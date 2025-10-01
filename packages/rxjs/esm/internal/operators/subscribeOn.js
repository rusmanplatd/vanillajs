import { operate } from '../util/lift';
/**
 *
 * @param scheduler
 * @param delay
 */
export function subscribeOn(scheduler, delay = 0) {
  return operate((source, subscriber) => {
    subscriber.add(
      scheduler.schedule(() => source.subscribe(subscriber), delay)
    );
  });
}
//# sourceMappingURL=subscribeOn.js.map
