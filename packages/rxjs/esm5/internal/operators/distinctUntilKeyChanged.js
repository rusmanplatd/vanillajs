import { distinctUntilChanged } from './distinctUntilChanged';
/**
 *
 * @param key
 * @param compare
 */
export function distinctUntilKeyChanged(key, compare) {
  return distinctUntilChanged(function (x, y) {
    return compare ? compare(x[key], y[key]) : x[key] === y[key];
  });
}
//# sourceMappingURL=distinctUntilKeyChanged.js.map
