'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('concatMapTo', function () {
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
      var e1 = hot('  --1-----3--5-------|');
      var e1subs = '  ^------------------!';
      var e2 = cold(' x-x-x|              ', { x: 10 });
      var expected = '--x-x-x-x-x-xx-x-x-|';
      var values = { x: 10 };
      var result = e1.pipe(operators_1.concatMapTo(e2));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.concatMapTo(rxjs_1.of(4, 5, 6), function (a, b, i, ii) {
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
      .pipe(operators_1.concatMapTo(rxjs_1.of(4, 5, 6), void 0))
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
  it('should concatMapTo many outer values to many inner values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|                        ');
      var e1subs = '    ^----------------!                        ';
      var inner = cold('--i-j-k-l-|                               ', values);
      var innerSubs = [
        '                 -^---------!                              ',
        '                 -----------^---------!                    ',
        '                 ---------------------^---------!          ',
        '                 -------------------------------^---------!',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l-|';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should handle an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var inner = cold('-1-2-3|');
      var innerSubs = [];
      var expected = '|';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should handle a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var inner = cold('-1-2-3|');
      var innerSubs = [];
      var expected = '-';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should error immediately if given a just-throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var inner = cold('-1-2-3|');
      var innerSubs = [];
      var expected = '#';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should return a silenced version of the source if the mapped inner is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   --a-b--c-|');
      var e1subs = '    ^--------!';
      var inner = cold('|');
      var innerSubs = [
        '                 --(^!)     ',
        '                 ----(^!)   ',
        '                 -------(^!)',
      ];
      var expected = '  ---------|';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should return a never if the mapped inner is never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   --a-b--c-|');
      var e1subs = '    ^--------!';
      var inner = cold('-');
      var innerSubs = ' --^       ';
      var expected = '  ----------';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should propagate errors if the mapped inner is a just-throw Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   --a-b--c-|');
      var e1subs = '    ^-!       ';
      var inner = cold('#');
      var innerSubs = ' --(^!)    ';
      var expected = '  --#';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, complete late', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d----------------------------------|');
      var e1subs = '    ^-----------------------------------------------!';
      var inner = cold(
        '--i-j-k-l-|                                      ',
        values
      );
      var innerSubs = [
        '                 -^---------!                                     ',
        '                 -----------^---------!                           ',
        '                 ---------------------^---------!                 ',
        '                 -------------------------------^---------!       ',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l--------|';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, outer never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d-----------------------------------');
      var e1subs = '    ^------------------------------------------------';
      var inner = cold(
        '--i-j-k-l-|                                      ',
        values
      );
      var innerSubs = [
        '                 -^---------!                                     ',
        '                 -----------^---------!                           ',
        '                 ---------------------^---------!                 ',
        '                 -------------------------------^---------!       ',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l---------';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---| ');
      var e1subs = '    ^----------------! ';
      var inner = cold('--i-j-k-l-|        ', values);
      var innerSubs = [
        '                 -^---------!       ',
        '                 -----------^------!',
      ];
      var expected = '  ---i-j-k-l---i-j-k-';
      var unsub = '     ------------------!';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.concatMapTo(inner),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, inner never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|');
      var e1subs = '    ^----------------!';
      var inner = cold('--i-j-k-l-        ', values);
      var innerSubs = ' -^                ';
      var expected = '  ---i-j-k-l--------';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, and inner throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|');
      var e1subs = '    ^----------!      ';
      var inner = cold('--i-j-k-l-#       ', values);
      var innerSubs = ' -^---------!      ';
      var expected = '  ---i-j-k-l-#      ';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, and outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---#');
      var e1subs = '    ^----------------!';
      var inner = cold('--i-j-k-l-|       ', values);
      var innerSubs = [
        '                 -^---------!      ',
        '                 -----------^-----!',
      ];
      var expected = '  ---i-j-k-l---i-j-#';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to many inner, both inner and outer throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---#');
      var e1subs = '    ^----------!      ';
      var inner = cold('--i-j-k-l-#       ', values);
      var innerSubs = ' -^---------!      ';
      var expected = '  ---i-j-k-l-#      ';
      var result = e1.pipe(operators_1.concatMapTo(inner));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner.subscriptions).toBe(innerSubs);
    });
  });
  it('should concatMapTo many outer to an array', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var e1 = hot('  2-----4--------3--------2-------|');
      var expected = '(0123)(0123)---(0123)---(0123)--|';
      var result = e1.pipe(operators_1.concatMapTo(['0', '1', '2', '3']));
      expectObservable(result).toBe(expected);
    });
  });
  it('should concatMapTo many outer to inner arrays, and outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var e1 = hot('  2-----4--------3--------2-------#');
      var expected = '(0123)(0123)---(0123)---(0123)--#';
      var result = e1.pipe(operators_1.concatMapTo(['0', '1', '2', '3']));
      expectObservable(result).toBe(expected);
    });
  });
  it('should concatMapTo many outer to inner arrays, outer unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var e1 = hot('  2-----4--------3--------2-------|');
      var unsub = '   -------------!';
      var expected = '(0123)(0123)--';
      var result = e1.pipe(operators_1.concatMapTo(['0', '1', '2', '3']));
      expectObservable(result, unsub).toBe(expected);
    });
  });
  it('should map values to constant resolved promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var results = [];
    source
      .pipe(operators_1.concatMapTo(rxjs_1.from(Promise.resolve(42))))
      .subscribe({
        next: function (x) {
          results.push(x);
        },
        error: function (err) {
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
  it('should map values to constant rejected promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    source
      .pipe(operators_1.concatMapTo(rxjs_1.from(Promise.reject(42))))
      .subscribe({
        next: function (x) {
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
  it('should stop listening to a synchronous observable when unsubscribed', function () {
    var sideEffects = [];
    var synchronousObservable = new rxjs_1.Observable(function (subscriber) {
      for (var i = 0; !subscriber.closed && i < 10; i++) {
        sideEffects.push(i);
        subscriber.next(i);
      }
    });
    synchronousObservable
      .pipe(operators_1.concatMapTo(rxjs_1.of(0)), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=concatMapTo-spec.js.map
