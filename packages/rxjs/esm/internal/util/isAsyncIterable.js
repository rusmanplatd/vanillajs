import { isFunction } from './isFunction';
/**
 *
 * @param obj
 */
export function isAsyncIterable(obj) {
  return (
    Symbol.asyncIterator &&
    isFunction(
      obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]
    )
  );
}
//# sourceMappingURL=isAsyncIterable.js.map
