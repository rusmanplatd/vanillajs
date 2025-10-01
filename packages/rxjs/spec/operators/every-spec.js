'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('every', function () {
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
  function truePredicate(x) {
    return true;
  }
  /**
   *
   * @param x
   */
  function predicate(x) {
    return +x % 5 === 0;
  }
  it('should return false if only one of elements does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15, d: 18, e: 20 };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------!      ';
      var expected = '-----------(x|)   ';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept thisArg with scalar observables', function () {
    var thisArg = {};
    rxjs_1
      .of(1)
      .pipe(
        operators_1.every(function (value, index) {
          chai_1.expect(this).to.deep.equal(thisArg);
          return true;
        }, thisArg)
      )
      .subscribe();
  });
  it('should increment index on each call to the predicate', function () {
    var indices = [];
    rxjs_1
      .of(1, 2, 3, 4)
      .pipe(
        operators_1.every(function (_, i) {
          indices.push(i);
          return true;
        })
      )
      .subscribe();
    chai_1.expect(indices).to.deep.equal([0, 1, 2, 3]);
  });
  it('should accept thisArg with array observable', function () {
    var thisArg = {};
    rxjs_1
      .of(1, 2, 3, 4)
      .pipe(
        operators_1.every(function (value, index) {
          chai_1.expect(this).to.deep.equal(thisArg);
          return true;
        }, thisArg)
      )
      .subscribe();
  });
  it('should accept thisArg with ordinary observable', function () {
    var thisArg = {};
    var source = new rxjs_1.Observable(function (observer) {
      observer.next(1);
      observer.complete();
    });
    source
      .pipe(
        operators_1.every(function (value, index) {
          chai_1.expect(this).to.deep.equal(thisArg);
          return true;
        }, thisArg)
      )
      .subscribe();
  });
  it('should emit true if source is empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----|   ');
      var e1subs = '  ^----!   ';
      var expected = '-----(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit false if single source element does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|');
      var e1subs = '  ^-!   ';
      var expected = '--(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit false if none of elements match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = '  ^-!               ';
      var expected = '--(x|)            ';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return false if only some of elements matches with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15 };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^----------!      ';
      var expected = '-----------(x|)   ';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15 };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^------!          ';
      var expected = '--------          ';
      var unsub = '   -------!          ';
      var result = e1.pipe(operators_1.every(predicate));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result observable is unsubscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15 };
      var e1 = hot('  --a--b--c--d--e--|', values);
      var e1subs = '  ^------!          ';
      var expected = '--------          ';
      var unsub = '   -------!          ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.every(predicate),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate error if predicate eventually throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = '  ^-------!';
      var expected = '--------#';
      /**
       *
       * @param x
       */
      function faultyPredicate(x) {
        if (x === 'c') {
          throw 'error';
        } else {
          return true;
        }
      }
      expectObservable(e1.pipe(operators_1.every(faultyPredicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit true if single source element matches with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5 };
      var e1 = hot('  --a--|   ', values);
      var e1subs = '  ^----!   ';
      var expected = '-----(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit true if scalar source matches with predicate', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(5);
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
    });
  });
  it('should emit false if scalar source does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(3);
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
    });
  });
  it('should propagate error if predicate throws on scalar source', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(3);
      var expected = '#';
      /**
       *
       * @param x
       */
      function faultyPredicate(x) {
        throw 'error';
      }
      expectObservable(e1.pipe(operators_1.every(faultyPredicate))).toBe(
        expected
      );
    });
  });
  it('should emit true if scalar array source matches with predicate', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(5, 10, 15, 20);
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
    });
  });
  it('should emit false if scalar array source does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(5, 9, 15, 20);
      var expected = '(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
    });
  });
  it('should propagate error if predicate eventually throws on scalar array source', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.of(5, 10, 15, 20);
      var expected = '#';
      /**
       *
       * @param x
       */
      function faultyPredicate(x) {
        if (x === 15) {
          throw 'error';
        }
        return true;
      }
      expectObservable(e1.pipe(operators_1.every(faultyPredicate))).toBe(
        expected
      );
    });
  });
  it('should emit true if all source elements match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15, d: 20, e: 25 };
      var e1 = hot('  --a--b--c--d--e--|   ', values);
      var e1subs = '  ^----------------!   ';
      var expected = '-----------------(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --#');
      var e1subs = '  ^-!';
      var expected = '--#';
      expectObservable(e1.pipe(operators_1.every(truePredicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source never emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.every(truePredicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit true if source element matches with predicate after subscription', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15, d: 20, e: 25 };
      var e1 = hot('--z--^--a--b--c--d--e--|   ', values);
      var e1subs = '     ^-----------------!   ';
      var expected = '   ------------------(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit false if source element does not match with predicate after subscription', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 5, b: 10, c: 15, d: 20 };
      var e1 = hot('--z--^--b--c--z--d--|', values);
      var e1subs = '     ^--------!      ';
      var expected = '   ---------(x|)   ';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: false,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source raises error after subscription', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--z--^--#');
      var e1subs = '     ^--!';
      var expected = '   ---#';
      expectObservable(e1.pipe(operators_1.every(truePredicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit true if source does not emit after subscription', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--z--^-----|   ');
      var e1subs = '     ^-----!   ';
      var expected = '   ------(x|)';
      expectObservable(e1.pipe(operators_1.every(predicate))).toBe(expected, {
        x: true,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=every-spec.js.map
