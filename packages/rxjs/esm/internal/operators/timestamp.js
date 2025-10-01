import { dateTimestampProvider } from '../scheduler/dateTimestampProvider';
import { map } from './map';
/**
 *
 * @param timestampProvider
 */
export function timestamp(timestampProvider = dateTimestampProvider) {
  return map((value) => ({ value, timestamp: timestampProvider.now() }));
}
//# sourceMappingURL=timestamp.js.map
