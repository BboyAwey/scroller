import './index.scss'

import {
  createDOM,
  addClass,
  removeClass,
  hasClass,
  addListener,
  removeListener,
  observeStyleChange,
  isFirefox
} from './dom'

let mousemoveHandler = null
let mouseupHandler = null
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
    this.observer = null
    this.drag = false
    this.dragDirection = ''
    this.dragDiff = 0
    this.barScroll = 0

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

    this.el.innerHTML = ''
    this.el.appendChild(this.container)
    this._setMask()

    this.observer = observeStyleChange(this.el, _ => this._setMask())

    this._initScrollerDom()
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

    addListener(this.mask, 'scroll', () => this._content2bar())
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

    const mouseenterHandler = () => this._calcStatus()
    const mouseleaveHandler = () => this._calcStatus()
    addListener(this.el, 'mouseenter', mouseenterHandler)
    addListener(this.el, 'mouseleave', mouseleaveHandler)

    const xMousedownHandler = e => this._mousedownHandler(e, 'horizontal')
    const yMousedownHandler = e => this._mousedownHandler(e, 'vertical')

    addListener(this.xScrollerBar, 'mousedown', xMousedownHandler)
    addListener(this.yScrollerBar, 'mousedown', yMousedownHandler)

    const xClickHandler = e => this._clickHandler(e, 'horizontal')
    const yClickHandler = e => this._clickHandler(e, 'vertical')
    addListener(this.xScrollerTrack, 'click', xClickHandler)
    addListener(this.yScrollerTrack, 'click', yClickHandler)
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

    mousemoveHandler = e => this._mousemoveHandler(e)
    mouseupHandler = e => this._mouseupHandler(e)
    addListener(window, 'mousemove', mousemoveHandler)
    addListener(window, 'mouseup', mouseupHandler)
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
    removeListener(window, 'mousemove', mousemoveHandler)
    removeListener(window, 'mouseup', mouseupHandler)
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

  destroy () {
    this.observer.disconnect()
    this.observer = null
    this.el = null
    this.container = null
    this.content = null
    this.xScrollerContainer = null
    this.yScrollerContainer = null
    this.xScrollerTrack = null
    this.yScrollerTrack = null
    this.xScrollerBar = null
    this.yScrollerBar = null
  }
}
