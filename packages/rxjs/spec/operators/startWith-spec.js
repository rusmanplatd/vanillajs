'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('startWith', function () {
  var defaultStartValue = 'x';
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should prepend to a cold Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a--b--c--|');
      var e1subs = '  ^-----------!';
      var expected = 's--a--b--c--|';
      var result = e1.pipe(operators_1.startWith('s'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start an observable with given value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|');
      var e1subs = '  ^----!';
      var expected = 'x-a--|';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and does not completes if source does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-');
      var e1subs = '  ^-----';
      var expected = 'x---a-';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and does not completes if source never emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' - ');
      var e1subs = '  ^ ';
      var expected = 'x-';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and completes if source does not emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---|');
      var e1subs = '  ^--!';
      var expected = 'x--|';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and complete immediately if source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(x|)';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and source both if source emits single value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' (a|)');
      var e1subs = '  (^!)';
      var expected = '(xa|)';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given values when given value is more than one', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--|');
      var e1subs = '  ^-------!';
      var expected = '(yz)-a--|';
      var result = e1.pipe(operators_1.startWith('y', 'z'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and raises error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --#');
      var e1subs = '  ^-!';
      var expected = 'x-#';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected, defaultStartValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with given value and raises error immediately if source throws error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '(x#)';
      var result = e1.pipe(operators_1.startWith(defaultStartValue));
      expectObservable(result).toBe(expected, defaultStartValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b----c--d--|');
      var unsub = '   ---------!        ';
      var e1subs = '  ^--------!        ';
      var expected = 's--a--b---        ';
      var values = { s: 's', a: 'a', b: 'b' };
      var result = e1.pipe(operators_1.startWith('s', testScheduler));
      expectObservable(result, unsub).toBe(expected, values);
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
      var expected = 's--a--b---        ';
      var unsub = '   ---------!        ';
      var values = { s: 's', a: 'a', b: 'b' };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.startWith('s', testScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start with empty if given value is not specified', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-|');
      var e1subs = '  ^--!';
      var expected = '-a-|';
      var result = e1.pipe(operators_1.startWith(testScheduler));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept scheduler as last argument with single value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|');
      var e1subs = '  ^----!';
      var expected = 'x-a--|';
      var result = e1.pipe(
        operators_1.startWith(defaultStartValue, testScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept scheduler as last argument with multiple value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--|');
      var e1subs = '  ^-------!';
      var expected = '(yz)-a--|';
      var result = e1.pipe(operators_1.startWith('y', 'z', testScheduler));
      expectObservable(result).toBe(expected);
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
      .pipe(operators_1.startWith(-1), operators_1.take(4))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=startWith-spec.js.map
