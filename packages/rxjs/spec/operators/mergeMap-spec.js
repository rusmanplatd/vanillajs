'use strict';
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
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var interop_helper_1 = require('../helpers/interop-helper');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('mergeMap', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { x: 10, y: 30, z: 50 };
      var x = cold('    x-x-x|             ', values);
      var xsubs = [
        '               --^----!             ',
        '               --------^----!       ',
        '               -----------^----!    ',
      ];
      var e1 = hot('  --1-----3--5--------|');
      var e1subs = '  ^-------------------!';
      var expected = '--x-x-x-y-yzyz-z----|';
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return x.pipe(
            operators_1.map(function (i) {
              return i * +value;
            })
          );
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.mergeMap(
          function (x) {
            return rxjs_1.of(x, x + 1, x + 2);
          },
          function (a, b, i, ii) {
            return [a, b, i, ii];
          }
        )
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([
            [1, 1, 0, 0],
            [1, 2, 0, 1],
            [1, 3, 0, 2],
            [2, 2, 1, 0],
            [2, 3, 1, 1],
            [2, 4, 1, 2],
            [3, 3, 2, 0],
            [3, 4, 2, 1],
            [3, 5, 2, 2],
          ]);
        },
      });
  });
  it('should support a void resultSelector (still deprecated)', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.mergeMap(
          function (x) {
            return rxjs_1.of(x, x + 1, x + 2);
          },
          void 0
        )
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([1, 2, 3, 2, 3, 4, 3, 4, 5]);
        },
      });
  });
  it('should support a void resultSelector (still deprecated) and concurrency limit', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.mergeMap(
          function (x) {
            return rxjs_1.of(x, x + 1, x + 2);
          },
          void 0,
          1
        )
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([1, 2, 3, 2, 3, 4, 3, 4, 5]);
        },
      });
  });
  it('should mergeMap many regular interval inners', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  ----a---a---a---(a|)                    ');
      var asubs = '   ^---------------!                       ';
      var b = cold('      ----b---b---(b|)                    ');
      var bsubs = '   ----^-----------!                       ';
      var c = cold('                  ----c---c---c---c---(c|)');
      var csubs = '   ----------------^-------------------!   ';
      var d = cold('                          ----(d|)        ');
      var dsubs = '   ------------------------^---!           ';
      var e1 = hot('  a---b-----------c-------d-------|       ');
      var e1subs = '  ^-------------------------------!       ';
      var expected = '----a---(ab)(ab)(ab)c---c---(cd)c---(c|)';
      var observableLookup = { a: a, b: b, c: c, d: d };
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map values to constant resolved promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function () {
      return rxjs_1.from(Promise.resolve(42));
    };
    var results = [];
    source.pipe(operators_1.mergeMap(project)).subscribe({
      next: function (x) {
        results.push(x);
      },
      error: function (err) {
        done(new Error('Subscriber error handler not supposed to be called.'));
      },
      complete: function () {
        chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
        done();
      },
    });
  });
  it('should map values to constant rejected promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function () {
      return rxjs_1.from(Promise.reject(42));
    };
    source.pipe(operators_1.mergeMap(project)).subscribe({
      next: function (x) {
        done(new Error('Subscriber next handler not supposed to be called.'));
      },
      error: function (err) {
        chai_1.expect(err).to.equal(42);
        done();
      },
      complete: function () {
        done(
          new Error('Subscriber complete handler not supposed to be called.')
        );
      },
    });
  });
  it('should map values to resolved promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value, index) {
      return rxjs_1.from(Promise.resolve(value + index));
    };
    var results = [];
    source.pipe(operators_1.mergeMap(project)).subscribe({
      next: function (x) {
        results.push(x);
      },
      error: function (err) {
        done(new Error('Subscriber error handler not supposed to be called.'));
      },
      complete: function () {
        chai_1.expect(results).to.deep.equal([4, 4, 4, 4]);
        done();
      },
    });
  });
  it('should map values to rejected promises and merge', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value, index) {
      return rxjs_1.from(Promise.reject('' + value + '-' + index));
    };
    source.pipe(operators_1.mergeMap(project)).subscribe({
      next: function (x) {
        done(new Error('Subscriber next handler not supposed to be called.'));
      },
      error: function (err) {
        chai_1.expect(err).to.equal('4-0');
        done();
      },
      complete: function () {
        done(
          new Error('Subscriber complete handler not supposed to be called.')
        );
      },
    });
  });
  it('should mergeMap many outer values to many inner values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                        ');
      var xsubs = [
        '               -^-------------------!                        ',
        '               ---------^-------------------!                ',
        '               -----------------^-------------------!        ',
        '               -------------------------^-------------------!',
      ];
      var e1 = hot('  -a-------b-------c-------d-------|            ');
      var e1subs = '  ^--------------------------------!            ';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l---|';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, complete late', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                            ');
      var xsubs = [
        '               -^-------------------!                            ',
        '               ---------^-------------------!                    ',
        '               -----------------^-------------------!            ',
        '               -------------------------^-------------------!    ',
      ];
      var e1 = hot('  -a-------b-------c-------d-----------------------|');
      var e1subs = '  ^------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-------|';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, outer never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                  '
      );
      var xsubs = [
        '               -^-------------------!                                  ',
        '               ---------^-------------------!                          ',
        '               -----------------^-------------------!                  ',
        '               -------------------------^-------------------!          ',
        '               ---------------------------------^-------------------!  ',
        '               -------------------------------------------------^-----!',
      ];
      var e1 = hot(
        '  -a-------b-------c-------d-------e---------------f------'
      );
      var e1subs = '  ^------------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i--';
      var unsub = '   -------------------------------------------------------!';
      var source = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(source, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                  '
      );
      var xsubs = [
        '               -^-------------------!                                  ',
        '               ---------^-------------------!                          ',
        '               -----------------^-------------------!                  ',
        '               -------------------------^-------------------!          ',
        '               ---------------------------------^-------------------!  ',
        '               -------------------------------------------------^-----!',
      ];
      var e1 = hot(
        '  -a-------b-------c-------d-------e---------------f------'
      );
      var e1subs = '  ^------------------------------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)(ki)(lj)k---l---i--';
      var unsub = '   -------------------------------------------------------!';
      var source = e1.pipe(
        operators_1.map(function (x) {
          return x;
        }),
        operators_1.mergeMap(function () {
          return x;
        }),
        operators_1.map(function (x) {
          return x;
        })
      );
      expectObservable(source, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|           ');
      var xsubs = '   ---------^-----------!                ';
      var y = cold('                     ---f---g---h---i--|');
      var ysubs = '   -------------------^-!                ';
      var e1 = hot('  ---------x---------y---------|        ');
      var e1subs = '  ^--------------------!                ';
      var expected = '-----------a--b--c--d-                ';
      var unsub = '   ---------------------!                ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.mergeMap(function (value) {
          return interop_helper_1.asInteropObservable(observableLookup[value]);
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, inner never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l-------------------------');
      var xsubs = [
        '               -^-----------------------------------------',
        '               ---------^---------------------------------',
        '               -----------------^-------------------------',
        '               -------------------------^-----------------',
      ];
      var e1 = hot('  -a-------b-------c-------d-------|         ');
      var e1subs = '  ^--------------------------------!         ';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)(lj)k---l-';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, and inner throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l-------#   ');
      var xsubs = [
        '               -^-----------------------!   ',
        '               ---------^---------------!   ',
        '               -----------------^-------!   ',
        '               -------------------------(^!)',
      ];
      var e1 = hot('  -a-------b-------c-------d   ');
      var e1subs = '  ^------------------------!   ';
      var expected = '-----i---j---(ki)(lj)(ki)#   ';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, and outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|            ');
      var xsubs = [
        '               -^-------------------!            ',
        '               ---------^-------------------!    ',
        '               -----------------^---------------!',
        '               -------------------------^-------!',
      ];
      var e1 = hot('  -a-------b-------c-------d-------#');
      var e1subs = '  ^--------------------------------!';
      var expected = '-----i---j---(ki)(lj)(ki)(lj)(ki)#';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to many inner, both inner and outer throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---#            ');
      var xsubs = [
        '               -^-------------------!            ',
        '               ---------^-----------!            ',
        '               -----------------^---!            ',
      ];
      var e1 = hot('  -a-------b-------c-------d-------#');
      var e1subs = '  ^--------------------!            ';
      var expected = '-----i---j---(ki)(lj)#            ';
      var result = e1.pipe(
        operators_1.mergeMap(function () {
          return x;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap to many cold Observable, with parameter concurrency=1', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold(
        '   ----i---j---k---l---|                                        '
      );
      var xsubs = [
        '               -^-------------------!                                        ',
        '               ---------------------^-------------------!                    ',
        '               -----------------------------------------^-------------------!',
      ];
      var e1 = hot(
        '  -a-------b-------c---|                                        '
      );
      var e1subs =
        '  ^--------------------!                                        ';
      var expected =
        '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
      var project = function () {
        return x;
      };
      var result = e1.pipe(operators_1.mergeMap(project, 1));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap to many cold Observable, with parameter concurrency=2', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('   ----i---j---k---l---|                    ');
      var xsubs = [
        '               -^-------------------!                    ',
        '               ---------^-------------------!            ',
        '               ---------------------^-------------------!',
      ];
      var e1 = hot('  -a-------b-------c---|                    ');
      var e1subs = '  ^--------------------!                    ';
      var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
      var project = function () {
        return x;
      };
      var result = e1.pipe(operators_1.mergeMap(project, 2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap to many hot Observable, with parameter concurrency=1', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot(
        '   x----i---j---k---l---|                                        '
      );
      var asubs =
        '   -^-------------------!                                        ';
      var b = hot(
        '   -x-x-xxxx-x-x-xxxxx-x----i---j---k---l---|                    '
      );
      var bsubs =
        '   ---------------------^-------------------!                    ';
      var c = hot(
        '   x-xxxx---x-x-x-x-x-xx--x--x-x--x--xxxx-x-----i---j---k---l---|'
      );
      var csubs =
        '   -----------------------------------------^-------------------!';
      var e1 = hot(
        '  -a-------b-------c---|                                        '
      );
      var e1subs =
        '  ^--------------------!                                        ';
      var expected =
        '-----i---j---k---l-------i---j---k---l-------i---j---k---l---|';
      var inners = { a: a, b: b, c: c };
      var project = function (x) {
        return inners[x];
      };
      var result = e1.pipe(operators_1.mergeMap(project, 1));
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap to many hot Observable, with parameter concurrency=2', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   x----i---j---k---l---|                    ');
      var xsubs = '   -^-------------------!                    ';
      var y = hot('   -x-x-xxxx----i---j---k---l---|            ');
      var ysubs = '   ---------^-------------------!            ';
      var z = hot('   x-xxxx---x-x-x-x-x-xx----i---j---k---l---|');
      var zsubs = '   ---------------------^-------------------!';
      var e1 = hot('  -a-------b-------c---|                    ');
      var e1subs = '  ^--------------------!                    ';
      var expected = '-----i---j---(ki)(lj)k---(li)j---k---l---|';
      var inners = { a: x, b: y, c: z };
      var project = function (x) {
        return inners[x];
      };
      var result = e1.pipe(operators_1.mergeMap(project, 2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, where all inners are finite', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^------------------------------!             ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^--------------!                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^------------------------------!';
      var f = cold('                                      --|            ');
      var fsubs = '       --------------------------------^-!            ';
      var g = cold('                                            ---1-2|  ');
      var gsubs = '       --------------------------------------^-----!  ';
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g|       ');
      var e1subs = '      ^--------------------------------------!       ';
      var expected = '    ---2--3--4--5---1--2--3--2--3--6--4--5---1-2--|';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, all inners finite except one', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^------------------------------!             ';
      var d = cold('              -----------2--3-                       ');
      var dsubs = '       --------^---------------                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^------------------------------!';
      var f = cold('                                      --|            ');
      var fsubs = '       --------------------------------^-!            ';
      var g = cold('                                            ---1-2|  ');
      var gsubs = '       --------------------------------------^-----!  ';
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g|       ');
      var e1subs = '      ^--------------------------------------!       ';
      var expected = '    ---2--3--4--5---1--2--3--2--3--6--4--5---1-2---';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, inners finite, outer does not complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^------------------------------!             ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^--------------!                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^------------------------------!';
      var f = cold('                                      --|            ');
      var fsubs = '       --------------------------------^-!            ';
      var g = cold('                                            ---1-2|  ');
      var gsubs = '       --------------------------------------^-----!  ';
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g--------');
      var e1subs = '      ^----------------------------------------------';
      var expected = '    ---2--3--4--5---1--2--3--2--3--6--4--5---1-2---';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, all inners finite, and outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^------------------------------!             ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^--------------!                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^-----------------------!       ';
      var f = cold('                                      --|            ');
      var fsubs = '       --------------------------------^-!            ';
      var g = cold('                                            ---1-2|  ');
      var gsubs = '       --------------------------------------^!       ';
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g#       ');
      var e1subs = '      ^--------------------------------------!       ';
      var expected = '    ---2--3--4--5---1--2--3--2--3--6--4--5-#       ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, all inners complete except one throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-#             ');
      var csubs = '       --^------------------------------!             ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^--------------!                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^-----------------!             ';
      var f = cold('                                      --|            ');
      var fsubs = '       --------------------------------^!             ';
      var g = cold('                                            ---1-2|  ');
      var gsubs = [];
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g|       ');
      var e1subs = '      ^--------------------------------!             ';
      var expected = '    ---2--3--4--5---1--2--3--2--3--6-#             ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, all inners finite, outer is unsubscribed', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^---------------------------!                ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^--------------!                       ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = '       ---------------^--------------!                ';
      var f = cold('                                      --|            ');
      var fsubs = [];
      var g = cold('                                            ---1-2|  ');
      var gsubs = [];
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g|');
      var e1subs = '      ^-----------------------------!                ';
      var expected = '    ---2--3--4--5---1--2--3--2--3--                ';
      var unsub = '       ------------------------------!                ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(source, unsub).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many complex, all inners finite, project throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(' -#                                                  ');
      var asubs = [];
      var b = cold('   -#                                                ');
      var bsubs = [];
      var c = cold('        -2--3--4--5------------------6-|             ');
      var csubs = '       --^------------!                               ';
      var d = cold('              -----------2--3|                       ');
      var dsubs = '       --------^------!                               ';
      var e = cold('                     -1--------2--3-----4--5--------|');
      var esubs = [];
      var f = cold('                                      --|            ');
      var fsubs = [];
      var g = cold('                                            ---1-2|  ');
      var gsubs = [];
      var e1 = hot('-a-b--^-c-----d------e----------------f-----g|       ');
      var e1subs = '      ^--------------!                               ';
      var expected = '    ---2--3--4--5--#                               ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          if (value === 'e') {
            throw 'error';
          }
          return observableLookup[value];
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  /**
   *
   * @param value
   * @param times
   */
  function arrayRepeat(value, times) {
    var results = [];
    for (var i = 0; i < times; i++) {
      results.push(value);
    }
    return results;
  }
  it('should mergeMap many outer to an array for each value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^-------------------------------!';
      var expected = '(22)--(4444)---(333)----(22)----|';
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to inner arrays, and outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------#');
      var e1subs = '  ^-------------------------------!';
      var expected = '(22)--(4444)---(333)----(22)----#';
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to inner arrays, outer gets unsubscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^------------!                   ';
      var expected = '(22)--(4444)--                   ';
      var unsub = '   -------------!                   ';
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(source, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeMap many outer to inner arrays, project throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^--------------!                 ';
      var expected = '(22)--(4444)---#                 ';
      var source = e1.pipe(
        operators_1.mergeMap(function (value) {
          if (value === '3') {
            throw 'error';
          }
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map and flatten', function () {
    var source = rxjs_1.of(1, 2, 3, 4).pipe(
      operators_1.mergeMap(function (x) {
        return rxjs_1.of(x + '!');
      })
    );
    var expected = ['1!', '2!', '3!', '4!'];
    var completed = false;
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        completed = true;
      },
    });
    chai_1.expect(completed).to.be.true;
  });
  it('should map and flatten an Array', function () {
    var source = rxjs_1.of(1, 2, 3, 4).pipe(
      operators_1.mergeMap(function (x) {
        return [x + '!'];
      })
    );
    var expected = ['1!', '2!', '3!', '4!'];
    var completed = false;
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        completed = true;
      },
    });
    chai_1.expect(completed).to.be.true;
  });
  it('should support nested merges', function (done) {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.mergeMap(function () {
          return rxjs_1
            .defer(function () {
              return rxjs_1.of(2, rxjs_1.asapScheduler);
            })
            .pipe(
              operators_1.mergeMap(function () {
                return rxjs_1.defer(function () {
                  return rxjs_1.of(3, rxjs_1.asapScheduler);
                });
              })
            );
        })
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        complete: function () {
          results.push('done');
        },
      });
    setTimeout(function () {
      chai_1.expect(results).to.deep.equal([3, 'done']);
      done();
    }, 0);
  });
  it('should support nested merges with promises', function (done) {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.mergeMap(function () {
          return rxjs_1.from(Promise.resolve(2)).pipe(
            operators_1.mergeMap(function () {
              return Promise.resolve(3);
            })
          );
        })
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        complete: function () {
          results.push('done');
        },
      });
    setTimeout(function () {
      chai_1.expect(results).to.deep.equal([3, 'done']);
      done();
    }, 0);
  });
  it('should support wrapped sources', function (done) {
    var results = [];
    var wrapped = new rxjs_1.Observable(function (subscriber) {
      var subscription = rxjs_1
        .timer(0, rxjs_1.asapScheduler)
        .subscribe(subscriber);
      return function () {
        return subscription.unsubscribe();
      };
    });
    wrapped
      .pipe(
        operators_1.mergeMap(function () {
          return rxjs_1.timer(0, rxjs_1.asapScheduler);
        })
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        complete: function () {
          results.push('done');
        },
      });
    setTimeout(function () {
      chai_1.expect(results).to.deep.equal([0, 'done']);
      done();
    }, 0);
  });
  it('should properly handle errors from iterables that are processed after some async', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var noXError = new Error('we do not allow x');
      var e1 = cold(' -----a------------b-----|', {
        a: ['o', 'o', 'o'],
        b: ['o', 'x', 'o'],
      });
      var e1subs = '  ^-----------------!      ';
      var expected = '-----(ooo)--------(o#)   ';
      var iterable = function (data) {
        var data_1, data_1_1, d, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 5, 6, 7]);
              ((data_1 = __values(data)), (data_1_1 = data_1.next()));
              _b.label = 1;
            case 1:
              if (data_1_1.done) return [3, 4];
              d = data_1_1.value;
              if (d === 'x') {
                throw noXError;
              }
              return [4, d];
            case 2:
              _b.sent();
              _b.label = 3;
            case 3:
              data_1_1 = data_1.next();
              return [3, 1];
            case 4:
              return [3, 7];
            case 5:
              e_1_1 = _b.sent();
              e_1 = { error: e_1_1 };
              return [3, 7];
            case 6:
              try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return))
                  _a.call(data_1);
              } finally {
                if (e_1) throw e_1.error;
              }
              return [7];
            case 7:
              return [2];
          }
        });
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1
            .of(x)
            .pipe(operators_1.delay(0), operators_1.mergeMap(iterable));
        })
      );
      expectObservable(result).toBe(expected, undefined, noXError);
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
        operators_1.mergeMap(function (value) {
          return rxjs_1.of(value);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=mergeMap-spec.js.map
