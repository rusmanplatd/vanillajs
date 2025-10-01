'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('retry', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should handle a basic source that emits next then errors, count=3', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2-3-#');
      var subs = [
        '                  ^-------!                ',
        '                  --------^-------!        ',
        '                  ----------------^-------!',
      ];
      var expected = '   --1-2-3---1-2-3---1-2-3-#';
      var result = source.pipe(operators_1.retry(2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should retry a number of times, without error, then complete', function (done) {
    var errors = 0;
    var retries = 2;
    new rxjs_1.Observable(function (observer) {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        operators_1.map(function (x) {
          if (++errors < retries) {
            throw 'bad';
          }
          errors = 0;
          return x;
        }),
        operators_1.retry(retries)
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(42);
        },
        error: function () {
          chai_1.expect('this was called').to.be.true;
        },
        complete: done,
      });
  });
  it('should retry a number of times, then call error handler', function (done) {
    var errors = 0;
    var retries = 2;
    new rxjs_1.Observable(function (observer) {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        operators_1.map(function () {
          errors += 1;
          throw 'bad';
        }),
        operators_1.retry(retries - 1)
      )
      .subscribe({
        next: function () {
          done("shouldn't next");
        },
        error: function () {
          chai_1.expect(errors).to.equal(2);
          done();
        },
        complete: function () {
          done("shouldn't complete");
        },
      });
  });
  it('should retry a number of times, then call error handler (with resetOnSuccess)', function (done) {
    var errors = 0;
    var retries = 2;
    new rxjs_1.Observable(function (observer) {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        operators_1.map(function () {
          errors += 1;
          throw 'bad';
        }),
        operators_1.retry({ count: retries - 1, resetOnSuccess: true })
      )
      .subscribe({
        next: function () {
          done("shouldn't next");
        },
        error: function () {
          chai_1.expect(errors).to.equal(2);
          done();
        },
        complete: function () {
          done("shouldn't complete");
        },
      });
  });
  it('should retry a number of times, then call next handler without error, then retry and complete', function (done) {
    var index = 0;
    var errors = 0;
    var retries = 2;
    rxjs_1
      .defer(function () {
        return rxjs_1.range(0, 4 - index);
      })
      .pipe(
        operators_1.mergeMap(function () {
          index++;
          if (index === 1 || index === 3) {
            errors++;
            return rxjs_1.throwError(function () {
              return 'bad';
            });
          } else {
            return rxjs_1.of(42);
          }
        }),
        operators_1.retry({ count: retries - 1, resetOnSuccess: true })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(42);
        },
        error: function () {
          done("shouldn't error");
        },
        complete: function () {
          chai_1.expect(errors).to.equal(retries);
          done();
        },
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
    var subscription = source.pipe(operators_1.retry(3)).subscribe({
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
  it('should retry a number of times, then call next handler without error, then retry and error', function (done) {
    var index = 0;
    var errors = 0;
    var retries = 2;
    rxjs_1
      .defer(function () {
        return rxjs_1.range(0, 4 - index);
      })
      .pipe(
        operators_1.mergeMap(function () {
          index++;
          if (index === 1 || index === 3) {
            errors++;
            return rxjs_1.throwError(function () {
              return 'bad';
            });
          } else {
            return rxjs_1.of(42);
          }
        }),
        operators_1.retry({ count: retries - 1, resetOnSuccess: false })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(42);
        },
        error: function () {
          chai_1.expect(errors).to.equal(retries);
          done();
        },
        complete: function () {
          done("shouldn't complete");
        },
      });
  });
  it('should retry until successful completion', function (done) {
    var errors = 0;
    var retries = 10;
    new rxjs_1.Observable(function (observer) {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        operators_1.map(function (x) {
          if (++errors < retries) {
            throw 'bad';
          }
          errors = 0;
          return x;
        }),
        operators_1.retry(),
        operators_1.take(retries)
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(42);
        },
        error: function () {
          chai_1.expect('this was called').to.be.true;
        },
        complete: done,
      });
  });
  it('should handle an empty source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('|  ');
      var subs = '      (^!)';
      var expected = '   |  ';
      var result = source.pipe(operators_1.retry());
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a never source', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-');
      var subs = '       ^';
      var expected = '   -';
      var result = source.pipe(operators_1.retry());
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should return a never observable given an async just-throw source and no count', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var source = cold('-#                                    ');
      var unsub = '     -------------------------------------!';
      var expected = '  --------------------------------------';
      var result = source.pipe(operators_1.retry());
      expectObservable(result, unsub).toBe(expected);
    });
  });
  it('should handle a basic source that emits next then completes', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--1--2--^--3--4--5---|');
      var subs = '              ^------------!';
      var expected = '          ---3--4--5---|';
      var result = source.pipe(operators_1.retry());
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a basic source that emits next but does not complete', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--1--2--^--3--4--5---');
      var subs = '              ^------------';
      var expected = '          ---3--4--5---';
      var result = source.pipe(operators_1.retry());
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a basic source that emits next then errors, no count', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2-3-#                             ');
      var unsub = '      -------------------------------------!';
      var subs = [
        '                  ^-------!                             ',
        '                  --------^-------!                     ',
        '                  ----------------^-------!             ',
        '                  ------------------------^-------!     ',
        '                  --------------------------------^----!',
      ];
      var expected = '   --1-2-3---1-2-3---1-2-3---1-2-3---1-2-';
      var result = source.pipe(operators_1.retry());
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle a source which eventually throws, count=3, and result is unsubscribed early', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2-3-#     ');
      var unsub = '      -------------!';
      var subs = [
        '                  ^-------!     ',
        '                  --------^----!',
      ];
      var expected = '   --1-2-3---1-2-';
      var result = source.pipe(operators_1.retry(3));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2-3-#     ');
      var subs = [
        '                  ^-------!     ',
        '                  --------^----!',
      ];
      var expected = '   --1-2-3---1-2-';
      var unsub = '      -------------!';
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.retry(100),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should retry a synchronous source (multicasted and refCounted) multiple times', function (done) {
    var expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.concat(
          rxjs_1.throwError(function () {
            return 'bad!';
          })
        ),
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        }),
        operators_1.refCount(),
        operators_1.retry(4)
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        error: function (err) {
          chai_1.expect(err).to.equal('bad!');
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
        },
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
      .pipe(operators_1.retry(1), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should not alter the source when the number of retries is smaller than 1', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2-3-# ');
      var subs = ['      ^-------! '];
      var expected = '   --1-2-3-# ';
      var unsub = '      ---------!';
      var result = source.pipe(operators_1.retry(0));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  describe('with delay config', function () {
    describe('of a number', function () {
      it('should delay the retry by a specified amount of time', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            time = _a.time,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var t = time('                ----|');
          var subs = [
            '                  ^----------!',
            '                  ---------------^----------!',
            '                  ------------------------------^----------!',
            '                  ---------------------------------------------^----!',
          ];
          var unsub =
            '      ^-------------------------------------------------!';
          var expected =
            '   ---a---b----------a---b----------a---b----------a--';
          var result = source.pipe(
            operators_1.retry({
              delay: t,
            })
          );
          expectObservable(result, unsub).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should act like a normal retry if delay is set to 0', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  -----------^----------!',
            '                  ----------------------^----------!',
            '                  ---------------------------------^----!',
          ];
          var unsub = '      ^-------------------------------------!';
          var expected = '   ---a---b------a---b------a---b------a--';
          var result = source.pipe(
            operators_1.retry({
              delay: 0,
            })
          );
          expectObservable(result, unsub).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should act like a normal retry if delay is less than 0', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  -----------^----------!',
            '                  ----------------------^----------!',
            '                  ---------------------------------^----!',
          ];
          var unsub = '      ^-------------------------------------!';
          var expected = '   ---a---b------a---b------a---b------a--';
          var result = source.pipe(
            operators_1.retry({
              delay: -100,
            })
          );
          expectObservable(result, unsub).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should honor count as the max retries', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            time = _a.time,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var t = time('                ----|');
          var subs = [
            '                  ^----------!',
            '                  ---------------^----------!',
            '                  ------------------------------^----------!',
          ];
          var expected = '   ---a---b----------a---b----------a---b---#';
          var result = source.pipe(
            operators_1.retry({
              count: 2,
              delay: t,
            })
          );
          expectObservable(result).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
    });
    describe('of a function', function () {
      it('should delay the retry with a function that returns a notifier', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  ------------^----------!',
            '                  -------------------------^----------!',
            '                  ---------------------------------------^----!',
          ];
          var unsub = '      ^-------------------------------------------!';
          var expected = '   ---a---b-------a---b--------a---b---------a--';
          var result = source.pipe(
            operators_1.retry({
              delay: function (_err, retryCount) {
                return rxjs_1.timer(retryCount);
              },
            })
          );
          expectObservable(result, unsub).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should delay the retry with a function that returns a hot observable', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold(' ---a---b---#');
          var notifier = hot(
            '--------------x----------------x----------------x------'
          );
          var subs = [
            '                   ^----------!',
            '                   --------------^----------!',
            '                   -------------------------------^----------!',
          ];
          var notifierSubs = [
            '                   -----------^--!',
            '                   -------------------------^-----!',
            '                   ------------------------------------------^-!',
          ];
          var unsub = '       ^-------------------------------------------!';
          var expected = '    ---a---b---------a---b------------a---b------';
          var result = source.pipe(
            operators_1.retry({
              delay: function () {
                return notifier;
              },
            })
          );
          expectObservable(result, unsub).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
          expectSubscriptions(notifier.subscriptions).toBe(notifierSubs);
        });
      });
      it('should complete if the notifier completes', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  ------------^----------!',
            '                  -------------------------^----------!',
            '                  ------------------------------------!',
          ];
          var expected = '   ---a---b-------a---b--------a---b---|';
          var result = source.pipe(
            operators_1.retry({
              delay: function (_err, retryCount) {
                return retryCount <= 2
                  ? rxjs_1.timer(retryCount)
                  : rxjs_1.EMPTY;
              },
            })
          );
          expectObservable(result).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should error if the notifier errors', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  ------------^----------!',
            '                  -------------------------^----------!',
            '                  ------------------------------------!',
          ];
          var expected = '   ---a---b-------a---b--------a---b---#';
          var result = source.pipe(
            operators_1.retry({
              delay: function (_err, retryCount) {
                return retryCount <= 2
                  ? rxjs_1.timer(retryCount)
                  : rxjs_1.throwError(function () {
                      return new Error('blah');
                    });
              },
            })
          );
          expectObservable(result).toBe(expected, undefined, new Error('blah'));
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should error if the delay function throws', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectSubscriptions = _a.expectSubscriptions,
            expectObservable = _a.expectObservable;
          var source = cold('---a---b---#');
          var subs = [
            '                  ^----------!',
            '                  ------------^----------!',
            '                  -------------------------^----------!',
            '                  ------------------------------------!',
          ];
          var expected = '   ---a---b-------a---b--------a---b---#';
          var result = source.pipe(
            operators_1.retry({
              delay: function (_err, retryCount) {
                if (retryCount <= 2) {
                  return rxjs_1.timer(retryCount);
                } else {
                  throw new Error('blah');
                }
              },
            })
          );
          expectObservable(result).toBe(expected, undefined, new Error('blah'));
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
      it('should be usable for exponential backoff', function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var source = cold('---a---#');
          var subs = [
            '                  ^------!',
            '                  ---------^------!',
            '                  --------------------^------!',
            '                  -----------------------------------^------!',
          ];
          var expected = '   ---a--------a----------a--------------a---#';
          var result = source.pipe(
            operators_1.retry({
              count: 3,
              delay: function (_err, retryCount) {
                return rxjs_1.timer(Math.pow(2, retryCount));
              },
            })
          );
          expectObservable(result).toBe(expected);
          expectSubscriptions(source.subscriptions).toBe(subs);
        });
      });
    });
  });
});
//# sourceMappingURL=retry-spec.js.map
