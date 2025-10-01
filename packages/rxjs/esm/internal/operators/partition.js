import { not } from '../util/not';
import { filter } from './filter';
/**
 *
 * @param predicate
 * @param thisArg
 */
export function partition(predicate, thisArg) {
  return (source) => [
    filter(predicate, thisArg)(source),
    filter(not(predicate, thisArg))(source),
  ];
}
//# sourceMappingURL=partition.js.map
