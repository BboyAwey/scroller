"use strict";
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _el, _direction, _trackClassName, _barClassName, _offset, _scaleable, _dragDirection, _dragDiff, _barScroll, _scrollListeners, _DOM, _observers, _handlers, _needX, needX_fn, _needY, needY_fn, _noX, noX_fn, _noY, noY_fn, _init, init_fn, _initEl, initEl_fn, _handleChildInsert, handleChildInsert_fn, _recalc, recalc_fn, _syncPlaceholderSize, syncPlaceholderSize_fn, _setMask, setMask_fn, _insertBg, insertBg_fn, _initScrollBarDom, initScrollBarDom_fn, _getViewSize, getViewSize_fn, _calcStatus, calcStatus_fn, _calcVisible, calcVisible_fn, _calcBarSize, calcBarSize_fn, _content2bar, content2bar_fn, _mousedownHandler, mousedownHandler_fn, _mousemoveHandler, mousemoveHandler_fn, _mouseupHandler, mouseupHandler_fn, _clickHandler, clickHandler_fn, _setBarScroll, setBarScroll_fn, _bar2content, bar2content_fn;
const index$1 = "";
var MapShim = function() {
  if (typeof Map !== "undefined") {
    return Map;
  }
  function getIndex(arr, key) {
    var result = -1;
    arr.some(function(entry, index2) {
      if (entry[0] === key) {
        result = index2;
        return true;
      }
      return false;
    });
    return result;
  }
  return function() {
    function class_1() {
      this.__entries__ = [];
    }
    Object.defineProperty(class_1.prototype, "size", {
      get: function() {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true
    });
    class_1.prototype.get = function(key) {
      var index2 = getIndex(this.__entries__, key);
      var entry = this.__entries__[index2];
      return entry && entry[1];
    };
    class_1.prototype.set = function(key, value) {
      var index2 = getIndex(this.__entries__, key);
      if (~index2) {
        this.__entries__[index2][1] = value;
      } else {
        this.__entries__.push([key, value]);
      }
    };
    class_1.prototype.delete = function(key) {
      var entries = this.__entries__;
      var index2 = getIndex(entries, key);
      if (~index2) {
        entries.splice(index2, 1);
      }
    };
    class_1.prototype.has = function(key) {
      return !!~getIndex(this.__entries__, key);
    };
    class_1.prototype.clear = function() {
      this.__entries__.splice(0);
    };
    class_1.prototype.forEach = function(callback, ctx) {
      if (ctx === void 0) {
        ctx = null;
      }
      for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
        var entry = _a[_i];
        callback.call(ctx, entry[1], entry[0]);
      }
    };
    return class_1;
  }();
}();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1 = function() {
  if (typeof global !== "undefined" && global.Math === Math) {
    return global;
  }
  if (typeof self !== "undefined" && self.Math === Math) {
    return self;
  }
  if (typeof window !== "undefined" && window.Math === Math) {
    return window;
  }
  return Function("return this")();
}();
var requestAnimationFrame$1 = function() {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame.bind(global$1);
  }
  return function(callback) {
    return setTimeout(function() {
      return callback(Date.now());
    }, 1e3 / 60);
  };
}();
var trailingTimeout = 2;
function throttle(callback, delay) {
  var leadingCall = false, trailingCall = false, lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
var ResizeObserverController = function() {
  function ResizeObserverController2() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
  }
  ResizeObserverController2.prototype.addObserver = function(observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    }
    if (!this.connected_) {
      this.connect_();
    }
  };
  ResizeObserverController2.prototype.removeObserver = function(observer) {
    var observers2 = this.observers_;
    var index2 = observers2.indexOf(observer);
    if (~index2) {
      observers2.splice(index2, 1);
    }
    if (!observers2.length && this.connected_) {
      this.disconnect_();
    }
  };
  ResizeObserverController2.prototype.refresh = function() {
    var changesDetected = this.updateObservers_();
    if (changesDetected) {
      this.refresh();
    }
  };
  ResizeObserverController2.prototype.updateObservers_ = function() {
    var activeObservers = this.observers_.filter(function(observer) {
      return observer.gatherActive(), observer.hasActive();
    });
    activeObservers.forEach(function(observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  ResizeObserverController2.prototype.connect_ = function() {
    if (!isBrowser || this.connected_) {
      return;
    }
    document.addEventListener("transitionend", this.onTransitionEnd_);
    window.addEventListener("resize", this.refresh);
    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener("DOMSubtreeModified", this.refresh);
      this.mutationEventsAdded_ = true;
    }
    this.connected_ = true;
  };
  ResizeObserverController2.prototype.disconnect_ = function() {
    if (!isBrowser || !this.connected_) {
      return;
    }
    document.removeEventListener("transitionend", this.onTransitionEnd_);
    window.removeEventListener("resize", this.refresh);
    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }
    if (this.mutationEventsAdded_) {
      document.removeEventListener("DOMSubtreeModified", this.refresh);
    }
    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
    var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
    var isReflowProperty = transitionKeys.some(function(key) {
      return !!~propertyName.indexOf(key);
    });
    if (isReflowProperty) {
      this.refresh();
    }
  };
  ResizeObserverController2.getInstance = function() {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController2();
    }
    return this.instance_;
  };
  ResizeObserverController2.instance_ = null;
  return ResizeObserverController2;
}();
var defineConfigurable = function(target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return target;
};
var getWindowOf = function(target) {
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
  return ownerGlobal || global$1;
};
var emptyRect = createRectInit(0, 0, 0, 0);
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }
  return positions.reduce(function(size, position) {
    var value = styles["border-" + position + "-width"];
    return size + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width), height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
var isSVGGraphicsElement = function() {
  if (typeof SVGGraphicsElement !== "undefined") {
    return function(target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  }
  return function(target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
  };
}();
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a) {
  var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
function createRectInit(x, y, width, height) {
  return { x, y, width, height };
}
var ResizeObservation = function() {
  function ResizeObservation2(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  ResizeObservation2.prototype.isActive = function() {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  ResizeObservation2.prototype.broadcastRect = function() {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };
  return ResizeObservation2;
}();
var ResizeObserverEntry = function() {
  function ResizeObserverEntry2(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);
    defineConfigurable(this, { target, contentRect });
  }
  return ResizeObserverEntry2;
}();
var ResizeObserverSPI = function() {
  function ResizeObserverSPI2(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();
    if (typeof callback !== "function") {
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    }
    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  ResizeObserverSPI2.prototype.observe = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (observations.has(target)) {
      return;
    }
    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this);
    this.controller_.refresh();
  };
  ResizeObserverSPI2.prototype.unobserve = function(target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (!observations.has(target)) {
      return;
    }
    observations.delete(target);
    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  ResizeObserverSPI2.prototype.disconnect = function() {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  ResizeObserverSPI2.prototype.gatherActive = function() {
    var _this = this;
    this.clearActive();
    this.observations_.forEach(function(observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  ResizeObserverSPI2.prototype.broadcastActive = function() {
    if (!this.hasActive()) {
      return;
    }
    var ctx = this.callbackCtx_;
    var entries = this.activeObservations_.map(function(observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  ResizeObserverSPI2.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  };
  ResizeObserverSPI2.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  };
  return ResizeObserverSPI2;
}();
var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
var ResizeObserver = function() {
  function ResizeObserver2(callback) {
    if (!(this instanceof ResizeObserver2)) {
      throw new TypeError("Cannot call a class as a function.");
    }
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }
  return ResizeObserver2;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(method) {
  ResizeObserver.prototype[method] = function() {
    var _a;
    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});
var index = function() {
  if (typeof global$1.ResizeObserver !== "undefined") {
    return global$1.ResizeObserver;
  }
  return ResizeObserver;
}();
const createElement = (elName, className) => {
  const el = document.createElement(elName);
  el.className = className;
  return el;
};
const nestElements = (elements) => {
  for (let i = 0; i < elements.length; i++) {
    if (!i)
      continue;
    elements[i - 1].appendChild(elements[i]);
  }
};
const transferDOM = (source, target, clear = true) => {
  const fragment = document.createDocumentFragment();
  const contents = source.children;
  for (let i = 0; i < contents.length; i++) {
    fragment.appendChild(contents[i]);
  }
  target.innerHTML = "";
  if (clear)
    source.innerHTML = "";
  target.appendChild(fragment);
};
const addClass = (el, className) => {
  if (el.className.indexOf(className) === -1) {
    el.className += (el.className.trim() ? " " : "") + className;
  }
};
const removeClass = (el, className) => {
  if (el.className.indexOf(className) !== -1) {
    el.className = el.className.split(/\s+/).filter((c) => {
      return c && c.trim() !== className.trim();
    }).join(" ");
  }
};
const hasClass = (el, className) => {
  return el.className.trim().indexOf(className.trim()) !== -1;
};
const addListener = (el, event, handler) => {
  el.removeEventListener(event, handler);
  el.addEventListener(event, handler);
};
const removeListener = (el, event, handler) => {
  el.removeEventListener(event, handler);
};
const observeMutation = (el, handler, config, context, throttle2) => {
  let throttleTimer = null;
  const clear = () => {
    if (throttleTimer) {
      window.clearTimeout(throttleTimer);
      throttleTimer = null;
    }
  };
  const observer = new window.MutationObserver((mutationList) => {
    if (throttle2) {
      clear();
      throttleTimer = window.setTimeout(() => {
        handler.call(context, mutationList);
        clear();
      }, throttle2);
    } else {
      handler.call(context, mutationList);
    }
  });
  observer.observe(el, config);
  return observer;
};
const observeChildInsert = (el, handler, context) => {
  return observeMutation(el, (mutationList) => {
    let addedNodes = [];
    for (let mutation of mutationList) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (addedNodes.indexOf(node) === -1)
            addedNodes.push(node);
        }
      }
    }
    if (addedNodes.length)
      handler.call(context, addedNodes);
  }, { childList: true }, context);
};
const observeStyleChange = (el, handler, context) => observeMutation(el, handler, { attributeFilter: ["style"] }, context);
const observeResize = (el, handler, context) => {
  let oldSize = { width: 0, height: 0 };
  const observer = new index((entity) => {
    let rect = entity[0].contentRect;
    if (rect.width !== oldSize.width || rect.height !== oldSize.height) {
      handler.call(context);
      oldSize.width = rect.width;
      oldSize.height = rect.height;
    }
  });
  observer.observe(el);
  return observer;
};
const isOnDocument = (elementNode) => {
  if (elementNode === document.body)
    return true;
  else if (!elementNode.parentNode)
    return false;
  else if (elementNode.parentNode === document.body)
    return true;
  else
    return isOnDocument(elementNode.parentNode);
};
let nativeScrollWidth = null;
const getNativeScrollBarWidth = () => {
  if (nativeScrollWidth)
    return nativeScrollWidth;
  let outer = document.createElement("div");
  let inner = document.createElement("div");
  outer.appendChild(inner);
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.visibility = "hidden";
  document.body.appendChild(outer);
  let before = inner.getBoundingClientRect().width;
  outer.style.overflow = "scroll";
  let after = inner.getBoundingClientRect().width;
  document.body.removeChild(outer);
  nativeScrollWidth = before - after;
  return nativeScrollWidth;
};
class Scroller {
  constructor(options) {
    __privateAdd(this, _needX);
    __privateAdd(this, _needY);
    __privateAdd(this, _noX);
    __privateAdd(this, _noY);
    __privateAdd(this, _init);
    __privateAdd(this, _initEl);
    __privateAdd(this, _handleChildInsert);
    __privateAdd(this, _recalc);
    __privateAdd(this, _syncPlaceholderSize);
    __privateAdd(this, _setMask);
    __privateAdd(this, _insertBg);
    __privateAdd(this, _initScrollBarDom);
    __privateAdd(this, _getViewSize);
    __privateAdd(this, _calcStatus);
    __privateAdd(this, _calcVisible);
    __privateAdd(this, _calcBarSize);
    __privateAdd(this, _content2bar);
    __privateAdd(this, _mousedownHandler);
    __privateAdd(this, _mousemoveHandler);
    __privateAdd(this, _mouseupHandler);
    __privateAdd(this, _clickHandler);
    __privateAdd(this, _setBarScroll);
    __privateAdd(this, _bar2content);
    __privateAdd(this, _el, void 0);
    __privateAdd(this, _direction, "both");
    __privateAdd(this, _trackClassName, "_scroller_track_default");
    __privateAdd(this, _barClassName, "_scroller_bar_default");
    __privateAdd(this, _offset, 4);
    __privateAdd(this, _scaleable, true);
    __privateAdd(this, _dragDirection, "");
    __privateAdd(this, _dragDiff, 0);
    __privateAdd(this, _barScroll, 0);
    __privateAdd(this, _scrollListeners, []);
    __privateAdd(this, _DOM, {
      container: createElement("div", "_container"),
      mask: createElement("div", "_mask"),
      contentWrapper: createElement("div", "_content_wrapper"),
      content: createElement("div", "_content"),
      placeholder: createElement("div", "_placeholder"),
      xScrollBarContainer: createElement("div", "_x_scroller_container"),
      xScrollBarTrack: createElement("div", "_x_scroller_track"),
      xScrollBarHandler: createElement("div", "_x_scroller_bar_handler"),
      yScrollBarContainer: createElement("div", "_y_scroller_container"),
      yScrollBarTrack: createElement("div", "_y_scroller_track"),
      yScrollBarHandler: createElement("div", "_y_scroller_bar_handler")
    });
    __privateAdd(this, _observers, {
      elStyleChangeObserver: null,
      elResizeObserver: null,
      childInsertObserver: null,
      contentSizeObserver: null
    });
    __privateAdd(this, _handlers, {
      scrollHandler: () => __privateMethod(this, _content2bar, content2bar_fn).call(this),
      mouseenterHandler: () => __privateMethod(this, _calcStatus, calcStatus_fn).call(this),
      mouseleaveHandler: () => __privateMethod(this, _calcStatus, calcStatus_fn).call(this),
      xMousedownHandler: (event) => __privateMethod(this, _mousedownHandler, mousedownHandler_fn).call(this, event, "horizontal"),
      yMousedownHandler: (event) => __privateMethod(this, _mousedownHandler, mousedownHandler_fn).call(this, event, "vertical"),
      xClickHandler: (event) => __privateMethod(this, _clickHandler, clickHandler_fn).call(this, event, "horizontal"),
      yClickHandler: (event) => __privateMethod(this, _clickHandler, clickHandler_fn).call(this, event, "vertical"),
      mousemoveHandler: (event) => __privateMethod(this, _mousemoveHandler, mousemoveHandler_fn).call(this, event),
      mouseupHandler: (event) => __privateMethod(this, _mouseupHandler, mouseupHandler_fn).call(this, event)
    });
    if (!options.el) {
      throw new Error("Scroller: you should at least specify an element in options");
    }
    __privateSet(this, _el, options.el);
    options.trackClassName && __privateSet(this, _trackClassName, options.trackClassName);
    options.barClassName && __privateSet(this, _barClassName, options.barClassName);
    options.offset !== void 0 && __privateSet(this, _offset, options.offset);
    options.scaleable !== void 0 && __privateSet(this, _scaleable, options.scaleable);
    __privateMethod(this, _init, init_fn).call(this);
    this.setDirection(options.direction || __privateGet(this, _direction), true);
  }
  getScroll() {
    return {
      scrollTop: __privateGet(this, _DOM).mask.scrollTop,
      scrollLeft: __privateGet(this, _DOM).mask.scrollLeft
    };
  }
  scrollTo(position) {
    const { scrollTop, scrollLeft } = position;
    if (scrollTop || scrollTop === 0) {
      __privateGet(this, _DOM).mask.scrollTop = scrollTop;
    }
    if (scrollLeft || scrollLeft === 0) {
      __privateGet(this, _DOM).mask.scrollLeft = scrollLeft;
    }
    return this;
  }
  onScroll(cb) {
    if (__privateGet(this, _scrollListeners).indexOf(cb) === -1) {
      __privateGet(this, _scrollListeners).push(cb);
      addListener(__privateGet(this, _DOM).mask, "scroll", cb);
    }
    return this;
  }
  offScroll(cb) {
    const index2 = __privateGet(this, _scrollListeners).indexOf(cb);
    if (cb && index2 !== -1) {
      removeListener(__privateGet(this, _DOM).mask, "scroll", cb);
      __privateGet(this, _scrollListeners).splice(index2, 1);
    } else {
      __privateGet(this, _scrollListeners).forEach((c) => removeListener(__privateGet(this, _DOM).mask, "scroll", c));
    }
    return this;
  }
  setDirection(direction, lazy) {
    __privateSet(this, _direction, direction);
    if (__privateMethod(this, _noX, noX_fn).call(this)) {
      addClass(__privateGet(this, _DOM).content, "_no_x");
    } else {
      removeClass(__privateGet(this, _DOM).content, "_no_x");
    }
    if (__privateMethod(this, _noY, noY_fn).call(this)) {
      addClass(__privateGet(this, _DOM).content, "_no_y");
    } else {
      removeClass(__privateGet(this, _DOM).content, "_no_y");
    }
    if (!lazy) {
      __privateMethod(this, _recalc, recalc_fn).call(this);
    }
    return this;
  }
  destroy() {
    transferDOM(__privateGet(this, _DOM).content, __privateGet(this, _el));
    __privateGet(this, _el).removeChild(__privateGet(this, _DOM).container);
    __privateGet(this, _el).removeChild(__privateGet(this, _DOM).xScrollBarContainer);
    __privateGet(this, _el).removeChild(__privateGet(this, _DOM).yScrollBarContainer);
    __privateGet(this, _el).removeChild(__privateGet(this, _DOM).placeholder);
    removeClass(__privateGet(this, _el), "_scroller");
    removeListener(__privateGet(this, _el), "mouseenter", __privateGet(this, _handlers).mouseenterHandler);
    removeListener(__privateGet(this, _el), "mouseleave", __privateGet(this, _handlers).mouseleaveHandler);
    removeListener(__privateGet(this, _DOM).xScrollBarHandler, "mousedown", __privateGet(this, _handlers).xMousedownHandler);
    removeListener(__privateGet(this, _DOM).yScrollBarHandler, "mousedown", __privateGet(this, _handlers).yMousedownHandler);
    removeListener(__privateGet(this, _DOM).xScrollBarTrack, "click", __privateGet(this, _handlers).xClickHandler);
    removeListener(__privateGet(this, _DOM).yScrollBarTrack, "click", __privateGet(this, _handlers).yClickHandler);
    removeListener(window, "mousemove", __privateGet(this, _handlers).mousemoveHandler);
    removeListener(window, "mouseup", __privateGet(this, _handlers).mouseupHandler);
    __privateGet(this, _scrollListeners).forEach((c) => removeListener(__privateGet(this, _DOM).mask, "scroll", c));
  }
}
_el = new WeakMap();
_direction = new WeakMap();
_trackClassName = new WeakMap();
_barClassName = new WeakMap();
_offset = new WeakMap();
_scaleable = new WeakMap();
_dragDirection = new WeakMap();
_dragDiff = new WeakMap();
_barScroll = new WeakMap();
_scrollListeners = new WeakMap();
_DOM = new WeakMap();
_observers = new WeakMap();
_handlers = new WeakMap();
_needX = new WeakSet();
needX_fn = function() {
  const contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
  const viewSize = __privateMethod(this, _getViewSize, getViewSize_fn).call(this);
  return (__privateGet(this, _direction) === "horizontal" || __privateGet(this, _direction) === "both") && contentRect.width > viewSize.width;
};
_needY = new WeakSet();
needY_fn = function() {
  const contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
  const viewSize = __privateMethod(this, _getViewSize, getViewSize_fn).call(this);
  return (__privateGet(this, _direction) === "vertical" || __privateGet(this, _direction) === "both") && contentRect.height > viewSize.height;
};
_noX = new WeakSet();
noX_fn = function() {
  return __privateGet(this, _direction) === "vertical" || __privateGet(this, _direction) === "none";
};
_noY = new WeakSet();
noY_fn = function() {
  return __privateGet(this, _direction) === "horizontal" || __privateGet(this, _direction) === "none";
};
_init = new WeakSet();
init_fn = function() {
  __privateMethod(this, _initEl, initEl_fn).call(this);
  nestElements([
    __privateGet(this, _DOM).container,
    __privateGet(this, _DOM).mask,
    __privateGet(this, _DOM).contentWrapper,
    __privateGet(this, _DOM).content
  ]);
  transferDOM(__privateGet(this, _el), __privateGet(this, _DOM).content);
  __privateGet(this, _el).appendChild(__privateGet(this, _DOM).placeholder);
  __privateGet(this, _el).appendChild(__privateGet(this, _DOM).container);
  __privateGet(this, _observers).elStyleChangeObserver = observeStyleChange(__privateGet(this, _el), __privateMethod(this, _recalc, recalc_fn), this);
  __privateGet(this, _observers).elResizeObserver = observeResize(__privateGet(this, _el), __privateMethod(this, _recalc, recalc_fn), this);
  __privateGet(this, _observers).contentSizeObserver = observeResize(__privateGet(this, _DOM).content, __privateMethod(this, _recalc, recalc_fn), this);
  __privateGet(this, _observers).childInsertObserver = observeChildInsert(__privateGet(this, _el), __privateMethod(this, _handleChildInsert, handleChildInsert_fn), this);
  __privateMethod(this, _initScrollBarDom, initScrollBarDom_fn).call(this);
  __privateMethod(this, _recalc, recalc_fn).call(this);
};
_initEl = new WeakSet();
initEl_fn = function() {
  addClass(__privateGet(this, _el), "_scroller");
  if (__privateGet(this, _scaleable))
    addClass(__privateGet(this, _el), "_scaleable");
  let positionStyle = window.getComputedStyle(__privateGet(this, _el)).position;
  if (!positionStyle || positionStyle === "static") {
    __privateGet(this, _el).style.position = "relative";
  }
};
_handleChildInsert = new WeakSet();
handleChildInsert_fn = function(insertedNodes) {
  const children = __privateGet(this, _el).children;
  const indexOfChild = (childEl) => {
    return Array.prototype.indexOf.call(children, childEl);
  };
  for (let el of insertedNodes) {
    if (indexOfChild(el) > indexOfChild(__privateGet(this, _el))) {
      __privateGet(this, _DOM).content.appendChild(el);
    } else {
      __privateGet(this, _DOM).content.insertBefore(el, __privateGet(this, _DOM).content.children[0]);
    }
  }
};
_recalc = new WeakSet();
recalc_fn = function() {
  __privateMethod(this, _syncPlaceholderSize, syncPlaceholderSize_fn).call(this);
  __privateMethod(this, _setMask, setMask_fn).call(this);
  __privateMethod(this, _calcStatus, calcStatus_fn).call(this);
};
_syncPlaceholderSize = new WeakSet();
syncPlaceholderSize_fn = function() {
  let contentRect = {};
  if (isOnDocument(__privateGet(this, _DOM).content)) {
    contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
    if (!contentRect.width) {
      let duplicate = __privateGet(this, _DOM).content.cloneNode(true);
      duplicate.style.visibility = "hidden";
      __privateGet(this, _DOM).placeholder.style.width = "auto";
      __privateGet(this, _DOM).placeholder.style.height = "auto";
      __privateGet(this, _DOM).placeholder.appendChild(duplicate);
      contentRect.width = duplicate.getBoundingClientRect().width;
      __privateGet(this, _DOM).placeholder.removeChild(duplicate);
    }
  } else {
    let duplicate = __privateGet(this, _DOM).content.cloneNode(true);
    duplicate.className = "___";
    duplicate.style.display = "inline-block";
    duplicate.style.position = "absolute";
    duplicate.style.zIndex = "-99999";
    duplicate.style.top = "9999999";
    duplicate.style.left = "9999999";
    document.body.appendChild(duplicate);
    contentRect = duplicate.getBoundingClientRect();
    document.body.removeChild(duplicate);
  }
  __privateGet(this, _DOM).placeholder.style.width = contentRect.width + "px";
  __privateGet(this, _DOM).placeholder.style.height = contentRect.height + "px";
};
_setMask = new WeakSet();
setMask_fn = function() {
  let {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  } = window.getComputedStyle(__privateGet(this, _el));
  let { width, height } = __privateGet(this, _DOM).container.getBoundingClientRect();
  __privateGet(this, _DOM).content.style.paddingLeft = paddingLeft;
  __privateGet(this, _DOM).content.style.paddingTop = paddingTop;
  __privateGet(this, _DOM).content.style.paddingRight = parseFloat(paddingRight) + "px";
  __privateGet(this, _DOM).content.style.paddingBottom = parseFloat(paddingBottom) + "px";
  if (!__privateMethod(this, _needX, needX_fn).call(this)) {
    __privateGet(this, _DOM).mask.style.overflowX = "hidden";
    __privateGet(this, _DOM).mask.style.height = height + "px";
  } else {
    __privateGet(this, _DOM).mask.style.overflowX = "auto";
    __privateGet(this, _DOM).mask.style.height = height + getNativeScrollBarWidth() + "px";
  }
  if (!__privateMethod(this, _needY, needY_fn).call(this)) {
    __privateGet(this, _DOM).mask.style.overflowY = "hidden";
    __privateGet(this, _DOM).mask.style.width = width + "px";
  } else {
    __privateGet(this, _DOM).mask.style.overflowY = "auto";
    __privateGet(this, _DOM).mask.style.width = width + getNativeScrollBarWidth() + "px";
  }
  __privateMethod(this, _content2bar, content2bar_fn).call(this);
  addListener(__privateGet(this, _DOM).mask, "scroll", __privateGet(this, _handlers).scrollHandler);
};
_insertBg = new WeakSet();
insertBg_fn = function(el, className) {
  const bg = document.createElement("div");
  bg.className = className;
  el.insertBefore(bg, el.querySelector(":first-child"));
  return bg;
};
_initScrollBarDom = new WeakSet();
initScrollBarDom_fn = function() {
  nestElements([
    __privateGet(this, _DOM).xScrollBarContainer,
    __privateGet(this, _DOM).xScrollBarTrack,
    __privateGet(this, _DOM).xScrollBarHandler
  ]);
  __privateMethod(this, _insertBg, insertBg_fn).call(this, __privateGet(this, _DOM).xScrollBarTrack, "_scroller_bg " + __privateGet(this, _trackClassName));
  __privateMethod(this, _insertBg, insertBg_fn).call(this, __privateGet(this, _DOM).xScrollBarHandler, "_scroller_bg " + __privateGet(this, _barClassName));
  __privateGet(this, _DOM).container.appendChild(__privateGet(this, _DOM).xScrollBarContainer);
  nestElements([
    __privateGet(this, _DOM).yScrollBarContainer,
    __privateGet(this, _DOM).yScrollBarTrack,
    __privateGet(this, _DOM).yScrollBarHandler
  ]);
  __privateMethod(this, _insertBg, insertBg_fn).call(this, __privateGet(this, _DOM).yScrollBarTrack, "_scroller_bg " + __privateGet(this, _trackClassName));
  __privateMethod(this, _insertBg, insertBg_fn).call(this, __privateGet(this, _DOM).yScrollBarHandler, "_scroller_bg " + __privateGet(this, _barClassName));
  __privateGet(this, _DOM).container.appendChild(__privateGet(this, _DOM).yScrollBarContainer);
  __privateGet(this, _DOM).xScrollBarContainer.style.bottom = __privateGet(this, _offset) + "px";
  __privateGet(this, _DOM).yScrollBarContainer.style.right = __privateGet(this, _offset) + "px";
  __privateMethod(this, _calcStatus, calcStatus_fn).call(this);
  addListener(__privateGet(this, _el), "mouseenter", __privateGet(this, _handlers).mouseenterHandler);
  addListener(__privateGet(this, _el), "mouseleave", __privateGet(this, _handlers).mouseleaveHandler);
  addListener(__privateGet(this, _DOM).xScrollBarHandler, "mousedown", __privateGet(this, _handlers).xMousedownHandler);
  addListener(__privateGet(this, _DOM).yScrollBarHandler, "mousedown", __privateGet(this, _handlers).yMousedownHandler);
  addListener(__privateGet(this, _DOM).xScrollBarTrack, "click", __privateGet(this, _handlers).xClickHandler);
  addListener(__privateGet(this, _DOM).yScrollBarTrack, "click", __privateGet(this, _handlers).yClickHandler);
};
_getViewSize = new WeakSet();
getViewSize_fn = function() {
  const containerRect = __privateGet(this, _DOM).container.getBoundingClientRect();
  return { width: containerRect.width, height: containerRect.height };
};
_calcStatus = new WeakSet();
calcStatus_fn = function() {
  __privateMethod(this, _calcVisible, calcVisible_fn).call(this);
  __privateMethod(this, _calcBarSize, calcBarSize_fn).call(this);
};
_calcVisible = new WeakSet();
calcVisible_fn = function() {
  if (getNativeScrollBarWidth() === 0) {
    __privateGet(this, _DOM).xScrollBarContainer.style.display = "none";
    __privateGet(this, _DOM).yScrollBarContainer.style.display = "none";
  } else {
    if (__privateMethod(this, _needX, needX_fn).call(this)) {
      __privateGet(this, _DOM).xScrollBarContainer.style.display = "inline-block";
    } else {
      __privateGet(this, _DOM).xScrollBarContainer.style.display = "none";
    }
    if (__privateMethod(this, _needY, needY_fn).call(this)) {
      __privateGet(this, _DOM).yScrollBarContainer.style.display = "inline-block";
    } else {
      __privateGet(this, _DOM).yScrollBarContainer.style.display = "none";
    }
  }
};
_calcBarSize = new WeakSet();
calcBarSize_fn = function() {
  const contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
  const viewSize = __privateMethod(this, _getViewSize, getViewSize_fn).call(this);
  const calc = (content, view, track) => Math.floor(track * view / content);
  if (__privateMethod(this, _needY, needY_fn).call(this)) {
    const res = calc(
      contentRect.height,
      viewSize.height,
      __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect().height
    );
    __privateGet(this, _DOM).yScrollBarHandler.style.height = res + "px";
    if (res < 20) {
      addClass(__privateGet(this, _DOM).yScrollBarHandler, "_minimal");
    } else {
      removeClass(__privateGet(this, _DOM).yScrollBarHandler, "_minimal");
    }
  }
  if (__privateMethod(this, _needX, needX_fn).call(this)) {
    const res = calc(
      contentRect.width,
      viewSize.width,
      __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect().width
    );
    __privateGet(this, _DOM).xScrollBarHandler.style.width = res + "px";
    if (res < 20) {
      addClass(__privateGet(this, _DOM).xScrollBarHandler, "_minimal");
    } else {
      removeClass(__privateGet(this, _DOM).xScrollBarHandler, "_minimal");
    }
  }
};
_content2bar = new WeakSet();
content2bar_fn = function() {
  const contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
  const scrollTop = __privateGet(this, _DOM).mask.scrollTop;
  const scrollLeft = __privateGet(this, _DOM).mask.scrollLeft;
  const calc = (scroll, content, track) => Math.ceil(scroll * track / content) + 1;
  if (__privateMethod(this, _needX, needX_fn).call(this)) {
    const trackRect = __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect();
    __privateGet(this, _DOM).xScrollBarHandler.style.transform = `
        translateX(${calc(scrollLeft, contentRect.width, trackRect.width)}px)
      `;
  }
  if (__privateMethod(this, _needY, needY_fn).call(this)) {
    const trackRect = __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect();
    __privateGet(this, _DOM).yScrollBarHandler.style.transform = `
      translateY(${calc(scrollTop, contentRect.height, trackRect.height)}px)
      `;
  }
};
_mousedownHandler = new WeakSet();
mousedownHandler_fn = function(event, direction) {
  event.preventDefault();
  event.stopPropagation();
  __privateSet(this, _dragDirection, direction);
  if (__privateGet(this, _dragDirection) === "vertical") {
    __privateSet(this, _dragDiff, event.pageY - __privateGet(this, _DOM).yScrollBarHandler.getBoundingClientRect().top);
    addClass(__privateGet(this, _DOM).yScrollBarHandler, "_dragging_target");
  } else {
    __privateSet(this, _dragDiff, event.pageX - __privateGet(this, _DOM).xScrollBarHandler.getBoundingClientRect().left);
    addClass(__privateGet(this, _DOM).xScrollBarHandler, "_dragging_target");
  }
  addClass(__privateGet(this, _el), "_dragging");
  addListener(window, "mousemove", __privateGet(this, _handlers).mousemoveHandler);
  addListener(window, "mouseup", __privateGet(this, _handlers).mouseupHandler);
};
_mousemoveHandler = new WeakSet();
mousemoveHandler_fn = function(event) {
  event.preventDefault();
  event.stopPropagation();
  let theoreticBarScroll = 0;
  if (__privateGet(this, _dragDirection) === "vertical") {
    theoreticBarScroll = event.pageY - __privateGet(this, _dragDiff) - __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect().top;
  } else {
    theoreticBarScroll = event.pageX - __privateGet(this, _dragDiff) - __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect().left;
  }
  __privateMethod(this, _setBarScroll, setBarScroll_fn).call(this, theoreticBarScroll);
  __privateMethod(this, _bar2content, bar2content_fn).call(this);
};
_mouseupHandler = new WeakSet();
mouseupHandler_fn = function(event) {
  event.preventDefault();
  event.stopPropagation();
  removeClass(__privateGet(this, _DOM).xScrollBarHandler, "_dragging_target");
  removeClass(__privateGet(this, _DOM).yScrollBarHandler, "_dragging_target");
  removeClass(__privateGet(this, _el), "_dragging");
  removeListener(window, "mousemove", __privateGet(this, _handlers).mousemoveHandler);
  removeListener(window, "mouseup", __privateGet(this, _handlers).mouseupHandler);
};
_clickHandler = new WeakSet();
clickHandler_fn = function(event, direction) {
  if (hasClass(event.target, "_x_scroller_bar") || hasClass(event.target, "_y_scroller_bar"))
    return false;
  __privateSet(this, _dragDirection, direction);
  const calc = (mouse, track, coreSize) => mouse - track - coreSize / 2;
  if (__privateGet(this, _dragDirection) === "vertical") {
    const coreRect = __privateGet(this, _DOM).yScrollBarHandler.getBoundingClientRect();
    const trackRect = __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect();
    __privateSet(this, _barScroll, calc(event.clientY, trackRect.top, coreRect.height));
  } else {
    const coreRect = __privateGet(this, _DOM).xScrollBarHandler.getBoundingClientRect();
    const trackRect = __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect();
    __privateSet(this, _barScroll, calc(event.clientX, trackRect.left, coreRect.width));
  }
  __privateMethod(this, _bar2content, bar2content_fn).call(this);
};
_setBarScroll = new WeakSet();
setBarScroll_fn = function(theoreticBarScroll) {
  if (__privateGet(this, _dragDirection) === "vertical") {
    const barRect = __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect();
    const coreRect = __privateGet(this, _DOM).yScrollBarHandler.getBoundingClientRect();
    const max = barRect.height - coreRect.height;
    const reality = theoreticBarScroll < 0 ? 0 : theoreticBarScroll > max ? max : theoreticBarScroll;
    __privateGet(this, _DOM).yScrollBarHandler.style.transform = `translateY(${reality}px)`;
    __privateSet(this, _barScroll, reality);
  } else {
    const barRect = __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect();
    const coreRect = __privateGet(this, _DOM).xScrollBarHandler.getBoundingClientRect();
    const max = barRect.width - coreRect.width;
    const reality = theoreticBarScroll < 0 ? 0 : theoreticBarScroll > max ? max : theoreticBarScroll;
    __privateGet(this, _DOM).xScrollBarHandler.style.transform = `translateX(${reality}px)`;
    __privateSet(this, _barScroll, reality);
  }
};
_bar2content = new WeakSet();
bar2content_fn = function() {
  const barScroll = __privateGet(this, _barScroll);
  const contentRect = __privateGet(this, _DOM).content.getBoundingClientRect();
  const calc = (barScroll2, content, track) => Math.ceil(barScroll2 * content / track);
  if (__privateGet(this, _dragDirection) === "vertical") {
    const trackRect = __privateGet(this, _DOM).yScrollBarTrack.getBoundingClientRect();
    __privateGet(this, _DOM).mask.scrollTop = calc(barScroll, contentRect.height, trackRect.height);
  } else {
    const trackRect = __privateGet(this, _DOM).xScrollBarTrack.getBoundingClientRect();
    __privateGet(this, _DOM).mask.scrollLeft = calc(barScroll, contentRect.width, trackRect.width);
  }
};
module.exports = Scroller;
