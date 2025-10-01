'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('materialize', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should materialize an Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --x--y--z--|   ');
      var e1subs = '  ^----------!   ';
      var expected = '--a--b--c--(d|)';
      var values = { a: '{x}', b: '{y}', c: '{z}', d: '|' };
      var result = e1.pipe(
        operators_1.materialize(),
        operators_1.map(function (x) {
          if (x.kind === 'C') {
            return '|';
          } else {
            return '{' + x.value + '}';
          }
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize a happy stream', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|   ');
      var e1subs = '  ^----------!   ';
      var expected = '--w--x--y--(z|)';
      var expectedValue = {
        w: rxjs_1.Notification.createNext('a'),
        x: rxjs_1.Notification.createNext('b'),
        y: rxjs_1.Notification.createNext('c'),
        z: rxjs_1.Notification.createComplete(),
      };
      expectObservable(e1.pipe(operators_1.materialize())).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize a sad stream', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--#   ');
      var e1subs = '  ^----------!   ';
      var expected = '--w--x--y--(z|)';
      var expectedValue = {
        w: rxjs_1.Notification.createNext('a'),
        x: rxjs_1.Notification.createNext('b'),
        y: rxjs_1.Notification.createNext('c'),
        z: rxjs_1.Notification.createError('error'),
      };
      expectObservable(e1.pipe(operators_1.materialize())).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '--w--x-     ';
      var unsub = '   ------!     ';
      var expectedValue = {
        w: rxjs_1.Notification.createNext('a'),
        x: rxjs_1.Notification.createNext('b'),
      };
      expectObservable(e1.pipe(operators_1.materialize()), unsub).toBe(
        expected,
        expectedValue
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '--w--x-     ';
      var unsub = '   ------!     ';
      var expectedValue = {
        w: rxjs_1.Notification.createNext('a'),
        x: rxjs_1.Notification.createNext('b'),
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.materialize(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, expectedValue);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize stream that does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.materialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize stream that does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----|   ');
      var e1subs = '  ^---!   ';
      var expected = '----(x|)';
      expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, {
        x: rxjs_1.Notification.createComplete(),
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize empty stream', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, {
        x: rxjs_1.Notification.createComplete(),
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should materialize stream that throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.materialize())).toBe(expected, {
        x: rxjs_1.Notification.createError('error'),
      });
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
      .pipe(operators_1.materialize(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=materialize-spec.js.map
