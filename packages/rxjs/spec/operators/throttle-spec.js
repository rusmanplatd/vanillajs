'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var TestScheduler_1 = require('rxjs/internal/testing/TestScheduler');
var observableMatcher_1 = require('../helpers/observableMatcher');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
describe('throttle', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new TestScheduler_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should immediately emit the first value in each time window', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-xy-----b--x--cxyz-|');
      var e1subs = '  ^--------------------!';
      var e2 = cold('  ----i                ');
      var e2subs = [
        '               -^---!                ',
        '               ----------^---!       ',
        '               ----------------^---! ',
      ];
      var expected = '-a--------b-----c----|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle sync source with sync notifier and trailing appropriately', function () {
    var results = [];
    var source = rxjs_1.of(1).pipe(
      operators_1.throttle(
        function () {
          return rxjs_1.of(1);
        },
        { leading: false, trailing: true }
      )
    );
    source.subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal([1, 'done']);
  });
  it('should simply mirror the source if values are not emitted often enough', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ^a--------b-----c----|');
      var e1subs = '  ^--------------------!';
      var e2 = cold('  ----|                ');
      var e2subs = [
        '               -^---!                ',
        '               ----------^---!       ',
        '               ----------------^---! ',
      ];
      var expected = '-a--------b-----c----|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should throttle with duration Observable using next to close the duration', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ^a-xy-----b--x--cxxx-|');
      var e1subs = '  ^--------------------!';
      var e2 = cold('  ----x-y-z            ');
      var e2subs = [
        '               -^---!                ',
        '               ----------^---!       ',
        '               ----------------^---! ',
      ];
      var expected = '-a--------b-----c----|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should interrupt source and duration when result is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-x-y-z-xyz-x-y-z----b--x-x-|');
      var unsub = '   --------------!               ';
      var e1subs = '  ^-------------!               ';
      var e2 = cold('  ---------------------|       ');
      var e2subs = '  -^------------!               ';
      var expected = '-a-------------               ';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-x-y-z-xyz-x-y-z----b--x-x-|');
      var e1subs = '  ^-------------!               ';
      var e2 = cold('  ------------------|           ');
      var e2subs = '  -^------------!               ';
      var expected = '-a-------------               ';
      var unsub = '   --------------!               ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.throttle(function () {
          return e2;
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle a busy producer emitting a regular repeating sequence', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^------------------------!';
      var e2 = cold(' -----|                    ');
      var e2subs = [
        '               ^----!                    ',
        '               ------^----!              ',
        '               ------------^----!        ',
        '               ------------------^----!  ',
        '               ------------------------^!',
      ];
      var expected = 'a-----a-----a-----a-----a|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should mirror source if durations are immediate', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^------------------------!';
      var e2 = cold(' x                         ');
      var expected = 'abcdefabcdefabcdefabcdefa|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mirror source if durations are empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^------------------------!';
      var e2 = cold(' |                         ');
      var expected = 'abcdefabcdefabcdefabcdefa|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take only the first value emitted if duration is a never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^----------------------------!';
      var e2 = cold(' -                             ');
      var e2subs = '  ----^------------------------!';
      var expected = '----a------------------------|';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should unsubscribe duration Observable when source raise error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----abcdefabcdefabcdefabcdefa#');
      var e1subs = '  ^----------------------------!';
      var e2 = cold(' -                             ');
      var e2subs = '  ----^------------------------!';
      var expected = '----a------------------------#';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should raise error as soon as just-throw duration is used', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^---!-------------------------';
      var e2 = cold(' #                             ');
      var e2subs = '  ----(^!)                      ';
      var expected = '----(a#)                      ';
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should throttle using durations of varying lengths', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdabcdefghabca|   ');
      var e1subs = '  ^---------------------!   ';
      var e2 = [
        cold('          -----|                    '),
        cold('                ---|                '),
        cold('                    -------|        '),
        cold('                            --|     '),
        cold('                               ----|'),
      ];
      var e2subs = [
        '               ^----!                    ',
        '               ------^--!                ',
        '               ----------^------!        ',
        '               ------------------^-!     ',
        '               ---------------------^!   ',
      ];
      var expected = 'a-----a---a-------a--a|   ';
      var i = 0;
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2[i++];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var j = 0; j < e2.length; j++) {
        expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
      }
    });
  });
  it('should propagate error from duration Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdabcdefghabca|   ');
      var e1subs = '  ^----------------!        ';
      var e2 = [
        cold('          -----|                    '),
        cold('                ---|                '),
        cold('                    -------#        '),
      ];
      var e2subs = [
        '               ^----!                    ',
        '               ------^--!                ',
        '               ----------^------!        ',
      ];
      var expected = 'a-----a---a------#        ';
      var i = 0;
      var result = e1.pipe(
        operators_1.throttle(function () {
          return e2[i++];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      for (var j = 0; j < e2.length; j++) {
        expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
      }
    });
  });
  it('should propagate error thrown from durationSelector function', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot(' --^--x--x--x--x--x--x--e--x--x--x--|');
      var s1Subs = ' ^--------------------!              ';
      var n1 = cold('----|                               ');
      var n1Subs = [
        '              ---^---!                            ',
        '              ---------^---!                      ',
        '              ---------------^---!                ',
      ];
      var exp = '    ---x-----x-----x-----(e#)           ';
      var i = 0;
      var result = s1.pipe(
        operators_1.throttle(function () {
          if (i++ === 3) {
            throw new Error('lol');
          }
          return n1;
        })
      );
      expectObservable(result).toBe(exp, undefined, new Error('lol'));
      expectSubscriptions(s1.subscriptions).toBe(s1Subs);
      expectSubscriptions(n1.subscriptions).toBe(n1Subs);
    });
  });
  it('should complete when source does not emit', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----|');
      var subs = '    ^----!';
      var expected = '-----|';
      /**
       *
       */
      function durationSelector() {
        return cold('-----|');
      }
      expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should raise error when source does not emit and raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----#');
      var subs = '    ^----!';
      var expected = '-----#';
      /**
       *
       */
      function durationSelector() {
        return cold('-----|');
      }
      expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should handle an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |     ');
      var subs = '    (^!)  ';
      var expected = '|     ';
      /**
       *
       */
      function durationSelector() {
        return cold('-----|');
      }
      expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should handle a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -     ');
      var subs = '    ^     ';
      var expected = '-     ';
      /**
       *
       */
      function durationSelector() {
        return cold('-----|');
      }
      expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should handle a throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #     ');
      var subs = '    (^!)  ';
      var expected = '#     ';
      /**
       *
       */
      function durationSelector() {
        return cold('-----|');
      }
      expectObservable(e1.pipe(operators_1.throttle(durationSelector))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  describe('throttle(fn, { leading: true, trailing: true })', function () {
    it('should immediately emit the first value in each time window', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-xy-----b--x--cxxx------|');
        var e1subs = '  ^-------------------------!';
        var e2 = cold('  ----x                     ');
        var e2subs = [
          '               -^---!                     ',
          '               -----^---!                 ',
          '               ----------^---!            ',
          '               --------------^---!        ',
          '               ------------------^---!    ',
          '               ----------------------^---!',
        ];
        var expected = '-a---y----b---x---x---x---|';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should work for individual values', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var s1 = hot('-^-x------------------|     ');
        var s1Subs = ' ^--------------------!     ';
        var n1 = cold('  ------------------------|');
        var n1Subs = ['--^------------------!     '];
        var exp = '    --x------------------|     ';
        var result = s1.pipe(
          operators_1.throttle(
            function () {
              return n1;
            },
            { trailing: true }
          )
        );
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });
    it('should emit trailing value after throttle duration when source completes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--------xy|     ');
        var e1subs = '  ^-----------!     ';
        var e2 = cold('  ----x            ');
        var e2subs = [
          '               -^---!            ',
          '               ----------^---!   ',
        ];
        var expected = '-a--------x---(y|)';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
  });
  describe('throttle(fn, { leading: false, trailing: true })', function () {
    it('should immediately emit the first value in each time window', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-xy-----b--x--cxxx------|');
        var e1subs = '  ^-------------------------!';
        var e2 = cold('  ----x                     ');
        var e2subs = [
          '               -^---!                     ',
          '               -----^---!                 ',
          '               ----------^---!            ',
          '               --------------^---!        ',
          '               ------------------^---!    ',
          '               ----------------------^---!',
        ];
        var expected = '-----y--------x---x---x---|';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should work for individual values', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var s1 = hot('-^-x------------------|        ');
        var s1Subs = ' ^--------------------!        ';
        var n1 = cold('  ------------------------x   ');
        var n1Subs = ['--^-----------------------!   '];
        var exp = '    --------------------------(x|)';
        var result = s1.pipe(
          operators_1.throttle(
            function () {
              return n1;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });
    it('should wait for trailing throttle before completing, even if source completes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = hot('  -^--x--------y---------|        ');
        var sourceSubs = '   ^---------------------!        ';
        var duration = cold('   ------------------------x   ');
        var durationSubs = ' ---^-----------------------!   ';
        var exp = '          ---------------------------(y|)';
        var result = source.pipe(
          operators_1.throttle(
            function () {
              return duration;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(exp);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        expectSubscriptions(duration.subscriptions).toBe(durationSubs);
      });
    });
    it('should emit trailing value after throttle duration when source completes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--------x|   ');
        var e1subs = '  ^----------!   ';
        var e2 = cold('  ----x         ');
        var e2subs = [
          '               -^---!         ',
          '               -----^---!     ',
          '               ----------^---!',
        ];
        var expected = '-----a--------(x|)';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should emit the last trailing value after throttle duration when source completes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--------xy|  ');
        var e1subs = '  ^-----------!  ';
        var e2 = cold('  ----x         ');
        var e2subs = [
          '               -^---!         ',
          '               -----^---!     ',
          '               ----------^---!',
        ];
        var expected = '-----a--------(y|)';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should complete when source completes if no value is available', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-----|');
        var e1subs = '  ^------!';
        var e2 = cold('  ----x  ');
        var e2subs = ['               -^---!  ', '               -----^-!'];
        var expected = '-----a-|';
        var result = e1.pipe(
          operators_1.throttle(
            function () {
              return e2;
            },
            { leading: false, trailing: true }
          )
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
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
        operators_1.throttle(function () {
          return rxjs_1.of(0);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=throttle-spec.js.map
