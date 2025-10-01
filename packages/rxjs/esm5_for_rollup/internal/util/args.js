import { isFunction } from './isFunction';
import { isScheduler } from './isScheduler';
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
export function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : undefined;
}
/**
 *
 * @param args
 */
export function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : undefined;
}
/**
 *
 * @param args
 * @param defaultValue
 */
export function popNumber(args, defaultValue) {
  return typeof last(args) === 'number' ? args.pop() : defaultValue;
}
//# sourceMappingURL=args.js.map
