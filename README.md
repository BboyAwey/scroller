# scroller
The best custom scroll bar. Can be nested.

## install

```bash
yarn install scroller
```

## Useage

```css
.custom-track-style {
  background: red;
}
.custom-bar-style {
  background: blue;
}
```

```js
import Scroller from 'scroller'

const myScroller = new Scroller({
  el: document.getElementById('your-element'),
  direction: 'both',
  trackClassName: 'custom-track-style',
  barClassName: 'custom-bar-style'
})
```

## Options

* `el`: DOMElement, a container element which you want to made it a custom scrollbar
* `direction`: String, which direction you would like to scroll. it support values below.
  * `both`: default value
  * `horizontal`
  * `vertical`
  * `none`
* `trackClassName`: String, you can use it to customize the track style
* `barClassName`: String, you can use it to customize the bar style

## Methods

* `Scroller(options)`: Constructor, it returns an instance of scroller
* `scroller.destroy()`: Instance method, use it to destroy a scroller instance