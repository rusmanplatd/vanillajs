'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('race', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should race a single observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|');
      var e1subs = '  ^-------------------!';
      var expected = '---a-----b-----c----|';
      var result = rxjs_1.race(e1);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should race cold and cold', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race with array of observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = rxjs_1.race([e1, e2]);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race hot and hot', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race hot and cold', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race 2nd and 1st', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ------x-----y-----z----|');
      var e1subs = '  ^--!                    ';
      var e2 = cold(' ---a-----b-----c----|   ');
      var e2subs = '  ^-------------------!   ';
      var expected = '---a-----b-----c----|   ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race emit and complete', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -----|                  ');
      var e1subs = '  ^----!                  ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^----!                  ';
      var expected = '-----|                  ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-----------!           ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b---           ';
      var unsub = '   ------------!           ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--^--b--c---d-| ');
      var e1subs = '       ^--------!    ';
      var e2 = hot('  ---e-^---f--g---h-|');
      var e2subs = '       ^--!          ';
      var expected = '     ---b--c---    ';
      var unsub = '        ---------!    ';
      var result = rxjs_1
        .race(
          e1.pipe(
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            })
          ),
          e2.pipe(
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            })
          )
        )
        .pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should never emit when given non emitting sources', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---|');
      var e2 = cold(' ---|');
      var e1subs = '  ^--!';
      var expected = '---|';
      var source = rxjs_1.race(e1, e2);
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should throw when error occurs mid stream', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----#              ');
      var e1subs = '  ^--------!              ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----#              ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should throw when error occurs before a winner is found', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---#                    ');
      var e1subs = '  ^--!                    ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---#                    ';
      var result = rxjs_1.race(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('handle empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var source = rxjs_1.race(e1);
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('handle never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var source = rxjs_1.race(e1);
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('handle throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var source = rxjs_1.race(e1);
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support a single ObservableInput argument', function (done) {
    var source = rxjs_1.race(Promise.resolve(42));
    source.subscribe({
      next: function (value) {
        chai_1.expect(value).to.equal(42);
      },
      error: done,
      complete: done,
    });
  });
});
//# sourceMappingURL=race-spec.js.map
