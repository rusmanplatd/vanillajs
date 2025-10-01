import { ConnectableObservable } from '../observable/ConnectableObservable';
import { isFunction } from '../util/isFunction';
import { connect } from './connect';
/**
 *
 * @param subjectOrSubjectFactory
 * @param selector
 */
export function multicast(subjectOrSubjectFactory, selector) {
  var subjectFactory = isFunction(subjectOrSubjectFactory)
    ? subjectOrSubjectFactory
    : function () {
        return subjectOrSubjectFactory;
      };
  if (isFunction(selector)) {
    return connect(selector, {
      connector: subjectFactory,
    });
  }
  return function (source) {
    return new ConnectableObservable(source, subjectFactory);
  };
}
//# sourceMappingURL=multicast.js.map
