import { mergeMap } from './mergeMap';
import { identity } from '../util/identity';
/**
 *
 * @param concurrent
 */
export function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}
//# sourceMappingURL=mergeAll.js.map
