import './index.less'

import {
  transferDOM,
  addClass,
  removeClass,
  hasClass,
  addListener,
  removeListener,
  observeResize,
  observeChildInsert,
  observeStyleChange,
  isOnDocument,
  getNativeScrollBarWidth,
  createElement,
  nestElements
} from './dom'

export type ScrollDirection = 'both' | 'vertical' | 'horizontal' | 'both' | 'none'

export interface ScrollerOptions {
  el?: HTMLElement | null
  direction?: ScrollDirection
  trackClassName?: string
  barClassName?: string
  offset?: number
  scaleable?: boolean
}

export default class Scroller {
  // properties
  #el: HTMLElement
  #direction: ScrollDirection = 'both'
  #trackClassName: string = '_scroller_track_default'
  #barClassName: string = '_scroller_bar_default'
  #offset: number = 4
  #scaleable: boolean = true

  #dragDirection = ''
  #dragDiff = 0
  #barScroll = 0
  #scrollListeners: EventListener[] = []

  #DOM = {
    container: createElement('div', '_container'),
    mask: createElement('div', '_mask'),
    contentWrapper: createElement('div', '_content_wrapper'),
    content: createElement('div', '_content'),
    placeholder: createElement('div', '_placeholder'),

    xScrollBarContainer: createElement('div', '_x_scroller_container'),
    xScrollBarTrack: createElement('div', '_x_scroller_track'),
    xScrollBarHandler: createElement('div', '_x_scroller_bar_handler'),

    yScrollBarContainer: createElement('div', '_y_scroller_container'),
    yScrollBarTrack: createElement('div', '_y_scroller_track'),
    yScrollBarHandler: createElement('div', '_y_scroller_bar_handler'),
  }

  // observers
  #observers: Record<string, MutationObserver | ResizeObserver | null> = {
    elStyleChangeObserver: null,
    elResizeObserver: null,
    childInsertObserver: null,
    contentSizeObserver: null
  }

  // handlers
  #handlers = {
    scrollHandler: () => this.#content2bar(),
    mouseenterHandler: () => this.#calcStatus(),
    mouseleaveHandler: () => this.#calcStatus(),
    xMousedownHandler: (event: MouseEvent) => this.#mousedownHandler(event, 'horizontal'),
    yMousedownHandler: (event: MouseEvent) => this.#mousedownHandler(event, 'vertical'),
    xClickHandler: (event: MouseEvent) => this.#clickHandler(event, 'horizontal'),
    yClickHandler: (event: MouseEvent) => this.#clickHandler(event, 'vertical'),
    mousemoveHandler: (event: MouseEvent) => this.#mousemoveHandler(event),
    mouseupHandler: (event: MouseEvent) => this.#mouseupHandler(event)
  }
  

  constructor (options: ScrollerOptions) {
    if (!options.el) {
      throw new Error('Scroller: you should at least specify an element in options')
    }
    // deal with options
    this.#el = options.el
    options.trackClassName && (this.#trackClassName = options.trackClassName)
    options.barClassName && (this.#barClassName = options.barClassName)
    options.offset !== undefined && (this.#offset = options.offset)
    options.scaleable !== undefined  && (this.#scaleable = options.scaleable)
    
    this.#init()
    // deal with direction
    this.setDirection(options.direction || this.#direction, true)
  }

  #needX () {
    const contentRect = this.#DOM.content.getBoundingClientRect()
    const viewSize = this.#getViewSize()
    return (this.#direction === 'horizontal' || this.#direction === 'both') && contentRect.width > viewSize.width
  }

  #needY () {
    const contentRect = this.#DOM.content.getBoundingClientRect()
    const viewSize = this.#getViewSize()
    return (this.#direction === 'vertical' || this.#direction === 'both') && contentRect.height > viewSize.height
  }

  #noX () {
    return this.#direction === 'vertical' || this.#direction === 'none'
  }
  #noY () {
    return this.#direction === 'horizontal' || this.#direction === 'none'
  }

  #init () {
    // prepare target element
    this.#initEl()
    // init dom constructure
    nestElements([
      this.#DOM.container,
      this.#DOM.mask,
      this.#DOM.contentWrapper,
      this.#DOM.content
    ])
    transferDOM(this.#el, this.#DOM.content)
    this.#el.appendChild(this.#DOM.placeholder)
    this.#el.appendChild(this.#DOM.container)

    this.#observers.elStyleChangeObserver = observeStyleChange(this.#el, this.#recalc, this)
    this.#observers.elResizeObserver = observeResize(this.#el, this.#recalc, this)
    this.#observers.contentSizeObserver = observeResize(this.#DOM.content, this.#recalc, this)
    this.#observers.childInsertObserver = observeChildInsert(this.#el, this.#handleChildInsert, this)

    this.#initScrollBarDom()
    this.#recalc()
  }

  #initEl () {
    addClass(this.#el, '_scroller')
    if (this.#scaleable) addClass(this.#el, '_scaleable')
    let positionStyle = window.getComputedStyle(this.#el).position

    if (!positionStyle || positionStyle === 'static') {
      this.#el.style.position = 'relative'
    }
  }

  #handleChildInsert (insertedNodes: Node[]) {
    const children = this.#el.children
    const indexOfChild = (childEl: Node) => {
      return Array.prototype.indexOf.call(children, childEl)
    }

    for (let el of insertedNodes) {
      if (indexOfChild(el) > indexOfChild(this.#el)) {
        this.#DOM.content.appendChild(el)
      } else {
        this.#DOM.content.insertBefore(el, this.#DOM.content.children[0])
      }
    }
  }

  #recalc () {
    this.#syncPlaceholderSize()
    this.#setMask()
    this.#calcStatus()
  }

  #syncPlaceholderSize () {
    let contentRect: DOMRect = {} as DOMRect
    if (isOnDocument(this.#DOM.content)) {
      contentRect = this.#DOM.content.getBoundingClientRect()
      if (!contentRect.width) {
        let duplicate = this.#DOM.content.cloneNode(true) as HTMLElement
        duplicate.style.visibility = 'hidden'

        this.#DOM.placeholder.style.width = 'auto'
        this.#DOM.placeholder.style.height = 'auto'

        this.#DOM.placeholder.appendChild(duplicate)
        contentRect.width = duplicate.getBoundingClientRect().width
        this.#DOM.placeholder.removeChild(duplicate)
      }
    } else {
      let duplicate = this.#DOM.content.cloneNode(true) as HTMLElement
      duplicate.className = '___'
      duplicate.style.display = 'inline-block'
      duplicate.style.position = 'absolute'
      duplicate.style.zIndex = '-99999'
      duplicate.style.top = '9999999'
      duplicate.style.left = '9999999'
      document.body.appendChild(duplicate)

      contentRect = duplicate.getBoundingClientRect()
      document.body.removeChild(duplicate)
    }

    this.#DOM.placeholder.style.width = contentRect.width + 'px'
    this.#DOM.placeholder.style.height = contentRect.height + 'px'
  }

  #setMask () {
    // use a mask div to do the real scroll
    let {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    } = window.getComputedStyle(this.#el)
    let { width, height } = this.#DOM.container.getBoundingClientRect()

    this.#DOM.content.style.paddingLeft = paddingLeft
    this.#DOM.content.style.paddingTop = paddingTop
    this.#DOM.content.style.paddingRight = parseFloat(paddingRight) + 'px'
    this.#DOM.content.style.paddingBottom = parseFloat(paddingBottom) + 'px'

    if (!this.#needX()) {
      this.#DOM.mask.style.overflowX = 'hidden'
      this.#DOM.mask.style.height = height + 'px'
    } else {
      this.#DOM.mask.style.overflowX = 'auto'
      this.#DOM.mask.style.height = height + getNativeScrollBarWidth() + 'px'
    }
    if (!this.#needY()) {
      this.#DOM.mask.style.overflowY = 'hidden'
      this.#DOM.mask.style.width = width + 'px'
    } else {
      this.#DOM.mask.style.overflowY = 'auto'
      this.#DOM.mask.style.width = width + getNativeScrollBarWidth() + 'px'
    }

    this.#content2bar()
    addListener(this.#DOM.mask, 'scroll', this.#handlers.scrollHandler)
  }

  #insertBg (el: HTMLElement, className: string) {
    const bg = document.createElement('div')
    bg.className = className
    el.insertBefore(bg, el.querySelector(':first-child'))
    return bg
  }

  #initScrollBarDom () {
    nestElements([
      this.#DOM.xScrollBarContainer,
      this.#DOM.xScrollBarTrack,
      this.#DOM.xScrollBarHandler
    ])
    this.#insertBg(this.#DOM.xScrollBarTrack, '_scroller_bg ' + this.#trackClassName)
    this.#insertBg(this.#DOM.xScrollBarHandler, '_scroller_bg ' + this.#barClassName)
    this.#DOM.container.appendChild(this.#DOM.xScrollBarContainer)

    nestElements([
      this.#DOM.yScrollBarContainer,
      this.#DOM.yScrollBarTrack,
      this.#DOM.yScrollBarHandler
    ])
    this.#insertBg(this.#DOM.yScrollBarTrack, '_scroller_bg ' + this.#trackClassName)
    this.#insertBg(this.#DOM.yScrollBarHandler, '_scroller_bg ' + this.#barClassName)
    this.#DOM.container.appendChild(this.#DOM.yScrollBarContainer)

    this.#DOM.xScrollBarContainer.style.bottom = this.#offset + 'px'
    this.#DOM.yScrollBarContainer.style.right = this.#offset + 'px'

    this.#calcStatus()

    addListener(this.#el, 'mouseenter', this.#handlers.mouseenterHandler)
    addListener(this.#el, 'mouseleave', this.#handlers.mouseleaveHandler)

    addListener(this.#DOM.xScrollBarHandler, 'mousedown', this.#handlers.xMousedownHandler as EventListener)
    addListener(this.#DOM.yScrollBarHandler, 'mousedown', this.#handlers.yMousedownHandler as EventListener)

    addListener(this.#DOM.xScrollBarTrack, 'click', this.#handlers.xClickHandler as EventListener)
    addListener(this.#DOM.yScrollBarTrack, 'click', this.#handlers.yClickHandler as EventListener)
  }

  #getViewSize () {
    const containerRect = this.#DOM.container.getBoundingClientRect()
    // firefox will ignore padding bottom when do scrolling
    return { width: containerRect.width, height: containerRect.height }
  }

  #calcStatus () {
    this.#calcVisible()
    this.#calcBarSize()
  }

  #calcVisible () {
    if (getNativeScrollBarWidth() === 0) {
      this.#DOM.xScrollBarContainer.style.display = 'none'
      this.#DOM.yScrollBarContainer.style.display = 'none'
    } else {
      if (this.#needX()) {
        this.#DOM.xScrollBarContainer.style.display = 'inline-block'
        // this.#DOM.mask.style.overflowX = 'auto'
      } else {
        this.#DOM.xScrollBarContainer.style.display = 'none'
        // this.#DOM.mask.style.overflowX = 'hidden'
      }
      if (this.#needY()) {
        this.#DOM.yScrollBarContainer.style.display = 'inline-block'
        // this.#DOM.mask.style.overflowY = 'auto'
      } else {
        this.#DOM.yScrollBarContainer.style.display = 'none'
        // this.#DOM.mask.style.overflowY = 'hidden'
      }
    }
  }

  #calcBarSize () {
    const contentRect = this.#DOM.content.getBoundingClientRect()
    const viewSize = this.#getViewSize()

    const calc = (
      content: number,
      view: number,
      track: number
    ) => Math.floor(track * view / content)

    if (this.#needY()) {
      const res = calc(
        contentRect.height,
        viewSize.height,
        this.#DOM.yScrollBarTrack.getBoundingClientRect().height
      )
      this.#DOM.yScrollBarHandler.style.height = res + 'px'
      if (res < 20) {
        addClass(this.#DOM.yScrollBarHandler, '_minimal')
      } else {
        removeClass(this.#DOM.yScrollBarHandler, '_minimal')
      }
    }
    if (this.#needX()) {
      const res = calc(
        contentRect.width,
        viewSize.width,
        this.#DOM.xScrollBarTrack.getBoundingClientRect().width
      )
      this.#DOM.xScrollBarHandler.style.width = res + 'px'
      if (res < 20) {
        addClass(this.#DOM.xScrollBarHandler, '_minimal')
      } else {
        removeClass(this.#DOM.xScrollBarHandler, '_minimal')
      }
    }
  }

  #content2bar () {
    const contentRect = this.#DOM.content.getBoundingClientRect()

    const scrollTop = this.#DOM.mask.scrollTop
    const scrollLeft = this.#DOM.mask.scrollLeft

    const calc = (
      scroll: number,
      content: number,
      track: number
    ) => Math.ceil(scroll * track / content) + 1

    if (this.#needX()) {
      const trackRect = this.#DOM.xScrollBarTrack.getBoundingClientRect()
      this.#DOM.xScrollBarHandler.style.transform = `
        translateX(${calc(scrollLeft, contentRect.width, trackRect.width)}px)
      `
    }
    if (this.#needY()) {
      const trackRect = this.#DOM.yScrollBarTrack.getBoundingClientRect()
      this.#DOM.yScrollBarHandler.style.transform = `
      translateY(${calc(scrollTop, contentRect.height, trackRect.height)}px)
      `
    }
  }

  // handle drag event of core
  #mousedownHandler (event: MouseEvent, direction: ScrollDirection) {
    event.preventDefault()
    event.stopPropagation()

    this.#dragDirection = direction
    if (this.#dragDirection === 'vertical') {
      this.#dragDiff = event.pageY - this.#DOM.yScrollBarHandler.getBoundingClientRect().top
      addClass(this.#DOM.yScrollBarHandler, '_dragging_target')
    } else {
      this.#dragDiff = event.pageX - this.#DOM.xScrollBarHandler.getBoundingClientRect().left
      addClass(this.#DOM.xScrollBarHandler, '_dragging_target')
    }

    addClass(this.#el, '_dragging')

    addListener(window, 'mousemove', this.#handlers.mousemoveHandler as EventListener)
    addListener(window, 'mouseup', this.#handlers.mouseupHandler as EventListener)
  }

  #mousemoveHandler (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    let theoreticBarScroll = 0

    if (this.#dragDirection === 'vertical') {
      theoreticBarScroll = event.pageY - this.#dragDiff - this.#DOM.yScrollBarTrack.getBoundingClientRect().top
    } else {
      theoreticBarScroll = event.pageX - this.#dragDiff - this.#DOM.xScrollBarTrack.getBoundingClientRect().left
    }

    this.#setBarScroll(theoreticBarScroll)
    this.#bar2content()
  }

  #mouseupHandler (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    removeClass(this.#DOM.xScrollBarHandler, '_dragging_target')
    removeClass(this.#DOM.yScrollBarHandler, '_dragging_target')
    removeClass(this.#el, '_dragging')
    removeListener(window, 'mousemove', this.#handlers.mousemoveHandler as EventListener)
    removeListener(window, 'mouseup', this.#handlers.mouseupHandler as EventListener)
  }

  #clickHandler (event: MouseEvent, direction: ScrollDirection) {
    if (
      hasClass(event.target as HTMLElement, '_x_scroller_bar') ||
      hasClass(event.target as HTMLElement, '_y_scroller_bar')
    ) return false
    
    this.#dragDirection = direction

    const calc = (
      mouse: number,
      track: number,
      coreSize: number
    ) => mouse - track - coreSize / 2

    if (this.#dragDirection === 'vertical') {
      const coreRect = this.#DOM.yScrollBarHandler.getBoundingClientRect()
      const trackRect = this.#DOM.yScrollBarTrack.getBoundingClientRect()
      this.#barScroll = calc(event.clientY, trackRect.top, coreRect.height)
    } else {
      const coreRect = this.#DOM.xScrollBarHandler.getBoundingClientRect()
      const trackRect = this.#DOM.xScrollBarTrack.getBoundingClientRect()
      this.#barScroll = calc(event.clientX, trackRect.left, coreRect.width)
    }

    this.#bar2content()
  }
  // end of handling drag event of core

  #setBarScroll (theoreticBarScroll: number) {
    if (this.#dragDirection === 'vertical') {
      const barRect = this.#DOM.yScrollBarTrack.getBoundingClientRect()
      const coreRect = this.#DOM.yScrollBarHandler.getBoundingClientRect()
      const max = barRect.height - coreRect.height
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.#DOM.yScrollBarHandler.style.transform = `translateY(${reality}px)`
      this.#barScroll = reality
    } else {
      const barRect = this.#DOM.xScrollBarTrack.getBoundingClientRect()
      const coreRect = this.#DOM.xScrollBarHandler.getBoundingClientRect()
      const max = barRect.width - coreRect.width
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.#DOM.xScrollBarHandler.style.transform = `translateX(${reality}px)`
      this.#barScroll = reality
    }
  }

  #bar2content () {
    const barScroll = this.#barScroll
    const contentRect = this.#DOM.content.getBoundingClientRect()

    const calc = (
      barScroll: number,
      content: number,
      track: number
    ) => Math.ceil(barScroll * content / track)

    if (this.#dragDirection === 'vertical') {
      const trackRect = this.#DOM.yScrollBarTrack.getBoundingClientRect()
      this.#DOM.mask.scrollTop = calc(barScroll, contentRect.height, trackRect.height)
    } else {
      const trackRect = this.#DOM.xScrollBarTrack.getBoundingClientRect()
      this.#DOM.mask.scrollLeft = calc(barScroll, contentRect.width, trackRect.width)
    }
  }

  getScroll () {
    return {
      scrollTop: this.#DOM.mask.scrollTop,
      scrollLeft: this.#DOM.mask.scrollLeft
    }
  }

  scrollTo (position: { scrollTop?: number, scrollLeft?: number }) {
    const { scrollTop, scrollLeft } = position
    if (scrollTop || scrollTop === 0) {
      this.#DOM.mask.scrollTop = scrollTop
    }
    if (scrollLeft || scrollLeft === 0) {
      this.#DOM.mask.scrollLeft = scrollLeft
    }
    return this
  }

  onScroll (cb: EventListener) {
    if (this.#scrollListeners.indexOf(cb) === -1) {
      this.#scrollListeners.push(cb)
      addListener(this.#DOM.mask, 'scroll', cb)
    }
    return this
  }

  offScroll (cb: EventListener) {
    const index = this.#scrollListeners.indexOf(cb)
    if (cb && index !== -1) {
      removeListener(this.#DOM.mask, 'scroll', cb)
      this.#scrollListeners.splice(index, 1)
    } else {
      this.#scrollListeners.forEach(c => removeListener(this.#DOM.mask, 'scroll', c))
    }
    return this
  }

  setDirection (direction: ScrollDirection, lazy?: boolean) {
    this.#direction = direction

    if (this.#noX()) {
      addClass(this.#DOM.content, '_no_x')
    } else {
      removeClass(this.#DOM.content, '_no_x')
    }
    if (this.#noY()) {
      addClass(this.#DOM.content, '_no_y')
    } else {
      removeClass(this.#DOM.content, '_no_y')
    }

    if (!lazy) {
      this.#recalc()
    }

    return this
  }

  destroy () {
    // recover dom constructure
    transferDOM(this.#DOM.content, this.#el)
    this.#DOM.container.parentElement === this.#el && this.#el.removeChild(this.#DOM.container)
    this.#DOM.xScrollBarContainer.parentElement  === this.#el && this.#el.removeChild(this.#DOM.xScrollBarContainer)

    this.#DOM.yScrollBarContainer.parentElement === this.#el && this.#el.removeChild(this.#DOM.yScrollBarContainer)
    this.#DOM.placeholder.parentElement === this.#el && this.#el.removeChild(this.#DOM.placeholder)
    removeClass(this.#el, '_scroller')

    // remove all listeners
    removeListener(this.#el, 'mouseenter', this.#handlers.mouseenterHandler)
    removeListener(this.#el, 'mouseleave', this.#handlers.mouseleaveHandler)
    removeListener(this.#DOM.xScrollBarHandler, 'mousedown', this.#handlers.xMousedownHandler as EventListener)
    removeListener(this.#DOM.yScrollBarHandler, 'mousedown', this.#handlers.yMousedownHandler as EventListener)
    removeListener(this.#DOM.xScrollBarTrack, 'click', this.#handlers.xClickHandler as EventListener)
    removeListener(this.#DOM.yScrollBarTrack, 'click', this.#handlers.yClickHandler as EventListener)
    removeListener(window, 'mousemove', this.#handlers.mousemoveHandler as EventListener)
    removeListener(window, 'mouseup', this.#handlers.mouseupHandler as EventListener)
    this.#scrollListeners.forEach(c => removeListener(this.#DOM.mask, 'scroll', c))
  }
}
