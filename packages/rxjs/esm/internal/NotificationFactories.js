export const COMPLETE_NOTIFICATION = (() =>
  createNotification('C', undefined, undefined))();
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
    kind,
    value,
    error,
  };
}
//# sourceMappingURL=NotificationFactories.js.map
