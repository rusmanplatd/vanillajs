import { config } from '../config';
import { timeoutProvider } from '../scheduler/timeoutProvider';
/**
 *
 * @param err
 */
export function reportUnhandledError(err) {
  timeoutProvider.setTimeout(() => {
    const { onUnhandledError } = config;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}
//# sourceMappingURL=reportUnhandledError.js.map
