import './index.scss'

import {
  createDOM,
  transferDOM,
  addClass,
  removeClass,
  hasClass,
  addListener,
  removeListener,
  observeMutation,
  observeStyleChange,
  observeChildInsert,
  isFirefox
} from './dom'

let directions = [
  'horizontal',
  'vertical',
  'both',
  'none'
]

export default class Scroller {
  constructor (options = {}) {
    // deal with options
    this.el = options.el
    this.direction = directions.indexOf(options.direction) !== -1
      ? options.direction
      : 'both'
    this.trackClassName = options.trackClassName || '_scroller_track_default'
    this.barClassName = options.barClassName || '_scroller_bar_default'

    // other properties
    this.container = null
    this.content = null
    this.styleObserver = null
    this.childInsertObserver = null
    this.contentOberver = null
    this.drag = false
    this.dragDirection = ''
    this.dragDiff = 0
    this.barScroll = 0
    this.cbs = []
    this.throttleTimer = null

    // handlers
    this.scrollHandler = null
    this.mouseenterHandler = null
    this.mouseleaveHandler = null
    this.xMousedownHandler = null
    this.yMousedownHandler = null
    this.xClickHandler = null
    this.yClickHandler = null
    this.mousemoveHandler = null
    this.mouseupHandler = null

    this._init()
  }

  _needX () {
    return this.direction === 'horizontal' || this.direction === 'both'
  }

  _needY () {
    return this.direction === 'vertical' || this.direction === 'both'
  }

  _init () {
    // prepare target element
    this._initEl()
    // init dom constructure
    createDOM(['_container', '_mask', '_content_wrapper', '_content'], this)
    this.content.innerHTML = this.el.innerHTML
    transferDOM(this.el, this.content)
    this.el.appendChild(this.container)
    this._setMask()

    this.styleObserver = observeStyleChange(this.el, this._setMask, this)
    this.childInsertObserver = observeChildInsert(this.el, this._handleChildInsert, this)

    this._initScrollerDom()

    this.contentOberver = observeMutation(this.content, this._handleContentMutation, {
      attributes: true,
      childList: true,
      subtree: true
    }, this)
  }

  _initEl () {
    if (!this.el) {
      throw new Error('Scroller: you should at least specify an DOM element in options')
    } else {
      addClass(this.el, '_scroller')
    }

    let positionStyle = window.getComputedStyle(this.el).position

    if (!positionStyle || positionStyle === 'static') {
      this.el.style.position = 'relative'
    }
  }

  _handleChildInsert (insertedNodes) {
    const children = this.el.children
    children.indexOf = (el) => {
      return Array.prototype.indexOf.call(children, el)
    }
    for (let el of insertedNodes) {
      if (children.indexOf(el) > children.indexOf(this.el)) {
        this.content.appendChild(el)
      } else {
        this.content.insertBefore(el, this.content.children[0])
      }
    }
  }

  _handleContentMutation () {
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer)
      this.throttleTimer = null
    }
    this.throttleTimer = setTimeout(_ => {
      this._calcStatus()
      clearTimeout(this.throttleTimer)
      this.throttleTimer = null
    }, 500)
  }

  _setMask () {
    // use a mask div to do the real scroll
    let {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    } = window.getComputedStyle(this.el)
    let { width, height } = window.getComputedStyle(this.container)

    this.mask.style.paddingTop = paddingTop
    this.mask.style.paddingLeft = paddingLeft
    this.mask.style.paddingRight = parseFloat(paddingRight) + 15 + 'px'
    this.mask.style.paddingBottom = parseFloat(paddingBottom) + 15 + 'px'

    const verticalDiff = parseFloat(paddingTop) + parseFloat(paddingBottom)
    const horizontalDiff = parseFloat(paddingLeft) + parseFloat(paddingRight)

    this.mask.style.width = parseFloat(width) - horizontalDiff + 'px'
    this.mask.style.height = parseFloat(height) - verticalDiff + 'px'

    if (!this._needX()) this.mask.style.overflowX = 'hidden'
    if (!this._needY()) this.mask.style.overflowY = 'hidden'

    this.scrollHandler = () => this._content2bar()

    addListener(this.mask, 'scroll', this.scrollHandler)
  }

  _insertBg (el, className) {
    const bg = document.createElement('div')
    bg.className = className
    el.insertBefore(bg, el.querySelector(':first-child'))
    return bg
  }

  _initScrollerDom () {
    createDOM(['_x_scroller_container', '_x_scroller_track', '_x_scroller_bar'], this)
    this._insertBg(this.xScrollerTrack, '_scroller_bg ' + this.trackClassName)
    this._insertBg(this.xScrollerBar, '_scroller_bg ' + this.barClassName)
    this.container.appendChild(this.xScrollerContainer)

    createDOM(['_y_scroller_container', '_y_scroller_track', '_y_scroller_bar'], this)
    this._insertBg(this.yScrollerTrack, '_scroller_bg ' + this.trackClassName)
    this._insertBg(this.yScrollerBar, '_scroller_bg ' + this.barClassName)
    this.container.appendChild(this.yScrollerContainer)

    this._calcStatus()

    this.mouseenterHandler = () => this._calcStatus()
    this.mouseleaveHandler = () => this._calcStatus()
    addListener(this.el, 'mouseenter', this.mouseenterHandler)
    addListener(this.el, 'mouseleave', this.mouseleaveHandler)

    this.xMousedownHandler = e => this._mousedownHandler(e, 'horizontal')
    this.yMousedownHandler = e => this._mousedownHandler(e, 'vertical')

    addListener(this.xScrollerBar, 'mousedown', this.xMousedownHandler)
    addListener(this.yScrollerBar, 'mousedown', this.yMousedownHandler)

    this.xClickHandler = e => this._clickHandler(e, 'horizontal')
    this.yClickHandler = e => this._clickHandler(e, 'vertical')
    addListener(this.xScrollerTrack, 'click', this.xClickHandler)
    addListener(this.yScrollerTrack, 'click', this.yClickHandler)
  }

  _getViewSize () {
    const {
      paddingTop,
      // paddingRight,
      paddingBottom,
      paddingLeft
    } = window.getComputedStyle(this.el)
    const containerRect = this.container.getBoundingClientRect()

    const width = parseFloat(containerRect.width) - parseFloat(paddingLeft)
    // firefox will ignore padding bottom when do scrolling
    const height = parseFloat(containerRect.height) -
      parseFloat(paddingTop) -
      (isFirefox() ? 0 : parseFloat(paddingBottom))

    return { width, height }
  }

  _calcStatus () {
    this._calcVisible()
    this._calcBarSize()
  }

  _calcVisible () {
    const contentRect = this.content.getBoundingClientRect()
    const viewSize = this._getViewSize()

    if (this._needX() && contentRect.width > viewSize.width) {
      this.xScrollerContainer.style.display = 'inline-block'
    } else {
      this.xScrollerContainer.style.display = 'none'
    }
    if (this._needY() && contentRect.height > viewSize.height) {
      this.yScrollerContainer.style.display = 'inline-block'
    } else {
      this.yScrollerContainer.style.display = 'none'
    }
  }

  _calcBarSize () {
    const contentRect = this.content.getBoundingClientRect()
    const viewSize = this._getViewSize()

    const calc = (content, view, track) => Math.floor(track * view / content)

    if (this._needY()) {
      this.yScrollerBar.style.height = calc(
        contentRect.height,
        viewSize.height,
        this.yScrollerTrack.getBoundingClientRect().height
      ) + 'px'
    }
    if (this._needX) {
      this.xScrollerBar.style.width = calc(
        contentRect.width,
        viewSize.width,
        this.xScrollerTrack.getBoundingClientRect().width
      ) + 'px'
    }
  }

  _content2bar () {
    const contentRect = this.content.getBoundingClientRect()
    const scrollTop = this.mask.scrollTop
    const scrollLeft = this.mask.scrollLeft

    const calc = (scroll, content, track) => Math.floor(scroll * track / content)

    if (this._needX()) {
      const trackRect = this.xScrollerTrack.getBoundingClientRect()
      this.xScrollerBar.style.transform = `
        translateX(${calc(scrollLeft, contentRect.width, trackRect.width)}px)
      `
    }
    if (this._needY()) {
      const trackRect = this.yScrollerTrack.getBoundingClientRect()
      this.yScrollerBar.style.transform = `
      translateY(${calc(scrollTop, contentRect.height, trackRect.height)}px)
      `
    }
  }

  // handle drag event of core
  _mousedownHandler (e, direction) {
    e.preventDefault()
    e.stopPropagation()

    this.drag = true
    this.dragDirection = direction
    if (this.dragDirection === 'vertical') {
      this.dragDiff = e.pageY - this.yScrollerBar.getBoundingClientRect().top
    } else {
      this.dragDiff = e.pageX - this.xScrollerBar.getBoundingClientRect().left
    }

    addClass(this.el, '_dragging')

    this.mousemoveHandler = e => this._mousemoveHandler(e)
    this.mouseupHandler = e => this._mouseupHandler(e)
    addListener(window, 'mousemove', this.mousemoveHandler)
    addListener(window, 'mouseup', this.mouseupHandler)
  }

  _mousemoveHandler (e) {
    e.preventDefault()
    e.stopPropagation()

    let theoreticBarScroll = 0

    if (this.dragDirection === 'vertical') {
      theoreticBarScroll = e.pageY - this.dragDiff - this.yScrollerTrack.getBoundingClientRect().top
    } else {
      theoreticBarScroll = e.pageX - this.dragDiff - this.xScrollerTrack.getBoundingClientRect().left
    }

    this._setBarScroll(theoreticBarScroll)
    this._bar2content()
  }

  _mouseupHandler (e) {
    e.preventDefault()
    e.stopPropagation()
    this.drag = false
    removeClass(this.el, '_dragging')
    removeListener(window, 'mousemove', this.mousemoveHandler)
    removeListener(window, 'mouseup', this.mouseupHandler)
  }

  _clickHandler (e, direction) {
    if (hasClass(e.target, '_x_scroller_bar') || hasClass(e.target, '_y_scroller_bar')) return false
    this.dragDirection = direction

    const calc = (mouse, track, coreSize) => mouse - track - coreSize / 2

    if (this.dragDirection === 'vertical') {
      const coreRect = this.yScrollerBar.getBoundingClientRect()
      const trackRect = this.yScrollerTrack.getBoundingClientRect()
      this.barScroll = calc(e.pageY, trackRect.top, coreRect.height)
    } else {
      const coreRect = this.xScrollerBar.getBoundingClientRect()
      const trackRect = this.xScrollerTrack.getBoundingClientRect()
      this.barScroll = calc(e.pageX, trackRect.left, coreRect.width)
    }
    this._bar2content()
  }
  // end of handling drag event of core

  _setBarScroll (theoreticBarScroll) {
    if (this.dragDirection === 'vertical') {
      const barRect = this.yScrollerTrack.getBoundingClientRect()
      const coreRect = this.yScrollerBar.getBoundingClientRect()
      const max = barRect.height - coreRect.height
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.yScrollerBar.style.transform = `translateY(${reality}px)`
      this.barScroll = reality
    } else {
      const barRect = this.xScrollerTrack.getBoundingClientRect()
      const coreRect = this.xScrollerBar.getBoundingClientRect()
      const max = barRect.width - coreRect.width
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.xScrollerBar.style.transform = `translateX(${reality}px)`
      this.barScroll = reality
    }
  }

  _bar2content () {
    const barScroll = this.barScroll
    const contentRect = this.content.getBoundingClientRect()

    const calc = (barScroll, content, track) => Math.floor(barScroll * content / track)

    if (this.dragDirection === 'vertical') {
      const trackRect = this.yScrollerTrack.getBoundingClientRect()
      this.mask.scrollTop = calc(barScroll, contentRect.height, trackRect.height)
    } else {
      const trackRect = this.xScrollerTrack.getBoundingClientRect()
      this.mask.scrollLeft = calc(barScroll, contentRect.width, trackRect.width)
    }
  }

  getScroll () {
    return {
      scrollTop: this.mask.scrollTop,
      scrollLeft: this.mask.scrollLeft
    }
  }

  scrollTo ({ scrollTop, scrollLeft }) {
    if (scrollTop || scrollTop === 0) {
      this.mask.scrollTop = scrollTop
    }
    if (scrollLeft || scrollLeft === 0) {
      this.mask.scrollLeft = scrollLeft
    }
    return this
  }

  onScroll (cb) {
    if (this.cbs.indexOf(cb) === -1) {
      this.cbs.push(cb)
      addListener(this.mask, 'scroll', cb)
    }
    return this
  }

  offScroll (cb) {
    const index = this.cbs.indexOf(cb)
    if (cb && index !== -1) {
      removeListener(this.mask, 'scroll', cb)
      this.cbs.splice(index, 1)
    } else {
      this.cbs.forEach(c => removeListener(this.mask, 'scroll', c))
    }
    return this
  }

  destroy () {
    // recover dom constructure
    transferDOM(this.content, this.el)
    removeClass(this.el, '_scroller')

    // remove all listeners
    // removeListener(this.mask, 'scroll', this.scrollHandler)
    removeListener(this.el, 'mouseenter', this.mouseenterHandler)
    removeListener(this.el, 'mouseleave', this.mouseleaveHandler)
    removeListener(this.xScrollerBar, 'mousedown', this.xMousedownHandler)
    removeListener(this.yScrollerBar, 'mousedown', this.yMousedownHandler)
    removeListener(this.xScrollerTrack, 'click', this.xClickHandler)
    removeListener(this.yScrollerTrack, 'click', this.yClickHandler)
    // removeListener(window, 'mousemove', this.mousemoveHandler)
    // removeListener(window, 'mouseup', this.mouseupHandler)
    this.cbs.forEach(c => removeListener(this.mask, 'scroll', c))

    // remove all handlers
    this.scrollHandler = null
    this.mouseenterHandler = null
    this.mouseleaveHandler = null
    this.xMousedownHandler = null
    this.yMousedownHandler = null
    this.xClickHandler = null
    this.yClickHandler = null
    this.mousemoveHandler = null
    this.mouseupHandler = null

    // remove all properties
    this.barClassName = null
    this.barScroll = null
    this.cbs = null
    this.container = null
    this.contentWrapper = null
    this.content = null
    this.direction = null
    this.drag = null
    this.dragDiff = null
    this.dragDirection = null
    this.el = null
    this.mask = null
    this.styleObserver.disconnect()
    this.styleObserver = null
    this.childInsertObserver.disconnect()
    this.childInsertObserver = null
    this.contentOberver.disconnect()
    this.contentOberver = null
    this.throttleTimer = null
    this.trackClassName = null
    this.xScrollerBar = null
    this.xScrollerContainer = null
    this.xScrollerTrack = null
    this.yScrollerBar = null
    this.yScrollerContainer = null
    this.yScrollerTrack = null
  }
}
