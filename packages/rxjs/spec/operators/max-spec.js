'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('max', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should find the max of values of an observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|   ', { a: 42, b: -1, c: 3 });
      var e1subs = '  ^----------!   ';
      var expected = '-----------(x|)';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected, { x: 42 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be never when source is never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be zero when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should be never when source doesn't complete", function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--x--^--y--');
      var e1subs = '     ^-----';
      var expected = '   ------';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should complete when source doesn't have values", function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|');
      var e1subs = '   ^---!';
      var expected = ' ----|';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should max the unique value of an observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--|   ', { y: 42 });
      var e1subs = '   ^-----!   ';
      var expected = ' ------(w|)';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected, { w: 42 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should max the values of an ongoing hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--|   ', { a: 42, b: -1, c: 0, d: 6 });
      var e1subs = '    ^----------!   ';
      var expected = '  -----------(x|)';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected, { x: 6 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|', { a: 42, b: -1, c: 0 });
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      expectObservable(e1.pipe(operators_1.max()), unsub).toBe(expected, {
        x: 42,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|', { a: 42, b: -1, c: 0 });
      var e1subs = '  ^-----!     ';
      var expected = '-------     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.max(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, { x: 42 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should max a range() source observable', function (done) {
    rxjs_1
      .range(1, 10000)
      .pipe(operators_1.max())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(10000);
        },
        error: function () {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should max a range().pipe(skip(1)) source observable', function (done) {
    rxjs_1
      .range(1, 10)
      .pipe(operators_1.skip(1), operators_1.max())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(10);
        },
        error: function () {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should max a range().pipe(take(1)) source observable', function (done) {
    rxjs_1
      .range(1, 10)
      .pipe(operators_1.take(1), operators_1.max())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(1);
        },
        error: function () {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should work with error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--z--#', { x: 1, y: 2, z: 3 }, 'too bad');
      var e1subs = '   ^--------!';
      var expected = ' ---------#';
      expectObservable(e1.pipe(operators_1.max())).toBe(
        expected,
        null,
        'too bad'
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.max())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a constant predicate on an empty hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|');
      var e1subs = '   ^---!';
      var expected = ' ----|';
      var predicate = function () {
        return 42;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a constant predicate on an never hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^----');
      var e1subs = '   ^----';
      var expected = ' -----';
      var predicate = function () {
        return 42;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a constant predicate on a simple hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^-a-|   ', { a: 1 });
      var e1subs = '   ^---!   ';
      var expected = ' ----(w|)';
      var predicate = function () {
        return 42;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, {
        w: 1,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a reverse predicate on observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-a-^-b--c--d-|   ', { a: 42, b: -1, c: 0, d: 666 });
      var e1subs = '   ^---------!   ';
      var expected = ' ----------(w|)';
      var predicate = function (x, y) {
        return x > y ? -1 : 1;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, {
        w: -1,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a predicate for string on observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-a-^-b--c--d-|   ');
      var e1subs = '   ^---------!   ';
      var expected = ' ----------(w|)';
      var predicate = function (x, y) {
        return x > y ? -1 : 1;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected, {
        w: 'b',
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a constant predicate on observable that throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^---#');
      var e1subs = '   ^---!';
      var expected = ' ----#';
      var predicate = function () {
        return 42;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a predicate that throws, on observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^-2--3--|');
      var e1subs = '   ^----!   ';
      var expected = ' -----#   ';
      var predicate = function (x, y) {
        if (y === '3') {
          throw 'error';
        }
        return x > y ? -1 : 1;
      };
      expectObservable(e1.pipe(operators_1.max(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=max-spec.js.map
