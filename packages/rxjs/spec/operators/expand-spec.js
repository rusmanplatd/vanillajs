'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('expand', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should recursively map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --x----|  ', { x: 1 });
      var e1subs = '  ^------!  ';
      var e2 = cold('   --c|    ', { c: 2 });
      var expected = '--a-b-c-d|';
      var values = { a: 1, b: 2, c: 4, d: 8 };
      var result = e1.pipe(
        operators_1.expand(function (x) {
          return x === 8
            ? rxjs_1.EMPTY
            : e2.pipe(
                operators_1.map(function (c) {
                  return c * x;
                })
              );
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with scheduler', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --x----|  ', { x: 1 });
      var e1subs = '  ^------!  ';
      var e2 = cold('   --c|    ', { c: 2 });
      var expected = '--a-b-c-d|';
      var values = { a: 1, b: 2, c: 4, d: 8 };
      var result = e1.pipe(
        operators_1.expand(
          function (x) {
            return x === 8
              ? rxjs_1.EMPTY
              : e2.pipe(
                  operators_1.map(function (c) {
                    return c * x;
                  })
                );
          },
          Infinity,
          testScheduler
        )
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and recursively flatten', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)            ', values);
      var e1subs = '  (^!)            ';
      var e2shape = ' ---(z|)         ';
      var expected = 'a--b--c--d--(e|)';
      var result = e1.pipe(
        operators_1.expand(function (x, index) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          } else {
            return cold(e2shape, { z: x + x });
          }
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and recursively flatten, and handle event raised error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)         ', values);
      var e1subs = '  (^!)         ';
      var e2shape = ' ---(z|)      ';
      var expected = 'a--b--c--(d#)';
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 8) {
            return cold('#');
          }
          return cold(e2shape, { z: x + x });
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and recursively flatten, and propagate error thrown from projection', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)         ', values);
      var e1subs = '  (^!)         ';
      var e2shape = ' ---(z|)      ';
      var expected = 'a--b--c--(d#)';
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 8) {
            throw 'error';
          }
          return cold(e2shape, { z: x + x });
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)    ', values);
      var unsub = '   -------!';
      var e1subs = '  (^!)    ';
      var e2shape = ' ---(z|) ';
      var expected = 'a--b--c-';
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)    ', values);
      var e1subs = '  (^!)    ';
      var e2shape = ' ---(z|) ';
      var expected = 'a--b--c-';
      var unsub = '   -------!';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow concurrent expansions', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  a-a|              ', values);
      var e1subs = '  ^--!              ';
      var e2shape = ' ---(z|)           ';
      var expected = 'a-ab-bc-cd-de-(e|)';
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow configuring the concurrency limit parameter to 1', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
        u: 10,
        v: 20,
        x: 40,
        y: 80,
        z: 160,
      };
      var e1 = hot('  a-u|                         ', values);
      var e1subs = '  ^--!                         ';
      var e2shape = ' ---(z|)                      ';
      var expected = 'a--u--b--v--c--x--d--y--(ez|)';
      var concurrencyLimit = 1;
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 16 || x === 160) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        }, concurrencyLimit)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow configuring the concurrency limit parameter to 2', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        u: 10,
        v: 20,
        x: 40,
      };
      var e1 = hot('  a---au|                   ', values);
      var e1subs = '  ^-----!                   ';
      var e2shape = ' ------(z|)                ';
      var expected = 'a---a-u---b-b---v-(cc)(x|)';
      var concurrencyLimit = 2;
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 4 || x === 40) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        }, concurrencyLimit)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should ignore concurrency limit if it is not passed', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
        u: 10,
        v: 20,
        x: 40,
        y: 80,
        z: 160,
      };
      var e1 = hot('  a-u|              ', values);
      var e1subs = '  ^--!              ';
      var e2shape = ' ---(z|)           ';
      var expected = 'a-ub-vc-xd-ye-(z|)';
      var concurrencyLimit = 100;
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 16 || x === 160) {
            return rxjs_1.EMPTY;
          }
          return cold(e2shape, { z: x + x });
        }, concurrencyLimit)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and recursively flatten with scalars', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)    ', values);
      var e1subs = '  (^!)    ';
      var expected = '(abcde|)';
      var result = e1.pipe(
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return rxjs_1.of(x + x);
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should recursively flatten promises', function (done) {
    var expected = [1, 2, 4, 8, 16];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return Promise.resolve(x + x);
        })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        complete: function () {
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
      });
  });
  it('should recursively flatten Arrays', function (done) {
    var expected = [1, 2, 4, 8, 16];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.expand(function (x) {
          if (x === 16) {
            return rxjs_1.EMPTY;
          }
          return [x + x];
        })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        complete: function () {
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
      });
  });
  it('should recursively flatten lowercase-o observables', function (done) {
    var expected = [1, 2, 4, 8, 16];
    var project = function (x) {
      var _a;
      if (x === 16) {
        return rxjs_1.EMPTY;
      }
      return (
        (_a = {
          subscribe: function (observer) {
            observer.next(x + x);
            observer.complete();
          },
        }),
        (_a[Symbol.observable] = function () {
          return this;
        }),
        _a
      );
    };
    rxjs_1
      .of(1)
      .pipe(operators_1.expand(project))
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        complete: function () {
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
      });
  });
  it('should work when passing undefined for the optional arguments', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 1 + 1,
        c: 2 + 2,
        d: 4 + 4,
        e: 8 + 8,
      };
      var e1 = hot('  (a|)            ', values);
      var e1subs = '  (^!)            ';
      var e2shape = ' ---(z|)         ';
      var expected = 'a--b--c--d--(e|)';
      var project = function (x, index) {
        if (x === 16) {
          return rxjs_1.EMPTY;
        }
        return cold(e2shape, { z: x + x });
      };
      var result = e1.pipe(operators_1.expand(project, undefined, undefined));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with the AsapScheduler', function (done) {
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    rxjs_1
      .of(0)
      .pipe(
        operators_1.expand(
          function (x) {
            return rxjs_1.of(x + 1);
          },
          Infinity,
          rxjs_1.asapScheduler
        ),
        operators_1.take(10),
        operators_1.toArray()
      )
      .subscribe({
        next: function (actual) {
          return chai_1.expect(actual).to.deep.equal(expected);
        },
        error: done,
        complete: done,
      });
  });
  it('should work with the AsyncScheduler', function (done) {
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    rxjs_1
      .of(0)
      .pipe(
        operators_1.expand(
          function (x) {
            return rxjs_1.of(x + 1);
          },
          Infinity,
          rxjs_1.asyncScheduler
        ),
        operators_1.take(10),
        operators_1.toArray()
      )
      .subscribe({
        next: function (actual) {
          return chai_1.expect(actual).to.deep.equal(expected);
        },
        error: done,
        complete: done,
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
      .pipe(
        operators_1.expand(function () {
          return rxjs_1.EMPTY;
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=expand-spec.js.map
