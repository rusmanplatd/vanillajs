import { Observable } from '../Observable';
export const EMPTY = new Observable((subscriber) => subscriber.complete());
/**
 *
 * @param scheduler
 */
export function empty(scheduler) {
  return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
/**
 *
 * @param scheduler
 */
function emptyScheduled(scheduler) {
  return new Observable((subscriber) =>
    scheduler.schedule(() => subscriber.complete())
  );
}
//# sourceMappingURL=empty.js.map
