'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('count', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should count the values of an observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--|');
      var subs = '      ^----------!';
      var expected = '  -----------(x|)';
      expectObservable(source.pipe(operators_1.count())).toBe(expected, {
        x: 3,
      });
      expectSubscriptions(source.subscriptions).toBe(subs);
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
      expectObservable(e1.pipe(operators_1.count())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be zero when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '(w|)';
      expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 0 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should be never when source doesn't complete", function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--x--^--y--');
      var e1subs = '     ^     ';
      var expected = '   ------';
      expectObservable(e1.pipe(operators_1.count())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should be zero when source doesn't have values", function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|');
      var e1subs = '   ^---!';
      var expected = ' ----(w|)';
      expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 0 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should count the unique value of an observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--|');
      var e1subs = '   ^-----!';
      var expected = ' ------(w|)';
      expectObservable(e1.pipe(operators_1.count())).toBe(expected, { w: 1 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should count the values of an ongoing hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a-^-b--c--d--|');
      var subs = '          ^----------!';
      var expected = '      -----------(x|)';
      expectObservable(source.pipe(operators_1.count())).toBe(expected, {
        x: 3,
      });
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should count a range() source observable', function (done) {
    rxjs_1
      .range(1, 10)
      .pipe(operators_1.count())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(10);
        },
        error: function (x) {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should count a range().skip(1) source observable', function (done) {
    rxjs_1
      .range(1, 10)
      .pipe(operators_1.skip(1), operators_1.count())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(9);
        },
        error: function (x) {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
  });
  it('should count a range().take(1) source observable', function (done) {
    rxjs_1
      .range(1, 10)
      .pipe(operators_1.take(1), operators_1.count())
      .subscribe({
        next: function (value) {
          chai_1.expect(value).to.equal(1);
        },
        error: function (x) {
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
      expectObservable(e1.pipe(operators_1.count())).toBe(
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
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.count())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-true predicate on an empty hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|');
      var e1subs = '   ^---!';
      var expected = ' ----(w|)';
      var predicate = function () {
        return true;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 0,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-false predicate on an empty hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|');
      var e1subs = '   ^---!';
      var expected = ' ----(w|)';
      var predicate = function () {
        return false;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 0,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-true predicate on a simple hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^-a-|');
      var e1subs = '   ^---!';
      var expected = ' ----(w|)';
      var predicate = function () {
        return true;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 1,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-false predicate on a simple hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^-a-|');
      var e1subs = '   ^---!';
      var expected = ' ----(w|)';
      var predicate = function () {
        return false;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 0,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^-2--3--4-|');
      var e1subs = '   ^-----!    ';
      var expected = ' -------    ';
      var unsub = '    ------!    ';
      var result = e1.pipe(
        operators_1.count(function (value) {
          return parseInt(value) < 10;
        })
      );
      expectObservable(result, unsub).toBe(expected, { w: 3 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^-2--3--4-|');
      var e1subs = '   ^-----!    ';
      var expected = ' -------    ';
      var unsub = '    ------!    ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.count(function (value) {
          return parseInt(value) < 10;
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, { w: 3 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a match-all predicate on observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^-2--3--4-|');
      var e1subs = '   ^---------!';
      var expected = ' ----------(w|)';
      var predicate = function (value) {
        return parseInt(value) < 10;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 3,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a match-none predicate on observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^-2--3--4-|');
      var e1subs = '   ^---------!';
      var expected = ' ----------(w|)';
      var predicate = function (value) {
        return parseInt(value) > 10;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected, {
        w: 0,
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-true predicate on observable that throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^---#');
      var e1subs = '   ^---!';
      var expected = ' ----#';
      var predicate = function () {
        return true;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-false predicate on observable that throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^---#');
      var e1subs = '   ^---!';
      var expected = ' ----#';
      var predicate = function () {
        return false;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an always-true predicate on a hot never-observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^----');
      var e1subs = '   ^    ';
      var expected = ' -----';
      var predicate = function () {
        return true;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
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
      var predicate = function (value) {
        if (value === '3') {
          throw 'error';
        }
        return true;
      };
      expectObservable(e1.pipe(operators_1.count(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=count-spec.js.map
