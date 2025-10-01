'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.distinctUntilKeyChanged = void 0;
var distinctUntilChanged_1 = require('./distinctUntilChanged');
/**
 *
 * @param key
 * @param compare
 */
function distinctUntilKeyChanged(key, compare) {
  return distinctUntilChanged_1.distinctUntilChanged(function (x, y) {
    return compare ? compare(x[key], y[key]) : x[key] === y[key];
  });
}
exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
//# sourceMappingURL=distinctUntilKeyChanged.js.map
