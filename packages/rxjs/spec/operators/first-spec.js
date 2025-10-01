'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var observableMatcher_1 = require('../helpers/observableMatcher');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
describe('first', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should take the first value of an observable with many values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----a--b--c---d---|');
      var e1subs = '  ^----!              ';
      var expected = '-----(a|)           ';
      expectObservable(e1.pipe(operators_1.first())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take the first value of an observable with one value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---(a|)');
      var e1subs = '  ^--!   ';
      var expected = '---(a|)';
      expectObservable(e1.pipe(operators_1.first())).toBe(expected);
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
          operators_1.first(function (value) {
            return value === 'b';
          }, undefined)
        )
      ).toBe(expected, { U: undefined });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should error on empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^----|');
      var e1subs = '     ^----!';
      var expected = '   -----#';
      expectObservable(e1.pipe(operators_1.first())).toBe(
        expected,
        null,
        new rxjs_1.EmptyError()
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return the default value if source observable was empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-----^----|   ');
      var e1subs = '     ^----!   ';
      var expected = '   -----(a|)';
      expectObservable(e1.pipe(operators_1.first(null, 'a'))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should only emit one value in recursive cases', function () {
    var subject = new rxjs_1.Subject();
    var results = [];
    subject.pipe(operators_1.first()).subscribe(function (x) {
      results.push(x);
      subject.next(x + 1);
    });
    subject.next(0);
    chai_1.expect(results).to.deep.equal([0]);
  });
  it('should propagate error from the source observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^---#');
      var e1subs = '   ^---!';
      var expected = ' ----#';
      expectObservable(e1.pipe(operators_1.first())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should go on forever on never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--^-------');
      var e1subs = '  ^-------';
      var expected = '--------';
      expectObservable(e1.pipe(operators_1.first())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^-----b----c---d--|');
      var e1subs = '     ^--!               ';
      var expected = '   ----               ';
      var unsub = '      ---!               ';
      expectObservable(e1.pipe(operators_1.first()), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^-----b----c---d--|');
      var e1subs = '     ^--!               ';
      var expected = '   ----               ';
      var unsub = '      ---!               ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.first(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should unsubscribe when the first value is received', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b---c-|');
      var e1subs = '  ^-!         ';
      var t = time('    --|       ');
      var expected = '----(a|)    ';
      var result = e1.pipe(operators_1.first(), operators_1.delay(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return first value that matches a predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^--b--c--a--c--|');
      var e1subs = '    ^-----!         ';
      var expected = '  ------(c|)      ';
      expectObservable(
        e1.pipe(
          operators_1.first(function (value) {
            return value === 'c';
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return first value that matches a predicate for odd numbers', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      var e1 = hot('--a-^--b--c--d--e--|', values);
      var e1subs = '    ^-----!         ';
      var expected = '  ------(c|)      ';
      expectObservable(
        e1.pipe(
          operators_1.first(function (x) {
            return x % 2 === 1;
          })
        )
      ).toBe(expected, { c: 3 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should error when no value matches the predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^--b--c--a--c--|');
      var e1subs = '    ^--------------!';
      var expected = '  ---------------#';
      expectObservable(
        e1.pipe(
          operators_1.first(function (x) {
            return x === 's';
          })
        )
      ).toBe(expected, null, new rxjs_1.EmptyError());
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return the default value when no value matches the predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^--b--c--a--c--|   ');
      var e1subs = '    ^--------------!   ';
      var expected = '  ---------------(d|)';
      expectObservable(
        e1.pipe(
          operators_1.first(function (x) {
            return x === 's';
          }, 'd')
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate error when no value matches the predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^--b--c--a--#');
      var e1subs = '    ^-----------!';
      var expected = '  ------------#';
      expectObservable(
        e1.pipe(
          operators_1.first(function (x) {
            return x === 's';
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return first value that matches the index in the predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^--b--c--a--c--|');
      var e1subs = '    ^--------!      ';
      var expected = '  ---------(a|)   ';
      expectObservable(
        e1.pipe(
          operators_1.first(function (_, i) {
            return i === 2;
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate error from predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      var e1 = hot('--a-^--b--c--d--e--|', values);
      var e1subs = '    ^--------!      ';
      var expected = '  ---------#      ';
      var predicate = function (value) {
        if (value < 4) {
          return false;
        } else {
          throw 'error';
        }
      };
      expectObservable(e1.pipe(operators_1.first(predicate))).toBe(
        expected,
        null,
        'error'
      );
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
        .pipe(operators_1.first())
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(
          operators_1.first(function (foo) {
            return foo.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(operators_1.first(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var foobar = new Foo();
      rxjs_1
        .of(foobar)
        .pipe(operators_1.first())
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(
          operators_1.first(function (foobar) {
            return foobar.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(operators_1.first(isBaz))
        .subscribe(function (x) {
          return x.baz;
        });
      var barish = { bar: 'quack', baz: 42 };
      rxjs_1
        .of(barish)
        .pipe(operators_1.first())
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(barish)
        .pipe(
          operators_1.first(function (x) {
            return x.bar === 'quack';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(barish)
        .pipe(operators_1.first(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
    }
    {
      var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
      var isString = function (x) {
        return typeof x === 'string';
      };
      xs.pipe(operators_1.first()).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.first(null)).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.first(undefined)).subscribe(function (x) {
        return x;
      });
      xs.pipe(operators_1.first(isString)).subscribe(function (s) {
        return s.length;
      });
      xs.pipe(
        operators_1.first(function (x) {
          return typeof x === 'string';
        })
      ).subscribe(function (x) {
        return x;
      });
    }
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
        operators_1.first(function (value) {
          return value === 2;
        })
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=first-spec.js.map
