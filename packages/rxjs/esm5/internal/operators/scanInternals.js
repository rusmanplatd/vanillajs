import { createOperatorSubscriber } from './OperatorSubscriber';
/**
 *
 * @param accumulator
 * @param seed
 * @param hasSeed
 * @param emitOnNext
 * @param emitBeforeComplete
 */
export function scanInternals(
  accumulator,
  seed,
  hasSeed,
  emitOnNext,
  emitBeforeComplete
) {
  return function (source, subscriber) {
    var hasState = hasSeed;
    var state = seed;
    var index = 0;
    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        function (value) {
          var i = index++;
          state = hasState
            ? accumulator(state, value, i)
            : ((hasState = true), value);
          emitOnNext && subscriber.next(state);
        },
        emitBeforeComplete &&
          function () {
            hasState && subscriber.next(state);
            subscriber.complete();
          }
      )
    );
  };
}
//# sourceMappingURL=scanInternals.js.map
