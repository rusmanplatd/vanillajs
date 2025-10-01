'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.asInteropSubscriber =
  exports.asInteropSubject =
  exports.asInteropObservable =
    void 0;
var rxjs_1 = require('rxjs');
/**
 *
 * @param observable
 */
function asInteropObservable(observable) {
  return new Proxy(observable, {
    get: function (target, key) {
      if (key === 'lift') {
        var lift = target.lift;
        return interopLift(lift);
      }
      if (key === 'subscribe') {
        var subscribe = target.subscribe;
        return interopSubscribe(subscribe);
      }
      return Reflect.get(target, key);
    },
    getPrototypeOf: function (target) {
      var _a = Object.getPrototypeOf(target),
        lift = _a.lift,
        subscribe = _a.subscribe,
        rest = __rest(_a, ['lift', 'subscribe']);
      return __assign(__assign({}, rest), {
        lift: interopLift(lift),
        subscribe: interopSubscribe(subscribe),
      });
    },
  });
}
exports.asInteropObservable = asInteropObservable;
/**
 *
 * @param subject
 */
function asInteropSubject(subject) {
  return asInteropSubscriber(subject);
}
exports.asInteropSubject = asInteropSubject;
/**
 *
 * @param subscriber
 */
function asInteropSubscriber(subscriber) {
  return new Proxy(subscriber, {
    get: function (target, key) {
      return Reflect.get(target, key);
    },
    getPrototypeOf: function (target) {
      var rest = __rest(Object.getPrototypeOf(target), []);
      return rest;
    },
  });
}
exports.asInteropSubscriber = asInteropSubscriber;
/**
 *
 * @param lift
 */
function interopLift(lift) {
  return function (operator) {
    var observable = lift.call(this, operator);
    var call = observable.operator.call;
    observable.operator.call = function (subscriber, source) {
      return call.call(this, asInteropSubscriber(subscriber), source);
    };
    observable.source = asInteropObservable(observable.source);
    return asInteropObservable(observable);
  };
}
/**
 *
 * @param subscribe
 */
function interopSubscribe(subscribe) {
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var _a = __read(args, 1),
      arg = _a[0];
    if (arg instanceof rxjs_1.Subscriber) {
      return subscribe.call(this, asInteropSubscriber(arg));
    }
    return subscribe.apply(this, args);
  };
}
//# sourceMappingURL=interop-helper.js.map
