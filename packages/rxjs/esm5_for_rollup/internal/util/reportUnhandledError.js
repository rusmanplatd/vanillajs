import { config } from '../config';
import { timeoutProvider } from '../scheduler/timeoutProvider';
/**
 *
 * @param err
 */
export function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function () {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}
//# sourceMappingURL=reportUnhandledError.js.map
