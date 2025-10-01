'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('timeoutWith operator', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should timeout after a specified period then subscribe to the passed observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  -------a--b--|');
      var sourceSubs = '   ^----!        ';
      var t = time('       -----|');
      var switchTo = cold('     x-y-z-|  ');
      var switchToSubs = ' -----^-----!  ';
      var expected = '     -----x-y-z-|  ';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should timeout at a specified date then subscribe to the passed observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  -');
      var sourceSubs = '   ^---------!           ';
      var t = time('       ----------|');
      var switchTo = cold('          --x--y--z--|');
      var switchToSubs = ' ----------^----------!';
      var expected = '     ------------x--y--z--|';
      var result = source.pipe(
        operators_1.timeoutWith(new Date(t), switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should timeout after a specified period between emit then subscribe to the passed observable when source emits', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  ---a---b------c---|');
      var t = time('             ----|       ');
      var sourceSubs = '  ^----------!       ';
      var switchTo = cold('          -x-y-|  ');
      var switchToSubs = '-----------^----!  ';
      var expected = '    ---a---b----x-y-|  ';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  ---a---b-----c----|');
      var t = time('             ----|       ');
      var sourceSubs = '  ^----------!       ';
      var switchTo = cold('          -x---y| ');
      var switchToSubs = '-----------^--!    ';
      var expected = '    ---a---b----x--    ';
      var unsub = '       --------------!    ';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  ---a---b-----c----|');
      var t = time('      ----|              ');
      var sourceSubs = '  ^----------!       ';
      var switchTo = cold('          -x---y| ');
      var switchToSubs = '-----------^--!    ';
      var expected = '    ---a---b----x--    ';
      var unsub = '       --------------!    ';
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.timeoutWith(t, switchTo, rxTestScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should not subscribe to withObservable after explicit unsubscription', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('---a------b------');
      var t = time('     -----|           ');
      var sourceSubs = ' ^----!           ';
      var switchTo = cold('   i---j---|   ');
      var expected = '   ---a--           ';
      var unsub = '      -----!           ';
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.timeoutWith(t, switchTo, rxTestScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
    });
  });
  it('should timeout after a specified period then subscribe to the passed observable when source is empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -------------|      ');
      var t = time('      ----------|         ');
      var sourceSubs = '  ^---------!         ';
      var switchTo = cold('         ----x----|');
      var switchToSubs = '----------^--------!';
      var expected = '    --------------x----|';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should timeout after a specified period between emit then never completes if other source does not complete', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  --a--b--------c--d--|');
      var t = time('           ----|           ');
      var sourceSubs = '  ^--------!           ';
      var switchTo = cold('        ------------');
      var switchToSubs = '---------^-----------';
      var expected = '    --a--b---------------';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should timeout after a specified period then subscribe to the passed observable when source raises error after timeout', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -------------#      ');
      var t = time('      ----------|         ');
      var sourceSubs = '  ^---------!         ';
      var switchTo = cold('         ----x----|');
      var switchToSubs = '----------^--------!';
      var expected = '    --------------x----|';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should timeout after a specified period between emit then never completes if other source emits but not complete', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -------------|      ');
      var t = time('      -----------|        ');
      var sourceSubs = '  ^----------!        ';
      var switchTo = cold('          ----x----');
      var switchToSubs = '-----------^--------';
      var expected = '    ---------------x----';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe(switchToSubs);
    });
  });
  it('should not timeout if source completes within timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -----|        ');
      var t = time('      ----------|   ');
      var sourceSubs = '  ^----!        ';
      var switchTo = cold('    ----x----');
      var expected = '    -----|        ';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
    });
  });
  it('should not timeout if source raises error within timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-----#              ');
      var t = time('    ----------|         ');
      var sourceSubs = '^----!              ';
      var switchTo = cold('       ----x----|');
      var expected = '  -----#              ';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
    });
  });
  it('should not timeout if source emits within timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('   --a--b--c--d--e--|');
      var t = time('       -----|            ');
      var sourceSubs = '   ^----------------!';
      var switchTo = cold('----x----|        ');
      var expected = '     --a--b--c--d--e--|';
      var result = source.pipe(
        operators_1.timeoutWith(t, switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
    });
  });
  it('should not timeout if source completes within specified Date', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--|   ');
      var t = time('    --------------------|');
      var sourceSubs = '^----------------!   ';
      var switchTo = cold('--x--|            ');
      var expected = '  --a--b--c--d--e--|   ';
      var result = source.pipe(
        operators_1.timeoutWith(new Date(t), switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
    });
  });
  it('should not timeout if source raises error within specified Date', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('---a---#           ');
      var t = time('       ----------|     ');
      var sourceSubs = '^------!           ';
      var switchTo = cold('          --x--|');
      var expected = '  ---a---#           ';
      var result = source.pipe(
        operators_1.timeoutWith(new Date(t), switchTo, rxTestScheduler)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(switchTo.subscriptions).toBe([]);
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
      .pipe(operators_1.timeoutWith(0, rxjs_1.EMPTY), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=timeoutWith-spec.js.map
