'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai = require('chai');
var sinonChai = require('sinon-chai');
if (typeof Symbol !== 'function') {
  var id_1 = 0;
  var symbolFn = function (description) {
    return 'Symbol_' + id_1++ + ' ' + description + ' (RxJS Testing Polyfill)';
  };
  Symbol = symbolFn;
}
if (!Symbol.observable) {
  Symbol.observable = Symbol('Symbol.observable polyfill from RxJS Testing');
}
(function (window) {
  window = window || this;
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})(global);
chai.use(sinonChai);
//# sourceMappingURL=setup.js.map
