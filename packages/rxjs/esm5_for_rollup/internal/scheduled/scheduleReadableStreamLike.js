import { scheduleAsyncIterable } from './scheduleAsyncIterable';
import { readableStreamLikeToAsyncGenerator } from '../util/isReadableStreamLike';
/**
 *
 * @param input
 * @param scheduler
 */
export function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(
    readableStreamLikeToAsyncGenerator(input),
    scheduler
  );
}
//# sourceMappingURL=scheduleReadableStreamLike.js.map
