'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('takeUntil operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should take values until notifier emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^------------!          ';
      var e2 = hot('  -------------z--|       ');
      var e2subs = '  ^------------!          ';
      var expected = '--a--b--c--d-|          ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should take values and raises error when notifier raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^------------!          ';
      var e2 = hot('  -------------#          ');
      var e2subs = '  ^------------!          ';
      var expected = '--a--b--c--d-#          ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should take all values when notifier is empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^----------------------!';
      var e2 = hot('  -------------|          ');
      var e2subs = '  ^------------!          ';
      var expected = '--a--b--c--d--e--f--g--|';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should take all values when notifier does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^----------------------!';
      var e2 = hot('  -                       ');
      var e2subs = '  ^----------------------!';
      var expected = '--a--b--c--d--e--f--g--|';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete without subscribing to the source when notifier synchronously emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--|');
      var e2 = rxjs_1.of(1, 2, 3);
      var expected = '(|)     ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe([]);
    });
  });
  it('should subscribe to the source when notifier synchronously completes without emitting', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--|');
      var e1subs = '  ^------!';
      var e2 = rxjs_1.EMPTY;
      var expected = '----a--|';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^------!                ';
      var e2 = hot('  -------------z--|       ');
      var e2subs = '  ^------!                ';
      var unsub = '   -------!                ';
      var expected = '--a--b--                ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2)), unsub).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete when notifier emits if source observable does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -        ');
      var e1subs = '  ^-!      ';
      var e2 = hot('  --a--b--|');
      var e2subs = '  ^-!      ';
      var expected = '--|      ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error when notifier raises error if source observable does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -  ');
      var e1subs = '  ^-!';
      var e2 = hot('  --#');
      var e2subs = '  ^-!';
      var expected = '--#';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not complete when notifier is empty if source observable does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -  ');
      var e1subs = '  ^  ';
      var e2 = hot('  --|');
      var e2subs = '  ^-!';
      var expected = '---';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not complete when source and notifier do not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var e2 = hot('  -');
      var e2subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete when notifier emits before source observable emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--|');
      var e1subs = '  ^-!     ';
      var e2 = hot('  --x     ');
      var e2subs = '  ^-!     ';
      var expected = '--|     ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error if source raises error before notifier emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--#     ');
      var e1subs = '  ^-------------!     ';
      var e2 = hot('  ----------------a--|');
      var e2subs = '  ^-------------!     ';
      var expected = '--a--b--c--d--#     ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error immediately if source throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var e2 = hot('  --x ');
      var e2subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should dispose source observable if notifier emits before source emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---|');
      var e1subs = '  ^-!     ';
      var e2 = hot('  --x-|   ');
      var e2subs = '  ^-!     ';
      var expected = '--|     ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should dispose notifier if source observable completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|     ');
      var e1subs = '  ^----!     ';
      var e2 = hot('  -------x--|');
      var e2subs = '  ^----!     ';
      var expected = '--a--|     ';
      expectObservable(e1.pipe(operators_1.takeUntil(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--|');
      var e1subs = '  ^------!                ';
      var e2 = hot('  -------------z--|       ');
      var e2subs = '  ^------!                ';
      var unsub = '   -------!                ';
      var expected = '--a--b--                ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.takeUntil(e2),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
});
//# sourceMappingURL=takeUntil-spec.js.map
