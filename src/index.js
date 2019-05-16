import './index.scss'

import {
  createDOM,
  addClass,
  removeClass,
  addListener,
  removeListener,
  observeStyleChange,
  isFirefox
} from './dom'

let mousemoveHandler = null
let mouseupHandler = null

export default class Scroller {
  constructor (options = {}) {
    // deal with options
    this.el = options.el
    this.scroll = options.scroll || 'both' // 'horizontal', 'vertical', 'both'

    // other properties
    this.container = null
    this.skin = null
    this.observer = null
    this.drag = false
    this.dragDirection = ''
    this.dragDiff = 0

    this._init()
  }

  _init () {
    // prepare target element
    this._initEl()
    // init dom constructure
    createDOM(['_container', '_mask', '_content', '_skin'], this)
    this.skin.innerHTML = this.el.innerHTML

    this.el.innerHTML = ''
    this.el.appendChild(this.container)
    this._setMaskBox()

    this.observer = observeStyleChange(this.el, _ => this._setMaskBox())

    this._initScrollbarDom()
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

  _setMaskBox () {
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

    addListener(this.mask, 'scroll', () => this._contentScroll2BarScroll())
  }

  _initScrollbarDom () {
    if (this.scroll !== 'vertical') {
      createDOM(['_x_scrollbar_container', '_x_scrollbar_orbit', '_x_scrollcore'], this)
      this.container.appendChild(this.xScrollbarContainer)
    }
    if (this.scroll !== 'horizontal') {
      createDOM(['_y_scrollbar_container', '_y_scrollbar_orbit', '_y_scrollcore'], this)
      this.container.appendChild(this.yScrollbarContainer)
    }

    this._calcScrollBarStatus()

    const mouseenterHandler = () => this._calcScrollBarStatus()
    const mouseleaveHandler = () => this._calcScrollBarStatus()
    addListener(this.el, 'mouseenter', mouseenterHandler)
    addListener(this.el, 'mouseleave', mouseleaveHandler)

    const xMousedownHandler = e => this._mousedownHandler(e, 'horizontal')
    const yMousedownHandler = e => this._mousedownHandler(e, 'vertical')

    addListener(this.xScrollcore, 'mousedown', xMousedownHandler)
    addListener(this.yScrollcore, 'mousedown', yMousedownHandler)
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

  _calcScrollBarStatus () {
    this._calcScrollBarVisible()
    this._calcScrollcoreSize()
  }

  _calcScrollBarVisible () {
    const skinRect = this.skin.getBoundingClientRect()
    const viewSize = this._getViewSize()
    if (skinRect.width > viewSize.width) this.xScrollbarContainer.style.display = 'inline-block'
    else this.xScrollbarContainer.style.display = 'none'
    if (skinRect.height > viewSize.height) this.yScrollbarContainer.style.display = 'inline-block'
    else this.yScrollbarContainer.style.display = 'none'
  }

  _calcScrollcoreSize () {
    const skinRect = this.skin.getBoundingClientRect()
    const viewSize = this._getViewSize()

    const calc = (content, view, orbit) => Math.floor(orbit * view / content)

    if (this.scroll !== 'horizontal') {
      this.yScrollcore.style.height = calc(
        skinRect.height,
        viewSize.height,
        this.yScrollbarOrbit.getBoundingClientRect().height
      ) + 'px'
    }
    if (this.scroll !== 'vertical') {
      this.xScrollcore.style.width = calc(
        skinRect.width,
        viewSize.width,
        this.xScrollbarOrbit.getBoundingClientRect().width
      ) + 'px'
    }
  }

  _contentScroll2BarScroll () {
    const skinRect = this.skin.getBoundingClientRect()
    const scrollTop = this.mask.scrollTop
    const scrollLeft = this.mask.scrollLeft

    const calc = (scroll, skin, orbit) => Math.floor(scroll * orbit / skin)

    if (this.scroll !== 'vertical') {
      const orbitRect = this.xScrollbarOrbit.getBoundingClientRect()
      this.xScrollcore.style.transform = `
        translateX(${calc(scrollLeft, skinRect.width, orbitRect.width)}px)
      `
    }
    if (this.scroll !== 'horizontal') {
      const orbitRect = this.yScrollbarOrbit.getBoundingClientRect()
      this.yScrollcore.style.transform = `
      translateY(${calc(scrollTop, skinRect.height, orbitRect.height)}px)
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
      this.dragDiff = e.pageY - this.yScrollcore.getBoundingClientRect().top
    } else {
      this.dragDiff = e.pageX - this.xScrollcore.getBoundingClientRect().left
    }

    addClass(this.el, '_no_select')

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
      theoreticBarScroll = e.pageY - this.dragDiff - this.yScrollbarOrbit.getBoundingClientRect().top
    } else {
      theoreticBarScroll = e.pageX - this.dragDiff - this.xScrollbarOrbit.getBoundingClientRect().left
    }

    this._setBarScroll(theoreticBarScroll)
    this._barScroll2ContentScroll()
  }

  _mouseupHandler (e) {
    e.preventDefault()
    e.stopPropagation()
    this.drag = false
    removeClass(this.el, '_no_select')
    removeListener(window, 'mousemove', mousemoveHandler)
    removeListener(window, 'mouseup', mouseupHandler)
  }

  // end of handling drag event of core
  _setBarScroll (theoreticBarScroll) {
    if (this.dragDirection === 'vertical') {
      const barRect = this.yScrollbarOrbit.getBoundingClientRect()
      const coreRect = this.yScrollcore.getBoundingClientRect()
      const max = barRect.height - coreRect.height
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.yScrollcore.style.transform = `translateY(${reality}px)`
      this.barScroll = reality
    } else {
      const barRect = this.xScrollbarOrbit.getBoundingClientRect()
      const coreRect = this.xScrollcore.getBoundingClientRect()
      const max = barRect.width - coreRect.width
      const reality = theoreticBarScroll < 0 ? 0 : (
        theoreticBarScroll > max ? max : theoreticBarScroll
      )
      this.xScrollcore.style.transform = `translateX(${reality}px)`
      this.barScroll = reality
    }
  }

  _barScroll2ContentScroll () {
    const barScroll = this.barScroll
    const skinRect = this.skin.getBoundingClientRect()

    const calc = (barScroll, skin, orbit) => Math.floor(barScroll * skin / orbit)

    if (this.dragDirection === 'vertical') {
      const orbitRect = this.yScrollbarOrbit.getBoundingClientRect()
      this.mask.scrollTop = calc(barScroll, skinRect.height, orbitRect.height)
    } else {
      const orbitRect = this.xScrollbarOrbit.getBoundingClientRect()
      this.mask.scrollLeft = calc(barScroll, skinRect.width, orbitRect.width)
    }
  }

  destroy () {
    this.observer.disconnect()
    this.observer = null
    this.el = null
    this.container = null
    this.skin = null
    this.xScrollbarContainer = null
    this.yScrollbarContainer = null
    this.xScrollbarOrbit = null
    this.yScrollbarOrbit = null
    this.xScrollcore = null
    this.yScrollcore = null
  }
}
