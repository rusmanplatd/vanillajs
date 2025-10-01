import { raceInit } from '../observable/race';
import { operate } from '../util/lift';
import { identity } from '../util/identity';
/**
 *
 * @param {...any} otherSources
 */
export function raceWith(...otherSources) {
  return !otherSources.length
    ? identity
    : operate((source, subscriber) => {
        raceInit([source, ...otherSources])(subscriber);
      });
}
//# sourceMappingURL=raceWith.js.map
