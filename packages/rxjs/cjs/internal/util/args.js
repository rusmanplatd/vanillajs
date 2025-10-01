'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.popNumber = exports.popScheduler = exports.popResultSelector = void 0;
var isFunction_1 = require('./isFunction');
var isScheduler_1 = require('./isScheduler');
/**
 *
 * @param arr
 */
function last(arr) {
  return arr[arr.length - 1];
}
/**
 *
 * @param args
 */
function popResultSelector(args) {
  return isFunction_1.isFunction(last(args)) ? args.pop() : undefined;
}
exports.popResultSelector = popResultSelector;
/**
 *
 * @param args
 */
function popScheduler(args) {
  return isScheduler_1.isScheduler(last(args)) ? args.pop() : undefined;
}
exports.popScheduler = popScheduler;
/**
 *
 * @param args
 * @param defaultValue
 */
function popNumber(args, defaultValue) {
  return typeof last(args) === 'number' ? args.pop() : defaultValue;
}
exports.popNumber = popNumber;
//# sourceMappingURL=args.js.map
