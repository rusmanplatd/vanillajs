'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('combineLatest', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should accept array of observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--|');
      var e1subs = '     ^--------!';
      var e2 = hot('---e-^---f--g--|');
      var e2subs = '     ^---------!';
      var e3 = hot('---h-^----i--j-|');
      var e3subs = '     ^---------!';
      var expected = '   -----wxyz-|';
      var result = e1.pipe(
        operators_1.combineLatest([e2, e3], function (x, y, z) {
          return x + y + z;
        })
      );
      expectObservable(result).toBe(expected, {
        w: 'bfi',
        x: 'cfi',
        y: 'cgi',
        z: 'cgj',
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
});
//# sourceMappingURL=combineLatest-spec.js.map
