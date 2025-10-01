'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('sample', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should get samples when the notifier emits', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a----b---c----------d-----|   ');
      var e1subs = '  ^----------------------------!   ';
      var e2 = hot('  -----x----------x---x------x---| ');
      var e2subs = '  ^----------------------------!   ';
      var expected = '-----a----------c----------d-|   ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should sample nothing if source has not nexted at all', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('----a-^------------|');
      var e1subs = '      ^------------!';
      var e2 = hot('      -----x-------|');
      var e2subs = '      ^------------!';
      var expected = '    -------------|';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should behave properly when notified by the same observable as the source (issue #2075)', function () {
    var item$ = new rxjs_1.Subject();
    var results = [];
    item$.pipe(operators_1.sample(item$)).subscribe(function (value) {
      return results.push(value);
    });
    item$.next(1);
    item$.next(2);
    item$.next(3);
    chai_1.expect(results).to.deep.equal([1, 2, 3]);
  });
  it('should sample nothing if source has nexted after all notifications, but notifier does not complete', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-^------b-----|');
      var e1subs = '        ^------------!';
      var e2 = hot('        -----x--------');
      var e2subs = '        ^------------!';
      var expected = '      -------------|';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not sample when the notifier completes', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-^------b----------|');
      var e1subs = '        ^-----------------!';
      var e2 = hot('        -----x-----|       ');
      var e2subs = '        ^----------!       ';
      var expected = '      ------------------|';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not complete when the notifier completes, nor should it emit', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a----b----c----d----e----f----');
      var e1subs = '  ^---------------------------------';
      var e2 = hot('  ------x-|                         ');
      var e2subs = '  ^-------!                         ';
      var expected = '------a---------------------------';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete only when the source completes, if notifier completes early', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a----b----c----d----e----f---|');
      var e1subs = '  ^--------------------------------!';
      var e2 = hot('  ------x-|                         ');
      var e2subs = '  ^-------!                         ';
      var expected = '------a--------------------------|';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-^--b----c----d----e----f----|          ');
      var unsub = '         --------------!                        ';
      var e1subs = '        ^-------------!                        ';
      var e2 = hot('        -----x----------x----------x----------|');
      var e2subs = '        ^-------------!                        ';
      var expected = '      -----b---------                        ';
      expectObservable(e1.pipe(operators_1.sample(e2)), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-^--b----c----d----e----f----|          ');
      var e1subs = '        ^-------------!                        ';
      var e2 = hot('        -----x----------x----------x----------|');
      var e2subs = '        ^-------------!                        ';
      var expected = '      -----b---------                        ';
      var unsub = '         --------------!                        ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.sample(e2),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should only sample when a new value arrives, even if it is the same value', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a----b----c----c----e----f----|  ');
      var e1subs = '  ^---------------------------------!  ';
      var e2 = hot('  ------x-x------xx-x---x----x--------|');
      var e2subs = '  ^---------------------------------!  ';
      var expected = '------a--------c------c----e------|  ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error if source raises error', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a-^--b----c----d----#                    ');
      var e1subs = '        ^-----------------!                    ';
      var e2 = hot('        -----x----------x----------x----------|');
      var e2subs = '        ^-----------------!                    ';
      var expected = '      -----b----------d-#                    ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should completes if source does not emits', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  |              ');
      var e2 = hot('  ------x-------|');
      var expected = '|              ';
      var e1subs = '  (^!)           ';
      var e2subs = '  (^!)           ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error if source throws immediately', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  #              ');
      var e2 = hot('  ------x-------|');
      var expected = '#              ';
      var e1subs = '  (^!)           ';
      var e2subs = '  (^!)           ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error if notification raises error', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a-----|');
      var e2 = hot('  ----#    ');
      var expected = '----#    ';
      var e1subs = '  ^---!    ';
      var e2subs = '  ^---!    ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not completes if source does not complete', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---------------');
      var e1subs = '  ^--------------';
      var e2 = hot('  ------x-------|');
      var e2subs = '  ^-------------!';
      var expected = '---------------';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should sample only until source completes', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a----b----c----d-|              ');
      var e1subs = '  ^--------------------!              ';
      var e2 = hot('  -----------x----------x------------|');
      var e2subs = '  ^--------------------!              ';
      var expected = '-----------b---------|              ';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete sampling if sample observable completes', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a----b----c----d-|');
      var e1subs = '  ^--------------------!';
      var e2 = hot('  |                     ');
      var e2subs = '  (^!)                  ';
      var expected = '---------------------|';
      expectObservable(e1.pipe(operators_1.sample(e2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
});
//# sourceMappingURL=sample-spec.js.map
