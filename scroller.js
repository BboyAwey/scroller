(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Scroller = factory());
}(this, function () { 'use strict';

  function ___$insertStyle(css) {
    if (!css) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }

    var style = document.createElement('style');

    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  ___$insertStyle("._scroller_transition, ._scroller ._x_scroller_track,\n._scroller ._y_scroller_track,\n._scroller ._scroller_bg, ._scroller ._y_scroller_container, ._scroller ._x_scroller_container, ._scroller_bar, ._scroller ._y_scroller_bar, ._scroller ._x_scroller_bar {\n  transition-duration: 0.2s;\n  transition-timing-function: ease;\n  transition-property: opacity, height, width, border-radius, background-color;\n}\n\n._scroller_container, ._scroller ._y_scroller_container, ._scroller ._x_scroller_container {\n  display: none;\n  position: absolute;\n  box-sizing: border-box;\n  opacity: 0.6;\n}\n\n._scroller_bar, ._scroller ._y_scroller_bar, ._scroller ._x_scroller_bar {\n  position: relative;\n  border-radius: 2px;\n}\n._scroller_bar > ._scroller_bg, ._scroller ._y_scroller_bar > ._scroller_bg, ._scroller ._x_scroller_bar > ._scroller_bg {\n  opacity: 0.6;\n}\n._scroller_bar > ._scroller_bg, ._scroller ._y_scroller_bar > ._scroller_bg, ._scroller ._x_scroller_bar > ._scroller_bg {\n  opacity: 0.6;\n}\n\n._dragging * {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n._dragging ._mask {\n  scroll-behavior: auto !important;\n}\n\n._scroller ._container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box !important;\n  z-index: 0;\n}\n._scroller ._mask {\n  width: 100%;\n  height: 100%;\n  overflow: scroll;\n  box-sizing: content-box !important;\n  scroll-behavior: smooth;\n}\n._scroller ._content {\n  display: inline-block;\n}\n._scroller ._x_scroller_container {\n  left: 0;\n  bottom: 4px;\n  width: 100%;\n  height: 4px;\n  padding: 0 10px;\n}\n._scroller ._y_scroller_container {\n  top: 0;\n  right: 4px;\n  width: 4px;\n  height: 100%;\n  padding: 10px 0;\n}\n._scroller ._x_scroller_track,\n._scroller ._y_scroller_track,\n._scroller ._scroller_bg {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 3px;\n  overflow: hidden;\n}\n._scroller ._scroller_bg {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n._scroller ._x_scroller_track > ._scroller_bg,\n._scroller ._y_scroller_track > ._scroller_bg {\n  opacity: 0.2;\n}\n._scroller ._x_scroller_bar {\n  height: 100%;\n  width: 100px;\n}\n._scroller ._y_scroller_bar {\n  width: 100%;\n  height: 100px;\n}\n._scroller ._x_scroller_bar:hover > ._scroller_bg,\n._scroller ._y_scroller_bar:hover > ._scroller_bg {\n  opacity: 0.9;\n}\n\n._scroller:hover > ._container > ._x_scroller_container,\n._scroller._dragging > ._container > ._x_scroller_container {\n  height: 8px;\n}\n._scroller:hover > ._container > ._y_scroller_container,\n._scroller._dragging > ._container > ._y_scroller_container {\n  width: 8px;\n}\n._scroller:hover ._x_scroller_track,\n._scroller:hover ._y_scroller_track,\n._scroller._dragging ._x_scroller_track,\n._scroller._dragging ._y_scroller_track {\n  border-radius: 4px;\n}\n._scroller:hover ._x_scroller_bar,\n._scroller:hover ._y_scroller_bar,\n._scroller._dragging ._x_scroller_bar,\n._scroller._dragging ._y_scroller_bar {\n  border-radius: 4px;\n}\n\n._scroller ._scroller_track_default {\n  background-color: black;\n}\n._scroller ._scroller_bar_default {\n  background-color: black;\n}\n._scroller ._scroller_bar_default:hover {\n  background-color: black;\n}");

  var createDOM = function createDOM() {
    var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var receiver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var res = classNames.reduce(function (last, curr) {
      var key = curr.split('_').filter(function (e) {
        return e;
      }).reduce(function (l, c, i) {
        return l + (!i ? c : c[0].toUpperCase() + c.substring(1));
      }, '');
      var el = document.createElement('div');
      el.className = curr;

      if (last[last.length - 1]) {
        last[last.length - 1].el.appendChild(el);
      }

      last.push({
        el: el,
        key: key
      });
      return last;
    }, []).reduce(function (last, curr) {
      last[curr.key] = curr.el;
      return last;
    }, receiver);
    return receiver || res;
  };
  var transferDOM = function transferDOM(source, target) {
    var clear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    // recover dom constructure
    var fragment = document.createDocumentFragment();
    var contents = source.children;

    for (var i = 0; i < contents.length; i++) {
      fragment.appendChild(contents[i]);
    }

    target.innerHTML = '';
    if (clear) source.innerHTML = '';
    target.appendChild(fragment);
  };
  var addClass = function addClass(el, cn) {
    if (el.className.indexOf(cn) === -1) {
      el.className += (el.className.trim() ? ' ' : '') + cn;
    }
  };
  var removeClass = function removeClass(el, cn) {
    if (el.className.indexOf(cn) !== -1) {
      el.className = el.className.split(/\s+/).filter(function (c) {
        return c && c.trim() !== cn.trim();
      });
    }
  };
  var hasClass = function hasClass(el, cn) {
    return el.className.trim().indexOf(cn.trim()) !== -1;
  };
  var addListener = function addListener(el, event, handler) {
    el.removeEventListener(event, handler);
    el.addEventListener(event, handler);
  };
  var removeListener = function removeListener(el, event, handler) {
    el.removeEventListener(event, handler);
  };
  var observeStyleChange = function observeStyleChange(el, handler) {
    var config = {
      attributes: true,
      childList: false,
      subtree: false
    };
    var observer = new MutationObserver(function (mutationsList) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;

          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            handler();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
    observer.observe(el, config);
    return observer;
  };
  var isFirefox = function isFirefox(_) {
    return navigator.userAgent.indexOf('Firefox') !== -1;
  };

  var directions = ['horizontal', 'vertical', 'both', 'none'];

  var Scroller =
  /*#__PURE__*/
  function () {
    function Scroller() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Scroller);

      // deal with options
      this.el = options.el;
      this.direction = directions.indexOf(options.direction) !== -1 ? options.direction : 'both';
      this.trackClassName = options.trackClassName || '_scroller_track_default';
      this.barClassName = options.barClassName || '_scroller_bar_default'; // other properties

      this.container = null;
      this.content = null;
      this.observer = null;
      this.drag = false;
      this.dragDirection = '';
      this.dragDiff = 0;
      this.barScroll = 0;
      this.cbs = []; // handlers

      this.scrollHandler = null;
      this.mouseenterHandler = null;
      this.mouseleaveHandler = null;
      this.xMousedownHandler = null;
      this.yMousedownHandler = null;
      this.xClickHandler = null;
      this.yClickHandler = null;
      this.mousemoveHandler = null;
      this.mouseupHandler = null;

      this._init();
    }

    _createClass(Scroller, [{
      key: "_needX",
      value: function _needX() {
        return this.direction === 'horizontal' || this.direction === 'both';
      }
    }, {
      key: "_needY",
      value: function _needY() {
        return this.direction === 'vertical' || this.direction === 'both';
      }
    }, {
      key: "_init",
      value: function _init() {
        var _this = this;

        // prepare target element
        this._initEl(); // init dom constructure


        createDOM(['_container', '_mask', '_content_wrapper', '_content'], this);
        this.content.innerHTML = this.el.innerHTML;
        transferDOM(this.el, this.content);
        this.el.appendChild(this.container);

        this._setMask();

        this.observer = observeStyleChange(this.el, function (_) {
          return _this._setMask();
        });

        this._initScrollerDom();
      }
    }, {
      key: "_initEl",
      value: function _initEl() {
        if (!this.el) {
          throw new Error('Scroller: you should at least specify an DOM element in options');
        } else {
          addClass(this.el, '_scroller');
        }

        var positionStyle = window.getComputedStyle(this.el).position;

        if (!positionStyle || positionStyle === 'static') {
          this.el.style.position = 'relative';
        }
      }
    }, {
      key: "_setMask",
      value: function _setMask() {
        var _this2 = this;

        // use a mask div to do the real scroll
        var _window$getComputedSt = window.getComputedStyle(this.el),
            paddingTop = _window$getComputedSt.paddingTop,
            paddingRight = _window$getComputedSt.paddingRight,
            paddingBottom = _window$getComputedSt.paddingBottom,
            paddingLeft = _window$getComputedSt.paddingLeft;

        var _window$getComputedSt2 = window.getComputedStyle(this.container),
            width = _window$getComputedSt2.width,
            height = _window$getComputedSt2.height;

        this.mask.style.paddingTop = paddingTop;
        this.mask.style.paddingLeft = paddingLeft;
        this.mask.style.paddingRight = parseFloat(paddingRight) + 15 + 'px';
        this.mask.style.paddingBottom = parseFloat(paddingBottom) + 15 + 'px';
        var verticalDiff = parseFloat(paddingTop) + parseFloat(paddingBottom);
        var horizontalDiff = parseFloat(paddingLeft) + parseFloat(paddingRight);
        this.mask.style.width = parseFloat(width) - horizontalDiff + 'px';
        this.mask.style.height = parseFloat(height) - verticalDiff + 'px';
        if (!this._needX()) this.mask.style.overflowX = 'hidden';
        if (!this._needY()) this.mask.style.overflowY = 'hidden';

        this.scrollHandler = function () {
          return _this2._content2bar();
        };

        addListener(this.mask, 'scroll', this.scrollHandler);
      }
    }, {
      key: "_insertBg",
      value: function _insertBg(el, className) {
        var bg = document.createElement('div');
        bg.className = className;
        el.insertBefore(bg, el.querySelector(':first-child'));
        return bg;
      }
    }, {
      key: "_initScrollerDom",
      value: function _initScrollerDom() {
        var _this3 = this;

        createDOM(['_x_scroller_container', '_x_scroller_track', '_x_scroller_bar'], this);

        this._insertBg(this.xScrollerTrack, '_scroller_bg ' + this.trackClassName);

        this._insertBg(this.xScrollerBar, '_scroller_bg ' + this.barClassName);

        this.container.appendChild(this.xScrollerContainer);
        createDOM(['_y_scroller_container', '_y_scroller_track', '_y_scroller_bar'], this);

        this._insertBg(this.yScrollerTrack, '_scroller_bg ' + this.trackClassName);

        this._insertBg(this.yScrollerBar, '_scroller_bg ' + this.barClassName);

        this.container.appendChild(this.yScrollerContainer);

        this._calcStatus();

        this.mouseenterHandler = function () {
          return _this3._calcStatus();
        };

        this.mouseleaveHandler = function () {
          return _this3._calcStatus();
        };

        addListener(this.el, 'mouseenter', this.mouseenterHandler);
        addListener(this.el, 'mouseleave', this.mouseleaveHandler);

        this.xMousedownHandler = function (e) {
          return _this3._mousedownHandler(e, 'horizontal');
        };

        this.yMousedownHandler = function (e) {
          return _this3._mousedownHandler(e, 'vertical');
        };

        addListener(this.xScrollerBar, 'mousedown', this.xMousedownHandler);
        addListener(this.yScrollerBar, 'mousedown', this.yMousedownHandler);

        this.xClickHandler = function (e) {
          return _this3._clickHandler(e, 'horizontal');
        };

        this.yClickHandler = function (e) {
          return _this3._clickHandler(e, 'vertical');
        };

        addListener(this.xScrollerTrack, 'click', this.xClickHandler);
        addListener(this.yScrollerTrack, 'click', this.yClickHandler);
      }
    }, {
      key: "_getViewSize",
      value: function _getViewSize() {
        var _window$getComputedSt3 = window.getComputedStyle(this.el),
            paddingTop = _window$getComputedSt3.paddingTop,
            paddingBottom = _window$getComputedSt3.paddingBottom,
            paddingLeft = _window$getComputedSt3.paddingLeft;

        var containerRect = this.container.getBoundingClientRect();
        var width = parseFloat(containerRect.width) - parseFloat(paddingLeft); // firefox will ignore padding bottom when do scrolling

        var height = parseFloat(containerRect.height) - parseFloat(paddingTop) - (isFirefox() ? 0 : parseFloat(paddingBottom));
        return {
          width: width,
          height: height
        };
      }
    }, {
      key: "_calcStatus",
      value: function _calcStatus() {
        this._calcVisible();

        this._calcBarSize();
      }
    }, {
      key: "_calcVisible",
      value: function _calcVisible() {
        var contentRect = this.content.getBoundingClientRect();

        var viewSize = this._getViewSize();

        if (this._needX() && contentRect.width > viewSize.width) {
          this.xScrollerContainer.style.display = 'inline-block';
        } else {
          this.xScrollerContainer.style.display = 'none';
        }

        if (this._needY() && contentRect.height > viewSize.height) {
          this.yScrollerContainer.style.display = 'inline-block';
        } else {
          this.yScrollerContainer.style.display = 'none';
        }
      }
    }, {
      key: "_calcBarSize",
      value: function _calcBarSize() {
        var contentRect = this.content.getBoundingClientRect();

        var viewSize = this._getViewSize();

        var calc = function calc(content, view, track) {
          return Math.floor(track * view / content);
        };

        if (this._needY()) {
          this.yScrollerBar.style.height = calc(contentRect.height, viewSize.height, this.yScrollerTrack.getBoundingClientRect().height) + 'px';
        }

        if (this._needX) {
          this.xScrollerBar.style.width = calc(contentRect.width, viewSize.width, this.xScrollerTrack.getBoundingClientRect().width) + 'px';
        }
      }
    }, {
      key: "_content2bar",
      value: function _content2bar() {
        var contentRect = this.content.getBoundingClientRect();
        var scrollTop = this.mask.scrollTop;
        var scrollLeft = this.mask.scrollLeft;

        var calc = function calc(scroll, content, track) {
          return Math.floor(scroll * track / content);
        };

        if (this._needX()) {
          var trackRect = this.xScrollerTrack.getBoundingClientRect();
          this.xScrollerBar.style.transform = "\n        translateX(".concat(calc(scrollLeft, contentRect.width, trackRect.width), "px)\n      ");
        }

        if (this._needY()) {
          var _trackRect = this.yScrollerTrack.getBoundingClientRect();

          this.yScrollerBar.style.transform = "\n      translateY(".concat(calc(scrollTop, contentRect.height, _trackRect.height), "px)\n      ");
        }
      } // handle drag event of core

    }, {
      key: "_mousedownHandler",
      value: function _mousedownHandler(e, direction) {
        var _this4 = this;

        e.preventDefault();
        e.stopPropagation();
        this.drag = true;
        this.dragDirection = direction;

        if (this.dragDirection === 'vertical') {
          this.dragDiff = e.pageY - this.yScrollerBar.getBoundingClientRect().top;
        } else {
          this.dragDiff = e.pageX - this.xScrollerBar.getBoundingClientRect().left;
        }

        addClass(this.el, '_dragging');

        this.mousemoveHandler = function (e) {
          return _this4._mousemoveHandler(e);
        };

        this.mouseupHandler = function (e) {
          return _this4._mouseupHandler(e);
        };

        addListener(window, 'mousemove', this.mousemoveHandler);
        addListener(window, 'mouseup', this.mouseupHandler);
      }
    }, {
      key: "_mousemoveHandler",
      value: function _mousemoveHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        var theoreticBarScroll = 0;

        if (this.dragDirection === 'vertical') {
          theoreticBarScroll = e.pageY - this.dragDiff - this.yScrollerTrack.getBoundingClientRect().top;
        } else {
          theoreticBarScroll = e.pageX - this.dragDiff - this.xScrollerTrack.getBoundingClientRect().left;
        }

        this._setBarScroll(theoreticBarScroll);

        this._bar2content();
      }
    }, {
      key: "_mouseupHandler",
      value: function _mouseupHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        this.drag = false;
        removeClass(this.el, '_dragging');
        removeListener(window, 'mousemove', this.mousemoveHandler);
        removeListener(window, 'mouseup', this.mouseupHandler);
      }
    }, {
      key: "_clickHandler",
      value: function _clickHandler(e, direction) {
        if (hasClass(e.target, '_x_scroller_bar') || hasClass(e.target, '_y_scroller_bar')) return false;
        this.dragDirection = direction;

        var calc = function calc(mouse, track, coreSize) {
          return mouse - track - coreSize / 2;
        };

        if (this.dragDirection === 'vertical') {
          var coreRect = this.yScrollerBar.getBoundingClientRect();
          var trackRect = this.yScrollerTrack.getBoundingClientRect();
          this.barScroll = calc(e.pageY, trackRect.top, coreRect.height);
        } else {
          var _coreRect = this.xScrollerBar.getBoundingClientRect();

          var _trackRect2 = this.xScrollerTrack.getBoundingClientRect();

          this.barScroll = calc(e.pageX, _trackRect2.left, _coreRect.width);
        }

        this._bar2content();
      } // end of handling drag event of core

    }, {
      key: "_setBarScroll",
      value: function _setBarScroll(theoreticBarScroll) {
        if (this.dragDirection === 'vertical') {
          var barRect = this.yScrollerTrack.getBoundingClientRect();
          var coreRect = this.yScrollerBar.getBoundingClientRect();
          var max = barRect.height - coreRect.height;
          var reality = theoreticBarScroll < 0 ? 0 : theoreticBarScroll > max ? max : theoreticBarScroll;
          this.yScrollerBar.style.transform = "translateY(".concat(reality, "px)");
          this.barScroll = reality;
        } else {
          var _barRect = this.xScrollerTrack.getBoundingClientRect();

          var _coreRect2 = this.xScrollerBar.getBoundingClientRect();

          var _max = _barRect.width - _coreRect2.width;

          var _reality = theoreticBarScroll < 0 ? 0 : theoreticBarScroll > _max ? _max : theoreticBarScroll;

          this.xScrollerBar.style.transform = "translateX(".concat(_reality, "px)");
          this.barScroll = _reality;
        }
      }
    }, {
      key: "_bar2content",
      value: function _bar2content() {
        var barScroll = this.barScroll;
        var contentRect = this.content.getBoundingClientRect();

        var calc = function calc(barScroll, content, track) {
          return Math.floor(barScroll * content / track);
        };

        if (this.dragDirection === 'vertical') {
          var trackRect = this.yScrollerTrack.getBoundingClientRect();
          this.mask.scrollTop = calc(barScroll, contentRect.height, trackRect.height);
        } else {
          var _trackRect3 = this.xScrollerTrack.getBoundingClientRect();

          this.mask.scrollLeft = calc(barScroll, contentRect.width, _trackRect3.width);
        }
      }
    }, {
      key: "getScroll",
      value: function getScroll() {
        return {
          scrollTop: this.mask.scrollTop,
          scrollLeft: this.mask.scrollLeft
        };
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(_ref) {
        var scrollTop = _ref.scrollTop,
            scrollLeft = _ref.scrollLeft;

        if (scrollTop || scrollTop === 0) {
          this.mask.scrollTop = scrollTop;
        }

        if (scrollLeft || scrollLeft === 0) {
          this.mask.scrollLeft = scrollLeft;
        }

        return this;
      }
    }, {
      key: "onScroll",
      value: function onScroll(cb) {
        if (this.cbs.indexOf(cb) === -1) {
          this.cbs.push(cb);
          addListener(this.mask, 'scroll', cb);
        }

        return this;
      }
    }, {
      key: "offScroll",
      value: function offScroll(cb) {
        var _this5 = this;

        var index = this.cbs.indexOf(cb);

        if (cb && index !== -1) {
          removeListener(this.mask, 'scroll', cb);
          this.cbs.splice(index, 1);
        } else {
          this.cbs.forEach(function (c) {
            return removeListener(_this5.mask, 'scroll', c);
          });
        }

        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this6 = this;

        // recover dom constructure
        transferDOM(this.content, this.el);
        removeClass(this.el, '_scroller'); // remove all listeners
        // removeListener(this.mask, 'scroll', this.scrollHandler)

        removeListener(this.el, 'mouseenter', this.mouseenterHandler);
        removeListener(this.el, 'mouseleave', this.mouseleaveHandler);
        removeListener(this.xScrollerBar, 'mousedown', this.xMousedownHandler);
        removeListener(this.yScrollerBar, 'mousedown', this.yMousedownHandler);
        removeListener(this.xScrollerTrack, 'click', this.xClickHandler);
        removeListener(this.yScrollerTrack, 'click', this.yClickHandler); // removeListener(window, 'mousemove', this.mousemoveHandler)
        // removeListener(window, 'mouseup', this.mouseupHandler)

        this.cbs.forEach(function (c) {
          return removeListener(_this6.mask, 'scroll', c);
        }); // remove all handlers

        this.scrollHandler = null;
        this.mouseenterHandler = null;
        this.mouseleaveHandler = null;
        this.xMousedownHandler = null;
        this.yMousedownHandler = null;
        this.xClickHandler = null;
        this.yClickHandler = null;
        this.mousemoveHandler = null;
        this.mouseupHandler = null; // remove all properties

        this.barClassName = null;
        this.barScroll = null;
        this.cbs = null;
        this.container = null;
        this.contentWrapper = null;
        this.content = null;
        this.direction = null;
        this.drag = null;
        this.dragDiff = null;
        this.dragDirection = null;
        this.el = null;
        this.mask = null;
        this.observer.disconnect();
        this.observer = null;
        this.trackClassName = null;
        this.xScrollerBar = null;
        this.xScrollerContainer = null;
        this.xScrollerTrack = null;
        this.yScrollerBar = null;
        this.yScrollerContainer = null;
        this.yScrollerTrack = null;
      }
    }]);

    return Scroller;
  }();

  return Scroller;

}));
