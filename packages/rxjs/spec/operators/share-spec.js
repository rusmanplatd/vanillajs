'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var sinon_1 = require('sinon');
var syncNotify = rxjs_1.of(1);
var asapNotify = rxjs_1.scheduled(syncNotify, rxjs_1.asapScheduler);
var syncError = rxjs_1.throwError(function () {
  return new Error();
});
/**
 *
 * @param fn
 */
function spyOnUnhandledError(fn) {
  var prevOnUnhandledError = rxjs_1.config.onUnhandledError;
  try {
    var onUnhandledError = sinon_1.spy();
    rxjs_1.config.onUnhandledError = onUnhandledError;
    fn(onUnhandledError);
  } finally {
    rxjs_1.config.onUnhandledError = prevOnUnhandledError;
  }
}
describe('share', function () {
  var e_1, _a, e_2, _b;
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  var _loop_1 = function (title, options) {
    describe(title, function () {
      it('should mirror a simple source Observable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('--1-2---3-4--5-|');
          var sourceSubs = ' ^--------------!';
          var expected = '   --1-2---3-4--5-|';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(shared).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share a single subscription', function () {
        var subscriptionCount = 0;
        var obs = new rxjs_1.Observable(function () {
          subscriptionCount++;
        });
        var source = obs.pipe(operators_1.share(options));
        chai_1.expect(subscriptionCount).to.equal(0);
        source.subscribe();
        source.subscribe();
        chai_1.expect(subscriptionCount).to.equal(1);
      });
      it('should not change the output of the observable when error', function () {
        rxTest.run(function (_a) {
          var hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var e1 = hot('---a--^--b--c--d--e--#');
          var e1subs = '      ^--------------!';
          var expected = '    ---b--c--d--e--#';
          expectObservable(e1.pipe(operators_1.share(options))).toBe(expected);
          expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
      });
      it('should not change the output of the observable when successful with cold observable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var e1 = cold(' ---a--b--c--d--e--|');
          var e1subs = '  ^-----------------!';
          var expected = '---a--b--c--d--e--|';
          expectObservable(e1.pipe(operators_1.share(options))).toBe(expected);
          expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
      });
      it('should not change the output of the observable when error with cold observable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var e1 = cold(' ---a--b--c--d--e--#');
          var e1subs = '  ^-----------------!';
          var expected = '---a--b--c--d--e--#';
          expectObservable(e1.pipe(operators_1.share(options))).toBe(expected);
          expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
      });
      it('should retry just fine', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var e1 = cold(' ---a--b--c--d--e--#                  ');
          var e1subs = [
            '               ^-----------------!                  ',
            '               ------------------^-----------------!',
          ];
          var expected = '---a--b--c--d--e-----a--b--c--d--e--#';
          expectObservable(
            e1.pipe(operators_1.share(options), operators_1.retry(1))
          ).toBe(expected);
          expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
      });
      it('should share the same values to multiple observers', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('    -1-2-3----4-|');
          var sourceSubs = '     ^-----------!';
          var subscriber1 = hot('a|           ');
          var expected1 = '      -1-2-3----4-|';
          var subscriber2 = hot('----b|       ');
          var expected2 = '      -----3----4-|';
          var subscriber3 = hot('--------c|   ');
          var expected3 = '      ----------4-|';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected2);
          expectObservable(
            subscriber3.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected3);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share an error from the source to multiple observers', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('    -1-2-3----4-#');
          var sourceSubs = '     ^-----------!';
          var subscriber1 = hot('a|           ');
          var expected1 = '      -1-2-3----4-#';
          var subscriber2 = hot('----b|       ');
          var expected2 = '      -----3----4-#';
          var subscriber3 = hot('--------c|   ');
          var expected3 = '      ----------4-#';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected2);
          expectObservable(
            subscriber3.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected3);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share the same values to multiple observers, but is unsubscribed explicitly and early', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('    -1-2-3----4-|');
          var sourceSubs = '     ^--------!   ';
          var unsub = '          ---------!   ';
          var subscriber1 = hot('a|           ');
          var expected1 = '      -1-2-3----   ';
          var subscriber2 = hot('----b|       ');
          var expected2 = '      -----3----   ';
          var subscriber3 = hot('--------c|   ');
          var expected3 = '      ----------   ';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared)),
            unsub
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared)),
            unsub
          ).toBe(expected2);
          expectObservable(
            subscriber3.pipe(operators_1.mergeMapTo(shared)),
            unsub
          ).toBe(expected3);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share an empty source', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('|   ');
          var sourceSubs = ' (^!)';
          var expected = '   |   ';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(shared).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share a never source', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('-');
          var sourceSubs = ' ^';
          var expected = '   -';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(shared).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should share a throw source', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('#   ');
          var sourceSubs = ' (^!)';
          var expected = '   #   ';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(shared).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should connect when first subscriber subscribes', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('       -1-2-3----4-|');
          var sourceSubs = '     ---^-----------!';
          var subscriber1 = hot('---a|           ');
          var expected1 = '      ----1-2-3----4-|';
          var subscriber2 = hot('-------b|       ');
          var expected2 = '      --------3----4-|';
          var subscriber3 = hot('-----------c|   ');
          var expected3 = '      -------------4-|';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected2);
          expectObservable(
            subscriber3.pipe(operators_1.mergeMapTo(shared))
          ).toBe(expected3);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should disconnect when last subscriber unsubscribes', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('       -1-2-3----4-|');
          var sourceSubs = '     ---^--------!   ';
          var subscriber1 = hot('---a|           ');
          var unsub1 = '         ----------!     ';
          var expected1 = '      ----1-2-3--     ';
          var subscriber2 = hot('-------b|       ');
          var unsub2 = '         ------------!   ';
          var expected2 = '      --------3----   ';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared)),
            unsub1
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared)),
            unsub2
          ).toBe(expected2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should not break unsubscription chain when last subscriber unsubscribes', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('       -1-2-3----4-|');
          var sourceSubs = '     ---^--------!   ';
          var subscriber1 = hot('---a|           ');
          var unsub1 = '         ----------!     ';
          var expected1 = '      ----1-2-3--     ';
          var subscriber2 = hot('-------b|       ');
          var unsub2 = '         ------------!   ';
          var expected2 = '      --------3----   ';
          var shared = source.pipe(
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            }),
            operators_1.share(options),
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            })
          );
          expectObservable(
            subscriber1.pipe(operators_1.mergeMapTo(shared)),
            unsub1
          ).toBe(expected1);
          expectObservable(
            subscriber2.pipe(operators_1.mergeMapTo(shared)),
            unsub2
          ).toBe(expected2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should be retryable when cold source is synchronous', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('(123#)    ');
          var subscribe1 = ' s         ';
          var expected1 = '  (123123#) ';
          var subscribe2 = ' -s        ';
          var expected2 = '  -(123123#)';
          var sourceSubs = [
            '                  (^!)      ',
            '                  (^!)      ',
            '                  -(^!)     ',
            '                  -(^!)     ',
          ];
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            hot(subscribe1).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.retry(1))).toBe(
                  expected1
                );
              })
            )
          ).toBe(subscribe1);
          expectObservable(
            hot(subscribe2).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.retry(1))).toBe(
                  expected2
                );
              })
            )
          ).toBe(subscribe2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should be repeatable when cold source is synchronous', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('(123|)    ');
          var subscribe1 = ' s         ';
          var expected1 = '  (123123|) ';
          var subscribe2 = ' -s        ';
          var expected2 = '  -(123123|)';
          var sourceSubs = [
            '                  (^!)      ',
            '                  (^!)      ',
            '                  -(^!)     ',
            '                  -(^!)     ',
          ];
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            hot(subscribe1).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.repeat(2))).toBe(
                  expected1
                );
              })
            )
          ).toBe(subscribe1);
          expectObservable(
            hot(subscribe2).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.repeat(2))).toBe(
                  expected2
                );
              })
            )
          ).toBe(subscribe2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should be retryable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('-1-2-3----4-#                        ');
          var sourceSubs = [
            '                  ^-----------!                        ',
            '                  ------------^-----------!            ',
            '                  ------------------------^-----------!',
          ];
          var subscribe1 = ' s------------------------------------';
          var expected1 = '  -1-2-3----4--1-2-3----4--1-2-3----4-#';
          var subscribe2 = ' ----s--------------------------------';
          var expected2 = '  -----3----4--1-2-3----4--1-2-3----4-#';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            hot(subscribe1).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.retry(2))).toBe(
                  expected1
                );
              })
            )
          ).toBe(subscribe1);
          expectObservable(
            hot(subscribe2).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.retry(2))).toBe(
                  expected2
                );
              })
            )
          ).toBe(subscribe2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should be repeatable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('-1-2-3----4-|                        ');
          var sourceSubs = [
            '                  ^-----------!                        ',
            '                  ------------^-----------!            ',
            '                  ------------------------^-----------!',
          ];
          var subscribe1 = ' s------------------------------------';
          var expected1 = '  -1-2-3----4--1-2-3----4--1-2-3----4-|';
          var subscribe2 = ' ----s--------------------------------';
          var expected2 = '  -----3----4--1-2-3----4--1-2-3----4-|';
          var shared = source.pipe(operators_1.share(options));
          expectObservable(
            hot(subscribe1).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.repeat(3))).toBe(
                  expected1
                );
              })
            )
          ).toBe(subscribe1);
          expectObservable(
            hot(subscribe2).pipe(
              operators_1.tap(function () {
                expectObservable(shared.pipe(operators_1.repeat(3))).toBe(
                  expected2
                );
              })
            )
          ).toBe(subscribe2);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should not change the output of the observable when never', function () {
        rxTest.run(function (_a) {
          var expectObservable = _a.expectObservable;
          var e1 = rxjs_1.NEVER;
          var expected = '-';
          expectObservable(e1.pipe(operators_1.share(options))).toBe(expected);
        });
      });
      it('should not change the output of the observable when empty', function () {
        rxTest.run(function (_a) {
          var expectObservable = _a.expectObservable;
          var e1 = rxjs_1.EMPTY;
          var expected = '|';
          expectObservable(e1.pipe(operators_1.share(options))).toBe(expected);
        });
      });
      it('should stop listening to a synchronous observable when unsubscribed', function () {
        var sideEffects = [];
        var synchronousObservable = new rxjs_1.Observable(function (
          subscriber
        ) {
          for (var i = 0; !subscriber.closed && i < 10; i++) {
            sideEffects.push(i);
            subscriber.next(i);
          }
        });
        synchronousObservable
          .pipe(operators_1.share(options), operators_1.take(3))
          .subscribe(function () {});
        chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
      });
      it('should not fail on reentrant subscription', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('(123|)');
          var subs = '       (^!)  ';
          var expected = '   (136|)';
          var deferred = rxjs_1
            .defer(function () {
              return shared;
            })
            .pipe(operators_1.startWith(0));
          var shared = source.pipe(
            operators_1.withLatestFrom(deferred),
            operators_1.map(function (_a) {
              var _b = __read(_a, 2),
                a = _b[0],
                b = _b[1];
              return String(Number(a) + Number(b));
            }),
            operators_1.share(options)
          );
          expectObservable(shared).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
    });
  };
  try {
    for (
      var _c = __values([
          { title: 'share()', options: {} },
          {
            title:
              'share() using sync reset notifiers equivalent to default config',
            options: {
              resetOnError: function () {
                return syncNotify;
              },
              resetOnComplete: function () {
                return syncNotify;
              },
              resetOnRefCountZero: function () {
                return syncNotify;
              },
            },
          },
          {
            title:
              'share() using sync reset notifiers equivalent to default config and notifying again after reset is notified',
            options: {
              resetOnError: function () {
                return rxjs_1.concat(syncNotify, syncNotify);
              },
              resetOnComplete: function () {
                return rxjs_1.concat(syncNotify, syncNotify);
              },
              resetOnRefCountZero: function () {
                return rxjs_1.concat(syncNotify, syncNotify);
              },
            },
          },
          {
            title:
              'share() using sync reset notifiers equivalent to default config and never completing after reset is notified',
            options: {
              resetOnError: function () {
                return rxjs_1.concat(syncNotify, rxjs_1.NEVER);
              },
              resetOnComplete: function () {
                return rxjs_1.concat(syncNotify, rxjs_1.NEVER);
              },
              resetOnRefCountZero: function () {
                return rxjs_1.concat(syncNotify, rxjs_1.NEVER);
              },
            },
          },
          {
            title:
              'share() using sync reset notifiers equivalent to default config and throwing an error after reset is notified',
            options: {
              resetOnError: function () {
                return rxjs_1.concat(syncNotify, syncError);
              },
              resetOnComplete: function () {
                return rxjs_1.concat(syncNotify, syncError);
              },
              resetOnRefCountZero: function () {
                return rxjs_1.concat(syncNotify, syncError);
              },
            },
          },
        ]),
        _d = _c.next();
      !_d.done;
      _d = _c.next()
    ) {
      var _e = _d.value,
        title = _e.title,
        options = _e.options;
      _loop_1(title, options);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  var _loop_2 = function (
    title,
    resetOnError,
    resetOnComplete,
    resetOnRefCountZero
  ) {
    describe(title, function () {
      it('should not reset on error if configured to do so', function () {
        rxTest.run(function (_a) {
          var hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = hot('---a---b---c---d---e---f----#');
          var expected = '  ---a---b---c---d---e---f----#';
          var sourceSubs = [
            '                 ^----------!                 ',
            '                 -----------^-----------!     ',
            '                 -----------------------^----!',
          ];
          var result = source.pipe(
            operators_1.take(3),
            operators_1.share({ resetOnError: resetOnError }),
            operators_1.repeat()
          );
          expectObservable(result).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should not reset on complete if configured to do so', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('---a---b---c---#                          ');
          var expected = '   ---a---b---c------a---b---c------a---b---|';
          var sourceSubs = [
            '                  ^--------------!                          ',
            '                  ---------------^--------------!           ',
            '                  ------------------------------^----------!',
          ];
          var triggerComplete = new rxjs_1.Subject();
          var count = 0;
          var result = source.pipe(
            operators_1.takeUntil(triggerComplete),
            operators_1.share({ resetOnComplete: resetOnComplete }),
            operators_1.retry(),
            operators_1.tap(function () {
              if (++count === 9) {
                triggerComplete.next();
              }
            })
          );
          expectObservable(result).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should not reset on refCount 0 if configured to do so', function () {
        rxTest.run(function (_a) {
          var hot = _a.hot,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = hot(
            '  ---v---v---v---E--v---v---v---C---v----v------v---'
          );
          var expected =
            '    ---v---v---v------v---v---v-------v----v----      ';
          var subscription =
            '^-------------------------------------------!     ';
          var sourceSubs = [
            '                   ^--------------!',
            '                   ---------------^--------------!',
            '                   ------------------------------^--------------     ',
          ];
          var result = source.pipe(
            operators_1.tap(function (value) {
              if (value === 'E') {
                throw new Error('E');
              }
            }),
            operators_1.takeWhile(function (value) {
              return value !== 'C';
            }),
            operators_1.share({ resetOnRefCountZero: resetOnRefCountZero }),
            operators_1.retry(),
            operators_1.repeat()
          );
          expectObservable(result, subscription).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
      });
      it('should be referentially-transparent', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source1 = cold('-1-2-3-4-5-|');
          var source1Subs = ' ^----------!';
          var expected1 = '   -1-2-3-4-5-|';
          var source2 = cold('-6-7-8-9-0-|');
          var source2Subs = ' ^----------!';
          var expected2 = '   -6-7-8-9-0-|';
          var partialPipeLine = rxjs_1.pipe(
            operators_1.share({ resetOnRefCountZero: resetOnRefCountZero })
          );
          var shared1 = source1.pipe(partialPipeLine);
          var shared2 = source2.pipe(partialPipeLine);
          expectObservable(shared1).toBe(expected1);
          expectSubscriptions(source1.subscriptions).toBe(source1Subs);
          expectObservable(shared2).toBe(expected2);
          expectSubscriptions(source2.subscriptions).toBe(source2Subs);
        });
      });
    });
  };
  try {
    for (
      var _f = __values([
          {
            title: 'share(config)',
            resetOnError: false,
            resetOnComplete: false,
            resetOnRefCountZero: false,
          },
          {
            title:
              'share(config) using EMPTY as sync reset notifier equivalents',
            resetOnError: function () {
              return rxjs_1.EMPTY;
            },
            resetOnComplete: function () {
              return rxjs_1.EMPTY;
            },
            resetOnRefCountZero: function () {
              return rxjs_1.EMPTY;
            },
          },
          {
            title:
              'share(config) using NEVER as sync reset notifier equivalents',
            resetOnError: function () {
              return rxjs_1.NEVER;
            },
            resetOnComplete: function () {
              return rxjs_1.NEVER;
            },
            resetOnRefCountZero: function () {
              return rxjs_1.NEVER;
            },
          },
        ]),
        _g = _f.next();
      !_g.done;
      _g = _f.next()
    ) {
      var _h = _g.value,
        title = _h.title,
        resetOnError = _h.resetOnError,
        resetOnComplete = _h.resetOnComplete,
        resetOnRefCountZero = _h.resetOnRefCountZero;
      _loop_2(title, resetOnError, resetOnComplete, resetOnRefCountZero);
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  describe('share(config)', function () {
    it('should use the connector function provided', function () {
      var connector = sinon_1.spy(function () {
        return new rxjs_1.Subject();
      });
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var source = hot(
          '  ---v---v---v---E--v---v---v---C---v----v--------v----v---'
        );
        var subs1 =
          '       ^-------------------------------------------!            ';
        var expResult1 =
          '  ---v---v---v------v---v---v-------v----v-----            ';
        var subs2 =
          '       ----------------------------------------------^---------!';
        var expResult2 =
          '  ------------------------------------------------v----v---';
        var result = source.pipe(
          operators_1.tap(function (value) {
            if (value === 'E') {
              throw new Error('E');
            }
          }),
          operators_1.takeWhile(function (value) {
            return value !== 'C';
          }),
          operators_1.share({
            connector: connector,
          }),
          operators_1.retry(),
          operators_1.repeat()
        );
        expectObservable(result, subs1).toBe(expResult1);
        expectObservable(result, subs2).toBe(expResult2);
      });
      chai_1.expect(connector).to.have.callCount(4);
    });
  });
  describe('share(config) with async/deferred reset notifiers', function () {
    it('should reset on refCount 0 when synchronously resubscribing to a firehose and using a sync reset notifier', function () {
      var subscriptionCount = 0;
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriptionCount++;
        for (var i = 0; i < 3 && !subscriber.closed; i++) {
          subscriber.next(i);
        }
        if (!subscriber.closed) {
          subscriber.complete();
        }
      });
      var result;
      source
        .pipe(
          operators_1.share({
            resetOnRefCountZero: function () {
              return syncNotify;
            },
          }),
          operators_1.take(2),
          operators_1.repeat(2),
          operators_1.toArray()
        )
        .subscribe(function (numbers) {
          return void (result = numbers);
        });
      chai_1.expect(subscriptionCount).to.equal(2);
      chai_1.expect(result).to.deep.equal([0, 1, 0, 1]);
    });
    it('should reset on refCount 0 when synchronously resubscribing and using a sync reset notifier', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = hot('  ---1---2---3---(4 )---5---|');
        var sourceSubs = [
          '                   ^------!                   ',
          '                   -------^-------(! )        ',
        ];
        var expected = '    ---1---2---3---(4|)        ';
        var subscription = '^--------------(- )        ';
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnRefCountZero: function () {
              return syncNotify;
            },
          }),
          operators_1.take(2)
        );
        var result = rxjs_1.concat(sharedSource, sharedSource);
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should not reset on refCount 0 when synchronously resubscribing and using a deferred reset notifier', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold(' ---1---2---3---4---5---|');
        var sourceSubs = '  ^----------------------!';
        var expected = '    ---1---2---3---4---5---|';
        var subscription = '^-----------------------';
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnRefCountZero: function () {
              return asapNotify;
            },
          }),
          operators_1.take(3)
        );
        var result = rxjs_1.concat(sharedSource, sharedSource);
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should reset on refCount 0 only after reset notifier emitted', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = hot('      ---1---2---3---4---5---|');
        var sourceSubs = [
          '                       ^----------------!      ',
          '                       ------------------^----!',
        ];
        var expected = '        ---1---2---3---4---5---|';
        var subscription = '    ^-----------------------';
        var firstPause = cold('        -|               ');
        var reset = cold('             --r              ');
        var secondPause = cold('               ---|     ');
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnRefCountZero: function () {
              return reset;
            },
          }),
          operators_1.take(2)
        );
        var result = rxjs_1.concat(
          sharedSource,
          firstPause,
          sharedSource,
          secondPause,
          sharedSource
        );
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should reset on error only after reset notifier emitted', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('     ---1---2---#                ');
        var sourceSubs = [
          '                       ^----------!                ',
          '                       --------------^----------!  ',
        ];
        var expected = '        ---1---2---------1---2----# ';
        var subscription = '    ^-------------------------- ';
        var firstPause = cold('        -------|             ');
        var reset = cold('                 --r              ');
        var secondPause = cold('                     -----| ');
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnError: function () {
              return reset;
            },
            resetOnRefCountZero: false,
          }),
          operators_1.take(2)
        );
        var result = rxjs_1.concat(
          sharedSource,
          firstPause,
          sharedSource,
          secondPause,
          sharedSource
        );
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should reset on complete only after reset notifier emitted', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('     ---1---2---|                ');
        var sourceSubs = [
          '                       ^----------!                ',
          '                       --------------^----------!  ',
        ];
        var expected = '        ---1---2---------1---2----| ';
        var subscription = '    ^-------------------------- ';
        var firstPause = cold('        -------|             ');
        var reset = cold('                 --r              ');
        var secondPause = cold('                     -----| ');
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnComplete: function () {
              return reset;
            },
            resetOnRefCountZero: false,
          }),
          operators_1.take(2)
        );
        var result = rxjs_1.concat(
          sharedSource,
          firstPause,
          sharedSource,
          secondPause,
          sharedSource
        );
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should not reset on refCount 0 if reset notifier errors before emitting any value', function () {
      spyOnUnhandledError(function (onUnhandledError) {
        var error = new Error();
        rxTest.run(function (_a) {
          var hot = _a.hot,
            cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = hot('       ---1---2---3---4---(5 )---|');
          var sourceSubs = '       ^------------------(- )---!';
          var expected = '         ---1---2-------4---(5|)    ';
          var subscription = '     ^------------------(- )    ';
          var firstPause = cold('         ------|             ');
          var reset = cold(
            '              --#                 ',
            undefined,
            error
          );
          var sharedSource = source.pipe(
            operators_1.share({
              resetOnRefCountZero: function () {
                return reset;
              },
            }),
            operators_1.take(2)
          );
          var result = rxjs_1.concat(sharedSource, firstPause, sharedSource);
          expectObservable(result, subscription).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        chai_1.expect(onUnhandledError).to.have.been.calledTwice;
        chai_1
          .expect(onUnhandledError.getCall(0))
          .to.have.been.calledWithExactly(error);
        chai_1
          .expect(onUnhandledError.getCall(1))
          .to.have.been.calledWithExactly(error);
      });
    });
    it('should not reset on error if reset notifier errors before emitting any value', function () {
      spyOnUnhandledError(function (onUnhandledError) {
        var error = new Error();
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('    ---1---2---#   ');
          var sourceSubs = '     ^----------!   ';
          var expected = '       ---1---2------#';
          var subscription = '   ^--------------';
          var firstPause = cold('       -------|');
          var reset = cold('                --# ', undefined, error);
          var sharedSource = source.pipe(
            operators_1.share({
              resetOnError: function () {
                return reset;
              },
              resetOnRefCountZero: false,
            }),
            operators_1.take(2)
          );
          var result = rxjs_1.concat(sharedSource, firstPause, sharedSource);
          expectObservable(result, subscription).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        chai_1.expect(onUnhandledError).to.have.been.calledOnce;
        chai_1
          .expect(onUnhandledError.getCall(0))
          .to.have.been.calledWithExactly(error);
      });
    });
    it('should not reset on complete if reset notifier errors before emitting any value', function () {
      spyOnUnhandledError(function (onUnhandledError) {
        var error = new Error();
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('    ---1---2---|   ');
          var sourceSubs = '     ^----------!   ';
          var expected = '       ---1---2------|';
          var subscription = '   ^--------------';
          var firstPause = cold('       -------|');
          var reset = cold('                --# ', undefined, error);
          var sharedSource = source.pipe(
            operators_1.share({
              resetOnComplete: function () {
                return reset;
              },
              resetOnRefCountZero: false,
            }),
            operators_1.take(2)
          );
          var result = rxjs_1.concat(sharedSource, firstPause, sharedSource);
          expectObservable(result, subscription).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
        chai_1.expect(onUnhandledError).to.have.been.calledOnce;
        chai_1
          .expect(onUnhandledError.getCall(0))
          .to.have.been.calledWithExactly(error);
      });
    });
    it('should not call "resetOnRefCountZero" on error', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var resetOnRefCountZero = sinon_1.spy(function () {
          return rxjs_1.EMPTY;
        });
        var source = cold('    ---1---(2#)                ');
        var sourceSubs = [
          '                      ^------(! )                ',
          '                      -------(- )---^------(! )  ',
        ];
        var expected = '       ---1---(2 )------1---(2#)  ';
        var subscription = '   ^------(- )----------(- )  ';
        var firstPause = cold('       (- )---|            ');
        var reset = cold('            (- )-r              ');
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnError: function () {
              return reset;
            },
            resetOnRefCountZero: resetOnRefCountZero,
          })
        );
        var result = rxjs_1.concat(
          sharedSource.pipe(operators_1.onErrorResumeNext(firstPause)),
          sharedSource
        );
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        chai_1.expect(resetOnRefCountZero).to.not.have.been.called;
      });
    });
    it('should not call "resetOnRefCountZero" on complete', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var resetOnRefCountZero = sinon_1.spy(function () {
          return rxjs_1.EMPTY;
        });
        var source = cold('    ---1---(2|)                ');
        var sourceSubs = [
          '                      ^------(! )                ',
          '                      -------(- )---^------(! )  ',
        ];
        var expected = '       ---1---(2 )------1---(2|)  ';
        var subscription = '   ^------(- )----------(- )  ';
        var firstPause = cold('       (- )---|            ');
        var reset = cold('            (- )-r              ');
        var sharedSource = source.pipe(
          operators_1.share({
            resetOnComplete: function () {
              return reset;
            },
            resetOnRefCountZero: resetOnRefCountZero,
          })
        );
        var result = rxjs_1.concat(sharedSource, firstPause, sharedSource);
        expectObservable(result, subscription).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        chai_1.expect(resetOnRefCountZero).to.not.have.been.called;
      });
    });
  });
});
//# sourceMappingURL=share-spec.js.map
