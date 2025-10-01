'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('last', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should take the last value of an observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a----b--c--|   ');
      var e1subs = '  ^------------!   ';
      var expected = '-------------(c|)';
      expectObservable(e1.pipe(operators_1.last())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should error on nothing sent but completed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^----|');
      var e1subs = '     ^----!';
      var expected = '   -----#';
      expectObservable(e1.pipe(operators_1.last())).toBe(
        expected,
        null,
        new rxjs_1.EmptyError()
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should error on empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.last())).toBe(
        expected,
        null,
        new rxjs_1.EmptyError()
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should go on forever on never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.last())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow undefined as a default value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--a---a-|   ');
      var e1subs = '  ^-------------!   ';
      var expected = '--------------(U|)';
      expectObservable(
        e1.pipe(
          operators_1.last(function (value) {
            return value === 'b';
          }, undefined)
        )
      ).toBe(expected, { U: undefined });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return last element matches with predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--a--b--|   ');
      var e1subs = '  ^-------------!   ';
      var expected = '--------------(b|)';
      expectObservable(
        e1.pipe(
          operators_1.last(function (value) {
            return value === 'b';
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--|');
      var e1subs = '  ^------!       ';
      var expected = '--------       ';
      var unsub = '   -------!       ';
      expectObservable(e1.pipe(operators_1.last()), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--|');
      var e1subs = '  ^------!       ';
      var expected = '--------       ';
      var unsub = '   -------!       ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.last(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return a default value if no element found', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(a|)';
      expectObservable(e1.pipe(operators_1.last(null, 'a'))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not return default value if an element is found', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a---^---b---c---d---|   ');
      var e1subs = '      ^---------------!   ';
      var expected = '    ----------------(d|)';
      expectObservable(e1.pipe(operators_1.last(null, 'x'))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when predicate throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^---b---c---d---e--|');
      var e1subs = '     ^-------!           ';
      var expected = '   --------#           ';
      var predicate = function (x) {
        if (x === 'c') {
          throw 'error';
        } else {
          return false;
        }
      };
      expectObservable(e1.pipe(operators_1.last(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support type guards without breaking previous behavior', function () {
    {
      var Foo = (function () {
        /**
         *
         * @param bar
         * @param baz
         */
        function Foo(bar, baz) {
          if (bar === void 0) {
            bar = 'name';
          }
          if (baz === void 0) {
            baz = 42;
          }
          this.bar = bar;
          this.baz = baz;
        }
        return Foo;
      })();
      var isBar = function (x) {
        return x && x.bar !== undefined;
      };
      var isBaz = function (x) {
        return x && x.baz !== undefined;
      };
      var foo = new Foo();
      rxjs_1
        .of(foo)
        .pipe(operators_1.last())
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(
          operators_1.last(function (foo) {
            return foo.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(operators_1.last(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var foobar = new Foo();
      rxjs_1
        .of(foobar)
        .pipe(operators_1.last())
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(
          operators_1.last(function (foobar) {
            return foobar.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(operators_1.last(isBaz))
        .subscribe(function (x) {
          return x.baz;
        });
      var barish = { bar: 'quack', baz: 42 };
      rxjs_1
        .of(barish)
        .pipe(operators_1.last())
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(barish)
        .pipe(
          operators_1.last(function (x) {
            return x.bar === 'quack';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(barish)
        .pipe(operators_1.last(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
    }
    {
      var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
      var isString = function (x) {
        return typeof x === 'string';
      };
      xs.pipe(operators_1.last()).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.last(null)).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.last(undefined)).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.last(isString)).subscribe(function (s) {
        return s.length;
      });
      xs.pipe(
        operators_1.last(function (x) {
          return typeof x === 'string';
        })
      ).subscribe(function (x) {
        return x;
      });
    }
  });
});
//# sourceMappingURL=last-spec.js.map
