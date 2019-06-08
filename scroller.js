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

  ___$insertStyle("._scroller_transition, ._scroller ._x_scroller_track,\n._scroller ._y_scroller_track,\n._scroller ._scroller_bg, ._scroller ._y_scroller_container, ._scroller ._x_scroller_container, ._scroller_bar, ._scroller ._y_scroller_bar, ._scroller ._x_scroller_bar {\n  transition-duration: 0.2s;\n  transition-timing-function: ease;\n  transition-property: opacity, height, width, border-radius, background-color;\n}\n\n._scroller_container, ._scroller ._y_scroller_container, ._scroller ._x_scroller_container {\n  display: none;\n  position: absolute;\n  box-sizing: border-box;\n  opacity: 0.6;\n}\n\n._scroller_bar, ._scroller ._y_scroller_bar, ._scroller ._x_scroller_bar {\n  position: relative;\n  border-radius: 2px;\n}\n._scroller_bar > ._scroller_bg, ._scroller ._y_scroller_bar > ._scroller_bg, ._scroller ._x_scroller_bar > ._scroller_bg {\n  opacity: 0.6;\n}\n._scroller_bar > ._scroller_bg, ._scroller ._y_scroller_bar > ._scroller_bg, ._scroller ._x_scroller_bar > ._scroller_bg {\n  opacity: 0.6;\n}\n\n._dragging * {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n._dragging ._mask {\n  scroll-behavior: auto !important;\n}\n\n._scroller {\n  overflow: hidden;\n}\n._scroller ._container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  box-sizing: border-box !important;\n  z-index: 0;\n}\n._scroller ._mask {\n  width: 100%;\n  height: 100%;\n  overflow: scroll;\n  box-sizing: content-box !important;\n  scroll-behavior: smooth;\n}\n._scroller ._content {\n  display: inline-block;\n  min-width: 100%;\n  box-sizing: border-box;\n}\n._scroller ._no_x {\n  width: 100%;\n  display: block;\n}\n._scroller ._x_scroller_container {\n  left: 0;\n  bottom: 4px;\n  width: 100%;\n  height: 4px;\n  padding: 0 10px;\n}\n._scroller ._y_scroller_container {\n  top: 0;\n  right: 4px;\n  width: 4px;\n  height: 100%;\n  padding: 10px 0;\n}\n._scroller ._x_scroller_track,\n._scroller ._y_scroller_track,\n._scroller ._scroller_bg {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 3px;\n  overflow: hidden;\n}\n._scroller ._scroller_bg {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n._scroller ._x_scroller_track > ._scroller_bg,\n._scroller ._y_scroller_track > ._scroller_bg {\n  opacity: 0.2;\n}\n._scroller ._x_scroller_bar {\n  height: 100%;\n  width: 100px;\n}\n._scroller ._y_scroller_bar {\n  width: 100%;\n  height: 100px;\n}\n._scroller ._x_scroller_bar:hover > ._scroller_bg,\n._scroller ._y_scroller_bar:hover > ._scroller_bg {\n  opacity: 0.9;\n}\n._scroller ._y_scroller_bar._minimal > ._scroller_bg {\n  height: 20px;\n  top: 50%;\n  margin-top: -10px;\n}\n._scroller ._x_scroller_bar._minimal > ._scroller_bg {\n  width: 20px;\n  left: 50%;\n  margin-left: -10px;\n}\n\n._scroller:hover > ._container > ._x_scroller_container,\n._scroller._dragging > ._container > ._x_scroller_container {\n  height: 8px;\n}\n._scroller:hover > ._container > ._y_scroller_container,\n._scroller._dragging > ._container > ._y_scroller_container {\n  width: 8px;\n}\n._scroller:hover ._x_scroller_track,\n._scroller:hover ._y_scroller_track,\n._scroller._dragging ._x_scroller_track,\n._scroller._dragging ._y_scroller_track {\n  border-radius: 4px;\n}\n._scroller:hover ._x_scroller_bar,\n._scroller:hover ._y_scroller_bar,\n._scroller._dragging ._x_scroller_bar,\n._scroller._dragging ._y_scroller_bar {\n  border-radius: 4px;\n}\n\n._scroller ._scroller_track_default {\n  background-color: black;\n}\n._scroller ._scroller_bar_default {\n  background-color: black;\n}\n._scroller ._scroller_bar_default:hover {\n  background-color: black;\n}");

  /**
   * A collection of shims that provide minimal functionality of the ES6 collections.
   *
   * These implementations are not meant to be used outside of the ResizeObserver
   * modules as they cover only a limited range of use cases.
   */
  /* eslint-disable require-jsdoc, valid-jsdoc */
  var MapShim = (function () {
      if (typeof Map !== 'undefined') {
          return Map;
      }
      /**
       * Returns index in provided array that matches the specified key.
       *
       * @param {Array<Array>} arr
       * @param {*} key
       * @returns {number}
       */
      function getIndex(arr, key) {
          var result = -1;
          arr.some(function (entry, index) {
              if (entry[0] === key) {
                  result = index;
                  return true;
              }
              return false;
          });
          return result;
      }
      return /** @class */ (function () {
          function class_1() {
              this.__entries__ = [];
          }
          Object.defineProperty(class_1.prototype, "size", {
              /**
               * @returns {boolean}
               */
              get: function () {
                  return this.__entries__.length;
              },
              enumerable: true,
              configurable: true
          });
          /**
           * @param {*} key
           * @returns {*}
           */
          class_1.prototype.get = function (key) {
              var index = getIndex(this.__entries__, key);
              var entry = this.__entries__[index];
              return entry && entry[1];
          };
          /**
           * @param {*} key
           * @param {*} value
           * @returns {void}
           */
          class_1.prototype.set = function (key, value) {
              var index = getIndex(this.__entries__, key);
              if (~index) {
                  this.__entries__[index][1] = value;
              }
              else {
                  this.__entries__.push([key, value]);
              }
          };
          /**
           * @param {*} key
           * @returns {void}
           */
          class_1.prototype.delete = function (key) {
              var entries = this.__entries__;
              var index = getIndex(entries, key);
              if (~index) {
                  entries.splice(index, 1);
              }
          };
          /**
           * @param {*} key
           * @returns {void}
           */
          class_1.prototype.has = function (key) {
              return !!~getIndex(this.__entries__, key);
          };
          /**
           * @returns {void}
           */
          class_1.prototype.clear = function () {
              this.__entries__.splice(0);
          };
          /**
           * @param {Function} callback
           * @param {*} [ctx=null]
           * @returns {void}
           */
          class_1.prototype.forEach = function (callback, ctx) {
              if (ctx === void 0) { ctx = null; }
              for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                  var entry = _a[_i];
                  callback.call(ctx, entry[1], entry[0]);
              }
          };
          return class_1;
      }());
  })();

  /**
   * Detects whether window and document objects are available in current environment.
   */
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

  // Returns global object of a current environment.
  var global$1 = (function () {
      if (typeof global !== 'undefined' && global.Math === Math) {
          return global;
      }
      if (typeof self !== 'undefined' && self.Math === Math) {
          return self;
      }
      if (typeof window !== 'undefined' && window.Math === Math) {
          return window;
      }
      // eslint-disable-next-line no-new-func
      return Function('return this')();
  })();

  /**
   * A shim for the requestAnimationFrame which falls back to the setTimeout if
   * first one is not supported.
   *
   * @returns {number} Requests' identifier.
   */
  var requestAnimationFrame$1 = (function () {
      if (typeof requestAnimationFrame === 'function') {
          // It's required to use a bounded function because IE sometimes throws
          // an "Invalid calling object" error if rAF is invoked without the global
          // object on the left hand side.
          return requestAnimationFrame.bind(global$1);
      }
      return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
  })();

  // Defines minimum timeout before adding a trailing call.
  var trailingTimeout = 2;
  /**
   * Creates a wrapper function which ensures that provided callback will be
   * invoked only once during the specified delay period.
   *
   * @param {Function} callback - Function to be invoked after the delay period.
   * @param {number} delay - Delay after which to invoke callback.
   * @returns {Function}
   */
  function throttle (callback, delay) {
      var leadingCall = false, trailingCall = false, lastCallTime = 0;
      /**
       * Invokes the original callback function and schedules new invocation if
       * the "proxy" was called during current request.
       *
       * @returns {void}
       */
      function resolvePending() {
          if (leadingCall) {
              leadingCall = false;
              callback();
          }
          if (trailingCall) {
              proxy();
          }
      }
      /**
       * Callback invoked after the specified delay. It will further postpone
       * invocation of the original function delegating it to the
       * requestAnimationFrame.
       *
       * @returns {void}
       */
      function timeoutCallback() {
          requestAnimationFrame$1(resolvePending);
      }
      /**
       * Schedules invocation of the original function.
       *
       * @returns {void}
       */
      function proxy() {
          var timeStamp = Date.now();
          if (leadingCall) {
              // Reject immediately following calls.
              if (timeStamp - lastCallTime < trailingTimeout) {
                  return;
              }
              // Schedule new call to be in invoked when the pending one is resolved.
              // This is important for "transitions" which never actually start
              // immediately so there is a chance that we might miss one if change
              // happens amids the pending invocation.
              trailingCall = true;
          }
          else {
              leadingCall = true;
              trailingCall = false;
              setTimeout(timeoutCallback, delay);
          }
          lastCallTime = timeStamp;
      }
      return proxy;
  }

  // Minimum delay before invoking the update of observers.
  var REFRESH_DELAY = 20;
  // A list of substrings of CSS properties used to find transition events that
  // might affect dimensions of observed elements.
  var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
  // Check if MutationObserver is available.
  var mutationObserverSupported = typeof MutationObserver !== 'undefined';
  /**
   * Singleton controller class which handles updates of ResizeObserver instances.
   */
  var ResizeObserverController = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserverController.
       *
       * @private
       */
      function ResizeObserverController() {
          /**
           * Indicates whether DOM listeners have been added.
           *
           * @private {boolean}
           */
          this.connected_ = false;
          /**
           * Tells that controller has subscribed for Mutation Events.
           *
           * @private {boolean}
           */
          this.mutationEventsAdded_ = false;
          /**
           * Keeps reference to the instance of MutationObserver.
           *
           * @private {MutationObserver}
           */
          this.mutationsObserver_ = null;
          /**
           * A list of connected observers.
           *
           * @private {Array<ResizeObserverSPI>}
           */
          this.observers_ = [];
          this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
          this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
      }
      /**
       * Adds observer to observers list.
       *
       * @param {ResizeObserverSPI} observer - Observer to be added.
       * @returns {void}
       */
      ResizeObserverController.prototype.addObserver = function (observer) {
          if (!~this.observers_.indexOf(observer)) {
              this.observers_.push(observer);
          }
          // Add listeners if they haven't been added yet.
          if (!this.connected_) {
              this.connect_();
          }
      };
      /**
       * Removes observer from observers list.
       *
       * @param {ResizeObserverSPI} observer - Observer to be removed.
       * @returns {void}
       */
      ResizeObserverController.prototype.removeObserver = function (observer) {
          var observers = this.observers_;
          var index = observers.indexOf(observer);
          // Remove observer if it's present in registry.
          if (~index) {
              observers.splice(index, 1);
          }
          // Remove listeners if controller has no connected observers.
          if (!observers.length && this.connected_) {
              this.disconnect_();
          }
      };
      /**
       * Invokes the update of observers. It will continue running updates insofar
       * it detects changes.
       *
       * @returns {void}
       */
      ResizeObserverController.prototype.refresh = function () {
          var changesDetected = this.updateObservers_();
          // Continue running updates if changes have been detected as there might
          // be future ones caused by CSS transitions.
          if (changesDetected) {
              this.refresh();
          }
      };
      /**
       * Updates every observer from observers list and notifies them of queued
       * entries.
       *
       * @private
       * @returns {boolean} Returns "true" if any observer has detected changes in
       *      dimensions of it's elements.
       */
      ResizeObserverController.prototype.updateObservers_ = function () {
          // Collect observers that have active observations.
          var activeObservers = this.observers_.filter(function (observer) {
              return observer.gatherActive(), observer.hasActive();
          });
          // Deliver notifications in a separate cycle in order to avoid any
          // collisions between observers, e.g. when multiple instances of
          // ResizeObserver are tracking the same element and the callback of one
          // of them changes content dimensions of the observed target. Sometimes
          // this may result in notifications being blocked for the rest of observers.
          activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
          return activeObservers.length > 0;
      };
      /**
       * Initializes DOM listeners.
       *
       * @private
       * @returns {void}
       */
      ResizeObserverController.prototype.connect_ = function () {
          // Do nothing if running in a non-browser environment or if listeners
          // have been already added.
          if (!isBrowser || this.connected_) {
              return;
          }
          // Subscription to the "Transitionend" event is used as a workaround for
          // delayed transitions. This way it's possible to capture at least the
          // final state of an element.
          document.addEventListener('transitionend', this.onTransitionEnd_);
          window.addEventListener('resize', this.refresh);
          if (mutationObserverSupported) {
              this.mutationsObserver_ = new MutationObserver(this.refresh);
              this.mutationsObserver_.observe(document, {
                  attributes: true,
                  childList: true,
                  characterData: true,
                  subtree: true
              });
          }
          else {
              document.addEventListener('DOMSubtreeModified', this.refresh);
              this.mutationEventsAdded_ = true;
          }
          this.connected_ = true;
      };
      /**
       * Removes DOM listeners.
       *
       * @private
       * @returns {void}
       */
      ResizeObserverController.prototype.disconnect_ = function () {
          // Do nothing if running in a non-browser environment or if listeners
          // have been already removed.
          if (!isBrowser || !this.connected_) {
              return;
          }
          document.removeEventListener('transitionend', this.onTransitionEnd_);
          window.removeEventListener('resize', this.refresh);
          if (this.mutationsObserver_) {
              this.mutationsObserver_.disconnect();
          }
          if (this.mutationEventsAdded_) {
              document.removeEventListener('DOMSubtreeModified', this.refresh);
          }
          this.mutationsObserver_ = null;
          this.mutationEventsAdded_ = false;
          this.connected_ = false;
      };
      /**
       * "Transitionend" event handler.
       *
       * @private
       * @param {TransitionEvent} event
       * @returns {void}
       */
      ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
          var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
          // Detect whether transition may affect dimensions of an element.
          var isReflowProperty = transitionKeys.some(function (key) {
              return !!~propertyName.indexOf(key);
          });
          if (isReflowProperty) {
              this.refresh();
          }
      };
      /**
       * Returns instance of the ResizeObserverController.
       *
       * @returns {ResizeObserverController}
       */
      ResizeObserverController.getInstance = function () {
          if (!this.instance_) {
              this.instance_ = new ResizeObserverController();
          }
          return this.instance_;
      };
      /**
       * Holds reference to the controller's instance.
       *
       * @private {ResizeObserverController}
       */
      ResizeObserverController.instance_ = null;
      return ResizeObserverController;
  }());

  /**
   * Defines non-writable/enumerable properties of the provided target object.
   *
   * @param {Object} target - Object for which to define properties.
   * @param {Object} props - Properties to be defined.
   * @returns {Object} Target object.
   */
  var defineConfigurable = (function (target, props) {
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
  });

  /**
   * Returns the global object associated with provided element.
   *
   * @param {Object} target
   * @returns {Object}
   */
  var getWindowOf = (function (target) {
      // Assume that the element is an instance of Node, which means that it
      // has the "ownerDocument" property from which we can retrieve a
      // corresponding global object.
      var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
      // Return the local global object if it's not possible extract one from
      // provided element.
      return ownerGlobal || global$1;
  });

  // Placeholder of an empty content rectangle.
  var emptyRect = createRectInit(0, 0, 0, 0);
  /**
   * Converts provided string to a number.
   *
   * @param {number|string} value
   * @returns {number}
   */
  function toFloat(value) {
      return parseFloat(value) || 0;
  }
  /**
   * Extracts borders size from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @param {...string} positions - Borders positions (top, right, ...)
   * @returns {number}
   */
  function getBordersSize(styles) {
      var positions = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          positions[_i - 1] = arguments[_i];
      }
      return positions.reduce(function (size, position) {
          var value = styles['border-' + position + '-width'];
          return size + toFloat(value);
      }, 0);
  }
  /**
   * Extracts paddings sizes from provided styles.
   *
   * @param {CSSStyleDeclaration} styles
   * @returns {Object} Paddings box.
   */
  function getPaddings(styles) {
      var positions = ['top', 'right', 'bottom', 'left'];
      var paddings = {};
      for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
          var position = positions_1[_i];
          var value = styles['padding-' + position];
          paddings[position] = toFloat(value);
      }
      return paddings;
  }
  /**
   * Calculates content rectangle of provided SVG element.
   *
   * @param {SVGGraphicsElement} target - Element content rectangle of which needs
   *      to be calculated.
   * @returns {DOMRectInit}
   */
  function getSVGContentRect(target) {
      var bbox = target.getBBox();
      return createRectInit(0, 0, bbox.width, bbox.height);
  }
  /**
   * Calculates content rectangle of provided HTMLElement.
   *
   * @param {HTMLElement} target - Element for which to calculate the content rectangle.
   * @returns {DOMRectInit}
   */
  function getHTMLElementContentRect(target) {
      // Client width & height properties can't be
      // used exclusively as they provide rounded values.
      var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
      // By this condition we can catch all non-replaced inline, hidden and
      // detached elements. Though elements with width & height properties less
      // than 0.5 will be discarded as well.
      //
      // Without it we would need to implement separate methods for each of
      // those cases and it's not possible to perform a precise and performance
      // effective test for hidden elements. E.g. even jQuery's ':visible' filter
      // gives wrong results for elements with width & height less than 0.5.
      if (!clientWidth && !clientHeight) {
          return emptyRect;
      }
      var styles = getWindowOf(target).getComputedStyle(target);
      var paddings = getPaddings(styles);
      var horizPad = paddings.left + paddings.right;
      var vertPad = paddings.top + paddings.bottom;
      // Computed styles of width & height are being used because they are the
      // only dimensions available to JS that contain non-rounded values. It could
      // be possible to utilize the getBoundingClientRect if only it's data wasn't
      // affected by CSS transformations let alone paddings, borders and scroll bars.
      var width = toFloat(styles.width), height = toFloat(styles.height);
      // Width & height include paddings and borders when the 'border-box' box
      // model is applied (except for IE).
      if (styles.boxSizing === 'border-box') {
          // Following conditions are required to handle Internet Explorer which
          // doesn't include paddings and borders to computed CSS dimensions.
          //
          // We can say that if CSS dimensions + paddings are equal to the "client"
          // properties then it's either IE, and thus we don't need to subtract
          // anything, or an element merely doesn't have paddings/borders styles.
          if (Math.round(width + horizPad) !== clientWidth) {
              width -= getBordersSize(styles, 'left', 'right') + horizPad;
          }
          if (Math.round(height + vertPad) !== clientHeight) {
              height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
          }
      }
      // Following steps can't be applied to the document's root element as its
      // client[Width/Height] properties represent viewport area of the window.
      // Besides, it's as well not necessary as the <html> itself neither has
      // rendered scroll bars nor it can be clipped.
      if (!isDocumentElement(target)) {
          // In some browsers (only in Firefox, actually) CSS width & height
          // include scroll bars size which can be removed at this step as scroll
          // bars are the only difference between rounded dimensions + paddings
          // and "client" properties, though that is not always true in Chrome.
          var vertScrollbar = Math.round(width + horizPad) - clientWidth;
          var horizScrollbar = Math.round(height + vertPad) - clientHeight;
          // Chrome has a rather weird rounding of "client" properties.
          // E.g. for an element with content width of 314.2px it sometimes gives
          // the client width of 315px and for the width of 314.7px it may give
          // 314px. And it doesn't happen all the time. So just ignore this delta
          // as a non-relevant.
          if (Math.abs(vertScrollbar) !== 1) {
              width -= vertScrollbar;
          }
          if (Math.abs(horizScrollbar) !== 1) {
              height -= horizScrollbar;
          }
      }
      return createRectInit(paddings.left, paddings.top, width, height);
  }
  /**
   * Checks whether provided element is an instance of the SVGGraphicsElement.
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  var isSVGGraphicsElement = (function () {
      // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
      // interface.
      if (typeof SVGGraphicsElement !== 'undefined') {
          return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
      }
      // If it's so, then check that element is at least an instance of the
      // SVGElement and that it has the "getBBox" method.
      // eslint-disable-next-line no-extra-parens
      return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
          typeof target.getBBox === 'function'); };
  })();
  /**
   * Checks whether provided element is a document element (<html>).
   *
   * @param {Element} target - Element to be checked.
   * @returns {boolean}
   */
  function isDocumentElement(target) {
      return target === getWindowOf(target).document.documentElement;
  }
  /**
   * Calculates an appropriate content rectangle for provided html or svg element.
   *
   * @param {Element} target - Element content rectangle of which needs to be calculated.
   * @returns {DOMRectInit}
   */
  function getContentRect(target) {
      if (!isBrowser) {
          return emptyRect;
      }
      if (isSVGGraphicsElement(target)) {
          return getSVGContentRect(target);
      }
      return getHTMLElementContentRect(target);
  }
  /**
   * Creates rectangle with an interface of the DOMRectReadOnly.
   * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
   *
   * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
   * @returns {DOMRectReadOnly}
   */
  function createReadOnlyRect(_a) {
      var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
      // If DOMRectReadOnly is available use it as a prototype for the rectangle.
      var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
      var rect = Object.create(Constr.prototype);
      // Rectangle's properties are not writable and non-enumerable.
      defineConfigurable(rect, {
          x: x, y: y, width: width, height: height,
          top: y,
          right: x + width,
          bottom: height + y,
          left: x
      });
      return rect;
  }
  /**
   * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
   * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
   *
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   * @param {number} width - Rectangle's width.
   * @param {number} height - Rectangle's height.
   * @returns {DOMRectInit}
   */
  function createRectInit(x, y, width, height) {
      return { x: x, y: y, width: width, height: height };
  }

  /**
   * Class that is responsible for computations of the content rectangle of
   * provided DOM element and for keeping track of it's changes.
   */
  var ResizeObservation = /** @class */ (function () {
      /**
       * Creates an instance of ResizeObservation.
       *
       * @param {Element} target - Element to be observed.
       */
      function ResizeObservation(target) {
          /**
           * Broadcasted width of content rectangle.
           *
           * @type {number}
           */
          this.broadcastWidth = 0;
          /**
           * Broadcasted height of content rectangle.
           *
           * @type {number}
           */
          this.broadcastHeight = 0;
          /**
           * Reference to the last observed content rectangle.
           *
           * @private {DOMRectInit}
           */
          this.contentRect_ = createRectInit(0, 0, 0, 0);
          this.target = target;
      }
      /**
       * Updates content rectangle and tells whether it's width or height properties
       * have changed since the last broadcast.
       *
       * @returns {boolean}
       */
      ResizeObservation.prototype.isActive = function () {
          var rect = getContentRect(this.target);
          this.contentRect_ = rect;
          return (rect.width !== this.broadcastWidth ||
              rect.height !== this.broadcastHeight);
      };
      /**
       * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
       * from the corresponding properties of the last observed content rectangle.
       *
       * @returns {DOMRectInit} Last observed content rectangle.
       */
      ResizeObservation.prototype.broadcastRect = function () {
          var rect = this.contentRect_;
          this.broadcastWidth = rect.width;
          this.broadcastHeight = rect.height;
          return rect;
      };
      return ResizeObservation;
  }());

  var ResizeObserverEntry = /** @class */ (function () {
      /**
       * Creates an instance of ResizeObserverEntry.
       *
       * @param {Element} target - Element that is being observed.
       * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
       */
      function ResizeObserverEntry(target, rectInit) {
          var contentRect = createReadOnlyRect(rectInit);
          // According to the specification following properties are not writable
          // and are also not enumerable in the native implementation.
          //
          // Property accessors are not being used as they'd require to define a
          // private WeakMap storage which may cause memory leaks in browsers that
          // don't support this type of collections.
          defineConfigurable(this, { target: target, contentRect: contentRect });
      }
      return ResizeObserverEntry;
  }());

  var ResizeObserverSPI = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserver.
       *
       * @param {ResizeObserverCallback} callback - Callback function that is invoked
       *      when one of the observed elements changes it's content dimensions.
       * @param {ResizeObserverController} controller - Controller instance which
       *      is responsible for the updates of observer.
       * @param {ResizeObserver} callbackCtx - Reference to the public
       *      ResizeObserver instance which will be passed to callback function.
       */
      function ResizeObserverSPI(callback, controller, callbackCtx) {
          /**
           * Collection of resize observations that have detected changes in dimensions
           * of elements.
           *
           * @private {Array<ResizeObservation>}
           */
          this.activeObservations_ = [];
          /**
           * Registry of the ResizeObservation instances.
           *
           * @private {Map<Element, ResizeObservation>}
           */
          this.observations_ = new MapShim();
          if (typeof callback !== 'function') {
              throw new TypeError('The callback provided as parameter 1 is not a function.');
          }
          this.callback_ = callback;
          this.controller_ = controller;
          this.callbackCtx_ = callbackCtx;
      }
      /**
       * Starts observing provided element.
       *
       * @param {Element} target - Element to be observed.
       * @returns {void}
       */
      ResizeObserverSPI.prototype.observe = function (target) {
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          // Do nothing if current environment doesn't have the Element interface.
          if (typeof Element === 'undefined' || !(Element instanceof Object)) {
              return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          // Do nothing if element is already being observed.
          if (observations.has(target)) {
              return;
          }
          observations.set(target, new ResizeObservation(target));
          this.controller_.addObserver(this);
          // Force the update of observations.
          this.controller_.refresh();
      };
      /**
       * Stops observing provided element.
       *
       * @param {Element} target - Element to stop observing.
       * @returns {void}
       */
      ResizeObserverSPI.prototype.unobserve = function (target) {
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          // Do nothing if current environment doesn't have the Element interface.
          if (typeof Element === 'undefined' || !(Element instanceof Object)) {
              return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          // Do nothing if element is not being observed.
          if (!observations.has(target)) {
              return;
          }
          observations.delete(target);
          if (!observations.size) {
              this.controller_.removeObserver(this);
          }
      };
      /**
       * Stops observing all elements.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.disconnect = function () {
          this.clearActive();
          this.observations_.clear();
          this.controller_.removeObserver(this);
      };
      /**
       * Collects observation instances the associated element of which has changed
       * it's content rectangle.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.gatherActive = function () {
          var _this = this;
          this.clearActive();
          this.observations_.forEach(function (observation) {
              if (observation.isActive()) {
                  _this.activeObservations_.push(observation);
              }
          });
      };
      /**
       * Invokes initial callback function with a list of ResizeObserverEntry
       * instances collected from active resize observations.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.broadcastActive = function () {
          // Do nothing if observer doesn't have active observations.
          if (!this.hasActive()) {
              return;
          }
          var ctx = this.callbackCtx_;
          // Create ResizeObserverEntry instance for every active observation.
          var entries = this.activeObservations_.map(function (observation) {
              return new ResizeObserverEntry(observation.target, observation.broadcastRect());
          });
          this.callback_.call(ctx, entries, ctx);
          this.clearActive();
      };
      /**
       * Clears the collection of active observations.
       *
       * @returns {void}
       */
      ResizeObserverSPI.prototype.clearActive = function () {
          this.activeObservations_.splice(0);
      };
      /**
       * Tells whether observer has active observations.
       *
       * @returns {boolean}
       */
      ResizeObserverSPI.prototype.hasActive = function () {
          return this.activeObservations_.length > 0;
      };
      return ResizeObserverSPI;
  }());

  // Registry of internal observers. If WeakMap is not available use current shim
  // for the Map collection as it has all required methods and because WeakMap
  // can't be fully polyfilled anyway.
  var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
  /**
   * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
   * exposing only those methods and properties that are defined in the spec.
   */
  var ResizeObserver = /** @class */ (function () {
      /**
       * Creates a new instance of ResizeObserver.
       *
       * @param {ResizeObserverCallback} callback - Callback that is invoked when
       *      dimensions of the observed elements change.
       */
      function ResizeObserver(callback) {
          if (!(this instanceof ResizeObserver)) {
              throw new TypeError('Cannot call a class as a function.');
          }
          if (!arguments.length) {
              throw new TypeError('1 argument required, but only 0 present.');
          }
          var controller = ResizeObserverController.getInstance();
          var observer = new ResizeObserverSPI(callback, controller, this);
          observers.set(this, observer);
      }
      return ResizeObserver;
  }());
  // Expose public methods of ResizeObserver.
  [
      'observe',
      'unobserve',
      'disconnect'
  ].forEach(function (method) {
      ResizeObserver.prototype[method] = function () {
          var _a;
          return (_a = observers.get(this))[method].apply(_a, arguments);
      };
  });

  var index = (function () {
      // Export existing implementation if available.
      if (typeof global$1.ResizeObserver !== 'undefined') {
          return global$1.ResizeObserver;
      }
      return ResizeObserver;
  })();

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
      }).join(' ');
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
  var observeMutation = function observeMutation(el, handler, config, context, throttle) {
    if (!window.MutationObserver) {
      return {
        disconnect: function disconnect() {}
      };
    }

    var throttleTimer = null;

    var clear = function clear() {
      if (throttleTimer) {
        window.clearTimeout(throttleTimer);
        throttleTimer = null;
      }
    };

    var observer = new window.MutationObserver(function (mutationList) {
      if (throttle) {
        clear();
        throttleTimer = window.setTimeout(function (_) {
          handler.call(context, mutationList);
          clear();
        }, throttle);
      } else {
        handler.call(context, mutationList);
      }
    });
    observer.observe(el, config);
    return observer;
  };
  var observeChildInsert = function observeChildInsert(el, handler, context) {
    return observeMutation(el, function (mutationList) {
      var addedNodes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutationList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;

          if (mutation.addedNodes && mutation.addedNodes.length) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = mutation.addedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var node = _step2.value;
                if (addedNodes.indexOf(node) === -1) addedNodes.push(node);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
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

      if (addedNodes.length) handler.call(context, addedNodes);
    }, {
      childList: true
    }, context);
  };
  var observeStyleChange = function observeStyleChange(el, handler, context) {
    return observeMutation(el, handler, {
      attributeFilter: ['style']
    }, context);
  };
  var observeResize = function observeResize(el, handler, context) {
    var observer = new index(function () {
      handler.call(context);
    });
    observer.observe(el);
    return observer;
  };

  var directions = ['horizontal', 'vertical', 'both', 'none'];

  var Scroller =
  /*#__PURE__*/
  function () {
    function Scroller() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Scroller);

      // deal with options
      this.el = options.el; // this.direction = directions.indexOf(options.direction) !== -1
      //   ? options.direction
      //   : 'both'

      this.trackClassName = options.trackClassName || '_scroller_track_default';
      this.barClassName = options.barClassName || '_scroller_bar_default'; // other properties

      this.container = null;
      this.placeholder = null;
      this.content = null;
      this.elStyleChangeObserver = null;
      this.elResizeObserver = null;
      this.childInsertObserver = null;
      this.contentSizeObserver = null;
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

      this.setDirection(options.direction, true);
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
      key: "_noX",
      value: function _noX() {
        return this.direction === 'vertical' || this.direction === 'none';
      }
    }, {
      key: "_noY",
      value: function _noY() {
        return this.direction === 'horizontal' || this.direction === 'none';
      }
    }, {
      key: "_init",
      value: function _init() {
        // prepare target element
        this._initEl(); // init dom constructure


        createDOM(['_container', '_mask', '_content_wrapper', '_content'], this);
        transferDOM(this.el, this.content);
        this.placeholder = document.createElement('div');
        this.placeholder.className = '_placeholder';
        this.el.appendChild(this.placeholder);
        this.el.appendChild(this.container);
        this.elStyleChangeObserver = observeStyleChange(this.el, this._recalc, this);
        this.elResizeObserver = observeResize(this.el, this._recalc, this);
        this.contentSizeObserver = observeResize(this.content, this._recalc, this);
        this.childInsertObserver = observeChildInsert(this.el, this._handleChildInsert, this);

        this._initScrollerDom();

        this._recalc();
      }
    }, {
      key: "_initEl",
      value: function _initEl() {
        if (!this.el) {
          throw new Error('Scroller: you should at least specify an DOM element in options');
        }

        addClass(this.el, '_scroller');
        var positionStyle = window.getComputedStyle(this.el).position;

        if (!positionStyle || positionStyle === 'static') {
          this.el.style.position = 'relative';
        }
      }
    }, {
      key: "_handleChildInsert",
      value: function _handleChildInsert(insertedNodes) {
        var children = this.el.children;

        children.indexOf = function (el) {
          return Array.prototype.indexOf.call(children, el);
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = insertedNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var el = _step.value;

            if (children.indexOf(el) > children.indexOf(this.el)) {
              this.content.appendChild(el);
            } else {
              this.content.insertBefore(el, this.content.children[0]);
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
      }
    }, {
      key: "_recalc",
      value: function _recalc() {
        this._setMask();

        this._calcStatus();

        this._syncPlaceholderSize();
      }
    }, {
      key: "_syncPlaceholderSize",
      value: function _syncPlaceholderSize() {
        var contentRect = this.content.getBoundingClientRect();

        if (!contentRect.width && !contentRect.height) {
          var duplicate = this.content.cloneNode(true);
          duplicate.className = '___';
          duplicate.style.display = 'inline-block';
          duplicate.style.position = 'absolute';
          duplicate.style.zIndex = '-99999';
          duplicate.style.top = '9999999';
          duplicate.style.left = '9999999';
          document.body.appendChild(duplicate);
          contentRect = duplicate.getBoundingClientRect();
          document.body.removeChild(duplicate);
          duplicate = null;
        }

        this.placeholder.style.width = contentRect.width + 'px';
        this.placeholder.style.height = contentRect.height + 'px';
      }
    }, {
      key: "_setMask",
      value: function _setMask() {
        var _this = this;

        // use a mask div to do the real scroll
        var _window$getComputedSt = window.getComputedStyle(this.el),
            paddingTop = _window$getComputedSt.paddingTop,
            paddingRight = _window$getComputedSt.paddingRight,
            paddingBottom = _window$getComputedSt.paddingBottom,
            paddingLeft = _window$getComputedSt.paddingLeft;

        var _this$container$getBo = this.container.getBoundingClientRect(),
            width = _this$container$getBo.width,
            height = _this$container$getBo.height; // this.mask.style.paddingTop = paddingTop
        // this.mask.style.paddingLeft = paddingLeft
        // this.mask.style.paddingRight = parseFloat(paddingRight) + 20 + 'px'
        // this.mask.style.paddingBottom = parseFloat(paddingBottom) + 20 + 'px'
        // this.mask.style.paddingRight = 20 + 'px'
        // this.mask.style.paddingBottom = 20 + 'px'
        // console.log(paddingRight, paddingBottom)


        this.content.style.paddingLeft = paddingLeft;
        this.content.style.paddingTop = paddingTop;
        this.content.style.paddingRight = parseFloat(paddingRight) + 'px';
        this.content.style.paddingBottom = parseFloat(paddingBottom) + 'px'; // const verticalDiff = parseFloat(paddingTop) + parseFloat(paddingBottom)
        // const horizontalDiff = parseFloat(paddingLeft) + parseFloat(paddingRight)
        // this.mask.style.width = width - horizontalDiff + 'px'
        // this.mask.style.height = height - verticalDiff + 'px'
        // this.mask.style.width = width - horizontalDiff + 'px'
        // this.mask.style.height = height - verticalDiff + 'px'
        // this.contentWrapper.style.width = this.mask.getBoundingClientRect().width + 'px'
        // this.contentWrapper.style.height = this.mask.style.height

        if (!this._needX()) {
          this.mask.style.overflowX = 'hidden';
          this.mask.style.height = height + 'px';
        } else {
          this.mask.style.overflowX = 'auto';
          this.mask.style.height = height + 20 + 'px';
        }

        if (!this._needY()) {
          this.mask.style.overflowY = 'hidden';
          this.mask.style.width = width + 'px';
        } else {
          this.mask.style.overflowY = 'auto';
          this.mask.style.width = width + 20 + 'px';
        }

        this.scrollHandler = function () {
          return _this._content2bar();
        };

        this._content2bar();

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
        var _this2 = this;

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
          return _this2._calcStatus();
        };

        this.mouseleaveHandler = function () {
          return _this2._calcStatus();
        };

        addListener(this.el, 'mouseenter', this.mouseenterHandler);
        addListener(this.el, 'mouseleave', this.mouseleaveHandler);

        this.xMousedownHandler = function (e) {
          return _this2._mousedownHandler(e, 'horizontal');
        };

        this.yMousedownHandler = function (e) {
          return _this2._mousedownHandler(e, 'vertical');
        };

        addListener(this.xScrollerBar, 'mousedown', this.xMousedownHandler);
        addListener(this.yScrollerBar, 'mousedown', this.yMousedownHandler);

        this.xClickHandler = function (e) {
          return _this2._clickHandler(e, 'horizontal');
        };

        this.yClickHandler = function (e) {
          return _this2._clickHandler(e, 'vertical');
        };

        addListener(this.xScrollerTrack, 'click', this.xClickHandler);
        addListener(this.yScrollerTrack, 'click', this.yClickHandler);
      }
    }, {
      key: "_getViewSize",
      value: function _getViewSize() {
        var containerRect = this.container.getBoundingClientRect();
        var width = parseFloat(containerRect.width); // firefox will ignore padding bottom when do scrolling

        var height = parseFloat(containerRect.height);
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
          this.xScrollerContainer.style.display = 'inline-block'; // this.mask.style.overflowX = 'auto'
        } else {
          this.xScrollerContainer.style.display = 'none'; // this.mask.style.overflowX = 'hidden'
        }

        if (this._needY() && contentRect.height > viewSize.height) {
          this.yScrollerContainer.style.display = 'inline-block'; // this.mask.style.overflowY = 'auto'
        } else {
          this.yScrollerContainer.style.display = 'none'; // this.mask.style.overflowY = 'hidden'
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
          var res = calc(contentRect.height, viewSize.height, this.yScrollerTrack.getBoundingClientRect().height);
          this.yScrollerBar.style.height = res + 'px';

          if (res < 20) {
            addClass(this.yScrollerBar, '_minimal');
          } else {
            removeClass(this.yScrollerBar, '_minimal');
          }
        }

        if (this._needX) {
          var _res = calc(contentRect.width, viewSize.width, this.xScrollerTrack.getBoundingClientRect().width);

          this.xScrollerBar.style.width = _res + 'px';

          if (_res < 20) {
            addClass(this.xScrollerBar, '_minimal');
          } else {
            removeClass(this.xScrollerBar, '_minimal');
          }
        }
      }
    }, {
      key: "_content2bar",
      value: function _content2bar() {
        var contentRect = this.content.getBoundingClientRect();
        var scrollTop = this.mask.scrollTop;
        var scrollLeft = this.mask.scrollLeft;

        var calc = function calc(scroll, content, track) {
          return Math.ceil(scroll * track / content) + 1;
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
        var _this3 = this;

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
          return _this3._mousemoveHandler(e);
        };

        this.mouseupHandler = function (e) {
          return _this3._mouseupHandler(e);
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
          this.barScroll = calc(e.clientY, trackRect.top, coreRect.height);
        } else {
          var _coreRect = this.xScrollerBar.getBoundingClientRect();

          var _trackRect2 = this.xScrollerTrack.getBoundingClientRect();

          this.barScroll = calc(e.clientX, _trackRect2.left, _coreRect.width);
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
          return Math.ceil(barScroll * content / track);
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
        var _this4 = this;

        var index = this.cbs.indexOf(cb);

        if (cb && index !== -1) {
          removeListener(this.mask, 'scroll', cb);
          this.cbs.splice(index, 1);
        } else {
          this.cbs.forEach(function (c) {
            return removeListener(_this4.mask, 'scroll', c);
          });
        }

        return this;
      }
    }, {
      key: "setDirection",
      value: function setDirection(direction, lazy) {
        this.direction = directions.indexOf(direction) !== -1 ? direction : 'both';

        if (this._noX()) {
          addClass(this.content, '_no_x');
        } else {
          removeClass(this.content, '_no_x');
        }

        if (this._noY()) {
          addClass(this.content, '_no_y');
        } else {
          removeClass(this.content, '_no_y');
        }

        if (!lazy) {
          this._recalc();
        }

        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this5 = this;

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
          return removeListener(_this5.mask, 'scroll', c);
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
        this.placeholder = null;
        this.contentWrapper = null;
        this.content = null;
        this.direction = null;
        this.drag = null;
        this.dragDiff = null;
        this.dragDirection = null;
        this.el = null;
        this.mask = null;
        this.elResizeObserver.disconnect();
        this.elResizeObserver = null;
        this.elStyleChangeObserver.disconnect();
        this.elStyleChangeObserver = null;
        this.childInsertObserver.disconnect();
        this.childInsertObserver = null;
        this.contentSizeObserver.disconnect();
        this.contentSizeObserver = null;
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
