import { Subject } from '../Subject';
import { multicast } from './multicast';
import { connect } from './connect';
/**
 *
 * @param selector
 */
export function publish(selector) {
  return selector
    ? (source) => connect(selector)(source)
    : (source) => multicast(new Subject())(source);
}
//# sourceMappingURL=publish.js.map
