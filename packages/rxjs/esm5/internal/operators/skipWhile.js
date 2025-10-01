import { operate } from '../util/lift';
import { createOperatorSubscriber } from './OperatorSubscriber';
/**
 *
 * @param predicate
 */
export function skipWhile(predicate) {
  return operate(function (source, subscriber) {
    var taking = false;
    var index = 0;
    source.subscribe(
      createOperatorSubscriber(subscriber, function (value) {
        return (
          (taking || (taking = !predicate(value, index++))) &&
          subscriber.next(value)
        );
      })
    );
  });
}
//# sourceMappingURL=skipWhile.js.map
