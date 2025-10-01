import { isFunction } from './isFunction';
/**
 *
 * @param value
 */
export function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}
//# sourceMappingURL=isPromise.js.map
