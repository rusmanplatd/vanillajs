'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('timeout operator', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  var defaultTimeoutError = new rxjs_1.TimeoutError();
  it('should timeout after a specified timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = cold(' -------a--b--|');
      var t = time('  -----|        ');
      var e1subs = '  ^----!        ';
      var expected = '-----#        ';
      var result = e1.pipe(operators_1.timeout(t, rxTestScheduler));
      expectObservable(result).toBe(expected, null, defaultTimeoutError);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit and TimeoutError on timeout with appropriate due as number', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time;
      var e1 = cold('-------a--b--|');
      var t = time(' -----|');
      var result = e1.pipe(operators_1.timeout(t, rxTestScheduler));
      var error;
      result.subscribe({
        next: function () {
          throw new Error('this should not next');
        },
        error: function (err) {
          error = err;
        },
        complete: function () {
          throw new Error('this should not complete');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(error).to.be.an.instanceof(rxjs_1.TimeoutError);
      chai_1.expect(error).to.have.property('name', 'TimeoutError');
      chai_1.expect(error.info).to.deep.equal({
        seen: 0,
        meta: null,
        lastValue: null,
      });
    });
  });
  it('should emit and TimeoutError on timeout with appropriate due as Date', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time;
      var e1 = cold('-------a--b--|');
      var t = time(' ----|');
      var dueDate = new Date(t);
      var result = e1.pipe(operators_1.timeout(dueDate, rxTestScheduler));
      var error;
      result.subscribe({
        next: function () {
          throw new Error('this should not next');
        },
        error: function (err) {
          error = err;
        },
        complete: function () {
          throw new Error('this should not complete');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(error).to.be.an.instanceof(rxjs_1.TimeoutError);
      chai_1.expect(error).to.have.property('name', 'TimeoutError');
      chai_1.expect(error.info).to.deep.equal({
        seen: 0,
        meta: null,
        lastValue: null,
      });
    });
  });
  it('should not timeout if source completes within absolute timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  --a--b--c--d--e--|');
      var t = time('  --------------------|');
      var e1subs = '  ^----------------!';
      var expected = '--a--b--c--d--e--|';
      var timeoutValue = new Date(t);
      expectObservable(
        e1.pipe(operators_1.timeout(timeoutValue, rxTestScheduler))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not timeout if source emits within timeout period', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  --a--b--c--d--e--|');
      var t = time('  -----|            ');
      var e1subs = '  ^----------------!';
      var expected = '--a--b--c--d--e--|';
      expectObservable(e1.pipe(operators_1.timeout(t, rxTestScheduler))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  --a--b--c---d--e--|');
      var t = time('  -----|             ');
      var unsub = '   ----------!        ';
      var e1subs = '  ^---------!        ';
      var expected = '--a--b--c--        ';
      var result = e1.pipe(operators_1.timeout(t, rxTestScheduler));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  --a--b--c---d--e--|');
      var t = time('  -----|             ');
      var e1subs = '  ^---------!        ';
      var expected = '--a--b--c--        ';
      var unsub = '   ----------!        ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.timeout(t, rxTestScheduler),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should timeout after a specified timeout period between emit with default error while source emits', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  ---a---b---c------d---e---|');
      var t = time('             -----|');
      var e1subs = '  ^---------------!          ';
      var expected = '---a---b---c----#          ';
      var result = e1.pipe(operators_1.timeout(t, rxTestScheduler));
      expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should timeout at a specified Date', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = cold(' -');
      var t = time('  ----------|');
      var e1subs = '  ^---------!';
      var expected = '----------#';
      var result = e1.pipe(operators_1.timeout(new Date(t), rxTestScheduler));
      expectObservable(result).toBe(expected, null, defaultTimeoutError);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with synchronous observable', function () {
    chai_1
      .expect(function () {
        rxjs_1.of(1).pipe(operators_1.timeout(10)).subscribe();
      })
      .to.not.throw();
  });
  describe('config', function () {
    it('should timeout after a specified timeout period', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold(' -------a--b--|');
        var t = time('  -----|        ');
        var e1subs = '  ^----!        ';
        var expected = '-----#        ';
        var result = e1.pipe(
          operators_1.timeout({
            each: t,
          })
        );
        expectObservable(result).toBe(expected, null, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should emit and TimeoutError on timeout with appropriate due as number', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          time = _a.time;
        var e1 = cold('-------a--b--|');
        var t = time(' -----|');
        var result = e1.pipe(operators_1.timeout({ each: t }));
        var error;
        result.subscribe({
          next: function () {
            throw new Error('this should not next');
          },
          error: function (err) {
            error = err;
          },
          complete: function () {
            throw new Error('this should not complete');
          },
        });
        rxTestScheduler.flush();
        chai_1.expect(error).to.be.an.instanceof(rxjs_1.TimeoutError);
        chai_1.expect(error).to.have.property('name', 'TimeoutError');
        chai_1.expect(error.info).to.deep.equal({
          seen: 0,
          meta: null,
          lastValue: null,
        });
      });
    });
    it('should emit and TimeoutError on timeout with appropriate due as Date', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          time = _a.time;
        var e1 = cold('-------a--b--|');
        var t = time(' ----|');
        var dueDate = new Date(t);
        var result = e1.pipe(operators_1.timeout({ first: dueDate }));
        var error;
        result.subscribe({
          next: function () {
            throw new Error('this should not next');
          },
          error: function (err) {
            error = err;
          },
          complete: function () {
            throw new Error('this should not complete');
          },
        });
        rxTestScheduler.flush();
        chai_1.expect(error).to.be.an.instanceof(rxjs_1.TimeoutError);
        chai_1.expect(error).to.have.property('name', 'TimeoutError');
        chai_1.expect(error.info).to.deep.equal({
          seen: 0,
          meta: null,
          lastValue: null,
        });
      });
    });
    it('should not timeout if source completes within absolute timeout period', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = hot('  --a--b--c--d--e--|');
        var t = time('  --------------------|');
        var e1subs = '  ^----------------!';
        var expected = '--a--b--c--d--e--|';
        expectObservable(
          e1.pipe(operators_1.timeout({ first: new Date(t) }))
        ).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should not timeout if source emits within timeout period', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = hot('  --a--b--c--d--e--|');
        var t = time('  -----|            ');
        var e1subs = '  ^----------------!';
        var expected = '--a--b--c--d--e--|';
        expectObservable(e1.pipe(operators_1.timeout({ each: t }))).toBe(
          expected
        );
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should allow unsubscribing explicitly and early', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = hot('  --a--b--c---d--e--|');
        var t = time('  -----|             ');
        var unsub = '   ----------!        ';
        var e1subs = '  ^---------!        ';
        var expected = '--a--b--c--        ';
        var result = e1.pipe(operators_1.timeout({ each: t }));
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = hot('  --a--b--c---d--e--|');
        var t = time('  -----|             ');
        var e1subs = '  ^---------!        ';
        var expected = '--a--b--c--        ';
        var unsub = '   ----------!        ';
        var result = e1.pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          }),
          operators_1.timeout({ each: t }),
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should timeout after a specified timeout period between emit with default error while source emits', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = hot('  ---a---b---c------d---e---|');
        var t = time('             -----|');
        var e1subs = '  ^---------------!          ';
        var expected = '---a---b---c----#          ';
        var result = e1.pipe(operators_1.timeout({ each: t }));
        expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should timeout at a specified Date', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold(' -');
        var t = time('  ----------|');
        var e1subs = '  ^---------!';
        var expected = '----------#';
        var result = e1.pipe(operators_1.timeout({ first: new Date(t) }));
        expectObservable(result).toBe(expected, null, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should timeout at a specified time for first value only', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold(' -');
        var t = time('  ----------|');
        var e1subs = '  ^---------!';
        var expected = '----------#';
        var result = e1.pipe(operators_1.timeout({ first: t }));
        expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should not timeout for long delays if only first is specified', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold(' ---a-----------------------b---|');
        var t = time('     ----------|');
        var e1subs = '  ^------------------------------!';
        var expected = '---a-----------------------b---|';
        var result = e1.pipe(operators_1.timeout({ first: t }));
        expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should not timeout for long delays if only first is specified as Date', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold(' ---a-----------------------b---|');
        var t = time('  ----------|');
        var e1subs = '  ^------------------------------!';
        var expected = '---a-----------------------b---|';
        var result = e1.pipe(operators_1.timeout({ first: new Date(t) }));
        expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should timeout for long delays if first is specified as Date AND each is specified', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions,
          time = _a.time;
        var e1 = cold('   ---a-----------------------b---|');
        var first = time('-------------|');
        var each = time('    ------|');
        var e1subs = '    ^--------!';
        var expected = '  ---a-----#';
        var result = e1.pipe(
          operators_1.timeout({ first: new Date(first), each: each })
        );
        expectObservable(result).toBe(expected, undefined, defaultTimeoutError);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
  });
  describe('using with', function () {
    it('should timeout after a specified period then subscribe to the passed observable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          cold = _a.cold,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('  -------a--b--|');
        var sourceSubs = '   ^----!        ';
        var t = time('       -----|');
        var inner = cold('        x-y-z-|  ');
        var innerSubs = '    -----^-----!  ';
        var expected = '     -----x-y-z-|  ';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
      });
    });
    it('should timeout at a specified date then subscribe to the passed observable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          cold = _a.cold,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('  -');
        var sourceSubs = '   ^---------!           ';
        var t = time('       ----------|');
        var inner = cold('             --x--y--z--|');
        var innerSubs = '    ----------^----------!';
        var expected = '     ------------x--y--z--|';
        var result = source.pipe(
          operators_1.timeout({
            first: new Date(t),
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('             -x-y-|  ');
        var innerSubs = '   -----------^----!  ';
        var expected = '    ---a---b----x-y-|  ';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('             -x---y| ');
        var innerSubs = '   -----------^--!    ';
        var expected = '    ---a---b----x--    ';
        var unsub = '       --------------!    ';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('             -x---y| ');
        var innerSubs = '   -----------^--!    ';
        var expected = '    ---a---b----x--    ';
        var unsub = '       --------------!    ';
        var result = source.pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          }),
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          }),
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
      });
    });
    it('should not subscribe to withObservable after explicit unsubscription', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          cold = _a.cold,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('---a------b------');
        var t = time('     -----|           ');
        var sourceSubs = ' ^----!           ';
        var inner = cold('      i---j---|   ');
        var expected = '   ---a--           ';
        var unsub = '      -----!           ';
        var result = source.pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          }),
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          }),
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
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
        var inner = cold('            ----x----|');
        var innerSubs = '   ----------^--------!';
        var expected = '    --------------x----|';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('           ------------');
        var innerSubs = '   ---------^-----------';
        var expected = '    --a--b---------------';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('            ----x----|');
        var innerSubs = '   ----------^--------!';
        var expected = '    --------------x----|';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('             ----x----');
        var innerSubs = '   -----------^--------';
        var expected = '    ---------------x----';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe(innerSubs);
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
        var inner = cold('            ----x----');
        var expected = '    -----|        ';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
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
        var inner = cold('       ----x----|');
        var expected = '  -----#              ';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
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
        var inner = cold('        ----x----|   ');
        var expected = '     --a--b--c--d--e--|';
        var result = source.pipe(
          operators_1.timeout({
            each: t,
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
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
        var inner = cold('--x--|            ');
        var expected = '  --a--b--c--d--e--|   ';
        var result = source.pipe(
          operators_1.timeout({
            first: new Date(t),
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
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
        var inner = cold('             --x--|');
        var expected = '  ---a---#           ';
        var result = source.pipe(
          operators_1.timeout({
            first: new Date(t),
            with: function () {
              return inner;
            },
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(inner.subscriptions).toBe([]);
      });
    });
    it('should not timeout if source emits synchronously when subscribed', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable,
          time = _a.time;
        var source = rxjs_1.of('a').pipe(operators_1.concatWith(rxjs_1.NEVER));
        var t = time('  ---|');
        var expected = 'a---';
        expectObservable(
          source.pipe(operators_1.timeout({ first: new Date(t) }))
        ).toBe(expected);
      });
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
      .pipe(operators_1.timeout(0), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=timeout-spec.js.map
