import { bindCallbackInternals } from './bindCallbackInternals';
/**
 *
 * @param callbackFunc
 * @param resultSelector
 * @param scheduler
 */
export function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
  return bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
}
//# sourceMappingURL=bindNodeCallback.js.map
