'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('zip', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should work with non-empty observable and non-empty iterable selector that throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---^--1--2--3--|');
      var asubs = '   ^-----!';
      var expected = '---x--#';
      var b = [4, 5, 6];
      var selector = function (x, y) {
        if (y === 5) {
          throw new Error('too bad');
        } else {
          return x + y;
        }
      };
      expectObservable(a.pipe(operators_1.zip(b, selector))).toBe(
        expected,
        { x: '14' },
        new Error('too bad')
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
    });
  });
});
//# sourceMappingURL=zip-spec.js.map
