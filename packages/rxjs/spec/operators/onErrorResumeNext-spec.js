'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var interop_helper_1 = require('../helpers/interop-helper');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('onErrorResumeNext', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should continue observable sequence with next observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#        ');
      var e1subs = '  ^-------!        ';
      var e2 = cold('         --c--d--|');
      var e2subs = '  --------^-------!';
      var expected = '--a--b----c--d--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should continue with hot observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#        ');
      var e1subs = '  ^-------!        ';
      var e2 = hot('  -----x----c--d--|');
      var e2subs = '  --------^-------!';
      var expected = '--a--b----c--d--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should continue with array of multiple observables that throw errors', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#                     ');
      var e1subs = '  ^-------!                     ';
      var e2 = [
        cold('                  --c--d--#             '),
        cold('                          --e--#        '),
        cold('                               --f--g--|'),
      ];
      var e2subs = [
        '               --------^-------!',
        '               ----------------^----!',
        '               ---------------------^-------!',
      ];
      var expected = '--a--b----c--d----e----f--g--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2[0].subscriptions).toBe(e2subs[0]);
      expectSubscriptions(e2[1].subscriptions).toBe(e2subs[1]);
      expectSubscriptions(e2[2].subscriptions).toBe(e2subs[2]);
    });
  });
  it('should continue with multiple observables that throw errors', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#                     ');
      var e1subs = '  ^-------!                     ';
      var e2 = cold('         --c--d--#             ');
      var e2subs = '  --------^-------!             ';
      var e3 = cold('                 --e--#        ');
      var e3subs = '  ----------------^----!        ';
      var e4 = cold('                      --f--g--|');
      var e4subs = '  ---------------------^-------!';
      var expected = '--a--b----c--d----e----f--g--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2, e3, e4))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
      expectSubscriptions(e4.subscriptions).toBe(e4subs);
    });
  });
  it("should continue with multiple observables that don't throw error", function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|                     ');
      var e1subs = '  ^-------!                     ';
      var e2 = cold('         --c--d--|             ');
      var e2subs = '  --------^-------!             ';
      var e3 = cold('                 --e--|        ');
      var e3subs = '  ----------------^----!        ';
      var e4 = cold('                      --f--g--|');
      var e4subs = '  ---------------------^-------!';
      var expected = '--a--b----c--d----e----f--g--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2, e3, e4))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
      expectSubscriptions(e4.subscriptions).toBe(e4subs);
    });
  });
  it('should continue after empty observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  |                     ');
      var e1subs = '  (^!)                  ';
      var e2 = cold(' --c--d--|             ');
      var e2subs = '  ^-------!             ';
      var e3 = cold('         --e--#        ');
      var e3subs = '  --------^----!        ';
      var e4 = cold('              --f--g--|');
      var e4subs = '  -------------^-------!';
      var expected = '--c--d----e----f--g--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2, e3, e4))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
      expectSubscriptions(e4.subscriptions).toBe(e4subs);
    });
  });
  it('should not complete with observable that does not complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--| ');
      var e1subs = '  ^-------! ';
      var e2 = cold('         --');
      var e2subs = '  --------^-';
      var expected = '--a--b----';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not continue when source observable does not complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--');
      var e1subs = '  ^----';
      var e2 = cold('-b--c-');
      var e2subs = [];
      var expected = '--a--';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should complete observable when next observable throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#        ');
      var e1subs = '  ^-------!        ';
      var e2 = cold('         --c--d--#');
      var e2subs = '  --------^-------!';
      var expected = '--a--b----c--d--|';
      expectObservable(e1.pipe(operators_1.onErrorResumeNext(e2))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
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
    rxjs_1
      .throwError(function () {
        return new Error('Some error');
      })
      .pipe(
        operators_1.onErrorResumeNext(synchronousObservable),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should unsubscribe from an interop observable upon explicit unsubscription', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#       ');
      var e1subs = '  ^-------!       ';
      var e2 = cold('         --c--d--');
      var e2subs = '  --------^---!   ';
      var unsub = '   ------------!   ';
      var expected = '--a--b----c--   ';
      expectObservable(
        e1.pipe(
          operators_1.onErrorResumeNext(
            interop_helper_1.asInteropObservable(e2)
          )
        ),
        unsub
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with promise', function (done) {
    var expected = [1, 2];
    var source = rxjs_1.concat(
      rxjs_1.of(1),
      rxjs_1.throwError(function () {
        return 'meh';
      })
    );
    source.pipe(operators_1.onErrorResumeNext(Promise.resolve(2))).subscribe({
      next: function (x) {
        chai_1.expect(expected.shift()).to.equal(x);
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(expected).to.be.empty;
        done();
      },
    });
  });
  it('should skip invalid sources and move on', function () {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.onErrorResumeNext(
          [2, 3, 4],
          { notValid: 'LOL' },
          rxjs_1.of(5, 6)
        )
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1.expect(results).to.deep.equal([1, 2, 3, 4, 5, 6, 'complete']);
  });
  it('should call finalize after each sync observable', function () {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.finalize(function () {
          return results.push('finalize 1');
        }),
        operators_1.onErrorResumeNext(
          rxjs_1.of(2).pipe(
            operators_1.finalize(function () {
              return results.push('finalize 2');
            })
          ),
          rxjs_1.of(3).pipe(
            operators_1.finalize(function () {
              return results.push('finalize 3');
            })
          ),
          rxjs_1.of(4).pipe(
            operators_1.finalize(function () {
              return results.push('finalize 4');
            })
          )
        )
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1
      .expect(results)
      .to.deep.equal([
        1,
        'finalize 1',
        2,
        'finalize 2',
        3,
        'finalize 3',
        4,
        'finalize 4',
        'complete',
      ]);
  });
  it('should not subscribe to the next source until after the previous is finalized.', function () {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.tap({
          subscribe: function () {
            return results.push('subscribe 1');
          },
          finalize: function () {
            return results.push('finalize 1');
          },
        }),
        operators_1.onErrorResumeNext(
          rxjs_1.of(2).pipe(
            operators_1.tap({
              subscribe: function () {
                return results.push('subscribe 2');
              },
              finalize: function () {
                return results.push('finalize 2');
              },
            })
          ),
          rxjs_1.of(3).pipe(
            operators_1.tap({
              subscribe: function () {
                return results.push('subscribe 3');
              },
              finalize: function () {
                return results.push('finalize 3');
              },
            })
          ),
          rxjs_1.of(4).pipe(
            operators_1.tap({
              subscribe: function () {
                return results.push('subscribe 4');
              },
              finalize: function () {
                return results.push('finalize 4');
              },
            })
          )
        )
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1
      .expect(results)
      .to.deep.equal([
        'subscribe 1',
        1,
        'finalize 1',
        'subscribe 2',
        2,
        'finalize 2',
        'subscribe 3',
        3,
        'finalize 3',
        'subscribe 4',
        4,
        'finalize 4',
        'complete',
      ]);
  });
});
//# sourceMappingURL=onErrorResumeNext-spec.js.map
