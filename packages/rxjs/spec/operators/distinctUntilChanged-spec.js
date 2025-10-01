'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('distinctUntilChanged', function () {
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
      var e1 = hot('  -1--2-2----1-3-|');
      var e1subs = '  ^--------------!';
      var expected = '-1--2------1-3-|';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish between values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--a--b--b--a--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a--------b-----a--|';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      var expected = '--a--------b-----a-';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit if source is scalar', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of('a');
      var expected = '(a|)';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
    });
  });
  it('should raise error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--#');
      var e1subs = '  ^-------!';
      var expected = '--a-----#';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
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
      var result = e1.pipe(operators_1.distinctUntilChanged());
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
        operators_1.distinctUntilChanged(),
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
      expectObservable(e1.pipe(operators_1.distinctUntilChanged())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit once if comparator returns true always regardless of source emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a-----------------|';
      var comparator = function () {
        return true;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(comparator))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit all if comparator returns false always regardless of source emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a--a--a--a--a--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a--a--a--a--a--a--|';
      var comparator = function () {
        return false;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(comparator))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish values by comparator', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|', {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
      });
      var e1subs = '  ^-------------------!';
      var expected = '--a-----c-----e-----|';
      var comparator = function (x, y) {
        return y % 2 === 0;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(comparator))
      ).toBe(expected, { a: 1, c: 3, e: 5 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when comparator throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^----------!         ';
      var expected = '--a--b--c--#         ';
      var comparator = function (x, y) {
        if (y === 'd') {
          throw 'error';
        }
        return x === y;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(comparator))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should use the keySelector to pick comparator values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|', {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
      });
      var e1subs = '  ^-------------------!';
      var expected = '--a--b-----d-----f--|';
      var comparator = function (x, y) {
        return y % 2 === 1;
      };
      var keySelector = function (x) {
        return x % 2;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(comparator, keySelector))
      ).toBe(expected, { a: 1, b: 2, d: 4, f: 6 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should use the keySelector even for the first emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|', { a: 2, b: 4 });
      var e1subs = '  ^-------!';
      var expected = '--a-----|';
      var keySelector = function (x) {
        return x % 2;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(null, keySelector))
      ).toBe(expected, { a: 2 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when keySelector throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^----------!         ';
      var expected = '--a--b--c--#         ';
      var keySelector = function (x) {
        if (x === 'd') {
          throw 'error';
        }
        return x;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilChanged(null, keySelector))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
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
      .pipe(operators_1.distinctUntilChanged(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should work properly with reentrant streams', function () {
    var subject = new rxjs_1.Subject();
    var results = [];
    var count = 0;
    subject.pipe(operators_1.distinctUntilChanged()).subscribe(function (n) {
      results.push(n);
      if (++count > 2) {
        throw new Error('this should have only been hit once');
      }
      subject.next(1);
    });
    subject.next(1);
    chai_1.expect(results).to.deep.equal([1]);
  });
});
//# sourceMappingURL=distinctUntilChanged-spec.js.map
