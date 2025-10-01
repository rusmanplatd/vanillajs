'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('skipLast operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should skip two values of an observable with many values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '-------------a---b--|';
      expectObservable(e1.pipe(operators_1.skipLast(2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip last three values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '-----------------a--|';
      expectObservable(e1.pipe(operators_1.skipLast(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all elements when trying to skip larger then source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '--------------------|';
      expectObservable(e1.pipe(operators_1.skipLast(5))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all elements when trying to skip exact', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '--------------------|';
      expectObservable(e1.pipe(operators_1.skipLast(4))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not skip any values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a-----b----c---d--|';
      expectObservable(e1.pipe(operators_1.skipLast(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not skip any values if provided with negative value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a-----b----c---d--|');
      var e1subs = '  ^-------------------!';
      var expected = '--a-----b----c---d--|';
      expectObservable(e1.pipe(operators_1.skipLast(-42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '|';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should go on forever on never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip one value from an observable with one value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---(a|)');
      var e1subs = '  ^--!   ';
      var expected = '---|   ';
      expectObservable(e1.pipe(operators_1.skipLast(1))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip one value from an observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b----c---d--|');
      var e1subs = '     ^--------------!';
      var expected = '   --------b---c--|';
      expectObservable(e1.pipe(operators_1.skipLast(1))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with empty and early emission', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^----|');
      var e1subs = '     ^----!';
      var expected = '   -----|';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate error from the source observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^---#', undefined, 'too bad');
      var e1subs = '   ^---!';
      var expected = ' ----#';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(
        expected,
        null,
        'too bad'
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate error from an observable with values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^--a--b--#');
      var e1subs = '   ^--------!';
      var expected = ' ---------#';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^--a--b-----c--d--e--|');
      var unsub = '    ---------!            ';
      var e1subs = '   ^--------!            ';
      var expected = ' ----------            ';
      expectObservable(e1.pipe(operators_1.skipLast(42)), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.skipLast(42))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^--a--b-----c--d--e--|');
      var unsub = '    ---------!            ';
      var e1subs = '   ^--------!            ';
      var expected = ' ----------            ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.skipLast(42),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
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
      .pipe(operators_1.skipLast(1), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2, 3]);
  });
});
//# sourceMappingURL=skipLast-spec.js.map
