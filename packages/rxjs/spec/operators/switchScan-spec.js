'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('switchScan', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable while passing the accumulated value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --1-----3--5-------|');
      var e1subs = '  ^------------------!';
      var e2 = cold('    x-x-x|           ', { x: 10 });
      var expected = '--x-x-x-y-yz-z-z---|';
      var values = { x: 10, y: 40, z: 90 };
      var result = e1.pipe(
        operators_1.switchScan(function (acc, x) {
          return e2.pipe(
            operators_1.map(function (i) {
              return i * Number(x) + acc;
            })
          );
        }, 0)
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should provide the proper accumulated values', function () {
    var accs = [];
    rxjs_1
      .of(1, 3, 5)
      .pipe(
        operators_1.switchScan(function (acc, x) {
          accs.push(acc);
          return rxjs_1.of(acc + x);
        }, 100)
      )
      .subscribe();
    chai_1.expect(accs).to.deep.equal([100, 101, 104]);
  });
  it('should unsub inner observables', function () {
    var unsubbed = [];
    rxjs_1
      .of('a', 'b')
      .pipe(
        operators_1.switchScan(function (_acc, x) {
          return new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
              unsubbed.push(x);
            };
          });
        }, null)
      )
      .subscribe();
    chai_1.expect(unsubbed).to.deep.equal(['a', 'b']);
  });
  it('should switch inner cold observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|           ');
      var xsubs = '   ---------^---------!                  ';
      var y = cold('                     ---f---g---h---i--|');
      var ysubs = '   -------------------^-----------------!';
      var e1 = hot('  ---------x---------y---------|        ');
      var e1subs = '  ^----------------------------!        ';
      var expected = '-----------a--b--c----f---g---h---i--|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when projection throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -------x-----y---|');
      var e1subs = '  ^------!          ';
      var expected = '-------#          ';
      /**
       *
       */
      function project() {
        throw 'error';
      }
      expectObservable(e1.pipe(operators_1.switchScan(project, null))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner cold observables, outer is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|           ');
      var xsubs = '   ---------^---------!                  ';
      var y = cold('                     ---f---g---h---i--|');
      var ysubs = '   -------------------^-!                ';
      var e1 = hot('  ---------x---------y---------|        ');
      var e1subs = '  ^--------------------!                ';
      var unsub = '   ---------------------!                ';
      var expected = '-----------a--b--c----                ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|           ');
      var xsubs = '   ---------^---------!                  ';
      var y = cold('                     ---f---g---h---i--|');
      var ysubs = '   -------------------^-!                ';
      var e1 = hot('  ---------x---------y---------|        ');
      var e1subs = '  ^--------------------!                ';
      var expected = '-----------a--b--c----                ';
      var unsub = '   ---------------------!                ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null),
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
  it('should stop listening to a synchronous observable when unsubscribed', function () {
    var sideEffects = [];
    var synchronousObservable = rxjs_1.concat(
      rxjs_1.defer(function () {
        sideEffects.push(1);
        return rxjs_1.of(1);
      }),
      rxjs_1.defer(function () {
        sideEffects.push(2);
        return rxjs_1.of(2);
      }),
      rxjs_1.defer(function () {
        sideEffects.push(3);
        return rxjs_1.of(3);
      })
    );
    rxjs_1
      .of(null)
      .pipe(
        operators_1.switchScan(function () {
          return synchronousObservable;
        }, null),
        operators_1.takeWhile(function (x) {
          return x != 2;
        })
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([1, 2]);
  });
  it('should switch inner cold observables, inner never completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|          ');
      var xsubs = '   ---------^---------!                 ';
      var y = cold('                     ---f---g---h---i--');
      var ysubs = '   -------------------^                 ';
      var e1 = hot('  ---------x---------y---------|       ');
      var e1subs = '  ^----------------------------!       ';
      var expected = '-----------a--b--c----f---g---h---i--';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a synchronous switch to the second inner observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|   ');
      var xsubs = '   ---------(^!)                 ';
      var y = cold('           ---f---g---h---i--|  ');
      var ysubs = '   ---------^-----------------!  ';
      var e1 = hot('  ---------(xy)----------------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------------f---g---h---i----|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner cold observables, one inner throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--#--d--e--|          ');
      var xsubs = '   ---------^-------!                   ';
      var y = cold('                     ---f---g---h---i--');
      var ysubs = '                                        ';
      var e1 = hot('  ---------x---------y---------|       ');
      var e1subs = '  ^----------------!                   ';
      var expected = '-----------a--b--#                   ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner hot observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   -----a--b--c--d--e--|                 ');
      var xsubs = '   ---------^---------!                  ';
      var y = hot('   --p-o-o-p-------------f---g---h---i--|');
      var ysubs = '   -------------------^-----------------!';
      var e1 = hot('  ---------x---------y---------|        ');
      var e1subs = '  ^----------------------------!        ';
      var expected = '-----------c--d--e----f---g---h---i--|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner empty and empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           |                    ');
      var y = cold('                     |          ');
      var xsubs = '   ---------(^!)                 ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '-----------------------------|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner empty and never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           |                    ');
      var y = cold('                     -----------');
      var xsubs = '   ---------(^!)                 ';
      var ysubs = '   -------------------^          ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------------------------------';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner never and empty', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           -----------          ');
      var y = cold('                     |          ');
      var xsubs = '   ---------^---------!          ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '-----------------------------|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner never and throw', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           -----------          ');
      var y = cold('                     #          ', undefined, 'sad');
      var xsubs = '   ---------^---------!          ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^------------------!          ';
      var expected = '-------------------#          ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected, undefined, 'sad');
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch inner empty and throw', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           |                    ');
      var y = cold('                     #          ', undefined, 'sad');
      var xsubs = '   ---------(^!)                 ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^------------------!          ';
      var expected = '-------------------#          ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected, undefined, 'sad');
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle outer empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return rxjs_1.of(value);
        }, '')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle outer never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return rxjs_1.of(value);
        }, '')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle outer throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return rxjs_1.of(value);
        }, '')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle outer error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('           --a--b--c--d--e--|');
      var xsubs = '   ---------^---------!       ';
      var e1 = hot('  ---------x---------#       ');
      var e1subs = '  ^------------------!       ';
      var expected = '-----------a--b--c-#       ';
      var observableLookup = { x: x };
      var result = e1.pipe(
        operators_1.switchScan(function (_acc, value) {
          return observableLookup[value];
        }, null)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should create a new seed for each subscriber', function () {
    var seeds = [];
    var observer = function (value) {
      return seeds.push(value);
    };
    var source = rxjs_1.of('a', 'b').pipe(
      operators_1.switchScan(function (acc, x) {
        return rxjs_1.of(acc + x);
      }, '')
    );
    source.subscribe(observer);
    source.subscribe(observer);
    chai_1.expect(seeds).to.deep.equal(['a', 'ab', 'a', 'ab']);
  });
  it('should pass index to the accumulator function', function () {
    var indices = [];
    rxjs_1
      .of('a', 'b', 'c', 'd')
      .pipe(
        operators_1.switchScan(function (_acc, _x, index) {
          indices.push(index);
          return rxjs_1.of();
        }, '')
      )
      .subscribe();
    chai_1.expect(indices).to.deep.equal([0, 1, 2, 3]);
  });
});
//# sourceMappingURL=switchScan-spec.js.map
