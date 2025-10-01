import { asyncScheduler } from '../scheduler/async';
import { throttle } from './throttle';
import { timer } from '../observable/timer';
/**
 *
 * @param duration
 * @param scheduler
 * @param config
 */
export function throttleTime(duration, scheduler = asyncScheduler, config) {
  const duration$ = timer(duration, scheduler);
  return throttle(() => duration$, config);
}
//# sourceMappingURL=throttleTime.js.map
