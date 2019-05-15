import './index.scss'

import { createDOM, observeStyleChange, isFirefox } from './dom'

export default class Scroller {
  constructor (options = {}) {
    // deal with options
    this.el = options.el
    this.scroll = options.scroll || 'both' // 'horizontal', 'vertical', 'both'

    // other properties
    this.container = null
    this.content = null
    this.skin = null
    this.observer = null
    this.scrollbarVisible = false
    this.canScrollX = false
    this.canScrollY = true

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
    } else if (this.el.className.indexOf('_scroller') === -1) {
      this.el.className += ' _scroller'
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

    this.mask.addEventListener('scroll', e => {
      this._contentScroll2BarScroll()
    })
  }

  _initScrollbarDom () {
    // TODO: add x scrollbar
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

    this.el.removeEventListener('mouseenter', mouseenterHandler)
    this.el.removeEventListener('mouseleave', mouseleaveHandler)
    this.el.addEventListener('mouseenter', mouseenterHandler)
    this.el.addEventListener('mouseleave', mouseleaveHandler)
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

    if (this.scroll !== 'horizontal') {
      const orbitRect = this.yScrollbarOrbit.getBoundingClientRect()
      this.yScrollcore.style.transform = `
      translateY(${calc(scrollTop, skinRect.height, orbitRect.height)}px)
      `
    }
    if (this.scroll !== 'vertical') {
      const orbitRect = this.xScrollbarOrbit.getBoundingClientRect()
      this.xScrollcore.style.transform = `
        translateX(${calc(scrollLeft, skinRect.width, orbitRect.width)}px)
      `
    }
  }

  destroy () {
    this.observer.disconnect()
    this.observer = null
    this.el = null
    this.container = null
    this.content = null
    this.skin = null
  }
}
