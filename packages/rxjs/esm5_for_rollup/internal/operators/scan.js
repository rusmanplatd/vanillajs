import { operate } from '../util/lift';
import { scanInternals } from './scanInternals';
/**
 *
 * @param accumulator
 * @param seed
 */
export function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}
//# sourceMappingURL=scan.js.map
