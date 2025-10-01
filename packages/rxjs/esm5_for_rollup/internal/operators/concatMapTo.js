import { concatMap } from './concatMap';
import { isFunction } from '../util/isFunction';
/**
 *
 * @param innerObservable
 * @param resultSelector
 */
export function concatMapTo(innerObservable, resultSelector) {
  return isFunction(resultSelector)
    ? concatMap(function () {
        return innerObservable;
      }, resultSelector)
    : concatMap(function () {
        return innerObservable;
      });
}
//# sourceMappingURL=concatMapTo.js.map
