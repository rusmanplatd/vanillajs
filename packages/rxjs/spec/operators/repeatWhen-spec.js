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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var Subscriber_1 = require('rxjs/internal/Subscriber');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('repeatWhen operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should handle a source with eventual complete using a hot notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-1--2--|');
      var subs = [
        '                  ^------!                          ',
        '                  -------------^------!             ',
        '                  --------------------------^------!',
      ];
      var notifier = hot('-------------r------------r-|    ');
      var expected = '    -1--2---------1--2---------1--2--|';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a source with eventual complete using a hot notifier that raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--|');
      var subs = [
        '                   ^------!                      ',
        '                   -----------^------!           ',
        '                   -------------------^------!   ',
      ];
      var notifier = hot('-----------r-------r---------#');
      var expected = '    -1--2-------1--2----1--2-----#';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should repeat when notified via returned notifier on complete', function (done) {
    var retried = false;
    var expected = [1, 2, 1, 2];
    var i = 0;
    try {
      rxjs_1
        .of(1, 2)
        .pipe(
          operators_1.map(function (n) {
            return n;
          }),
          operators_1.repeatWhen(function (notifications) {
            return notifications.pipe(
              operators_1.map(function (x) {
                if (retried) {
                  throw new Error('done');
                }
                retried = true;
                return x;
              })
            );
          })
        )
        .subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal(expected[i++]);
          },
          error: function (err) {
            chai_1.expect(err).to.be.an('error', 'done');
            done();
          },
        });
    } catch (err) {
      done(err);
    }
  });
  it('should not repeat when applying an empty notifier', function (done) {
    var expected = [1, 2];
    var nexted = [];
    rxjs_1
      .of(1, 2)
      .pipe(
        operators_1.map(function (n) {
          return n;
        }),
        operators_1.repeatWhen(function (notifications) {
          return rxjs_1.EMPTY;
        })
      )
      .subscribe({
        next: function (n) {
          chai_1.expect(n).to.equal(expected.shift());
          nexted.push(n);
        },
        error: function (err) {
          done(new Error('should not be called'));
        },
        complete: function () {
          chai_1.expect(nexted).to.deep.equal([1, 2]);
          done();
        },
      });
  });
  it('should not error when applying an empty synchronous notifier', function () {
    var errors = [];
    var originalSubscribe = rxjs_1.Observable.prototype.subscribe;
    rxjs_1.Observable.prototype.subscribe = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var _a = __read(args, 1),
        subscriber = _a[0];
      if (!(subscriber instanceof rxjs_1.Subscriber)) {
        subscriber = new (Subscriber_1.SafeSubscriber.bind.apply(
          Subscriber_1.SafeSubscriber,
          __spreadArray([void 0], __read(args))
        ))();
      }
      subscriber.error = function (err) {
        errors.push(err);
        rxjs_1.Subscriber.prototype.error.call(this, err);
      };
      return originalSubscribe.call(this, subscriber);
    };
    rxjs_1
      .of(1, 2)
      .pipe(
        operators_1.repeatWhen(function (notifications) {
          return rxjs_1.EMPTY;
        })
      )
      .subscribe({
        error: function (err) {
          return errors.push(err);
        },
      });
    rxjs_1.Observable.prototype.subscribe = originalSubscribe;
    chai_1.expect(errors).to.deep.equal([]);
  });
  it('should not error when applying a non-empty synchronous notifier', function () {
    var errors = [];
    var originalSubscribe = rxjs_1.Observable.prototype.subscribe;
    rxjs_1.Observable.prototype.subscribe = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var _a = __read(args, 1),
        subscriber = _a[0];
      if (!(subscriber instanceof rxjs_1.Subscriber)) {
        subscriber = new (Subscriber_1.SafeSubscriber.bind.apply(
          Subscriber_1.SafeSubscriber,
          __spreadArray([void 0], __read(args))
        ))();
      }
      subscriber.error = function (err) {
        errors.push(err);
        rxjs_1.Subscriber.prototype.error.call(this, err);
      };
      return originalSubscribe.call(this, subscriber);
    };
    rxjs_1
      .of(1, 2)
      .pipe(
        operators_1.repeatWhen(function (notifications) {
          return rxjs_1.of(1);
        })
      )
      .subscribe({
        error: function (err) {
          return errors.push(err);
        },
      });
    rxjs_1.Observable.prototype.subscribe = originalSubscribe;
    chai_1.expect(errors).to.deep.equal([]);
  });
  it('should apply an empty notifier on an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |   ');
      var subs = '         (^!)';
      var notifier = cold('|   ');
      var expected = '     |   ';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply a never notifier on an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |   ');
      var subs = '         (^!)';
      var notifier = cold('-   ');
      var expected = '     -   ';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply an empty notifier on a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  -                                         ');
      var unsub = '        -----------------------------------------!';
      var subs = '         ^----------------------------------------!';
      var notifier = cold('|                                         ');
      var expected = '     -                                         ';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply a never notifier on a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  -                                         ');
      var unsub = '        -----------------------------------------!';
      var subs = '         ^----------------------------------------!';
      var notifier = cold('-                                        ');
      var expected = '     -                                        ';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should return an empty observable given a just-throw source and empty notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var source = cold('  #');
      var notifier = cold('|');
      var expected = '     #';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should return a error observable given a just-throw source and never notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var source = cold('  #');
      var notifier = cold('-');
      var expected = '     #';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should return a never-ending result if the notifier is never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--|                              ');
      var subs = '         ^----------!                              ';
      var notifier = cold('           -                              ');
      var expected = '     --a--b--c---------------------------------';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should propagate error thrown from notifierSelector function', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--a--b--c--|');
      var subs = '       ^----------!';
      var expected = '   --a--b--c--#';
      var result = source.pipe(
        operators_1.repeatWhen(function () {
          throw 'bad!';
        })
      );
      expectObservable(result).toBe(expected, undefined, 'bad!');
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should complete if the notifier only completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--|');
      var subs = '         ^----------!';
      var notifier = cold('           |');
      var expected = '     --a--b--c--|';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic cold source with complete, given a never notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--|');
      var subs = '         ^----------!';
      var notifier = cold('           |');
      var expected = '     --a--b--c--|';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic cold source with no termination, given a never notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c---');
      var subs = '         ^-----------';
      var notifier = cold('           |');
      var expected = '     --a--b--c---';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic hot source with complete, given a never notifier', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-a-^--b--c--|');
      var subs = '         ^--------!';
      var notifier = cold('         |');
      var expected = '     ---b--c--|';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it.skip('should handle a host source that completes via operator like take, and a hot notifier', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -1--2--3----4--5---|');
      var ssubs = [
        '                   ^------!            ',
        '                   -------------^----! ',
      ];
      var notifier = hot('--------------r--------r---r--r--r---|');
      var nsubs = '       -------^-----------!';
      var expected = '    -1--2----------5---|';
      var result = source.pipe(
        operators_1.takeWhile(function (value) {
          return value !== '3';
        }),
        operators_1.repeatWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(ssubs);
      expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
  });
  it('should tear down resources when result is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--|');
      var unsub = '       --------------------!       ';
      var subs = [
        '                   ^------!                    ',
        '                   ---------^------!           ',
        '                   -----------------^--!       ',
      ];
      var notifier = hot('---------r-------r---------#');
      var nsubs = '       -------^------------!       ';
      var expected = '    -1--2-----1--2----1--       ';
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--|');
      var subs = [
        '                   ^------!                    ',
        '                   ---------^------!           ',
        '                   -----------------^--!       ',
      ];
      var notifier = hot('---------r-------r-------r-#');
      var nsubs = '       -------^------------!       ';
      var expected = '    -1--2-----1--2----1--       ';
      var unsub = '       --------------------!       ';
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.repeatWhen(function (notifications) {
          return notifier;
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
  });
  it('should handle a source with eventual error using a dynamic notifier selector which eventually throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-1--2--|');
      var subs = [
        '                  ^------!              ',
        '                  -------^------!       ',
        '                  --------------^------!',
      ];
      var expected = '   -1--2---1--2---1--2--#';
      var invoked = 0;
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifications.pipe(
            operators_1.map(function (err) {
              if (++invoked === 3) {
                throw 'error';
              } else {
                return 'x';
              }
            })
          );
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a source with eventual error using a dynamic notifier selector which eventually completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-1--2--|');
      var subs = [
        '                  ^------!              ',
        '                  -------^------!       ',
        '                  --------------^------!',
      ];
      var expected = '   -1--2---1--2---1--2--|';
      var invoked = 0;
      var result = source.pipe(
        operators_1.repeatWhen(function (notifications) {
          return notifications.pipe(
            operators_1.map(function () {
              return 'x';
            }),
            operators_1.takeUntil(
              notifications.pipe(
                operators_1.mergeMap(function () {
                  if (++invoked < 3) {
                    return rxjs_1.EMPTY;
                  } else {
                    return rxjs_1.of('stop!');
                  }
                })
              )
            )
          );
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should always finalize before starting the next cycle, even when synchronous', function () {
    var results = [];
    var source = new rxjs_1.Observable(function (subscriber) {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.complete();
      return function () {
        results.push('finalizer');
      };
    });
    var subscription = source
      .pipe(
        operators_1.repeatWhen(function (completions$) {
          return completions$.pipe(
            operators_1.takeWhile(function (_, i) {
              return i < 3;
            })
          );
        })
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1.expect(subscription.closed).to.be.true;
    chai_1
      .expect(results)
      .to.deep.equal([
        1,
        2,
        'finalizer',
        1,
        2,
        'finalizer',
        1,
        2,
        'finalizer',
        1,
        2,
        'complete',
        'finalizer',
      ]);
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
        operators_1.repeatWhen(function () {
          return rxjs_1.of(0);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=repeatWhen-spec.js.map
