'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('scan', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should scan', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 3,
        c: 5,
        x: 1,
        y: 4,
        z: 9,
      };
      var e1 = hot('  --a--b--c--|', values);
      var e1subs = '  ^----------!';
      var expected = '--x--y--z--|';
      var scanFunction = function (o, x) {
        return o + x;
      };
      expectObservable(e1.pipe(operators_1.scan(scanFunction, 0))).toBe(
        expected,
        values
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should scan things', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ---u--v--w--x--y--z--|';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
        x: ['b', 'c', 'd', 'e'],
        y: ['b', 'c', 'd', 'e', 'f'],
        z: ['b', 'c', 'd', 'e', 'f', 'g'],
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should provide the proper index if seed is skipped', function () {
    var expected = [1, 2];
    rxjs_1
      .of(3, 3, 3)
      .pipe(
        operators_1.scan(function (_, __, i) {
          chai_1.expect(i).to.equal(expected.shift());
          return null;
        })
      )
      .subscribe();
  });
  it('should scan with a seed of undefined', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ---u--v--w--x--y--z--|';
      var values = {
        u: 'undefined b',
        v: 'undefined b c',
        w: 'undefined b c d',
        x: 'undefined b c d e',
        y: 'undefined b c d e f',
        z: 'undefined b c d e f g',
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc + ' ' + x;
        }, undefined)
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should scan without seed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--|');
      var e1subs = '     ^-----------!';
      var expected = '   ---x--y--z--|';
      var values = {
        x: 'b',
        y: 'bc',
        z: 'bcd',
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc + x;
        })
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle errors', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--#');
      var e1subs = '     ^-----------!';
      var expected = '   ---u--v--w--#';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle errors in the projection function', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------!            ';
      var expected = '   ---u--v--#            ';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
        x: ['b', 'c', 'd', 'e'],
        y: ['b', 'c', 'd', 'e', 'f'],
        z: ['b', 'c', 'd', 'e', 'f', 'g'],
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          if (x === 'd') {
            throw 'bad!';
          }
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected, values, 'bad!');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('handle empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('handle never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('handle throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var unsub = '      --------------!       ';
      var e1subs = '     ^-------------!       ';
      var expected = '   ---u--v--w--x--       ';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
        x: ['b', 'c', 'd', 'e'],
        y: ['b', 'c', 'd', 'e', 'f'],
        z: ['b', 'c', 'd', 'e', 'f', 'g'],
      };
      var source = e1.pipe(
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, [])
      );
      expectObservable(source, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^-------------!       ';
      var expected = '   ---u--v--w--x--       ';
      var unsub = '      --------------!       ';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
        x: ['b', 'c', 'd', 'e'],
        y: ['b', 'c', 'd', 'e', 'f'],
        z: ['b', 'c', 'd', 'e', 'f', 'g'],
      };
      var source = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.scan(function (acc, x) {
          return acc.concat(x);
        }, []),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(source, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should pass current index to accumulator', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 3,
        c: 5,
        x: 1,
        y: 4,
        z: 9,
      };
      var idx = [0, 1, 2];
      var e1 = hot('  --a--b--c--|', values);
      var e1subs = '  ^----------!';
      var expected = '--x--y--z--|';
      var scanFunction = function (o, value, index) {
        chai_1.expect(index).to.equal(idx.shift());
        return o + value;
      };
      var scanObs = e1.pipe(
        operators_1.scan(scanFunction, 0),
        operators_1.finalize(function () {
          chai_1.expect(idx).to.be.empty;
        })
      );
      expectObservable(scanObs).toBe(expected, values);
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
        operators_1.scan(function (_acc, value) {
          return value;
        }, 0),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=scan-spec.js.map
