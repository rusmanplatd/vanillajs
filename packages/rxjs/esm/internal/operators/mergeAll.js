import { mergeMap } from './mergeMap';
import { identity } from '../util/identity';
/**
 *
 * @param concurrent
 */
export function mergeAll(concurrent = Infinity) {
  return mergeMap(identity, concurrent);
}
//# sourceMappingURL=mergeAll.js.map
