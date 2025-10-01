'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
var addDrama = function (x) {
  return x + '!';
};
describe('map', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map multiple values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^----------!';
      var expected = '--x--y--z--|';
      var result = e1.pipe(
        operators_1.map(function (x) {
          return 10 * +x;
        })
      );
      expectObservable(result).toBe(expected, { x: 10, y: 20, z: 30 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map one value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { x: 42 };
      var e1 = cold(' --x--|', values);
      var e1subs = '  ^----!';
      var expected = '--y--|';
      var result = e1.pipe(operators_1.map(addDrama));
      expectObservable(result).toBe(expected, { y: '42!' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map multiple values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^----------!';
      var expected = '--x--y--z--|';
      var result = e1.pipe(operators_1.map(addDrama));
      expectObservable(result).toBe(expected, { x: '1!', y: '2!', z: '3!' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from map function', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { x: 42 };
      var e1 = cold(' --x--|', values);
      var e1subs = '  ^-!   ';
      var expected = '--#   ';
      var result = e1.pipe(
        operators_1.map(function (x) {
          throw 'too bad';
        })
      );
      expectObservable(result).toBe(expected, null, 'too bad');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from observable that emits only errors', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var result = e1.pipe(operators_1.map(rxjs_1.identity));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from observable that emit values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 1, b: 2 };
      var e1 = cold(' --a--b--#', values, 'too bad');
      var e1subs = '  ^-------!';
      var expected = '--x--y--#';
      var result = e1.pipe(operators_1.map(addDrama));
      expectObservable(result).toBe(expected, { x: '1!', y: '2!' }, 'too bad');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not map an empty observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var invoked = 0;
      var result = e1.pipe(
        operators_1.map(function (x) {
          invoked++;
          return x;
        }),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(0);
          },
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^-----!     ';
      var expected = '--x--y-     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(operators_1.map(addDrama));
      expectObservable(result, unsub).toBe(expected, { x: '1!', y: '2!' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map with index', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-5-^-4--3---2----1--|');
      var e1subs = '   ^----------------!';
      var expected = ' --a--b---c----d--|';
      var values = { a: 5, b: 14, c: 23, d: 32 };
      var invoked = 0;
      var result = e1.pipe(
        operators_1.map(function (x, index) {
          invoked++;
          return parseInt(x) + 1 + index * 10;
        }),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(4);
          },
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map with index until completed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-5-^-4--3---2----1--|');
      var e1subs = '   ^----------------!';
      var expected = ' --a--b---c----d--|';
      var values = { a: 5, b: 14, c: 23, d: 32 };
      var invoked = 0;
      var result = e1.pipe(
        operators_1.map(function (x, index) {
          invoked++;
          return parseInt(x) + 1 + index * 10;
        }),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(4);
          },
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map with index until an error occurs', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-5-^-4--3---2----1--#', undefined, 'too bad');
      var e1subs = '   ^----------------!';
      var expected = ' --a--b---c----d--#';
      var values = { a: 5, b: 14, c: 23, d: 32 };
      var invoked = 0;
      var result = e1.pipe(
        operators_1.map(function (x, index) {
          invoked++;
          return parseInt(x) + 1 + index * 10;
        }),
        operators_1.tap({
          error: function () {
            chai_1.expect(invoked).to.equal(4);
          },
        })
      );
      expectObservable(result).toBe(expected, values, 'too bad');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map using a custom thisArg', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-5-^-4--3---2----1--|');
      var e1subs = '   ^----------------!';
      var expected = ' --a--b---c----d--|';
      var values = { a: 46, b: 55, c: 64, d: 73 };
      var foo = {
        value: 42,
      };
      var result = e1.pipe(
        operators_1.map(function (x, index) {
          chai_1.expect(this).to.equal(foo);
          return parseInt(x) + foo.value + index * 10;
        }, foo)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map twice', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-0----1-^-2---3--4-5--6--7-8-|');
      var e1subs = '        ^--------------------!';
      var expected = '      --a---b--c-d--e--f-g-|';
      var values = { a: 2, b: 3, c: 4, d: 5, e: 6, f: 7, g: 8 };
      var invoked1 = 0;
      var invoked2 = 0;
      var result = e1.pipe(
        operators_1.map(function (x) {
          invoked1++;
          return parseInt(x) * 2;
        }),
        operators_1.map(function (x) {
          invoked2++;
          return x / 2;
        }),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked1).to.equal(7);
            chai_1.expect(invoked2).to.equal(7);
          },
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should do multiple maps using a custom thisArg', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --1--2--3--4--|');
      var e1subs = '  ^-------------!';
      var expected = '--a--b--c--d--|';
      var values = { a: 11, b: 14, c: 17, d: 20 };
      var Filterer = (function () {
        /**
         *
         */
        function Filterer() {
          this.selector1 = function (x) {
            return parseInt(x) + 2;
          };
          this.selector2 = function (x) {
            return parseInt(x) * 3;
          };
        }
        return Filterer;
      })();
      var filterer = new Filterer();
      var result = e1.pipe(
        operators_1.map(function (x) {
          return this.selector1(x);
        }, filterer),
        operators_1.map(function (x) {
          return this.selector2(x);
        }, filterer),
        operators_1.map(function (x) {
          return this.selector1(x);
        }, filterer)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^-----!     ';
      var expected = '--x--y-     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.map(addDrama),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, { x: '1!', y: '2!' });
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
      .pipe(operators_1.map(rxjs_1.identity), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=map-spec.js.map
