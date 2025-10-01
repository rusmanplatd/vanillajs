import { scheduled } from '../scheduled/scheduled';
import { innerFrom } from './innerFrom';
/**
 *
 * @param input
 * @param scheduler
 */
export function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}
//# sourceMappingURL=from.js.map
