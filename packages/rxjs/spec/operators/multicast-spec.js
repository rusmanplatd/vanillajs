'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('multicast', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should mirror a simple source Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1-2---3-4--5-|');
      var e1subs = '  ^--------------!';
      var expected = '--1-2---3-4--5-|';
      var result = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      result.connect();
    });
  });
  it('should accept Subjects', function (done) {
    var expected = [1, 2, 3, 4];
    var connectable = rxjs_1
      .of(1, 2, 3, 4)
      .pipe(operators_1.multicast(new rxjs_1.Subject()));
    connectable.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
    connectable.connect();
  });
  it('should multicast a ConnectableObservable', function (done) {
    var expected = [1, 2, 3, 4];
    var source = new rxjs_1.Subject();
    var connectable = source.pipe(operators_1.multicast(new rxjs_1.Subject()));
    var replayed = connectable.pipe(
      operators_1.multicast(new rxjs_1.ReplaySubject())
    );
    connectable.connect();
    replayed.connect();
    source.next(1);
    source.next(2);
    source.next(3);
    source.next(4);
    source.complete();
    replayed
      .pipe(
        operators_1.tap({
          next: function (x) {
            chai_1.expect(x).to.equal(expected.shift());
          },
          complete: function () {
            chai_1.expect(expected.length).to.equal(0);
          },
        })
      )
      .subscribe({ error: done, complete: done });
  });
  it('should accept Subject factory functions', function (done) {
    var expected = [1, 2, 3, 4];
    var connectable = rxjs_1.of(1, 2, 3, 4).pipe(
      operators_1.multicast(function () {
        return new rxjs_1.Subject();
      })
    );
    connectable.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
    connectable.connect();
  });
  it('should accept a multicast selector and connect to a hot source for each subscriber', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var subjectFactory = function () {
        return new rxjs_1.Subject();
      };
      var selector = function (x) {
        return rxjs_1.zip(x, x).pipe(
          operators_1.map(function (_a) {
            var _b = __read(_a, 2),
              a = _b[0],
              b = _b[1];
            return (parseInt(a) + parseInt(b)).toString();
          })
        );
      };
      var e1 = hot('         -1-2-3----4-|');
      var e1subs = [
        '                      ^-----------!',
        '                      ----^-------!',
        '                      --------^---!',
      ];
      var multicasted = e1.pipe(
        operators_1.multicast(subjectFactory, selector)
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -2-4-6----8-|';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----6----8-|';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ----------8-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should accept a multicast selector and connect to a cold source for each subscriber', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var subjectFactory = function () {
        return new rxjs_1.Subject();
      };
      var selector = function (x) {
        return rxjs_1.zip(x, x).pipe(
          operators_1.map(function (_a) {
            var _b = __read(_a, 2),
              a = _b[0],
              b = _b[1];
            return (parseInt(a) + parseInt(b)).toString();
          })
        );
      };
      var e1 = cold('        -1-2-3----4-|        ');
      var e1subs = [
        '                      ^-----------!        ',
        '                      ----^-----------!    ',
        '                      --------^-----------!',
      ];
      var multicasted = e1.pipe(
        operators_1.multicast(subjectFactory, selector)
      );
      var subscriber1 = hot('a|                   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -2-4-6----8-|        ';
      var subscriber2 = hot('----b|               ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----2-4-6----8-|    ';
      var subscriber3 = hot('--------c|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ---------2-4-6----8-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should accept a multicast selector and respect the subject's messaging semantics", function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var subjectFactory = function () {
        return new rxjs_1.ReplaySubject(1);
      };
      var selector = function (x) {
        return rxjs_1.concat(x, x.pipe(operators_1.takeLast(1)));
      };
      var e1 = cold('        -1-2-3----4-|           ');
      var e1subs = [
        '                      ^-----------!           ',
        '                      ----^-----------!       ',
        '                      --------^-----------!   ',
      ];
      var multicasted = e1.pipe(
        operators_1.multicast(subjectFactory, selector)
      );
      var subscriber1 = hot('a|                      ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -1-2-3----4-(4|)        ';
      var subscriber2 = hot('----b|                  ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----1-2-3----4-(4|)    ';
      var subscriber3 = hot('--------c|              ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ---------1-2-3----4-(4|)';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should do nothing if connect is not called, despite subscriptions', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1-2---3-4--5-|');
      var e1subs = [];
      var expected = '----------------';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      expectObservable(multicasted).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should multicast the same values to multiple observers', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('        -1-2-3----4-|');
      var e1subs = '         ^-----------!';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -1-2-3----4-|';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----3----4-|';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ----------4-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      multicasted.connect();
    });
  });
  it('should multicast an error from the source to multiple observers', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('        -1-2-3----4-#');
      var e1subs = '         ^-----------!';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -1-2-3----4-#';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----3----4-#';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ----------4-#';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      multicasted.connect();
    });
  });
  it('should multicast the same values to multiple observers, but is unsubscribed explicitly and early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('        -1-2-3----4-|');
      var e1subs = '         ^--------!   ';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var unsub = '          ---------u   ';
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----3----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ----------   ';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      var connection;
      expectObservable(
        hot(unsub).pipe(
          operators_1.tap(function () {
            connection.unsubscribe();
          })
        )
      ).toBe(unsub);
      connection = multicasted.connect();
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var project = function (x) {
        return rxjs_1.of(x);
      };
      var subjectFactory = function () {
        return new rxjs_1.Subject();
      };
      var e1 = cold('        -1-2-3----4-|');
      var e1subs = '         ^--------!   ';
      var multicasted = e1.pipe(
        operators_1.mergeMap(project),
        operators_1.multicast(subjectFactory)
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected2 = '      -----3----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(multicasted)
      );
      var expected3 = '      ----------   ';
      var unsub = '          ---------u   ';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      var connection;
      expectObservable(
        hot(unsub).pipe(
          operators_1.tap(function () {
            connection.unsubscribe();
          })
        )
      ).toBe(unsub);
      connection = multicasted.connect();
    });
  });
  it('should multicast an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var expected = '|   ';
      expectObservable(multicasted).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      multicasted.connect();
    });
  });
  it('should multicast a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var expected = '-';
      expectObservable(multicasted).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      multicasted.connect();
    });
  });
  it('should multicast a throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var multicasted = e1.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      var expected = '#   ';
      expectObservable(multicasted).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      multicasted.connect();
    });
  });
  describe('with refCount() and subject factory', function () {
    it('should connect when first subscriber subscribes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('           -1-2-3----4-|');
        var e1subs = '         ---^-----------!';
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscriber1 = hot('---a|           ').pipe(
          operators_1.mergeMapTo(multicasted)
        );
        var expected1 = '      ----1-2-3----4-|';
        var subscriber2 = hot('-------b|       ').pipe(
          operators_1.mergeMapTo(multicasted)
        );
        var expected2 = '      --------3----4-|';
        var subscriber3 = hot('-----------c|   ').pipe(
          operators_1.mergeMapTo(multicasted)
        );
        var expected3 = '      -------------4-|';
        expectObservable(subscriber1).toBe(expected1);
        expectObservable(subscriber2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should disconnect when last subscriber unsubscribes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('           -1-2-3----4-|');
        var e1subs = '         ---^--------!   ';
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscriber1 = hot('---a|           ').pipe(
          operators_1.mergeMapTo(multicasted)
        );
        var expected1 = '      ----1-2-3--     ';
        var unsub1 = '         ----------!     ';
        var subscriber2 = hot('-------b|       ').pipe(
          operators_1.mergeMapTo(multicasted)
        );
        var expected2 = '      --------3----   ';
        var unsub2 = '         ------------!   ';
        expectObservable(subscriber1, unsub1).toBe(expected1);
        expectObservable(subscriber2, unsub2).toBe(expected2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be retryable when cold source is synchronous', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('   (123#)          ');
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's               ';
        var expected1 = ' (123123123123#) ';
        var subscribe2 = '-s              ';
        var expected2 = ' -(123123123123#)';
        var e1subs = [
          '                 (^!)            ',
          '                 (^!)            ',
          '                 (^!)            ',
          '                 (^!)            ',
          '                 -(^!)           ',
          '                 -(^!)           ',
          '                 -(^!)           ',
          '                 -(^!)           ',
        ];
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be retryable with ReplaySubject and cold source is synchronous', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.ReplaySubject(1);
        };
        var e1 = cold('   (123#)          ');
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's               ';
        var expected1 = ' (123123123123#) ';
        var subscribe2 = '-s              ';
        var expected2 = ' -(123123123123#)';
        var e1subs = [
          '                 (^!)            ',
          '                 (^!)            ',
          '                 (^!)            ',
          '                 (^!)            ',
          '                 -(^!)           ',
          '                 -(^!)           ',
          '                 -(^!)           ',
          '                 -(^!)           ',
        ];
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(3))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be repeatable when cold source is synchronous', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('   (123|)             ');
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's                  ';
        var expected1 = ' (123123123123123|) ';
        var subscribe2 = '-s                 ';
        var expected2 = ' -(123123123123123|)';
        var e1subs = [
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
        ];
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be repeatable with ReplaySubject and cold source is synchronous', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.ReplaySubject(1);
        };
        var e1 = cold('   (123|)             ');
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's                  ';
        var expected1 = ' (123123123123123|) ';
        var subscribe2 = '-s                 ';
        var expected2 = ' -(123123123123123|)';
        var e1subs = [
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 (^!)               ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
          '                 -(^!)              ',
        ];
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(5))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be retryable', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('   -1-2-3----4-#                        ');
        var e1subs = [
          '                 ^-----------!                        ',
          '                 ------------^-----------!            ',
          '                 ------------------------^-----------!',
        ];
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's------------------------------------';
        var expected1 = ' -1-2-3----4--1-2-3----4--1-2-3----4-#';
        var subscribe2 = '----s--------------------------------';
        var expected2 = ' -----3----4--1-2-3----4--1-2-3----4-#';
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be retryable using a ReplaySubject', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.ReplaySubject(1);
        };
        var e1 = cold('        -1-2-3----4-#                        ');
        var e1subs = [
          '                      ^-----------!                        ',
          '                      ------------^-----------!            ',
          '                      ------------------------^-----------!',
        ];
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var expected1 = '      -1-2-3----4--1-2-3----4--1-2-3----4-#';
        var subscribe2 = time('----|                                ');
        var expected2 = '      ----23----4--1-2-3----4--1-2-3----4-#';
        expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(
          expected1
        );
        testScheduler.schedule(function () {
          return expectObservable(multicasted.pipe(operators_1.retry(2))).toBe(
            expected2
          );
        }, subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be repeatable', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.Subject();
        };
        var e1 = cold('   -1-2-3----4-|                        ');
        var e1subs = [
          '                 ^-----------!                        ',
          '                 ------------^-----------!            ',
          '                 ------------------------^-----------!',
        ];
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's------------------------------------';
        var expected1 = ' -1-2-3----4--1-2-3----4--1-2-3----4-|';
        var subscribe2 = '----s--------------------------------';
        var expected2 = ' -----3----4--1-2-3----4--1-2-3----4-|';
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should be repeatable using a ReplaySubject', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var subjectFactory = function () {
          return new rxjs_1.ReplaySubject(1);
        };
        var e1 = cold('   -1-2-3----4-|                        ');
        var e1subs = [
          '                 ^-----------!                        ',
          '                 ------------^-----------!            ',
          '                 ------------------------^-----------!',
        ];
        var multicasted = e1.pipe(
          operators_1.multicast(subjectFactory),
          operators_1.refCount()
        );
        var subscribe1 = 's------------------------------------';
        var expected1 = ' -1-2-3----4--1-2-3----4--1-2-3----4-|';
        var subscribe2 = '----s--------------------------------';
        var expected2 = ' ----23----4--1-2-3----4--1-2-3----4-|';
        expectObservable(
          hot(subscribe1).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(
                expected1
              );
            })
          )
        ).toBe(subscribe1);
        expectObservable(
          hot(subscribe2).pipe(
            operators_1.tap(function () {
              expectObservable(multicasted.pipe(operators_1.repeat(3))).toBe(
                expected2
              );
            })
          )
        ).toBe(subscribe2);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
  });
  it('should multicast one observable to multiple observers', function (done) {
    var results1 = [];
    var results2 = [];
    var subscriptions = 0;
    var source = new rxjs_1.Observable(function (observer) {
      subscriptions++;
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);
      observer.complete();
    });
    var connectable = source.pipe(
      operators_1.multicast(function () {
        return new rxjs_1.Subject();
      })
    );
    connectable.subscribe(function (x) {
      results1.push(x);
    });
    connectable.subscribe(function (x) {
      results2.push(x);
    });
    chai_1.expect(results1).to.deep.equal([]);
    chai_1.expect(results2).to.deep.equal([]);
    connectable.connect();
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(subscriptions).to.equal(1);
    done();
  });
  it('should remove all subscribers from the subject when disconnected', function () {
    var subject = new rxjs_1.Subject();
    var expected = [1, 2, 3, 4];
    var i = 0;
    var source = rxjs_1.from([1, 2, 3, 4]).pipe(operators_1.multicast(subject));
    source.subscribe(function (x) {
      chai_1.expect(x).to.equal(expected[i++]);
    });
    source.connect();
    chai_1.expect(subject.observers.length).to.equal(0);
  });
  describe('when given a subject factory', function () {
    it('should allow you to reconnect by subscribing again', function (done) {
      var expected = [1, 2, 3, 4];
      var i = 0;
      var source = rxjs_1.of(1, 2, 3, 4).pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        })
      );
      source.subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected[i++]);
        },
        complete: function () {
          i = 0;
          source.subscribe({
            next: function (x) {
              chai_1.expect(x).to.equal(expected[i++]);
            },
            complete: done,
          });
          source.connect();
        },
      });
      source.connect();
    });
    it('should not throw ObjectUnsubscribedError when used in a switchMap', function (done) {
      var source = rxjs_1.of(1, 2, 3).pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        }),
        operators_1.refCount()
      );
      var expected = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
      rxjs_1
        .of('a', 'b', 'c')
        .pipe(
          operators_1.switchMap(function (letter) {
            return source.pipe(
              operators_1.map(function (n) {
                return String(letter + n);
              })
            );
          })
        )
        .subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal(expected.shift());
          },
          error: function () {
            done(new Error('should not be called'));
          },
          complete: function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
          },
        });
    });
  });
  describe('when given a subject', function () {
    it('should not throw ObjectUnsubscribedError when used in a switchMap', function (done) {
      var source = rxjs_1
        .of(1, 2, 3)
        .pipe(
          operators_1.multicast(new rxjs_1.Subject()),
          operators_1.refCount()
        );
      var expected = ['a1', 'a2', 'a3'];
      rxjs_1
        .of('a', 'b', 'c')
        .pipe(
          operators_1.switchMap(function (letter) {
            return source.pipe(
              operators_1.map(function (n) {
                return String(letter + n);
              })
            );
          })
        )
        .subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal(expected.shift());
          },
          error: function () {
            done(new Error('should not be called'));
          },
          complete: function () {
            chai_1.expect(expected.length).to.equal(0);
            done();
          },
        });
    });
  });
});
//# sourceMappingURL=multicast-spec.js.map
