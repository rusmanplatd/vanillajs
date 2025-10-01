'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('filter', function () {
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
  function oddFilter(x) {
    return +x % 2 === 1;
  }
  /**
   *
   * @param i
   */
  function isPrime(i) {
    if (+i <= 1) {
      return false;
    }
    var max = Math.floor(Math.sqrt(+i));
    for (var j = 2; j <= max; ++j) {
      if (+i % j === 0) {
        return false;
      }
    }
    return true;
  }
  it('should filter out even values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --0--1--2--3--4--|');
      var e1subs = '  ^----------------!';
      var expected = '-----1-----3-----|';
      expectObservable(e1.pipe(operators_1.filter(oddFilter))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --3---5----7-------|';
      expectObservable(e1.pipe(operators_1.filter(isPrime))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter with an always-true predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --3-4-5-6--7-8--9--|';
      var predicate = function () {
        return true;
      };
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter with an always-false predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     -------------------|';
      var predicate = function () {
        return false;
      };
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, source unsubscribes early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^-----------!       ';
      var expected = '     --3---5----7-       ';
      var unsub = '        ------------!       ';
      expectObservable(e1.pipe(operators_1.filter(isPrime)), unsub).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, source throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--#');
      var e1subs = '       ^------------------!';
      var expected = '     --3---5----7-------#';
      expectObservable(e1.pipe(operators_1.filter(isPrime))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, but predicate throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^-------!           ';
      var expected = '     --3---5-#           ';
      var invoked = 0;
      /**
       *
       * @param x
       */
      function predicate(x) {
        invoked++;
        if (invoked === 4) {
          throw 'error';
        }
        return isPrime(x);
      }
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, predicate with index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --3--------7-------|';
      /**
       *
       * @param x
       * @param i
       */
      function predicate(x, i) {
        return isPrime(+x + i * 10);
      }
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should invoke predicate once for each checked value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --3---5----7-------|';
      var invoked = 0;
      var predicate = function (x) {
        invoked++;
        return isPrime(x);
      };
      var result = e1.pipe(
        operators_1.filter(predicate),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(7);
          },
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, predicate with index, source unsubscribes early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^-----------!       ';
      var expected = '     --3--------7-       ';
      var unsub = '        ------------!       ';
      /**
       *
       * @param x
       * @param i
       */
      function predicate(x, i) {
        return isPrime(+x + i * 10);
      }
      expectObservable(e1.pipe(operators_1.filter(predicate)), unsub).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, predicate with index, source throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--#');
      var e1subs = '       ^------------------!';
      var expected = '     --3--------7-------#';
      /**
       *
       * @param x
       * @param i
       */
      function predicate(x, i) {
        return isPrime(+x + i * 10);
      }
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should filter in only prime numbers, predicate with index and throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^-------!           ';
      var expected = '     --3-----#           ';
      var invoked = 0;
      /**
       *
       * @param x
       * @param i
       */
      function predicate(x, i) {
        invoked++;
        if (invoked === 4) {
          throw 'error';
        }
        return isPrime(+x + i * 10);
      }
      expectObservable(e1.pipe(operators_1.filter(predicate))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should compose with another filter to allow multiples of six', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --------6----------|';
      var result = e1.pipe(
        operators_1.filter(function (x) {
          return +x % 2 === 0;
        }),
        operators_1.filter(function (x) {
          return +x % 3 === 0;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be able to accept and use a thisArg', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     --------6----------|';
      var Filterer = (function () {
        /**
         *
         */
        function Filterer() {
          this.filter1 = function (x) {
            return +x % 2 === 0;
          };
          this.filter2 = function (x) {
            return +x % 3 === 0;
          };
        }
        return Filterer;
      })();
      var filterer = new Filterer();
      var result = e1.pipe(
        operators_1.filter(function (x) {
          return this.filter1(x);
        }, filterer),
        operators_1.filter(function (x) {
          return this.filter2(x);
        }, filterer),
        operators_1.filter(function (x) {
          return this.filter1(x);
        }, filterer)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be able to use filter and map composed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^------------------!';
      var expected = '     ----a---b----c-----|';
      var values = { a: 16, b: 36, c: 64 };
      var result = e1.pipe(
        operators_1.filter(function (x) {
          return +x % 2 === 0;
        }),
        operators_1.map(function (x) {
          return +x * +x;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from the source', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --0--1--2--3--4--#');
      var e1subs = '  ^----------------!';
      var expected = '-----1-----3-----#';
      expectObservable(e1.pipe(operators_1.filter(oddFilter))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.filter(oddFilter))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.filter(oddFilter))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.filter(oddFilter))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should send errors down the error path', function (done) {
    rxjs_1
      .of(42)
      .pipe(
        operators_1.filter(function (x, index) {
          throw 'bad';
        })
      )
      .subscribe({
        next: function (x) {
          done(new Error('should not be called'));
        },
        error: function (err) {
          chai_1.expect(err).to.equal('bad');
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
        },
      });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-1--2--^-3-4-5-6--7-8--9--|');
      var e1subs = '       ^-----------!       ';
      var expected = '     --3---5----7-       ';
      var unsub = '        ------------!       ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.filter(isPrime),
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
      var isBaz = function (x) {
        return x && x.baz !== undefined;
      };
      var foo = new Foo();
      rxjs_1
        .of(foo)
        .pipe(
          operators_1.filter(function (foo) {
            return foo.baz === 42;
          })
        )
        .subscribe(function (x) {
          return x.baz;
        });
      rxjs_1
        .of(foo)
        .pipe(operators_1.filter(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var foobar = new Foo();
      rxjs_1
        .of(foobar)
        .pipe(
          operators_1.filter(function (foobar) {
            return foobar.bar === 'name';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(foobar)
        .pipe(operators_1.filter(isBar))
        .subscribe(function (x) {
          return x.bar;
        });
      var barish = { bar: 'quack', baz: 42 };
      rxjs_1
        .of(barish)
        .pipe(
          operators_1.filter(function (x) {
            return x.bar === 'quack';
          })
        )
        .subscribe(function (x) {
          return x.bar;
        });
      rxjs_1
        .of(barish)
        .pipe(operators_1.filter(isBar))
        .subscribe(function (bar) {
          return bar.bar;
        });
    }
    {
      var xs = rxjs_1.from([1, 'aaa', 3, 'bb']);
      var isString = function (x) {
        return typeof x === 'string';
      };
      xs.pipe(operators_1.filter(isString)).subscribe(function (s) {
        return s.length;
      });
      xs.pipe(
        operators_1.filter(function (x) {
          return typeof x === 'number';
        })
      ).subscribe(function (x) {
        return x;
      });
      xs.pipe(
        operators_1.filter(function (x, i) {
          return typeof x === 'number' && x > i;
        })
      ).subscribe(function (x) {
        return x;
      });
    }
  });
  it('should support Boolean as a predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { t: 1, f: 0 };
      var e1 = hot('-t--f--^-t-f-t-f--t-f--f--|', values);
      var e1subs = '       ^------------------!';
      var expected = '     --t---t----t-------|';
      expectObservable(e1.pipe(operators_1.filter(Boolean))).toBe(
        expected,
        values
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
        operators_1.filter(function () {
          return true;
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=filter-spec.js.map
