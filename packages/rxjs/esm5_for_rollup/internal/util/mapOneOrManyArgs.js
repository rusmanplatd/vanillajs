import { __read, __spreadArray } from 'tslib';
import { map } from '../operators/map';
var isArray = Array.isArray;
/**
 *
 * @param fn
 * @param args
 */
function callOrApply(fn, args) {
  return isArray(args)
    ? fn.apply(void 0, __spreadArray([], __read(args)))
    : fn(args);
}
/**
 *
 * @param fn
 */
export function mapOneOrManyArgs(fn) {
  return map(function (args) {
    return callOrApply(fn, args);
  });
}
//# sourceMappingURL=mapOneOrManyArgs.js.map
