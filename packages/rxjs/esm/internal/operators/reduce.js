import { scanInternals } from './scanInternals';
import { operate } from '../util/lift';
/**
 *
 * @param accumulator
 * @param seed
 */
export function reduce(accumulator, seed) {
  return operate(
    scanInternals(accumulator, seed, arguments.length >= 2, false, true)
  );
}
//# sourceMappingURL=reduce.js.map
