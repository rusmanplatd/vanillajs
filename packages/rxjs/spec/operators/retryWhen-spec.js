'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('retryWhen', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should handle a source with eventual error using a hot notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--#                     ');
      var subs = [
        '                   ^------!                     ',
        '                   -------------^------!        ',
        '                   --------------------------^-!',
      ];
      var notifier = hot('-------------r------------r-|');
      var expected = '    -1--2---------1--2---------1|';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a source with eventual error using a hot notifier that raises error', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--#                      ');
      var subs = [
        '                   ^------!                      ',
        '                   -----------^------!           ',
        '                   -------------------^------!   ',
      ];
      var notifier = hot('-----------r-------r---------#');
      var expected = '    -1--2-------1--2----1--2-----#';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should retry when notified via returned notifier on thrown error', function (done) {
    var retried = false;
    var expected = [1, 2, 1, 2];
    var i = 0;
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.map(function (n) {
          if (n === 3) {
            throw 'bad';
          }
          return n;
        }),
        operators_1.retryWhen(function (errors) {
          return errors.pipe(
            operators_1.map(function (x) {
              chai_1.expect(x).to.equal('bad');
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
  });
  it('should retry when notified and complete on returned completion', function (done) {
    var expected = [1, 2, 1, 2];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.map(function (n) {
          if (n === 3) {
            throw 'bad';
          }
          return n;
        }),
        operators_1.retryWhen(function () {
          return rxjs_1.EMPTY;
        })
      )
      .subscribe({
        next: function (n) {
          chai_1.expect(n).to.equal(expected.shift());
        },
        error: function () {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should apply an empty notifier on an empty source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |   ');
      var subs = '         (^!)';
      var notifier = cold('|   ');
      var expected = '     |   ';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply a never notifier on an empty source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |   ');
      var subs = '         (^!)';
      var notifier = cold('-   ');
      var expected = '     |   ';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply an empty notifier on a never source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  ------------------------------------------');
      var unsub = '        -----------------------------------------!';
      var subs = '         ^----------------------------------------!';
      var notifier = cold('|                                         ');
      var expected = '     ------------------------------------------';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should apply a never notifier on a never source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  -----------------------------------------');
      var unsub = '        -----------------------------------------!';
      var subs = '         ^----------------------------------------!';
      var notifier = cold('------------------------------------------');
      var expected = '     -----------------------------------------';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should return an empty observable given a just-throw source and empty notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var source = cold('  #');
      var notifier = cold('|');
      var expected = '     |';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should return a never observable given a just-throw source and never notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var source = cold('  #');
      var notifier = cold('-');
      var expected = '     -';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should hide errors using a never notifier on a source with eventual error', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--#                              ');
      var subs = '         ^----------!                              ';
      var notifier = cold('           -------------------------------');
      var expected = '     --a--b--c---------------------------------';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should propagate error thrown from notifierSelector function', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--a--b--c--#');
      var subs = '       ^----------!';
      var expected = '   --a--b--c--#';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          throw 'bad!';
        })
      );
      expectObservable(result).toBe(expected, undefined, 'bad!');
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should replace error with complete using an empty notifier on a source with eventual error', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--#');
      var subs = '         ^----------!';
      var notifier = cold('           |');
      var expected = '     --a--b--c--|';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic cold source with complete, given an empty notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c--|');
      var subs = '         ^----------!';
      var notifier = cold('           |');
      var expected = '     --a--b--c--|';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic cold source with no termination, given an empty notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  --a--b--c---');
      var subs = '         ^-----------';
      var notifier = cold('           |');
      var expected = '     --a--b--c---';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should mirror a basic hot source with complete, given an empty notifier', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-a-^--b--c--|');
      var subs = '         ^--------!';
      var notifier = cold('         |');
      var expected = '     ---b--c--|';
      var result = source.pipe(
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a hot source that raises error but eventually completes', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -1--2--3----4--5---|                  ');
      var ssubs = [
        '                   ^------!                              ',
        '                   --------------^----!                  ',
      ];
      var notifier = hot('--------------r--------r---r--r--r---|');
      var nsubs = '       -------^-----------!                  ';
      var expected = '    -1--2----------5---|                  ';
      var result = source.pipe(
        operators_1.map(function (x) {
          if (x === '3') {
            throw 'error';
          }
          return x;
        }),
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(ssubs);
      expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
  });
  it('should tear down resources when result is unsubscribed early', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--#                    ');
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
        operators_1.retryWhen(function () {
          return notifier;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(notifier.subscriptions).toBe(nsubs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold(' -1--2--#                    ');
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
        operators_1.retryWhen(function () {
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
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-1--2--#              ');
      var subs = [
        '                  ^------!              ',
        '                  -------^------!       ',
        '                  --------------^------!',
      ];
      var expected = '   -1--2---1--2---1--2--#';
      var invoked = 0;
      var result = source.pipe(
        operators_1.retryWhen(function (errors) {
          return errors.pipe(
            operators_1.map(function () {
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
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-1--2--#              ');
      var subs = [
        '                  ^------!              ',
        '                  -------^------!       ',
        '                  --------------^------!',
      ];
      var expected = '   -1--2---1--2---1--2--|';
      var invoked = 0;
      var result = source.pipe(
        operators_1.retryWhen(function (errors) {
          return errors.pipe(
            operators_1.map(function () {
              return 'x';
            }),
            operators_1.takeUntil(
              errors.pipe(
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
      subscriber.error('bad');
      return function () {
        results.push('finalizer');
      };
    });
    var subscription = source
      .pipe(
        operators_1.retryWhen(function (errors$) {
          return errors$.pipe(
            operators_1.mergeMap(function (err, i) {
              return i < 3
                ? rxjs_1.of(true)
                : rxjs_1.throwError(function () {
                    return err;
                  });
            })
          );
        })
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        error: function (err) {
          return results.push(err);
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
        'bad',
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
        operators_1.retryWhen(function () {
          return rxjs_1.of(0);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=retryWhen-spec.js.map
