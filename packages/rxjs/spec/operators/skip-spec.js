'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var rxjs_1 = require('rxjs');
describe('skip', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should skip values before a total', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var subs = '      ^----------------!';
      var expected = '  -----------d--e--|';
      expectObservable(source.pipe(operators_1.skip(3))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should skip all values without error if total is more than actual number of values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var subs = '      ^----------------!';
      var expected = '  -----------------|';
      expectObservable(source.pipe(operators_1.skip(6))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should skip all values without error if total is same as actual number of values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var subs = '      ^----------------!';
      var expected = '  -----------------|';
      expectObservable(source.pipe(operators_1.skip(5))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should not skip if count is zero', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var subs = '      ^----------------!';
      var expected = '  --a--b--c--d--e--|';
      expectObservable(source.pipe(operators_1.skip(0))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should not skip if count is negative value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--a--b--c--d--e--|');
      var subs = '       ^----------------!';
      var expected = '   --a--b--c--d--e--|';
      expectObservable(source.pipe(operators_1.skip(-42))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var unsub = '     ----------!       ';
      var subs = '      ^---------!       ';
      var expected = '  --------c--       ';
      expectObservable(source.pipe(operators_1.skip(2)), unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|');
      var subs = '      ^---------!       ';
      var expected = '  --------c--       ';
      var unsub = '     ----------!       ';
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.skip(2),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should raise error if skip count is more than actual number of emits and source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--#');
      var subs = '      ^-------------!';
      var expected = '  --------------#';
      expectObservable(source.pipe(operators_1.skip(6))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should raise error if skip count is same as emits of source and source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--#');
      var subs = '      ^-------------!';
      var expected = '  --------------#';
      expectObservable(source.pipe(operators_1.skip(4))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should skip values before a total and raises error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--#');
      var subs = '      ^-------------!';
      var expected = '  -----------d--#';
      expectObservable(source.pipe(operators_1.skip(3))).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should complete regardless of skip count if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '|';
      expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source never completes without emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip values before total and never completes if source emits and does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c-');
      var e1subs = '  ^         ';
      var expected = '-----b--c-';
      expectObservable(e1.pipe(operators_1.skip(1))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all values and never completes if total is more than numbers of value and source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c-');
      var e1subs = '  ^         ';
      var expected = '----------';
      expectObservable(e1.pipe(operators_1.skip(6))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all values and never completes if total is same asnumbers of value and source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c-');
      var e1subs = '  ^         ';
      var expected = '----------';
      expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.skip(3))).toBe(expected);
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
      .pipe(operators_1.skip(1), operators_1.take(2))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=skip-spec.js.map
