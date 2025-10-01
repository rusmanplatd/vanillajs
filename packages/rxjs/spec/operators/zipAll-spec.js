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
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('zipAll operator', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should combine paired events from two observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable;
      var x = cold('                  -a-----b-|');
      var y = cold('                  --1-2-----');
      var outer = hot('-x----y--------|         ', { x: x, y: y });
      var expected = ' -----------------A----B-|';
      var result = outer.pipe(
        operators_1.zipAll(function (a, b) {
          return a + b;
        })
      );
      expectObservable(result).toBe(expected, { A: 'a1', B: 'b2' });
    });
  });
  it('should combine two observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1---2---3---');
      var asubs = '   ^';
      var b = hot('   --4--5--6--7--8--');
      var bsubs = '   ^';
      var expected = '---x---y---z';
      var values = { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] };
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected,
        values
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should take all observables from the source and zip them', function (done) {
    var expected = ['a1', 'b2', 'c3'];
    var i = 0;
    rxjs_1
      .of(rxjs_1.of('a', 'b', 'c'), rxjs_1.of(1, 2, 3))
      .pipe(
        operators_1.zipAll(function (a, b) {
          return a + b;
        })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected[i++]);
        },
        complete: done,
      });
  });
  it('should end once one observable completes and its buffer is empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b--c--|               ');
      var e1subs = '  ^-----------!               ';
      var e2 = hot('  ------d----e----f--------|  ');
      var e2subs = '  ^-----------------!         ';
      var e3 = hot('  --------h----i----j---------');
      var e3subs = '  ^-----------------!         ';
      var expected = '--------x----y----(z|)      ';
      var values = {
        x: ['a', 'd', 'h'],
        y: ['b', 'e', 'i'],
        z: ['c', 'f', 'j'],
      };
      expectObservable(rxjs_1.of(e1, e2, e3).pipe(operators_1.zipAll())).toBe(
        expected,
        values
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should end once one observable nexts and zips value from completed other observable whose buffer is empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b--c--|             ');
      var e1subs = '  ^-----------!             ';
      var e2 = hot('  ------d----e----f|        ');
      var e2subs = '  ^----------------!        ';
      var e3 = hot('  --------h----i----j-------');
      var e3subs = '  ^-----------------!       ';
      var expected = '--------x----y----(z|)    ';
      var values = {
        x: ['a', 'd', 'h'],
        y: ['b', 'e', 'i'],
        z: ['c', 'f', 'j'],
      };
      expectObservable(rxjs_1.of(e1, e2, e3).pipe(operators_1.zipAll())).toBe(
        expected,
        values
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  describe('with iterables', function () {
    it('should zip them with values', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var myIterator = (function () {
          var i;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < 4)) return [3, 4];
                return [4, i];
              case 2:
                _a.sent();
                _a.label = 3;
              case 3:
                i++;
                return [3, 1];
              case 4:
                return [2];
            }
          });
        })();
        var e1 = hot('  ---a---b---c---d---|');
        var e1subs = '  ^--------------!';
        var expected = '---w---x---y---(z|)';
        var values = {
          w: ['a', 0],
          x: ['b', 1],
          y: ['c', 2],
          z: ['d', 3],
        };
        expectObservable(
          rxjs_1.of(e1, myIterator).pipe(operators_1.zipAll())
        ).toBe(expected, values);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should complete instantly with never observable and empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = cold('  -');
        var asubs = '   (^!)';
        var b = [];
        var expected = '|';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with empty observable and empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = cold('  |');
        var asubs = '   (^!)';
        var b = [];
        var expected = '|';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with empty observable and non-empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = cold('  |');
        var asubs = '   (^!)';
        var b = [1];
        var expected = '|';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with non-empty observable and empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = hot('---^----a--|');
        var asubs = '   (^!)';
        var b = [];
        var expected = '|';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with never observable and non-empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = cold('  -');
        var asubs = '   ^';
        var b = [1];
        var expected = '-';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with non-empty observable and non-empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = hot('---^----1--|');
        var asubs = '   ^----!   ';
        var b = [2];
        var expected = '-----(x|)';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected,
          { x: ['1', 2] }
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with observable which raises error and non-empty iterable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = hot('---^----#');
        var asubs = '   ^----!';
        var b = [1];
        var expected = '-----#';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with non-empty many observable and non-empty many iterable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = hot('---^--1--2--3--|');
        var asubs = '   ^--------!   ';
        var b = [4, 5, 6];
        var expected = '---x--y--(z|)';
        expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
          expected,
          { x: ['1', 4], y: ['2', 5], z: ['3', 6] }
        );
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
    it('should work with non-empty observable and non-empty iterable selector that throws', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var a = hot('---^--1--2--3--|');
        var asubs = '   ^-----!';
        var b = [4, 5, 6];
        var expected = '---x--#';
        var selector = function (x, y) {
          if (y === 5) {
            throw new Error('too bad');
          } else {
            return x + y;
          }
        };
        expectObservable(
          rxjs_1.of(a, b).pipe(operators_1.zipAll(selector))
        ).toBe(expected, { x: '14' }, new Error('too bad'));
        expectSubscriptions(a.subscriptions).toBe(asubs);
      });
    });
  });
  it('should combine two observables and selector', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1---2---3---');
      var asubs = '   ^';
      var b = hot('   --4--5--6--7--8--');
      var bsubs = '   ^';
      var expected = '---x---y---z';
      expectObservable(
        rxjs_1.of(a, b).pipe(
          operators_1.zipAll(function (e1, e2) {
            return e1 + e2;
          })
        )
      ).toBe(expected, { x: '14', y: '25', z: '36' });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with n-ary symmetric', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1-^-1----4----|');
      var asubs = '        ^---------!  ';
      var b = hot('   ---1-^--2--5----| ');
      var bsubs = '        ^---------!  ';
      var c = hot('   ---1-^---3---6-|  ');
      var expected = '     ----x---y-|  ';
      expectObservable(rxjs_1.of(a, b, c).pipe(operators_1.zipAll())).toBe(
        expected,
        { x: ['1', '2', '3'], y: ['4', '5', '6'] }
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with n-ary symmetric selector', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^-1----4----|');
      var asubs = '     ^---------!  ';
      var b = hot('---1-^--2--5----| ');
      var bsubs = '     ^---------!  ';
      var c = hot('---1-^---3---6-|  ');
      var expected = '  ----x---y-|  ';
      var observable = rxjs_1.of(a, b, c).pipe(
        operators_1.zipAll(function (r0, r1, r2) {
          return [r0, r1, r2];
        })
      );
      expectObservable(observable).toBe(expected, {
        x: ['1', '2', '3'],
        y: ['4', '5', '6'],
      });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with n-ary symmetric array selector', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1-^-1----4----|');
      var asubs = '        ^---------!  ';
      var b = hot('   ---1-^--2--5----| ');
      var bsubs = '        ^---------!  ';
      var c = hot('   ---1-^---3---6-|  ');
      var expected = '     ----x---y-|  ';
      var observable = rxjs_1.of(a, b, c).pipe(
        operators_1.zipAll(function (r0, r1, r2) {
          return [r0, r1, r2];
        })
      );
      expectObservable(observable).toBe(expected, {
        x: ['1', '2', '3'],
        y: ['4', '5', '6'],
      });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with some data asymmetric 1', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
      var asubs = '     ^-----------------!    ';
      var b = hot('---1-^--2--4--6--8--0--|    ');
      var bsubs = '     ^-----------------!    ';
      var expected = '  ---a--b--c--d--e--|    ';
      expectObservable(
        rxjs_1.of(a, b).pipe(
          operators_1.zipAll(function (r1, r2) {
            return r1 + r2;
          })
        )
      ).toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with some data asymmetric 2', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^--2--4--6--8--0--|    ');
      var asubs = '     ^-----------------!    ';
      var b = hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
      var bsubs = '     ^-----------------!    ';
      var expected = '  ---a--b--c--d--e--|    ';
      expectObservable(
        rxjs_1.of(a, b).pipe(
          operators_1.zipAll(function (r1, r2) {
            return r1 + r2;
          })
        )
      ).toBe(expected, { a: '21', b: '43', c: '65', d: '87', e: '09' });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with some data symmetric', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^-1-3-5-7-9------| ');
      var asubs = '     ^----------------! ';
      var b = hot('---1-^--2--4--6--8--0--|');
      var bsubs = '     ^----------------! ';
      var expected = '  ---a--b--c--d--e-| ';
      expectObservable(
        rxjs_1.of(a, b).pipe(
          operators_1.zipAll(function (r1, r2) {
            return r1 + r2;
          })
        )
      ).toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with selector throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^-2---4----|  ');
      var asubs = '     ^-------!     ';
      var b = hot('---1-^--3----5----|');
      var bsubs = '     ^-------!     ';
      var expected = '  ---x----#     ';
      var selector = function (x, y) {
        if (y === '5') {
          throw new Error('too bad');
        } else {
          return x + y;
        }
      };
      var observable = rxjs_1.of(a, b).pipe(operators_1.zipAll(selector));
      expectObservable(observable).toBe(
        expected,
        { x: '23' },
        new Error('too bad')
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with right completes first', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('---1-^-2-----|');
      var asubs = '     ^-----!';
      var b = hot('---1-^--3--|');
      var bsubs = '     ^-----!';
      var expected = '  ---x--|';
      expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['2', '3'] });
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should zip until one child terminates', function (done) {
    var expected = ['a1', 'b2'];
    var i = 0;
    rxjs_1
      .of(rxjs_1.of('a', 'b', 'c'), rxjs_1.of(1, 2))
      .pipe(
        operators_1.zipAll(function (a, b) {
          return a + b;
        })
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected[i++]);
        },
        complete: done,
      });
  });
  it('should handle a hot observable of observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('          a---b---c---|      ');
      var xsubs = '   --------^-----------!';
      var y = cold('          d---e---f---|   ');
      var ysubs = '   --------^-----------!';
      var e1 = hot('  --x--y--|            ', { x: x, y: y });
      var e1subs = '  ^-------!            ';
      var expected = '--------u---v---w---|';
      var values = {
        u: ['a', 'd'],
        v: ['b', 'e'],
        w: ['c', 'f'],
      };
      expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected, values);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle merging a hot observable of non-overlapped observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('                             a-b---------|');
      var xsubs = '   ---------------------------^-----------!';
      var y = cold('                             c-d-e-f-|');
      var ysubs = '   ---------------------------^-------!';
      var z = cold('                             g-h-i-j-k-|');
      var zsubs = '   ---------------------------^---------!';
      var e1 = hot('  --x------y--------z--------|            ', {
        x: x,
        y: y,
        z: z,
      });
      var e1subs = '  ^--------------------------!            ';
      var expected = '---------------------------u-v---------|';
      var values = {
        u: ['a', 'c', 'g'],
        v: ['b', 'd', 'h'],
      };
      expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected, values);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if inner observable raises error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('                                a-b---------|');
      var xsubs = '   ------------------------------^-------!';
      var y = cold('                                c-d-e-f-#');
      var ysubs = '   ------------------------------^-------!';
      var z = cold('                                g-h-i-j-k-|');
      var zsubs = '   ------------------------------^-------!';
      var e1 = hot('  --x---------y--------z--------|        ', {
        x: x,
        y: y,
        z: z,
      });
      var e1subs = '  ^-----------------------------!        ';
      var expected = '------------------------------u-v-----#';
      var expectedValues = {
        u: ['a', 'c', 'g'],
        v: ['b', 'd', 'h'],
      };
      expectObservable(e1.pipe(operators_1.zipAll())).toBe(
        expected,
        expectedValues
      );
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if outer observable raises error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var y = cold('  a-b---------|');
      var z = cold('  c-d-e-f-|');
      var e1 = hot('  --y---------z---#', { y: y, z: z });
      var e1subs = '  ^---------------!';
      var expected = '----------------#';
      expectObservable(e1.pipe(operators_1.zipAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with two nevers', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  -');
      var asubs = '   ^';
      var b = cold('  -');
      var bsubs = '   ^';
      var expected = '-';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with never and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  -');
      var asubs = '   (^!)';
      var b = cold('  |');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with empty and never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  |');
      var asubs = '   (^!)';
      var b = cold('  -');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with empty and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  |');
      var asubs = '   (^!)';
      var b = cold('  |');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with empty and non-empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  |');
      var asubs = '   (^!)';
      var b = hot('   ---1--|');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with non-empty and empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1--|');
      var asubs = '   (^!)';
      var b = cold('  |');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with never and non-empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  -');
      var asubs = '   ^';
      var b = hot('   ---1--|');
      var bsubs = '   ^-----!';
      var expected = '-';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with non-empty and never', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1--|');
      var asubs = '   ^-----!';
      var b = cold('  -');
      var bsubs = '   ^';
      var expected = '-';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should combine a source with a second', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1---2---3---');
      var asubs = '   ^';
      var b = hot('   --4--5--6--7--8--');
      var bsubs = '   ^';
      var expected = '---x---y---z';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected,
        { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] }
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with empty and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  |');
      var asubs = '   (^!)';
      var b = hot('   ------#', undefined, 'too bad');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with error and empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ------#', undefined, 'too bad');
      var asubs = '   (^!)';
      var b = cold('  |');
      var bsubs = '   (^!)';
      var expected = '|';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ----------|');
      var asubs = '   ^-----!    ';
      var b = hot('   ------#    ');
      var bsubs = '   ^-----!    ';
      var expected = '------#    ';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with never and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  -');
      var asubs = '   ^-----!';
      var b = hot('   ------#');
      var bsubs = '   ^-----!';
      var expected = '------#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with error and never', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ------#');
      var asubs = '   ^-----!';
      var b = cold('  -');
      var bsubs = '   ^-----!';
      var expected = '------#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with error and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ------#', undefined, 'too bad');
      var asubs = '   ^-----!';
      var b = hot('   ----------#', undefined, 'too bad 2');
      var bsubs = '   ^-----!';
      var expected = '------#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected,
        null,
        'too bad'
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with two sources that eventually raise errors', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   --w-----#----', { w: 1 }, 'too bad');
      var asubs = '   ^-------!';
      var b = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
      var bsubs = '   ^-------!';
      var expected = '-----x--#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected,
        { x: [1, 2] },
        'too bad'
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with two sources that eventually raise errors (swapped)', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
      var asubs = '   ^-------!';
      var b = hot('   --w-----#', { w: 1 }, 'too bad');
      var bsubs = '   ^-------!';
      var expected = '-----x--#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected,
        { x: [2, 1] },
        'too bad'
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should work with error and some', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  #');
      var asubs = '   (^!)';
      var b = hot('   --1--2--3--');
      var bsubs = '   (^!)';
      var expected = '#';
      expectObservable(rxjs_1.of(a, b).pipe(operators_1.zipAll())).toBe(
        expected
      );
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should combine two immediately-scheduled observables', function (done) {
    rxTestScheduler.run(function () {
      var a = rxjs_1.scheduled([1, 2, 3], rxjs_1.queueScheduler);
      var b = rxjs_1.scheduled([4, 5, 6, 7, 8], rxjs_1.queueScheduler);
      var r = [
        [1, 4],
        [2, 5],
        [3, 6],
      ];
      var i = 0;
      var result = rxjs_1
        .scheduled([a, b], rxjs_1.queueScheduler)
        .pipe(operators_1.zipAll());
      result.subscribe({
        next: function (vals) {
          chai_1.expect(vals).to.deep.equal(r[i++]);
        },
        complete: done,
      });
    });
  });
  it('should combine a source with an immediately-scheduled source', function (done) {
    var a = rxjs_1.scheduled([1, 2, 3], rxjs_1.queueScheduler);
    var b = rxjs_1.of(4, 5, 6, 7, 8);
    var r = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    var i = 0;
    var result = rxjs_1
      .scheduled([a, b], rxjs_1.queueScheduler)
      .pipe(operators_1.zipAll());
    result.subscribe({
      next: function (vals) {
        chai_1.expect(vals).to.deep.equal(r[i++]);
      },
      complete: done,
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = hot('   ---1---2---3---|');
      var unsub = '   ---------!';
      var asubs = '   ^--------!';
      var b = hot('   --4--5--6--7--8--|');
      var bsubs = '   ^--------!';
      var expected = '---x---y--';
      var values = { x: ['1', '4'], y: ['2', '5'] };
      var r = rxjs_1.of(a, b).pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.zipAll(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(r, unsub).toBe(expected, values);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
  });
  it('should complete when empty source', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var source = hot('|');
      var expected = '  |';
      expectObservable(source.pipe(operators_1.zipAll())).toBe(expected);
    });
  });
});
//# sourceMappingURL=zipAll-spec.js.map
