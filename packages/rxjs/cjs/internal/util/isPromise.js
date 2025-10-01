'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isPromise = void 0;
var isFunction_1 = require('./isFunction');
/**
 *
 * @param value
 */
function isPromise(value) {
  return isFunction_1.isFunction(
    value === null || value === void 0 ? void 0 : value.then
  );
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map
