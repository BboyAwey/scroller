import './index.scss'

export default class Scroller {
  constructor (options = {}) {
    console.log('Hello Scroller!', options)

    if (options.el) {
      options.el.innerText = 'Hello Scroller'
    }
  }
}
