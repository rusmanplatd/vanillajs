import { defer } from './defer';
/**
 *
 * @param condition
 * @param trueResult
 * @param falseResult
 */
export function iif(condition, trueResult, falseResult) {
  return defer(function () {
    return condition() ? trueResult : falseResult;
  });
}
//# sourceMappingURL=iif.js.map
