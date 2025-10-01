import { popScheduler } from '../util/args';
import { from } from './from';
/**
 *
 * @param {...any} args
 */
export function of(...args) {
  const scheduler = popScheduler(args);
  return from(args, scheduler);
}
//# sourceMappingURL=of.js.map
