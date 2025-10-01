'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.NO_SUBS = exports.createObservableInputs = exports.lowerCaseO = void 0;
var rxjs_1 = require('rxjs');
var observable_1 = require('rxjs/internal/symbol/observable');
var iterator_1 = require('rxjs/internal/symbol/iterator');
if (process && process.on) {
  process.on('unhandledRejection', function (err) {
    console.error(err);
    process.exit(1);
  });
}
/**
 *
 */
function lowerCaseO() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var o = {
    subscribe: function (observer) {
      args.forEach(function (v) {
        return observer.next(v);
      });
      observer.complete();
      return {
        unsubscribe: function () {},
      };
    },
  };
  o[observable_1.observable] = function () {
    return this;
  };
  return o;
}
exports.lowerCaseO = lowerCaseO;
var createObservableInputs = function (value) {
  var _a, _b;
  return rxjs_1.of(
    rxjs_1.of(value),
    rxjs_1.scheduled([value], rxjs_1.asyncScheduler),
    [value],
    Promise.resolve(value),
    ((_a = {}),
    (_a[iterator_1.iterator] = function () {
      var iteratorResults = [{ value: value, done: false }, { done: true }];
      return {
        next: function () {
          return iteratorResults.shift();
        },
      };
    }),
    _a),
    ((_b = {}),
    (_b[observable_1.observable] = function () {
      return rxjs_1.of(value);
    }),
    _b)
  );
};
exports.createObservableInputs = createObservableInputs;
exports.NO_SUBS = [];
//# sourceMappingURL=test-helper.js.map
