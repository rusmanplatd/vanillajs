import { operate } from '../util/lift';
import { createOperatorSubscriber } from './OperatorSubscriber';
/**
 *
 * @param predicate
 * @param thisArg
 */
export function find(predicate, thisArg) {
  return operate(createFind(predicate, thisArg, 'value'));
}
/**
 *
 * @param predicate
 * @param thisArg
 * @param emit
 */
export function createFind(predicate, thisArg, emit) {
  const findIndex = emit === 'index';
  return (source, subscriber) => {
    let index = 0;
    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        (value) => {
          const i = index++;
          if (predicate.call(thisArg, value, i, source)) {
            subscriber.next(findIndex ? i : value);
            subscriber.complete();
          }
        },
        () => {
          subscriber.next(findIndex ? -1 : undefined);
          subscriber.complete();
        }
      )
    );
  };
}
//# sourceMappingURL=find.js.map
