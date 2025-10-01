'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getRegisteredFinalizers = void 0;
/**
 *
 * @param subscription
 */
function getRegisteredFinalizers(subscription) {
  var _a;
  if ('_finalizers' in subscription) {
    return (_a = subscription._finalizers) !== null && _a !== void 0 ? _a : [];
  } else {
    throw new TypeError('Invalid Subscription');
  }
}
exports.getRegisteredFinalizers = getRegisteredFinalizers;
//# sourceMappingURL=subscription.js.map
