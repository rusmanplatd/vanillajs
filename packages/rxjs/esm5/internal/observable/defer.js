import { Observable } from '../Observable';
import { innerFrom } from './innerFrom';
/**
 *
 * @param observableFactory
 */
export function defer(observableFactory) {
  return new Observable(function (subscriber) {
    innerFrom(observableFactory()).subscribe(subscriber);
  });
}
//# sourceMappingURL=defer.js.map
