'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('observeOn', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should observe on specified scheduler', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^-------!';
      var expected = '--a--b--|';
      expectObservable(e1.pipe(operators_1.observeOn(testScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should observe after specified delay', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a----b-|   ');
      var e1subs = '    ^--------!   ';
      var delay = time('  ---|       ');
      var expected = '  -----a----b-|';
      expectObservable(
        e1.pipe(operators_1.observeOn(testScheduler, delay))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should observe when source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--#');
      var e1subs = '  ^----!';
      var expected = '--a--#';
      expectObservable(e1.pipe(operators_1.observeOn(testScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should observe when source is empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----|');
      var e1subs = '  ^----!';
      var expected = '-----|';
      expectObservable(e1.pipe(operators_1.observeOn(testScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should observe when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----');
      var e1subs = '  ^----';
      var expected = '-----';
      expectObservable(e1.pipe(operators_1.observeOn(testScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^---!    ';
      var expected = '--a--    ';
      var unsub = '   ----!    ';
      var result = e1.pipe(operators_1.observeOn(testScheduler));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when the result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^---!    ';
      var expected = '--a--    ';
      var unsub = '   ----!    ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.observeOn(testScheduler),
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
      .pipe(operators_1.observeOn(rxjs_1.queueScheduler), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=observeOn-spec.js.map
