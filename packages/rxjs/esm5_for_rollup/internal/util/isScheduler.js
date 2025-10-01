import { isFunction } from './isFunction';
/**
 *
 * @param value
 */
export function isScheduler(value) {
  return value && isFunction(value.schedule);
}
//# sourceMappingURL=isScheduler.js.map
