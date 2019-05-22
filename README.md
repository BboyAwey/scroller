# scroller
The best custom scroll bar. Can be nested.

## install
Scroller can be installed by npm or yarn.

```bash
yarn install scroller
```

Or you can just install it as a script tag.

```html
<script src="../anypath/scroller.js"></script>
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

```html
<div id="container">
  <div style="width: 1200px; height: 1200px;"></div>
</div>
```

```js
import Scroller from 'scroller'

const myScroller = new Scroller({
  el: document.getElementById('container'),
  direction: 'both',
  trackClassName: 'custom-track-style',
  barClassName: 'custom-bar-style'
})
```

> Note: The children of container element should at least be an element node (`nodeType` === 1). All the other types will be ignored.

## Options

* `el`: DOMElement, required, a container element which you want to made it a custom scrollbar
* `direction`: String, optional, which direction you would like to scroll. it support values below.
  * `both`: default value
  * `horizontal`
  * `vertical`
  * `none`
* `trackClassName`: String, optional, you can use it to customize the track style
* `barClassName`: String, optional, you can use it to customize the bar style

## Methods

* `Scroller(options)`: Constructor, it returns an instance of scroller
* `scroller.setDirection(direction)`: Set scroll direction, it returns an instance of scroller
* `scroller.getScroll()`: Return current `scrollTop` and `scrollLeft` value
* `scroller.onScroll(callback)`: Bind a scroll event listener to instance, the callback recieves an `Event` object which is the native scroll event object. It returns current scroll instance
* `scroller.offScroll(callback)`: Unbind a scroll event listener to instance, the callback recieves an `Event` object which is the native scroll event object. Omitting callback will unbind all the scroll event listener. It returns current scroll instance
* `scroller.scrollTo(position)`: Let scroller scroll to the specified position. It returns current scroll instanc. `positions` is an object which contains keys below
  * `scrollTop`: Optional
  * `scrollLeft`: Optional
* `scroller.destroy()`: Instance method, use it to destroy a scroller instance