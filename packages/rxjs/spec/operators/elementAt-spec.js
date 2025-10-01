'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('elementAt', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should return next to last element by zero-based index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c-d---|');
      var e1subs = '  ^-------!      ';
      var expected = '--------(c|)   ';
      expectObservable(e1.pipe(operators_1.elementAt(2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return first element by zero-based index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-!';
      var expected = '--(a|)';
      expectObservable(e1.pipe(operators_1.elementAt(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow undefined as a default value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--a---a-|   ');
      var e1subs = '  ^-------------!   ';
      var expected = '--------------(U|)';
      expectObservable(e1.pipe(operators_1.elementAt(100, undefined))).toBe(
        expected,
        { U: undefined }
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return non-first element by zero-based index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--|');
      var e1subs = '  ^----------!         ';
      var expected = '-----------(d|)      ';
      expectObservable(e1.pipe(operators_1.elementAt(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return last element by zero-based index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-------!   ';
      var expected = '--------(c|)';
      expectObservable(e1.pipe(operators_1.elementAt(2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if e1 is Empty Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.elementAt(0))).toBe(
        expected,
        undefined,
        new rxjs_1.ArgumentOutOfRangeError()
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
      expectObservable(e1.pipe(operators_1.elementAt(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var expected = '-';
      var e1subs = '  ^';
      expectObservable(e1.pipe(operators_1.elementAt(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(operators_1.elementAt(2));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result Observable is unsubscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.elementAt(2),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should throw if index is smaller than zero', function () {
    chai_1
      .expect(function () {
        rxjs_1.range(0, 10).pipe(operators_1.elementAt(-1));
      })
      .to.throw(rxjs_1.ArgumentOutOfRangeError);
  });
  it('should raise error if index is out of range but does not have default value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|');
      var e1subs = '  ^----!';
      var expected = '-----#';
      expectObservable(e1.pipe(operators_1.elementAt(3))).toBe(
        expected,
        null,
        new rxjs_1.ArgumentOutOfRangeError()
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return default value if index is out of range', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|   ');
      var e1subs = '  ^----!   ';
      var expected = '-----(x|)';
      var defaultValue = '42';
      expectObservable(e1.pipe(operators_1.elementAt(3, defaultValue))).toBe(
        expected,
        { x: defaultValue }
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
      .pipe(operators_1.elementAt(2))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=elementAt-spec.js.map
