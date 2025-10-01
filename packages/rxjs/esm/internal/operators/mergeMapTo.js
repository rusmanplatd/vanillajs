import { mergeMap } from './mergeMap';
import { isFunction } from '../util/isFunction';
/**
 *
 * @param innerObservable
 * @param resultSelector
 * @param concurrent
 */
export function mergeMapTo(
  innerObservable,
  resultSelector,
  concurrent = Infinity
) {
  if (isFunction(resultSelector)) {
    return mergeMap(() => innerObservable, resultSelector, concurrent);
  }
  if (typeof resultSelector === 'number') {
    concurrent = resultSelector;
  }
  return mergeMap(() => innerObservable, concurrent);
}
//# sourceMappingURL=mergeMapTo.js.map
