import './index.scss'

import { createDOM } from './dom'

export default class Scroller {
  constructor (options = {}) {
    // deal with options
    this.el = this._disposeEl(options.el, this)
    this.direction = options.direction || 'both' // 'x', 'y', 'both'

    // other properties
    this.container = null
    this.content = null

    this._initDOM()
  }

  _disposeEl (el) {
    if (!el) {
      throw new Error('Scroller: you should at least specify an DOM element in options')
    } else if (el.className.indexOf('_scroller') === -1) {
      el.className += ' _scroller'
    }

    let positionStyle = window.getComputedStyle(el).position

    if (!positionStyle || positionStyle === 'static') {
      el.style.position = 'relative'
    }

    const mouseenterHandler = e => this._mouseenterHandler(e)
    const mouseleaveHandler = e => this._mouseleaveHandler(e)

    el.removeEventListener('mouseenter', mouseenterHandler)
    el.addEventListener('mouseenter', mouseenterHandler)
    el.removeEventListener('mouseleave', mouseleaveHandler)
    el.addEventListener('mouseleave', mouseleaveHandler)

    return el
  }

  _initDOM () {
    const fragment = this.el.innerHTML
    createDOM(['_container', '_mask', '_content'], this)
    this.content.innerHTML = fragment

    this.el.innerHTML = ''
    this.el.appendChild(this.container)
    this.setMaskBox()

    this._initScrollbar()
  }

  setMaskBox () {
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
  }

  _initScrollbar () {
    createDOM(['_scrollbar_container', '_scrollbar_orbit', '_scrollbar'], this)
    this.container.appendChild(this.scrollbarContainer)
  }

  _mouseenterHandler (e) {
    this.scrollbarContainer.style.opacity = 1
  }

  _mouseleaveHandler (e) {
    this.scrollbarContainer.style.opacity = 0
  }
}
