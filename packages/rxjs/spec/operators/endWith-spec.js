'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('endWith', function () {
  var defaultEndValue = 'x';
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should append to a cold Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a--b--c--|   ');
      var e1subs = '  ^-----------!   ';
      var expected = '---a--b--c--(s|)';
      expectObservable(e1.pipe(operators_1.endWith('s'))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should append numbers to a cold Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 2, c: 3, s: 4 };
      var e1 = cold(' ---a--b--c--|   ', values);
      var e1subs = '  ^-----------!   ';
      var expected = '---a--b--c--(s|)';
      expectObservable(e1.pipe(operators_1.endWith(values.s))).toBe(
        expected,
        values
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should end an observable with given value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|   ');
      var e1subs = '  ^----!   ';
      var expected = '--a--(x|)';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not end with given value if source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-');
      var e1subs = '  ^     ';
      var expected = '----a-';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not end with given value if source never emits and does not completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should end with given value if source does not emit but does complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---|   ');
      var e1subs = '  ^--!   ';
      var expected = '---(x|)';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit given value and complete immediately if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should end with given value and source both if source emits single value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' (a|) ');
      var e1subs = '  (^!) ';
      var expected = '(ax|)';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should end with given values when given more than one value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--|    ');
      var e1subs = '  ^-------!    ';
      var expected = '-----a--(yz|)';
      expectObservable(e1.pipe(operators_1.endWith('y', 'z'))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error and not end with given value if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --#');
      var e1subs = '  ^-!';
      var expected = '--#';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected,
        defaultEndValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error immediately and not end with given value if source throws error immediately', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.endWith(defaultEndValue))).toBe(
        expected,
        defaultEndValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b----c--d--|');
      var e1subs = '  ^--------!        ';
      var expected = '---a--b---        ';
      var unsub = '   ---------!        ';
      var result = e1.pipe(operators_1.endWith('s'));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b----c--d--|');
      var e1subs = '  ^--------!        ';
      var expected = '---a--b---        ';
      var unsub = '   ---------!        ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.endWith('s'),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should end with empty if given value is not specified', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-|');
      var e1subs = '  ^--!';
      var expected = '-a-|';
      expectObservable(e1.pipe(operators_1.endWith())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept scheduler as last argument with single value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|   ');
      var e1subs = '  ^----!   ';
      var expected = '--a--(x|)';
      expectObservable(
        e1.pipe(operators_1.endWith(defaultEndValue, testScheduler))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept scheduler as last argument with multiple value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--|    ');
      var e1subs = '  ^-------!    ';
      var expected = '-----a--(yz|)';
      expectObservable(
        e1.pipe(operators_1.endWith('y', 'z', testScheduler))
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
      .pipe(operators_1.endWith(0), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=endWith-spec.js.map
