'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var interop_helper_1 = require('../helpers/interop-helper');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('switchMap', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --1-----3--5-------|');
      var e1subs = '   ^------------------!';
      var e2 = cold('    x-x-x|            ', { x: 10 });
      var expected = ' --x-x-x-y-yz-z-z---|';
      var values = { x: 10, y: 30, z: 50 };
      var result = e1.pipe(
        operators_1.switchMap(function (x) {
          return e2.pipe(
            operators_1.map(function (i) {
              return i * +x;
            })
          );
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.switchMap(
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
        operators_1.switchMap(
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
  it('should unsub inner observables', function () {
    var unsubbed = [];
    rxjs_1
      .of('a', 'b')
      .pipe(
        operators_1.switchMap(function (x) {
          return new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
              unsubbed.push(x);
            };
          });
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
      expectObservable(e1.pipe(operators_1.switchMap(project))).toBe(expected);
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
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
  it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
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
        operators_1.switchMap(function (value) {
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
        operators_1.switchMap(function () {
          return synchronousObservable;
        }),
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
      var y = cold('                     -          ');
      var xsubs = '   ---------(^!)                 ';
      var ysubs = '   -------------------^          ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '------------------------------';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
      var x = cold('           -                    ');
      var y = cold('                     |          ');
      var xsubs = '   ---------^---------!          ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^----------------------------!';
      var expected = '-----------------------------|';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
      var x = cold('           -                    ');
      var y = cold('                     #          ', undefined, 'sad');
      var xsubs = '   ---------^---------!          ';
      var ysubs = '   -------------------(^!)       ';
      var e1 = hot('  ---------x---------y---------|');
      var e1subs = '  ^------------------!          ';
      var expected = '-------------------#          ';
      var observableLookup = { x: x, y: y };
      var result = e1.pipe(
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
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
        operators_1.switchMap(function (value) {
          return rxjs_1.of(value);
        })
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
        operators_1.switchMap(function (value) {
          return rxjs_1.of(value);
        })
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
        operators_1.switchMap(function (value) {
          return rxjs_1.of(value);
        })
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
        operators_1.switchMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
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
        operators_1.switchMap(function (value) {
          return rxjs_1.of(value);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should unsubscribe previous inner sub when getting synchronously reentrance during subscribing the inner sub', function () {
    var e = new rxjs_1.BehaviorSubject(1);
    var results = [];
    e.pipe(
      operators_1.take(3),
      operators_1.switchMap(function (value) {
        return new rxjs_1.Observable(function (subscriber) {
          e.next(value + 1);
          subscriber.next(value);
        });
      })
    ).subscribe(function (value) {
      return results.push(value);
    });
    chai_1.expect(results).to.deep.equal([3]);
  });
});
//# sourceMappingURL=switchMap-spec.js.map
