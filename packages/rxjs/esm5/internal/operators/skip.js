import { filter } from './filter';
/**
 *
 * @param count
 */
export function skip(count) {
  return filter(function (_, index) {
    return count <= index;
  });
}
//# sourceMappingURL=skip.js.map
