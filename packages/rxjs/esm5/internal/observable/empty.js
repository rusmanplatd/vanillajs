import { Observable } from '../Observable';
export var EMPTY = new Observable(function (subscriber) {
  return subscriber.complete();
});
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
  return new Observable(function (subscriber) {
    return scheduler.schedule(function () {
      return subscriber.complete();
    });
  });
}
//# sourceMappingURL=empty.js.map
