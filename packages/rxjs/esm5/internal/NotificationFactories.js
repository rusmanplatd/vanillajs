export var COMPLETE_NOTIFICATION = (function () {
  return createNotification('C', undefined, undefined);
})();
/**
 *
 * @param error
 */
export function errorNotification(error) {
  return createNotification('E', undefined, error);
}
/**
 *
 * @param value
 */
export function nextNotification(value) {
  return createNotification('N', value, undefined);
}
/**
 *
 * @param kind
 * @param value
 * @param error
 */
export function createNotification(kind, value, error) {
  return {
    kind: kind,
    value: value,
    error: error,
  };
}
//# sourceMappingURL=NotificationFactories.js.map
