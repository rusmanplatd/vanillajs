import { map } from '../operators/map';
const { isArray } = Array;
/**
 *
 * @param fn
 * @param args
 */
function callOrApply(fn, args) {
  return isArray(args) ? fn(...args) : fn(args);
}
/**
 *
 * @param fn
 */
export function mapOneOrManyArgs(fn) {
  return map((args) => callOrApply(fn, args));
}
//# sourceMappingURL=mapOneOrManyArgs.js.map
