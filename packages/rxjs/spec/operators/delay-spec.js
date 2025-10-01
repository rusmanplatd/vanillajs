'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var sinon = require('sinon');
var chai_1 = require('chai');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('delay', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should delay by specified timeframe', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b--|');
      var e1subs = '  ^--------!';
      var t = time('     --|    ');
      var expected = '-----a--b|';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not delay at all if the delay number is negative', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b--|');
      var e1subs = '  ^--------!';
      var t = -1;
      var expected = '---a--b--|';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay by absolute time period', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a---a----a----a------------b---b---b---b--|');
      var e1subs = '  ^----------------------------------------------!';
      var t = time('  --------------------|                           ');
      var expected = '--------------------(aaaaa)-----b---b---b---b--|';
      var absoluteDelay = new Date(testScheduler.now() + t);
      var result = e1.pipe(operators_1.delay(absoluteDelay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not delay at all if the absolute time is in the past', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a---a----a----a------------b---b---b---b--|');
      var e1subs = '  ^----------------------------------------------!';
      var t = -10000;
      var expected = '--a--a---a----a----a------------b---b---b---b--|';
      var absoluteDelay = new Date(testScheduler.now() + t);
      var result = e1.pipe(operators_1.delay(absoluteDelay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay by absolute time period after source ends', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^--a-----a---a-----a---|             ');
      var e1subs = '   ^----------------------!             ';
      var t = time('   ------------------------------|      ');
      var expected = ' ------------------------------(aaaa|)';
      var absoluteDelay = new Date(testScheduler.now() + t);
      var result = e1.pipe(operators_1.delay(absoluteDelay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---b---#');
      var e1subs = '  ^----------!';
      var t = time('     ---|     ');
      var expected = '------a---b#';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source raises error before absolute delay fires', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--a---a-----#     ');
      var e1subs = '  ^--------------!     ';
      var t = time('  --------------------|');
      var expected = '---------------#     ';
      var absoluteDelay = new Date(testScheduler.now() + t);
      var result = e1.pipe(operators_1.delay(absoluteDelay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source raises error after absolute delay fires', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^---a--a---a---a--------b---b---b--#');
      var e1subs = '   ^----------------------------------!';
      var t = time('   -----------------|                  ');
      var expected = ' -----------------(aaaa)-b---b---b--#';
      var absoluteDelay = new Date(testScheduler.now() + t);
      var result = e1.pipe(operators_1.delay(absoluteDelay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay when source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----|');
      var e1subs = '  ^---!';
      var t = time('  ---| ');
      var expected = '----|';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not delay when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var t = time('  ---|');
      var expected = '|   ';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay complete when a value is scheduled', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -a-|    ');
      var e1subs = '  ^--!    ';
      var t = time('   ---|   ');
      var expected = '----(a|)';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---b---------');
      var e1subs = '  ^---------------!';
      var t = time('     ---|          ');
      var expected = '------a---b------';
      var unsub = '   ----------------!';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---b----');
      var e1subs = '  ^-------!   ';
      var t = time('     ---|     ');
      var expected = '------a--   ';
      var unsub = '   --------!   ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.delay(t),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -   ');
      var e1subs = '  ^   ';
      var t = time('  ---|');
      var expected = '-   ';
      var result = e1.pipe(operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should unsubscribe scheduled actions after execution', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var subscribeSpy = null;
      var counts = [];
      var e1 = cold(' a|      ');
      var t = time('  -|      ');
      var expected = '--a-(a|)';
      var result = e1.pipe(
        operators_1.repeatWhen(function (notifications) {
          var delayed = notifications.pipe(operators_1.delay(t));
          subscribeSpy = sinon.spy(delayed['source'], 'subscribe');
          return delayed;
        }),
        operators_1.skip(1),
        operators_1.take(2),
        operators_1.tap({
          next: function () {
            var _a = __read(subscribeSpy.args, 1),
              _b = __read(_a[0], 1),
              subscriber = _b[0];
            counts.push(subscriber._finalizers.length);
          },
          complete: function () {
            chai_1.expect(counts).to.deep.equal([1, 1]);
          },
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should be possible to delay complete by composition', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b---|  ');
      var e1subs = '  ^---------!  ';
      var t = time('     --|       ');
      var expected = '-----a--b---|';
      var result = rxjs_1.concat(
        e1.pipe(operators_1.delay(t)),
        rxjs_1
          .of(undefined)
          .pipe(operators_1.delay(t), operators_1.ignoreElements())
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=delay-spec.js.map
