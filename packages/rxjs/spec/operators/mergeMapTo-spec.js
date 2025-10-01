'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('mergeMapTo', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    x-x-x|            ');
      var xsubs = [
        '               --^----!            ',
        '               --------^----!      ',
        '               -----------^----!   ',
      ];
      var e1 = hot('  --1-----3--5-------|');
      var e1subs = '  ^------------------!';
      var expected = '--x-x-x-x-xxxx-x---|';
      var result = e1.pipe(operators_1.mergeMapTo(x));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.mergeMapTo(rxjs_1.of(4, 5, 6), function (a, b, i, ii) {
          return [a, b, i, ii];
        })
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([
            [1, 4, 0, 0],
            [1, 5, 0, 1],
            [1, 6, 0, 2],
            [2, 4, 1, 0],
            [2, 5, 1, 1],
            [2, 6, 1, 2],
            [3, 4, 2, 0],
            [3, 5, 2, 1],
            [3, 6, 2, 2],
          ]);
        },
      });
  });
  it('should support a void resultSelector (still deprecated)', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(operators_1.mergeMapTo(rxjs_1.of(4, 5, 6), void 0))
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([4, 5, 6, 4, 5, 6, 4, 5, 6]);
        },
      });
  });
  it('should mergeMapTo many regular interval inners', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('  ----1---2---3---(4|)                        ');
      var xsubs = [
        '               ^---------------!                           ',
        '               ----^---------------!                       ',
        '               ----------------^---------------!           ',
        '               ------------------------^---------------!   ',
      ];
      var e1 = hot('  a---b-----------c-------d-------|           ');
      var e1subs = '  ^-------------------------------!           ';
      var expected = '----1---(21)(32)(43)(41)2---(31)(42)3---(4|)';
      var result = e1.pipe(operators_1.mergeMapTo(x));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map values to constant resolved promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var results = [];
    source
      .pipe(operators_1.mergeMapTo(rxjs_1.from(Promise.resolve(42))))
      .subscribe({
        next: function (x) {
          results.push(x);
        },
        error: function () {
          done(
            new Error('Subscriber error handler not supposed to be called.')
          );
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
          done();
        },
      });
  });
  it('should map values to constant rejected promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    source
      .pipe(operators_1.mergeMapTo(rxjs_1.from(Promise.reject(42))))
      .subscribe({
        next: function () {
          done(new Error('Subscriber next handler not supposed to be called.'));
        },
        error: function (err) {
          chai_1.expect(err).to.equal(42);
          done();
        },
        complete: function () {
          done(
            new Error('Subscriber complete handler not supposed to be called.')
          );
        },
      });
  });
  it('should mergeMapTo many outer values to many inner values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                        ');
      var xsubs = [
        '               -^-------------------!                        ',
        '               ---------^-------------------!                ',
        '               -----------------^-------------------!        ',
        '               -------------------------^-------------------!',
      ];
      var e1 = hot('  -a-------b-------c-------d-------|            ');
      var e1subs = '  ^--------------------------------!            ';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l---|';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, complete late', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                            ');
      var xsubs = [
        '               -^-------------------!                            ',
        '               ---------^-------------------!                    ',
        '               -----------------^-------------------!            ',
        '               -------------------------^-------------------!    ',
      ];
      var e1 = hot('  -a-------b-------c-------d-----------------------|');
      var e1subs = '  ^------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-------|';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, outer never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                  '
      );
      var xsubs = [
        '               -^-------------------!                                  ',
        '               ---------^-------------------!                          ',
        '               -----------------^-------------------!                  ',
        '               -------------------------^-------------------!          ',
        '               ---------------------------------^-------------------!  ',
        '               -------------------------------------------------^-----!',
      ];
      var e1 = hot(
        '  -a-------b-------c-------d-------e---------------f------'
      );
      var e1subs = '  ^------------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i-';
      var unsub = '   -------------------------------------------------------!';
      var result = e1.pipe(operators_1.mergeMapTo(x));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                  '
      );
      var xsubs = [
        '               -^-------------------!                                  ',
        '               ---------^-------------------!                          ',
        '               -----------------^-------------------!                  ',
        '               -------------------------^-------------------!          ',
        '               ---------------------------------^-------------------!  ',
        '               -------------------------------------------------^-----!',
      ];
      var e1 = hot(
        '  -a-------b-------c-------d-------e---------------f------'
      );
      var e1subs = '  ^------------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i-';
      var unsub = '   -------------------------------------------------------!';
      var result = e1.pipe(
        operators_1.map(function (x) {
          return x;
        }),
        operators_1.mergeMapTo(x),
        operators_1.map(function (x) {
          return x;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, inner never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l-                        ');
      var xsubs = [
        '               -^-----------------------------------------',
        '               ---------^---------------------------------',
        '               -----------------^-------------------------',
        '               -------------------------^-----------------',
      ];
      var e1 = hot('  -a-------b-------c-------d-------|         ');
      var e1subs = '  ^--------------------------------!         ';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, and inner throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l-------#        ');
      var xsubs = [
        '               -^-----------------------!        ',
        '               ---------^---------------!        ',
        '               -----------------^-------!        ',
        '               -------------------------(^!)     ',
      ];
      var e1 = hot('  -a-------b-------c-------d-------|');
      var e1subs = '  ^------------------------!        ';
      var expected = '-----i---j---(ki)(lj)(ki)#        ';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, and outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|            ');
      var xsubs = [
        '               -^-------------------!            ',
        '               ---------^-------------------!    ',
        '               -----------------^---------------!',
        '               -------------------------^-------!',
      ];
      var e1 = hot('  -a-------b-------c-------d-------#');
      var e1subs = '  ^--------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)#';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to many inner, both inner and outer throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---#            ');
      var xsubs = [
        '               -^-------------------!            ',
        '               ---------^-----------!            ',
        '               -----------------^---!            ',
      ];
      var e1 = hot('  -a-------b-------c-------d-------#');
      var e1subs = '  ^--------------------!            ';
      var expected = '-----i---j---(ki)(lj)#            ';
      expectObservable(e1.pipe(operators_1.mergeMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many cold Observable, with parameter concurrency=1, without resultSelector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                        '
      );
      var xsubs = [
        '               -^-------------------!                                        ',
        '               ---------------------^-------------------!                    ',
        '               -----------------------------------------^-------------------!',
      ];
      var e1 = hot(
        '  -a-------b-------c---|                                        '
      );
      var e1subs =
        '  ^--------------------!                                        ';
      var expected =
        '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
      var result = e1.pipe(operators_1.mergeMapTo(x, 1));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo to many cold Observable, with parameter concurrency=2, without resultSelector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                    ');
      var xsubs = [
        '               -^-------------------!                    ',
        '               ---------^-------------------!            ',
        '               ---------------------^-------------------!',
      ];
      var e1 = hot('  -a-------b-------c---|                    ');
      var e1subs = '  ^--------------------!                    ';
      var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
      var result = e1.pipe(operators_1.mergeMapTo(x, 2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to arrays', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^-------------------------------!';
      var expected = '(0123)(0123)---(0123)---(0123)--|';
      var result = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to inner arrays, and outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------#');
      var e1subs = '  ^-------------------------------!';
      var expected = '(0123)(0123)---(0123)---(0123)--#';
      var result = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMapTo many outer to inner arrays, outer gets unsubscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^------------!                   ';
      var expected = '(0123)(0123)--                   ';
      var unsub = '   -------------!                   ';
      var result = e1.pipe(operators_1.mergeMapTo(['0', '1', '2', '3']));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and flatten', function () {
    var source = rxjs_1
      .of(1, 2, 3, 4)
      .pipe(operators_1.mergeMapTo(rxjs_1.of('!')));
    var expected = ['!', '!', '!', '!'];
    var completed = false;
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        completed = true;
      },
    });
    chai_1.expect(completed).to.be.true;
  });
  it('should map and flatten an Array', function () {
    var source = rxjs_1.of(1, 2, 3, 4).pipe(operators_1.mergeMapTo(['!']));
    var expected = ['!', '!', '!', '!'];
    var completed = false;
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        completed = true;
      },
    });
    chai_1.expect(completed).to.be.true;
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
      .pipe(operators_1.mergeMapTo(rxjs_1.of(0)), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=mergeMapTo-spec.js.map
