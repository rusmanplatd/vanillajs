import { concatAll } from '../operators/concatAll';
import { popScheduler } from '../util/args';
import { from } from './from';
/**
 *
 * @param {...any} args
 */
export function concat(...args) {
  return concatAll()(from(args, popScheduler(args)));
}
//# sourceMappingURL=concat.js.map
