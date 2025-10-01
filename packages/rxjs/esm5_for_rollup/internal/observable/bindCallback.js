import { bindCallbackInternals } from './bindCallbackInternals';
/**
 *
 * @param callbackFunc
 * @param resultSelector
 * @param scheduler
 */
export function bindCallback(callbackFunc, resultSelector, scheduler) {
  return bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
}
//# sourceMappingURL=bindCallback.js.map
