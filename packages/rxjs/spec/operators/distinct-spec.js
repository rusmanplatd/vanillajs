'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('distinct', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should distinguish between values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--a--b--b--a--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a--------b--------|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish between values and does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--a--b--b--a-');
      var e1subs = '  ^------------------';
      var expected = '--a--------b-------';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete if source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ------|');
      var e1subs = '  ^-----!';
      var expected = '------|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit if source emits single element only', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|');
      var e1subs = '  ^----!';
      var expected = '--a--|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit if source is scalar', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of('a');
      var expected = '(a|)';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
    });
  });
  it('should raises error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--#');
      var e1subs = '  ^-------!';
      var expected = '--a-----#';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raises error if source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not omit if source elements are all different', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a--b--c--d--e--f--|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--b--d--a--f--|');
      var e1subs = '  ^---------!          ';
      var expected = '--a--b-----          ';
      var unsub = '   ----------!          ';
      var result = e1.pipe(operators_1.distinct());
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--b--d--a--f--|');
      var e1subs = '  ^---------!          ';
      var expected = '--a--b-----          ';
      var unsub = '   ----------!          ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.distinct(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit once if source elements are all same', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--a--a--a--a--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a-----------------|';
      expectObservable(e1.pipe(operators_1.distinct())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish values by key', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
      var e1 = hot('  --a--b--c--d--e--f--|', values);
      var e1subs = '  ^-------------------!';
      var expected = '--a--b--c-----------|';
      var selector = function (value) {
        return value % 3;
      };
      expectObservable(e1.pipe(operators_1.distinct(selector))).toBe(
        expected,
        values
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raises error when selector throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^----------!         ';
      var expected = '--a--b--c--#         ';
      var selector = function (value) {
        if (value === 'd') {
          throw new Error('d is for dumb');
        }
        return value;
      };
      expectObservable(e1.pipe(operators_1.distinct(selector))).toBe(
        expected,
        undefined,
        new Error('d is for dumb')
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support a flushing stream', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--a--b--a--b--|');
      var e1subs = '  ^-------------------!';
      var e2 = hot('  -----------x--------|');
      var e2subs = '  ^-------------------!';
      var expected = '--a--b--------a--b--|';
      expectObservable(e1.pipe(operators_1.distinct(undefined, e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error if flush raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--a--b--a--b--|');
      var e1subs = '  ^------------!       ';
      var e2 = hot('  -----------x-#       ');
      var e2subs = '  ^------------!       ';
      var expected = '--a--b-------#       ';
      expectObservable(e1.pipe(operators_1.distinct(undefined, e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should unsubscribe from the flushing stream when the main stream is unsubbed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--a--b--a--b--|');
      var e1subs = '  ^----------!         ';
      var e2 = hot('  -----------x--------|');
      var e2subs = '  ^----------!         ';
      var unsub = '   -----------!         ';
      var expected = '--a--b------         ';
      expectObservable(
        e1.pipe(operators_1.distinct(undefined, e2)),
        unsub
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow opting in to default comparator with flush', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--a--b--a--b--|');
      var e1subs = '  ^-------------------!';
      var e2 = hot('  -----------x--------|');
      var e2subs = '  ^-------------------!';
      var expected = '--a--b--------a--b--|';
      expectObservable(e1.pipe(operators_1.distinct(undefined, e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should stop listening to a synchronous observable when unsubscribed', function () {
    var sideEffects = [];
    var synchronousObservable = new rxjs_1.Observable(function (subscriber) {
      for (var i = 0; !subscriber.closed && i < 10; i++) {
        sideEffects.push(i);
        subscriber.next(i);
      }
    });
    synchronousObservable
      .pipe(operators_1.distinct(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=distinct-spec.js.map
