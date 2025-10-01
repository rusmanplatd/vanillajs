import { observable as Symbol_observable } from '../symbol/observable';
import { isFunction } from './isFunction';
/**
 *
 * @param input
 */
export function isInteropObservable(input) {
  return isFunction(input[Symbol_observable]);
}
//# sourceMappingURL=isInteropObservable.js.map
