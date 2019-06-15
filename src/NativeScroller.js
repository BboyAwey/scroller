import {
  addListener,
  removeListener
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
    this._init()
    this.setDirection(options.direction, true)
  }

  _noX () {
    return this.direction === 'vertical' || this.direction === 'none'
  }
  _noY () {
    return this.direction === 'horizontal' || this.direction === 'none'
  }

  getScroll () {
    return {
      scrollTop: this.mask.scrollTop,
      scrollLeft: this.mask.scrollLeft
    }
  }

  scrollTo ({ scrollTop, scrollLeft }) {
    if (scrollTop || scrollTop === 0) {
      this.el.scrollTop = scrollTop
    }
    if (scrollLeft || scrollLeft === 0) {
      this.el.scrollLeft = scrollLeft
    }
    return this
  }

  onScroll (cb) {
    addListener(this.mask, 'scroll', cb)
    return this
  }

  offScroll (cb) {
    removeListener(this.mask, 'scroll', cb)
    return this
  }

  setDirection (direction, lazy) {
    this.direction = directions.indexOf(direction) !== -1
      ? direction
      : 'both'
    if (this._noX()) {
      this.el.style.overFlowX = 'hidden'
    } else {
      this.el.style.overFlowX = 'auto'
    }
    if (this._noY()) {
      this.el.style.overFlowX = 'hidden'
    } else {
      this.el.style.overFlowX = 'auto'
    }

    return this
  }

  destroy () {
    this.el = null
  }
}
