import { operate } from '../util/lift';
import { createFind } from './find';
/**
 *
 * @param predicate
 * @param thisArg
 */
export function findIndex(predicate, thisArg) {
  return operate(createFind(predicate, thisArg, 'index'));
}
//# sourceMappingURL=findIndex.js.map
