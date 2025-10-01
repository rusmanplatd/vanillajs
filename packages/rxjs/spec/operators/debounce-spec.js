'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('debounce', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  /**
   *
   * @param x
   */
  function getTimerSelector(x) {
    return function () {
      return rxjs_1.timer(x, testScheduler);
    };
  }
  it('should debounce values by a specified cold Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a----bc----d-ef----|');
      var e1subs = '  ^-------------------!';
      var e2 = cold('  ---x                ');
      var e2subs = [
        '               -^--!                ',
        '               ------^!             ',
        '               -------^--!          ',
        '               ------------^-!      ',
        '               --------------^!     ',
        '               ---------------^--!  ',
      ];
      var expected = '----a-----c-------f-|';
      var result = e1.pipe(
        operators_1.debounce(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should delay all element by selector observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d---------|');
      var e1subs = '  ^--------------------!';
      var expected = '----a--b--c--d-------|';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce by selector observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^-------------!';
      var expected = '----a---c--d--|';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support a scalar selector observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^-------------!';
      var expected = '--a--bc--d----|';
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return rxjs_1.of(0);
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----|');
      var e1subs = '  ^----!';
      var expected = '-----|';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '|';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source does not emit and raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----#');
      var e1subs = '  ^----!';
      var expected = '-----#';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^------!       ';
      var expected = '----a---       ';
      var unsub = '   -------!       ';
      var result = e1.pipe(operators_1.debounce(getTimerSelector(2)));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^------!       ';
      var expected = '----a---       ';
      var unsub = '   -------!       ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.debounce(getTimerSelector(2)),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce and does not complete when source does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d---');
      var e1subs = '  ^            ';
      var expected = '----a---c--d-';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not completes when source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay all element until source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d---------#');
      var e1subs = '  ^--------------------!';
      var expected = '----a--b--c--d-------#';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(2)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce all elements while source emits by selector observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---b---c---d---e|');
      var e1subs = '  ^-------------------!';
      var expected = '--------------------(e|)';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(4)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce all element while source emits by selector observable until raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d-#');
      var e1subs = '  ^------------!';
      var expected = '-------------#';
      expectObservable(e1.pipe(operators_1.debounce(getTimerSelector(5)))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay element by same selector observable emits multiple', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('       ----a--b--c----d-----e-------|');
      var e1subs = '       ^----------------------------!';
      var expected = '     ------a--b--c----d-----e-----|';
      var selector = cold('--x-y-');
      var selectorSubs = [
        '                    ----^-!                      ',
        '                    -------^-!                   ',
        '                    ----------^-!                ',
        '                    ---------------^-!           ',
        '                    ---------------------^-!     ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector;
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should debounce by selector observable emits multiple', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--b--c----d-----e-------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------a-----c----------e-----|';
      var selector = [
        cold('              --x-y-                    '),
        cold('                 ----x-y-               '),
        cold('                    --x-y-              '),
        cold('                         ------x-y-     '),
        cold('                               --x-y-   '),
      ];
      var selectorSubs = [
        '               ----^-!                       ',
        '               -------^--!                   ',
        '               ----------^-!                 ',
        '               ---------------^-----!        ',
        '               ---------------------^-!      ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should debounce by selector observable until source completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--b--c----d----e|    ');
      var e1subs = '  ^--------------------!    ';
      var expected = '------a-----c--------(e|) ';
      var selector = [
        cold('              --x-y-                '),
        cold('                 ----x-y-           '),
        cold('                    --x-y-          '),
        cold('                         ------x-y- '),
        cold('                              --x-y-'),
      ];
      var selectorSubs = [
        '               ----^-!                   ',
        '               -------^--!               ',
        '               ----------^-!             ',
        '               ---------------^----!     ',
        '               --------------------^!    ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should raise error when selector observable raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a--------b--------c---------|');
      var e1subs = '  ^----------------------------!       ';
      var expected = '---------a---------b---------#       ';
      var selector = [
        cold('                  -x-y-                        '),
        cold('                           --x-y-              '),
        cold('                                    ---#       '),
      ];
      var selectorSubs = [
        '               --------^!                           ',
        '               -----------------^-!                 ',
        '               --------------------------^--!       ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should raise error when source raises error with selector observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a--------b--------c---------d#      ');
      var e1subs = '  ^------------------------------------!      ';
      var expected = '---------a---------b---------c-------#      ';
      var selector = [
        cold('                  -x-y-                               '),
        cold('                           --x-y-                     '),
        cold('                                    ---x-y-           '),
        cold('                                              ----x-y-'),
      ];
      var selectorSubs = [
        '               --------^!                                  ',
        '               -----------------^-!                        ',
        '               --------------------------^--!              ',
        '               ------------------------------------^!      ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should raise error when selector function throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a--------b--------c---------|');
      var e1subs = '  ^-------------------------!          ';
      var expected = '---------a---------b------#          ';
      var selector = [
        cold('                  -x-y-                        '),
        cold('                           --x-y-              '),
      ];
      var selectorSubs = [
        '               --------^!                           ',
        '               -----------------^-!                 ',
      ];
      /**
       *
       * @param x
       */
      function selectorFunction(x) {
        if (x !== 'c') {
          return selector.shift();
        } else {
          throw 'error';
        }
      }
      expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should ignore all values except last, when given an empty selector Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a-x-yz---bxy---z--c--x--y--z|   ');
      var e1subs = '  ^-----------------------------------!   ';
      var expected = '------------------------------------(z|)';
      /**
       *
       * @param x
       */
      function selectorFunction(x) {
        return rxjs_1.EMPTY;
      }
      expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should ignore all values except last, when given a never selector Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a-x-yz---bxy---z--c--x--y--z|  ');
      var e1subs = '  ^-----------------------------------!  ';
      var expected = '------------------------------------(z|)';
      /**
       *
       */
      function selectorFunction() {
        return rxjs_1.NEVER;
      }
      expectObservable(e1.pipe(operators_1.debounce(selectorFunction))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not delay by selector observable completes when it does not emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------a--------b--------c---------|   ');
      var e1subs = '  ^-----------------------------------!   ';
      var expected = '------------------------------------(c|)';
      var selector = [
        cold('                  -|                              '),
        cold('                           --|                    '),
        cold('                                    ---|          '),
      ];
      var selectorSubs = [
        '               --------^!                              ',
        '               -----------------^-!                    ',
        '               --------------------------^--!          ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should not debounce by selector observable completes when it does not emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----a--b-c---------de-------------|   ');
      var e1subs = '  ^---------------------------------!   ';
      var expected = '----------------------------------(e|)';
      var selector = [
        cold('              -|                                '),
        cold('                 --|                            '),
        cold('                   ---|                         '),
        cold('                             ----|              '),
        cold('                              -----|            '),
      ];
      var selectorSubs = [
        '               ----^!                                ',
        '               -------^-!                            ',
        '               ---------^--!                         ',
        '               -------------------^!                 ',
        '               --------------------^----!            ',
      ];
      expectObservable(
        e1.pipe(
          operators_1.debounce(function () {
            return selector.shift();
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var i = 0; i < selectorSubs.length; i++) {
        expectSubscriptions(selector[i].subscriptions).toBe(selectorSubs[i]);
      }
    });
  });
  it('should delay by promise resolves', function (done) {
    var e1 = rxjs_1.concat(
      rxjs_1.of(1),
      rxjs_1.timer(10).pipe(operators_1.mapTo(2)),
      rxjs_1.timer(10).pipe(operators_1.mapTo(3)),
      rxjs_1.timer(100).pipe(operators_1.mapTo(4))
    );
    var expected = [1, 2, 3, 4];
    e1.pipe(
      operators_1.debounce(function () {
        return new Promise(function (resolve) {
          resolve(42);
        });
      })
    ).subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        done();
      },
    });
  });
  it('should raises error when promise rejects', function (done) {
    var e1 = rxjs_1.concat(
      rxjs_1.of(1),
      rxjs_1.timer(10).pipe(operators_1.mapTo(2)),
      rxjs_1.timer(10).pipe(operators_1.mapTo(3)),
      rxjs_1.timer(100).pipe(operators_1.mapTo(4))
    );
    var expected = [1, 2];
    var error = new Error('error');
    e1.pipe(
      operators_1.debounce(function (x) {
        if (x === 3) {
          return new Promise(function (resolve, reject) {
            reject(error);
          });
        } else {
          return new Promise(function (resolve) {
            resolve(42);
          });
        }
      })
    ).subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (err) {
        chai_1.expect(err).to.be.an('error', 'error');
        chai_1.expect(expected.length).to.equal(0);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
  it('should debounce correctly when synchronously reentered', function () {
    var results = [];
    var source = new rxjs_1.Subject();
    source
      .pipe(
        operators_1.debounce(function () {
          return rxjs_1.of(null);
        })
      )
      .subscribe(function (value) {
        results.push(value);
        if (value === 1) {
          source.next(2);
        }
      });
    source.next(1);
    chai_1.expect(results).to.deep.equal([1, 2]);
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
        operators_1.debounce(function () {
          return rxjs_1.of(0);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=debounce-spec.js.map
