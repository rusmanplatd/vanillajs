'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('subscribeOn', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should subscribe on specified scheduler', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var expected = '--a--b--|';
      var sub = '     ^-------!';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should start subscribe after specified delay', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--|');
      var expected = '  -----b--|';
      var delay = time('---|     ');
      var sub = '       ---^----!';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler, delay));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should unsubscribe when source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--#');
      var expected = '--a--#';
      var sub = '     ^----!';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should subscribe when source is empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----|');
      var expected = '----|';
      var sub = '     ^---!';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should subscribe when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----');
      var expected = '----';
      var sub = '     ^---';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var sub = '     ^---!    ';
      var expected = '--a--    ';
      var unsub = '   ----!    ';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should not break unsubscription chains when the result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var sub = '     ^---!    ';
      var expected = '--a--    ';
      var unsub = '   ----!    ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.subscribeOn(testScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(sub);
    });
  });
  it('should properly support a delayTime of Infinity', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var expected = '---------';
      var result = e1.pipe(operators_1.subscribeOn(testScheduler, Infinity));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe([]);
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
      .pipe(operators_1.subscribeOn(rxjs_1.queueScheduler), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=subscribeOn-spec.js.map
