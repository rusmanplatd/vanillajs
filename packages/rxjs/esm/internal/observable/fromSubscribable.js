import { Observable } from '../Observable';
/**
 *
 * @param subscribable
 */
export function fromSubscribable(subscribable) {
  return new Observable((subscriber) => subscribable.subscribe(subscriber));
}
//# sourceMappingURL=fromSubscribable.js.map
