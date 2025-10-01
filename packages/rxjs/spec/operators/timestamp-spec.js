'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('timestamp', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should record the time stamp per each source elements', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -b-c-----d--e--|');
      var e1subs = '  ^--------------!';
      var expected = '-w-x-----y--z--|';
      var expectedValue = { w: 1, x: 3, y: 9, z: 12 };
      var result = e1.pipe(
        operators_1.timestamp(rxTestScheduler),
        operators_1.map(function (x) {
          return x.timestamp;
        })
      );
      expectObservable(result).toBe(expected, expectedValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should record stamp if source emit elements', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^b--c----d---e--|');
      var e1subs = '     ^---------------!';
      var expected = '   -w--x----y---z--|';
      var expectedValue = {
        w: { value: 'b', timestamp: 1 },
        x: { value: 'c', timestamp: 4 },
        y: { value: 'd', timestamp: 9 },
        z: { value: 'e', timestamp: 13 },
      };
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should completes without record stamp if source does not emits', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---------|');
      var e1subs = '  ^--------!';
      var expected = '---------|';
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete immediately if source is empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should record stamp then does not completes if source emits but not completes', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--b--');
      var e1subs = '  ^------';
      var expected = '-y--z--';
      var expectedValue = {
        y: { value: 'a', timestamp: 1 },
        z: { value: 'b', timestamp: 4 },
      };
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--b-----c---d---|');
      var unsub = '   -------!           ';
      var e1subs = '  ^------!           ';
      var expected = '-y--z---           ';
      var expectedValue = {
        y: { value: 'a', timestamp: 1 },
        z: { value: 'b', timestamp: 4 },
      };
      var result = e1.pipe(operators_1.timestamp(rxTestScheduler));
      expectObservable(result, unsub).toBe(expected, expectedValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--b-----c---d---|');
      var e1subs = '  ^------!           ';
      var expected = '-y--z---           ';
      var unsub = '   -------!           ';
      var expectedValue = {
        y: { value: 'a', timestamp: 1 },
        z: { value: 'b', timestamp: 4 },
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.timestamp(rxTestScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, expectedValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not completes if source never completes', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('raise error if source raises error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---#');
      var e1subs = '  ^--!';
      var expected = '---#';
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should record stamp then raise error if source raises error after emit', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--b--#');
      var e1subs = '  ^------!';
      var expected = '-y--z--#';
      var expectedValue = {
        y: { value: 'a', timestamp: 1 },
        z: { value: 'b', timestamp: 4 },
      };
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source immediately throws', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.timestamp(rxTestScheduler))).toBe(
        expected
      );
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
      .pipe(operators_1.timestamp(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=timestamp-spec.js.map
