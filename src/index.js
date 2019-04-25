import './index.scss'

import { createDOM, observeStyleChange } from './dom'

export default class Scroller {
  constructor (options = {}) {
    // deal with options
    this.el = options.el
    this.direction = options.direction || 'both' // 'x', 'y', 'both'

    // other properties
    this.container = null
    this.content = null
    this.observer = null
    this.scrollbarVisible = false

    this._init()
  }

  _init () {
    this._disposeEl()

    createDOM(['_container', '_mask', '_content'], this)
    this.content.innerHTML = this.el.innerHTML

    this.el.innerHTML = ''
    this.el.appendChild(this.container)
    this._setMaskBox()

    this.observer = observeStyleChange(this.el, _ => this._setMaskBox())

    this._initScrollbar()
  }

  _disposeEl () {
    if (!this.el) {
      throw new Error('Scroller: you should at least specify an DOM element in options')
    } else if (this.el.className.indexOf('_scroller') === -1) {
      this.el.className += ' _scroller'
    }

    let positionStyle = window.getComputedStyle(this.el).position

    if (!positionStyle || positionStyle === 'static') {
      this.el.style.position = 'relative'
    }

    const mouseenterHandler = e => this._showScrollbar(e)
    const mouseleaveHandler = e => this._hideScrollbar(e)

    this.el.removeEventListener('mouseenter', mouseenterHandler)
    this.el.addEventListener('mouseenter', mouseenterHandler)
    this.el.removeEventListener('mouseleave', mouseleaveHandler)
    this.el.addEventListener('mouseleave', mouseleaveHandler)
  }

  _setMaskBox () {
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
      console.log(e)
    })
  }

  _initScrollbar () {
    createDOM(['_scrollbar_container', '_scrollbar_orbit', '_scrollcore'], this)
    this.container.appendChild(this.scrollbarContainer)
  }

  _showScrollbar () {
    this.scrollbarContainer.style.width = '8px'
    this.scrollbarContainer.style.opacity = 1
    this.scrollbarOrbit.style.borderRadius = '4px'
    this.scrollcore.style.borderRadius = '4px'
    this.scrollbarVisible = true
  }

  _hideScrollbar () {
    this.scrollbarContainer.style.width = '4px'
    this.scrollbarContainer.style.opacity = 0.6
    this.scrollbarOrbit.style.borderRadius = '2px'
    this.scrollcore.style.borderRadius = '2px'
    this.scrollbarVisible = false
  }

  destroy () {
    this.observer.disconnect()
    this.observer = null
    this.el = null
    this.container = null
    this.content = null
  }
}
