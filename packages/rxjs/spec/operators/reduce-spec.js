'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('reduce', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should reduce', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 3, c: 5, x: 9 };
      var e1 = hot('  --a--b--c--|   ', values);
      var e1subs = '  ^----------!   ';
      var expected = '-----------(x|)';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, 0)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce with seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|   ');
      var e1subs = '  ^-------!   ';
      var expected = '--------(x|)';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + ' ' + x;
        }, 'n')
      );
      expectObservable(result).toBe(expected, { x: 'n a b' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce with a seed of undefined', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|   ');
      var e1subs = '     ^--------------------!   ';
      var expected = '   ---------------------(x|)';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + ' ' + x;
        }, undefined)
      );
      expectObservable(result).toBe(expected, { x: 'undefined b c d e f g' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce without a seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|   ');
      var e1subs = '     ^--------------------!   ';
      var expected = '   ---------------------(x|)';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + ' ' + x;
        })
      );
      expectObservable(result).toBe(expected, { x: 'b c d e f g' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce with index without seed', function () {
    var idx = [1, 2, 3, 4, 5];
    rxjs_1
      .range(0, 6)
      .pipe(
        operators_1.reduce(function (acc, value, index) {
          chai_1.expect(idx.shift()).to.equal(index);
          return value;
        })
      )
      .subscribe({
        complete: function () {
          chai_1.expect(idx).to.be.empty;
        },
      });
  });
  it('should reduce with index with seed', function () {
    var idx = [0, 1, 2, 3, 4, 5];
    rxjs_1
      .range(0, 6)
      .pipe(
        operators_1.reduce(function (acc, value, index) {
          chai_1.expect(idx.shift()).to.equal(index);
          return value;
        }, -1)
      )
      .subscribe({
        complete: function () {
          chai_1.expect(idx).to.be.empty;
        },
      });
  });
  it('should reduce with seed if source is empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^-------|   ');
      var e1subs = '     ^-------!   ';
      var expected = '   --------(x|)';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, '42')
      );
      expectObservable(result).toBe(expected, { x: '42' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if reduce function throws without seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^----!   ';
      var expected = '-----#   ';
      var result = e1.pipe(
        operators_1.reduce(function () {
          throw 'error';
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^-----!  ';
      var expected = '-------  ';
      var unsub = '   ------!  ';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
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
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^-----!  ';
      var expected = '-------  ';
      var unsub = '   ------!  ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.reduce(function (o, x) {
          return o + x;
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source emits and raises error with seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#');
      var e1subs = '  ^-------!';
      var expected = '--------#';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, '42')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source raises error with seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----#');
      var e1subs = '  ^---!';
      var expected = '----#';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, '42')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if reduce function throws with seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^-!      ';
      var expected = '--#      ';
      var result = e1.pipe(
        operators_1.reduce(function () {
          throw 'error';
        }, 'n')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete with seed if source emits but does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--');
      var e1subs = '  ^----';
      var expected = '-----';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, 'n')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete with seed if source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        }, 'n')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete without seed if source emits but does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--');
      var e1subs = '  ^-------';
      var expected = '--------';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete without seed if source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce if source does not emit without seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^-------|');
      var e1subs = '     ^-------!';
      var expected = '   --------|';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source emits and raises error without seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--#');
      var e1subs = '  ^-------!';
      var expected = '--------#';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source raises error without seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----#');
      var e1subs = '  ^---!';
      var expected = '----#';
      var result = e1.pipe(
        operators_1.reduce(function (o, x) {
          return o + x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=reduce-spec.js.map
