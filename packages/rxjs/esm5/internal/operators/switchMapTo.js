import { switchMap } from './switchMap';
import { isFunction } from '../util/isFunction';
/**
 *
 * @param innerObservable
 * @param resultSelector
 */
export function switchMapTo(innerObservable, resultSelector) {
  return isFunction(resultSelector)
    ? switchMap(function () {
        return innerObservable;
      }, resultSelector)
    : switchMap(function () {
        return innerObservable;
      });
}
//# sourceMappingURL=switchMapTo.js.map
