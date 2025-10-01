'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createNotification =
  exports.nextNotification =
  exports.errorNotification =
  exports.COMPLETE_NOTIFICATION =
    void 0;
exports.COMPLETE_NOTIFICATION = (function () {
  return createNotification('C', undefined, undefined);
})();
/**
 *
 * @param error
 */
function errorNotification(error) {
  return createNotification('E', undefined, error);
}
exports.errorNotification = errorNotification;
/**
 *
 * @param value
 */
function nextNotification(value) {
  return createNotification('N', value, undefined);
}
exports.nextNotification = nextNotification;
/**
 *
 * @param kind
 * @param value
 * @param error
 */
function createNotification(kind, value, error) {
  return {
    kind: kind,
    value: value,
    error: error,
  };
}
exports.createNotification = createNotification;
//# sourceMappingURL=NotificationFactories.js.map
