'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('takeWhile', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should take all elements until predicate is false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1-^2--3--4--5--6--|');
      var e1subs = '   ^------!         ';
      var expected = ' -2--3--|         ';
      var result = e1.pipe(
        operators_1.takeWhile(function (v) {
          return +v < 4;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take all elements with predicate returns true', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------------!';
      var expected = '  --b--c--d--e--|';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take all elements with truthy predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------------!';
      var expected = '  --b--c--d--e--|';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return {};
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all elements with predicate returns false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-!            ';
      var expected = '  --|            ';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return false;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should skip all elements with falsy predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-!            ';
      var expected = '  --|            ';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return null;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take all elements until predicate return false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------!      ';
      var expected = '  --b--c--|      ';
      /**
       *
       * @param value
       */
      function predicate(value) {
        return value !== 'd';
      }
      var result = e1.pipe(operators_1.takeWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take all elements up to and including the element that made the predicate return false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------!      ';
      var expected = '  --b--c--(d|)   ';
      /**
       *
       * @param value
       */
      function predicate(value) {
        return value !== 'd';
      }
      var inclusive = true;
      var result = e1.pipe(operators_1.takeWhile(predicate, inclusive));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take elements with predicate when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--');
      var e1subs = '    ^-------------';
      var expected = '  --b--c--d--e--';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^------------|');
      var e1subs = '    ^------------!';
      var expected = '  -------------|';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should pass element index to predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------!      ';
      var expected = '  --b--c--|      ';
      /**
       *
       * @param value
       * @param index
       */
      function predicate(value, index) {
        return index < 2;
      }
      var result = e1.pipe(operators_1.takeWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--#');
      var e1subs = '    ^-------------!';
      var expected = '  --b--c--d--e--#';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var result = e1.pipe(
        operators_1.takeWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should invoke predicate until return false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-------!      ';
      var expected = '  --b--c--|      ';
      var invoked = 0;
      /**
       *
       * @param value
       */
      function predicate(value) {
        invoked++;
        return value !== 'd';
      }
      var result = e1.pipe(
        operators_1.takeWhile(predicate),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(3);
          },
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if predicate throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var e1subs = '    ^-!            ';
      var expected = '  --#            ';
      /**
       *
       * @param value
       */
      function predicate(value) {
        throw 'error';
      }
      var result = e1.pipe(operators_1.takeWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take elements until unsubscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var unsub = '     -----!         ';
      var e1subs = '    ^----!         ';
      var expected = '  --b---         ';
      /**
       *
       * @param value
       */
      function predicate(value) {
        return value !== 'd';
      }
      var result = e1.pipe(operators_1.takeWhile(predicate));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a-^-b--c--d--e--|');
      var unsub = '     -----!         ';
      var e1subs = '    ^----!         ';
      var expected = '  --b---         ';
      /**
       *
       * @param value
       */
      function predicate(value) {
        return value !== 'd';
      }
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.takeWhile(predicate),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
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
      var foo = new Foo();
      rxjs_1
        .of(foo)
        .pipe(
          operators_1.takeWhile(function (foo) {
            return foo.baz === 42;
          })
        )
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(operators_1.takeWhile(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var foobar = new Foo();
      rxjs_1
        .of(foobar)
        .pipe(
          operators_1.takeWhile(function (foobar) {
            return foobar.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(operators_1.takeWhile(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var barish = { bar: 'quack', baz: 42 };
      rxjs_1
        .of(barish)
        .pipe(
          operators_1.takeWhile(function (x) {
            return x.bar === 'quack';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(barish)
        .pipe(operators_1.takeWhile(isBar))
        .subscribe(function (bar) {
          return bar.bar;
        });
    }
    {
      var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
      var isString = function (x) {
        return typeof x === 'string';
      };
      xs.pipe(operators_1.takeWhile(isString)).subscribe(function (s) {
        return s.length;
      });
      xs.pipe(
        operators_1.takeWhile(function (x) {
          return typeof x === 'number';
        })
      ).subscribe(function (x) {
        return x;
      });
      xs.pipe(
        operators_1.takeWhile(function (x, i) {
          return typeof x === 'number' && x > i;
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
        operators_1.takeWhile(function (value) {
          return value < 2;
        })
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=takeWhile-spec.js.map
