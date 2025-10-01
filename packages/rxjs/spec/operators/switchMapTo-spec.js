'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('switchMapTo', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --1-----3--5-------|');
      var e1subs = '  ^------------------!';
      var e2 = cold('   x-x-x|            ', { x: 10 });
      var expected = '--x-x-x-x-xx-x-x---|';
      var values = { x: 10 };
      var result = e1.pipe(operators_1.switchMapTo(e2));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.switchMapTo(rxjs_1.of(4, 5, 6), function (a, b, i, ii) {
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
      .pipe(operators_1.switchMapTo(rxjs_1.of(4, 5, 6), void 0))
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
  it('should switch a synchronous many outer to a synchronous many inner', function (done) {
    var a = rxjs_1.of(1, 2, 3);
    var expected = ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c'];
    a.pipe(operators_1.switchMapTo(rxjs_1.of('a', 'b', 'c'))).subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: done,
    });
  });
  it('should unsub inner observables', function () {
    var unsubbed = 0;
    rxjs_1
      .of('a', 'b')
      .pipe(
        operators_1.switchMapTo(
          new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
              unsubbed++;
            };
          })
        )
      )
      .subscribe();
    chai_1.expect(unsubbed).to.equal(2);
  });
  it('should switch to an inner cold observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|          ');
      var xsubs = [
        '               ---------^---------!                 ',
        '               -------------------^----------------!',
      ];
      var e1 = hot('  ---------x---------x---------|       ');
      var e1subs = '  ^----------------------------!       ';
      var expected = '-----------a--b--c---a--b--c--d--e--|';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner cold observable, outer eventually throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|');
      var xsubs = '   ---------^---------!       ';
      var e1 = hot('  ---------x---------#       ');
      var e1subs = '  ^------------------!       ';
      var expected = '-----------a--b--c-#       ';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner cold observable, outer is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|   ');
      var xsubs = [
        '               ---------^---------!          ',
        '               -------------------^--!       ',
      ];
      var e1 = hot('  ---------x---------x---------|');
      var unsub = '   ----------------------!       ';
      var e1subs = '  ^---------------------!       ';
      var expected = '-----------a--b--c---a-       ';
      expectObservable(e1.pipe(operators_1.switchMapTo(x)), unsub).toBe(
        expected
      );
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('--a--b--c--d--e--|   ');
      var xsubs = [
        '               ---------^---------!          ',
        '               -------------------^--!       ',
      ];
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^---------------------!       ';
      var expected = '-----------a--b--c---a-       ';
      var unsub = '   ----------------------!       ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.switchMapTo(x),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner cold observable, inner never completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e-          ');
      var xsubs = [
        '               ---------^---------!               ',
        '               -------------------^               ',
      ];
      var e1 = hot('  ---------x---------y---------|     ');
      var e1subs = '  ^----------------------------!     ';
      var expected = '-----------a--b--c---a--b--c--d--e-';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a synchronous switch to the inner observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|   ');
      var xsubs = [
        '               ---------(^!)                 ',
        '               ---------^----------------!   ',
      ];
      var e1 = hot('  ---------(xx)----------------|');
      var e1subs = '  ^----------------------------!';
      var expected = '-----------a--b--c--d--e-----|';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner cold observable, inner raises an error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--#            ');
      var xsubs = '   ---------^-------!            ';
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^----------------!            ';
      var expected = '-----------a--b--#            ';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch an inner hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   --p-o-o-p---a--b--c--d-|      ');
      var xsubs = [
        '               ---------^---------!          ',
        '               -------------------^---!      ',
      ];
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------------a--b--c--d-------|';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           |                    ');
      var xsubs = [
        '               ---------(^!)                 ',
        '               -------------------(^!)       ',
      ];
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '-----------------------------|';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           -                    ');
      var xsubs = [
        '               ---------^---------!          ',
        '               -------------------^          ',
      ];
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------------------------------';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to an inner that just raises an error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           #                    ');
      var xsubs = '   ---------(^!)                 ';
      var e1 = hot('  ---------x---------x---------|');
      var e1subs = '  ^--------!                    ';
      var expected = '---------#                    ';
      expectObservable(e1.pipe(operators_1.switchMapTo(x))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an empty outer', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never outer', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an outer that just raises and error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.switchMapTo(rxjs_1.of('foo')))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
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
      .pipe(operators_1.switchMapTo(rxjs_1.of(0)), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=switchMapTo-spec.js.map
