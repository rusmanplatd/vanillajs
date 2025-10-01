'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('dematerialize', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should dematerialize an Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '{x}',
        b: '{y}',
        c: '{z}',
        d: '|',
      };
      var e1 = hot('  --a--b--c--d-|', values);
      var e1subs = '  ^----------!  ';
      var expected = '--x--y--z--|  ';
      var result = e1.pipe(
        operators_1.map(function (x) {
          if (x === '|') {
            return rxjs_1.Notification.createComplete();
          } else {
            return rxjs_1.Notification.createNext(
              x.replace('{', '').replace('}', '')
            );
          }
        }),
        operators_1.dematerialize()
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize a happy stream', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: rxjs_1.Notification.createNext('w'),
        b: rxjs_1.Notification.createNext('x'),
        c: rxjs_1.Notification.createNext('y'),
        d: rxjs_1.Notification.createComplete(),
      };
      var e1 = hot('  --a--b--c--d--|', values);
      var e1subs = '  ^----------!   ';
      var expected = '--w--x--y--|   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize a sad stream', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: rxjs_1.Notification.createNext('w'),
        b: rxjs_1.Notification.createNext('x'),
        c: rxjs_1.Notification.createNext('y'),
        d: rxjs_1.Notification.createError('error'),
      };
      var e1 = hot('  --a--b--c--d--|', values);
      var e1subs = '  ^----------!   ';
      var expected = '--w--x--y--#   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize stream does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('------');
      var e1subs = '                             ^';
      var expected = '                           -';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize stream never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-');
      var e1subs = '                              ^';
      var expected = '                            -';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize stream does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('----|');
      var e1subs = '                             ^---!';
      var expected = '                           ----|';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize empty stream', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('|   ');
      var e1subs = '                              (^!)';
      var expected = '                            |   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize stream throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var error = 'error';
      var e1 = hot('  (x|)', { x: rxjs_1.Notification.createError(error) });
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(
        expected,
        null,
        error
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: rxjs_1.Notification.createNext('w'),
        b: rxjs_1.Notification.createNext('x'),
      };
      var e1 = hot('  --a--b--c--d--|', values);
      var e1subs = '  ^------!       ';
      var expected = '--w--x--       ';
      var unsub = '   -------!       ';
      var result = e1.pipe(operators_1.dematerialize());
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: rxjs_1.Notification.createNext('w'),
        b: rxjs_1.Notification.createNext('x'),
      };
      var e1 = hot('  --a--b--c--d--|', values);
      var e1subs = '  ^------!       ';
      var expected = '--w--x--       ';
      var unsub = '   -------!       ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.dematerialize(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize and completes when stream completes with complete notification', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----(a|)', { a: rxjs_1.Notification.createComplete() });
      var e1subs = '  ^---!   ';
      var expected = '----|   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should dematerialize and completes when stream emits complete notification', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--|', { a: rxjs_1.Notification.createComplete() });
      var e1subs = '  ^---!   ';
      var expected = '----|   ';
      expectObservable(e1.pipe(operators_1.dematerialize())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with materialize', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--b---c---d---e----f--|');
      var e1subs = '  ^--------------------------!';
      var expected = '----a--b---c---d---e----f--|';
      var result = e1.pipe(
        operators_1.materialize(),
        operators_1.dematerialize()
      );
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
      .pipe(
        operators_1.materialize(),
        operators_1.dematerialize(),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=dematerialize-spec.js.map
