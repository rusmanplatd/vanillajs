import { argsOrArgArray } from '../util/argsOrArgArray';
import { raceWith } from './raceWith';
/**
 *
 * @param {...any} args
 */
export function race(...args) {
  return raceWith(...argsOrArgArray(args));
}
//# sourceMappingURL=race.js.map
