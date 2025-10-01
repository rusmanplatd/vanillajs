import { innerFrom } from '../observable/innerFrom';
import { Observable } from '../Observable';
import { mergeMap } from '../operators/mergeMap';
import { isArrayLike } from '../util/isArrayLike';
import { isFunction } from '../util/isFunction';
import { mapOneOrManyArgs } from '../util/mapOneOrManyArgs';
const nodeEventEmitterMethods = ['addListener', 'removeListener'];
const eventTargetMethods = ['addEventListener', 'removeEventListener'];
const jqueryMethods = ['on', 'off'];
/**
 *
 * @param target
 * @param eventName
 * @param options
 * @param resultSelector
 */
export function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = undefined;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(
      mapOneOrManyArgs(resultSelector)
    );
  }
  const [add, remove] = isEventTarget(target)
    ? eventTargetMethods.map(
        (methodName) => (handler) =>
          target[methodName](eventName, handler, options)
      )
    : isNodeStyleEventEmitter(target)
      ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
      : isJQueryStyleEventEmitter(target)
        ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
        : [];
  if (!add) {
    if (isArrayLike(target)) {
      return mergeMap((subTarget) => fromEvent(subTarget, eventName, options))(
        innerFrom(target)
      );
    }
  }
  if (!add) {
    throw new TypeError('Invalid event target');
  }
  return new Observable((subscriber) => {
    const handler = (...args) =>
      subscriber.next(1 < args.length ? args : args[0]);
    add(handler);
    return () => remove(handler);
  });
}
/**
 *
 * @param target
 * @param eventName
 */
function toCommonHandlerRegistry(target, eventName) {
  return (methodName) => (handler) => target[methodName](eventName, handler);
}
/**
 *
 * @param target
 */
function isNodeStyleEventEmitter(target) {
  return isFunction(target.addListener) && isFunction(target.removeListener);
}
/**
 *
 * @param target
 */
function isJQueryStyleEventEmitter(target) {
  return isFunction(target.on) && isFunction(target.off);
}
/**
 *
 * @param target
 */
function isEventTarget(target) {
  return (
    isFunction(target.addEventListener) &&
    isFunction(target.removeEventListener)
  );
}
//# sourceMappingURL=fromEvent.js.map
