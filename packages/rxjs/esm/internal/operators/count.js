import { reduce } from './reduce';
/**
 *
 * @param predicate
 */
export function count(predicate) {
  return reduce(
    (total, value, i) =>
      !predicate || predicate(value, i) ? total + 1 : total,
    0
  );
}
//# sourceMappingURL=count.js.map
