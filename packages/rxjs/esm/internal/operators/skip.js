import { filter } from './filter';
/**
 *
 * @param count
 */
export function skip(count) {
  return filter((_, index) => count <= index);
}
//# sourceMappingURL=skip.js.map
