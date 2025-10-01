'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    /**
     *
     * @param value
     */
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      /**
       *
       * @param value
       */
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      /**
       *
       * @param value
       */
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      /**
       *
       * @param result
       */
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    /**
     *
     * @param n
     */
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    /**
     *
     * @param op
     */
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('repeat operator', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should resubscribe count number of times', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                ');
      var subs = [
        '               ^-------!                ',
        '               --------^-------!        ',
        '               ----------------^-------!',
      ];
      var expected = '--a--b----a--b----a--b--|';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should resubscribe multiple times', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                        ');
      var subs = [
        '               ^-------!                        ',
        '               --------^-------!                ',
        '               ----------------^-------!        ',
        '               ------------------------^-------!',
      ];
      var expected = '--a--b----a--b----a--b----a--b--|';
      expectObservable(
        e1.pipe(operators_1.repeat(2), operators_1.repeat(2))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should complete without emit when count is zero', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('--a--b--|');
      var subs = [];
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should emit source once when count is one', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|');
      var subs = '    ^-------!';
      var expected = '--a--b--|';
      expectObservable(e1.pipe(operators_1.repeat(1))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should repeat until gets unsubscribed', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|      ');
      var subs = [
        '               ^-------!      ',
        '               --------^------!',
      ];
      var unsub = '   ---------------!';
      var expected = '--a--b----a--b-';
      expectObservable(e1.pipe(operators_1.repeat(10)), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should be able to repeat indefinitely until unsubscribed', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                                    ');
      var subs = [
        '               ^-------!                                    ',
        '               --------^-------!                            ',
        '               ----------------^-------!                    ',
        '               ------------------------^-------!            ',
        '               --------------------------------^-------!    ',
        '               ----------------------------------------^---!',
      ];
      var unsub = '   --------------------------------------------!';
      var expected = '--a--b----a--b----a--b----a--b----a--b----a--';
      expectObservable(e1.pipe(operators_1.repeat()), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                                    ');
      var subs = [
        '               ^-------!                                    ',
        '               --------^-------!                            ',
        '               ----------------^-------!                    ',
        '               ------------------------^-------!            ',
        '               --------------------------------^-------!    ',
        '               ----------------------------------------^---!',
      ];
      var unsub = '   --------------------------------------------!';
      var expected = '--a--b----a--b----a--b----a--b----a--b----a--';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.repeat(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should consider negative count as no repeat, and return EMPTY', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('--a--b--|                                    ');
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(-1))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe([]);
    });
  });
  it('should always finalization before starting the next cycle', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var results, source;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            results = [];
            source = new rxjs_1.Observable(function (subscriber) {
              Promise.resolve().then(function () {
                subscriber.next(1);
                Promise.resolve().then(function () {
                  subscriber.next(2);
                  Promise.resolve().then(function () {
                    subscriber.complete();
                  });
                });
              });
              return function () {
                results.push('finalizer');
              };
            });
            return [
              4,
              source.pipe(operators_1.repeat(3)).forEach(function (value) {
                return results.push(value);
              }),
            ];
          case 1:
            _a.sent();
            chai_1
              .expect(results)
              .to.deep.equal([
                1,
                2,
                'finalizer',
                1,
                2,
                'finalizer',
                1,
                2,
                'finalizer',
              ]);
            return [2];
        }
      });
    });
  });
  it('should always finalize before starting the next cycle, even when synchronous', function () {
    var results = [];
    var source = new rxjs_1.Observable(function (subscriber) {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.complete();
      return function () {
        results.push('finalizer');
      };
    });
    var subscription = source.pipe(operators_1.repeat(3)).subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('complete');
      },
    });
    chai_1.expect(subscription.closed).to.be.true;
    chai_1
      .expect(results)
      .to.deep.equal([
        1,
        2,
        'finalizer',
        1,
        2,
        'finalizer',
        1,
        2,
        'complete',
        'finalizer',
      ]);
  });
  it('should not complete when source never completes', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-');
      var e1subs = '^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source does not completes', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-');
      var unsub = '------------------------------!';
      var subs = ' ^-----------------------------!';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.repeat(3)), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should complete immediately when source does not complete without emit but count is zero', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-');
      var subs = [];
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should complete immediately when source does not complete but count is zero', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('--a--b--');
      var subs = [];
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should emit source once and does not complete when source emits but does not complete', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--');
      var subs = ['   ^-------'];
      var expected = '--a--b--';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should complete when source is empty', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('|');
      var e1subs = ['(^!)', '(^!)', '(^!)'];
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source does not emit', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('----|        ');
      var subs = [
        '              ^---!        ',
        '              ----^---!    ',
        '              --------^---!',
      ];
      var expected = '------------|';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should complete immediately when source does not emit but count is zero', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('----|');
      var subs = [];
      var expected = '|';
      expectObservable(e1.pipe(operators_1.repeat(0))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should raise error when source raises error', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--#');
      var subs = '    ^-------!';
      var expected = '--a--b--#';
      expectObservable(e1.pipe(operators_1.repeat(2))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should raises error if source throws', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('#');
      var e1subs = '(^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.repeat(3))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raises error if source throws when repeating infinitely', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('#');
      var e1subs = '(^!)';
      var expected = '#';
      expectObservable(e1.pipe(operators_1.repeat())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error after first emit succeed', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var repeated = false;
      var e1 = cold('--a--|').pipe(
        operators_1.map(function (x) {
          if (repeated) {
            throw 'error';
          } else {
            repeated = true;
            return x;
          }
        })
      );
      var expected = '--a----#';
      expectObservable(e1.pipe(operators_1.repeat(2))).toBe(expected);
    });
  });
  it('should repeat a synchronous source (multicasted and refCounted) multiple times', function (done) {
    var expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        }),
        operators_1.refCount(),
        operators_1.repeat(5)
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        error: function (x) {
          done(new Error('should not be called'));
        },
        complete: function () {
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
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
      .pipe(operators_1.repeat(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should allow count configuration', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                ');
      var subs = [
        '               ^-------!                ',
        '               --------^-------!        ',
        '               ----------------^-------!',
      ];
      var expected = '--a--b----a--b----a--b--|';
      expectObservable(e1.pipe(operators_1.repeat({ count: 3 }))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should allow delay time configuration', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--|                ');
      var delay = 3;
      var subs = [
        '               ^-------!                ',
        '               -----------^-------!        ',
        '               ----------------------^-------!',
      ];
      var expected = '--a--b-------a--b-------a--b--|';
      expectObservable(
        e1.pipe(operators_1.repeat({ count: 3, delay: delay }))
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should allow delay function configuration', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var expectedCounts = [1, 2, 3];
      var e1 = cold(' --a--b--|                ');
      var delay = 3;
      var subs = [
        '               ^-------!                ',
        '               -----------^-------!        ',
        '               ----------------------^-------!',
      ];
      var expected = '--a--b-------a--b-------a--b--|';
      expectObservable(
        e1.pipe(
          operators_1.repeat({
            count: 3,
            delay: function (count) {
              chai_1.expect(count).to.equal(expectedCounts.shift());
              return rxjs_1.timer(delay);
            },
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should handle delay function throwing', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var expectedCounts = [1, 2, 3];
      var e1 = cold(' --a--b--|                ');
      var delay = 3;
      var subs = [
        '               ^-------!                ',
        '               -----------^-------!        ',
      ];
      var expected = '--a--b-------a--b--#';
      expectObservable(
        e1.pipe(
          operators_1.repeat({
            count: 3,
            delay: function (count) {
              if (count === 2) {
                throw 'bad';
              }
              return rxjs_1.timer(delay);
            },
          })
        )
      ).toBe(expected, undefined, 'bad');
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
});
//# sourceMappingURL=repeat-spec.js.map
