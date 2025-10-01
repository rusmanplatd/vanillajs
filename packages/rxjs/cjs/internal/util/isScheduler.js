'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isScheduler = void 0;
var isFunction_1 = require('./isFunction');
/**
 *
 * @param value
 */
function isScheduler(value) {
  return value && isFunction_1.isFunction(value.schedule);
}
exports.isScheduler = isScheduler;
//# sourceMappingURL=isScheduler.js.map
