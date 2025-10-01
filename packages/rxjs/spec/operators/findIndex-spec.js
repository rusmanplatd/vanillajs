'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var rxjs_1 = require('rxjs');
describe('findIndex', function () {
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
  it('should return matching element from source emits single element', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 3, b: 9, c: 15, d: 20 };
      var e1 = hot('  ---a--b--c--d---|', values);
      var e1subs = '  ^--------!       ';
      var expected = '---------(x|)    ';
      var predicate = function (x) {
        return x % 5 === 0;
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
        expected,
        { x: 2 }
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not emit if source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.findIndex(truePredicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return negative index if source is empty to match predicate', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(x|)';
      var result = e1.pipe(operators_1.findIndex(truePredicate));
      expectObservable(result).toBe(expected, { x: -1 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return index of element from source emits single element', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--|', { a: 1 });
      var e1subs = '  ^-!   ';
      var expected = '--(x|)';
      var predicate = function (value) {
        return value === 1;
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
        expected,
        { x: 0 }
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return index of matching element from source emits multiple elements', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b---c-|', { b: 7 });
      var e1subs = '  ^----!      ';
      var expected = '-----(x|)   ';
      var predicate = function (value) {
        return value === 7;
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
        expected,
        { x: 1 }
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with a custom thisArg', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var sourceValues = { b: 7 };
      var e1 = hot('  --a--b---c-|', sourceValues);
      var e1subs = '  ^----!      ';
      var expected = '-----(x|)   ';
      var predicate = function (value) {
        return value === this.b;
      };
      var result = e1.pipe(operators_1.findIndex(predicate, sourceValues));
      expectObservable(result).toBe(expected, { x: 1 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return negative index if element does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|   ');
      var e1subs = '  ^----------!   ';
      var expected = '-----------(x|)';
      var predicate = function (value) {
        return value === 'z';
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
        expected,
        { x: -1 }
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.findIndex(function (value) {
          return value === 'z';
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.findIndex(function (value) {
          return value === 'z';
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should unsubscribe when the predicate is matched', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b---c-|');
      var e1subs = '  ^----!      ';
      var t = time('    --|       ');
      var expected = '-------(x|) ';
      var result = e1.pipe(
        operators_1.findIndex(function (value) {
          return value === 'b';
        }),
        operators_1.delay(t)
      );
      expectObservable(result).toBe(expected, { x: 1 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise if source raise error while element does not match with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#');
      var e1subs = '  ^-------!';
      var expected = '--------#';
      var predicate = function (value) {
        return value === 'z';
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if predicate throws error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-!         ';
      var expected = '--#         ';
      var predicate = function (value) {
        throw 'error';
      };
      expectObservable(e1.pipe(operators_1.findIndex(predicate))).toBe(
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
      .pipe(
        operators_1.findIndex(function (value) {
          return value === 2;
        })
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=findIndex-spec.js.map
