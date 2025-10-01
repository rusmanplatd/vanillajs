'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('distinctUntilKeyChanged', function () {
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
      var values = { a: { k: 1 }, b: { k: 2 }, c: { k: 3 } };
      var e1 = hot('  -a--b-b----a-c-|', values);
      var e1Subs = '  ^--------------!';
      var expected = '-a--b------a-c-|';
      var result = e1.pipe(operators_1.distinctUntilKeyChanged('k'));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1Subs);
    });
  });
  it('should distinguish between values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 }, b: { val: 2 } };
      var e1 = hot('  --a--a--a--b--b--a--|', values);
      var e1subs = '  ^-------------------!';
      var expected = '--a--------b-----a--|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish between values and does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 }, b: { val: 2 } };
      var e1 = hot('  --a--a--a--b--b--a-', values);
      var e1subs = '  ^                  ';
      var expected = '--a--------b-----a-';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish between values with key', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { valOther: 1 },
        c: { valOther: 3 },
        d: { val: 1 },
        e: { val: 5 },
      };
      var e1 = hot('--a--b--c--d--e--|', values);
      var e1subs = '     ^----------------!';
      var expected = '   --a--b-----d--e--|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not compare if source does not have element with key', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { valOther: 1 },
        b: { valOther: 1 },
        c: { valOther: 3 },
        d: { valOther: 1 },
        e: { valOther: 5 },
      };
      var e1 = hot('--a--b--c--d--e--|', values);
      var e1subs = '     ^----------------!';
      var expected = '   --a--------------|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-');
      var e1subs = '      ^';
      var expected = '    -';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-');
      var e1subs = '     ^';
      var expected = '   -';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('|');
      var e1subs = '      (^!)';
      var expected = '    |';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete if source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('------|');
      var e1subs = '     ^-----!';
      var expected = '   ------|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit if source emits single element only', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 } };
      var e1 = hot('  --a--|', values);
      var e1subs = '  ^----!';
      var expected = '--a--|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit if source is scalar', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var values = { a: { val: 1 } };
      var e1 = rxjs_1.of(values.a);
      var expected = '(a|)';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
    });
  });
  it('should raise error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 } };
      var e1 = hot('  --a--a--#', values);
      var e1subs = '  ^-------!';
      var expected = '--a-----#';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('#   ');
      var e1subs = '      (^!)';
      var expected = '    #   ';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not omit if source elements are all different', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------------!';
      var expected = '--a--b--c--d--e--|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--b--d--a--e--|', values);
      var e1subs = '  ^---------!          ';
      var expected = '--a--b-----          ';
      var unsub = '   ----------!          ';
      var result = e1.pipe(operators_1.distinctUntilKeyChanged('val'));
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--b--d--a--e--|', values);
      var e1subs = '  ^---------!          ';
      var expected = '--a--b-----          ';
      var unsub = '   ----------!          ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.distinctUntilKeyChanged('val'),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit once if source elements are all same', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 } };
      var e1 = hot('  --a--a--a--a--a--a--|', values);
      var e1subs = '  ^-------------------!';
      var expected = '--a-----------------|';
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val'))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit once if comparer returns true always regardless of source emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------------!';
      var expected = '--a--------------|';
      expectObservable(
        e1.pipe(
          operators_1.distinctUntilKeyChanged('val', function () {
            return true;
          })
        )
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit all if comparer returns false always regardless of source emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: { val: 1 } };
      var e1 = hot('  --a--a--a--a--a--a--|', values);
      var e1subs = '  ^-------------------!';
      var expected = '--a--a--a--a--a--a--|';
      expectObservable(
        e1.pipe(
          operators_1.distinctUntilKeyChanged('val', function () {
            return false;
          })
        )
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should distinguish values by selector', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------------!';
      var expected = '--a-----c-----e--|';
      var selector = function (x, y) {
        return y % 2 === 0;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val', selector))
      ).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when comparer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: { val: 1 },
        b: { val: 2 },
        c: { val: 3 },
        d: { val: 4 },
        e: { val: 5 },
      };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------!      ';
      var expected = '--a--b--c--#      ';
      var selector = function (x, y) {
        if (y === 4) {
          throw 'error';
        }
        return x === y;
      };
      expectObservable(
        e1.pipe(operators_1.distinctUntilKeyChanged('val', selector))
      ).toBe(expected, values);
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
      .pipe(
        operators_1.map(function (value) {
          return { value: value };
        }),
        operators_1.distinctUntilKeyChanged('value'),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=distinctUntilKeyChanged-spec.js.map
