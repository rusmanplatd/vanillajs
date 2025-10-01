'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var chai_1 = require('chai');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('mergeScan', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should mergeScan things', function () {
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
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected, values);
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
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeScan values and be able to asynchronously project them', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var t = time('        --|                ');
      var expected = '   -----u--v--w--x--y--z|';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
        w: ['b', 'c', 'd'],
        x: ['b', 'c', 'd', 'e'],
        y: ['b', 'c', 'd', 'e', 'f'],
        z: ['b', 'c', 'd', 'e', 'f', 'g'],
      };
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(t));
        }, [])
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not stop ongoing async projections when source completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|     ');
      var e1subs = '     ^--------------------!     ';
      var t = time('        -----|');
      var expected = '   --------u--v--w--x--y--(z|)';
      var values = {
        u: ['b'],
        v: ['c'],
        w: ['b', 'd'],
        x: ['c', 'e'],
        y: ['b', 'd', 'f'],
        z: ['c', 'e', 'g'],
      };
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(t));
        }, [])
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should interrupt ongoing async projections when result is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^---------------!     ';
      var t = time('        -----|');
      var expected = '   --------u--v--w--     ';
      var unsub = '      ----------------!     ';
      var values = {
        u: ['b'],
        v: ['c'],
        w: ['b', 'd'],
      };
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(t));
        }, [])
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^---------------!     ';
      var t = time('        -----|');
      var expected = '   --------u--v--w--     ';
      var unsub = '      ----------------!     ';
      var values = {
        u: ['b'],
        v: ['c'],
        w: ['b', 'd'],
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x)).pipe(operators_1.delay(t));
        }, []),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
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
        operators_1.mergeScan(function () {
          return synchronousObservable;
        }, 0),
        operators_1.takeWhile(function (x) {
          return x != 2;
        })
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([1, 2]);
  });
  it('should handle errors in the projection function', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------!';
      var expected = '   ---u--v--#';
      var values = {
        u: ['b'],
        v: ['b', 'c'],
      };
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          if (x === 'd') {
            throw new Error('bad!');
          }
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected, values, new Error('bad!'));
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from the projected Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--!';
      var expected = '   ---#';
      var result = e1.pipe(
        operators_1.mergeScan(function () {
          return rxjs_1.throwError(function () {
            return new Error('bad!');
          });
        }, [])
      );
      expectObservable(result).toBe(expected, undefined, new Error('bad!'));
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an empty projected Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ---------------------|';
      var result = e1.pipe(
        operators_1.mergeScan(function () {
          return rxjs_1.EMPTY;
        }, [])
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never projected Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ----------------------';
      var result = e1.pipe(
        operators_1.mergeScan(function () {
          return rxjs_1.NEVER;
        }, [])
      );
      expectObservable(result).toBe(expected);
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
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected);
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
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected);
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
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeScan unsubscription', function () {
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
      };
      var result = e1.pipe(
        operators_1.mergeScan(function (acc, x) {
          return rxjs_1.of(acc.concat(x));
        }, [])
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mergeScan projects cold Observable with single concurrency', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inner = [
        cold('            --d--e--f--|                      '),
        cold('                       --g--h--i--|           '),
        cold('                                  --j--k--l--|'),
      ];
      var xsubs = '   --^----------!                      ';
      var ysubs = '   -------------^----------!           ';
      var zsubs = '   ------------------------^----------!';
      var e1 = hot('  --0--1--2--|                        ');
      var e1subs = '  ^----------!                        ';
      var expected = '--x-d--e--f--f-g--h--i--i-j--k--l--|';
      var result = e1.pipe(
        operators_1.mergeScan(
          function (acc, x) {
            return inner[+x].pipe(operators_1.startWith(acc));
          },
          'x',
          1
        )
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
      expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
      expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
  });
  it('should not emit accumulator if inner completes without value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ---------------------|';
      var result = e1.pipe(
        operators_1.mergeScan(
          function () {
            return rxjs_1.EMPTY;
          },
          ['1']
        )
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not emit accumulator if inner completes without value after source completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        -----|   ');
      var xsubs = [
        '                  ---^----!   ',
        '                  ------^----!',
      ];
      var e1 = hot('--a--^--b--c--|  ');
      var e1subs = '     ^--------!  ';
      var expected = '   -----------|';
      var result = e1.pipe(
        operators_1.mergeScan(function () {
          return x;
        }, '1')
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
    });
  });
  it('should mergeScan projects hot Observable with single concurrency', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inner = [
        hot('           --d--e--f--|                 '),
        hot('           ----g----h----i----|         '),
        hot('           ------j------k-------l------|'),
      ];
      var xsubs = '   ---^-------!                 ';
      var ysubs = '   -----------^-------!         ';
      var zsubs = '   -------------------^--------!';
      var e1 = hot('  ---0---1---2---|             ');
      var e1subs = '  ^--------------!             ';
      var expected = '---x-e--f--f--i----i-l------|';
      var result = e1.pipe(
        operators_1.mergeScan(
          function (acc, x) {
            return inner[+x].pipe(operators_1.startWith(acc));
          },
          'x',
          1
        )
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
      expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
      expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
  });
  it('should mergeScan projects cold Observable with dual concurrency', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inner = [
        cold('              ---d---e---f---|               '),
        cold('                   ---g---h---i---|          '),
        cold('                             ---j---k---l---|'),
      ];
      var xsubs = '   ----^--------------!               ';
      var ysubs = '   ---------^--------------!          ';
      var zsubs = '   -------------------^--------------!';
      var e1 = hot('  ----0----1----2----|               ');
      var e1subs = '  ^------------------!               ';
      var expected = '----x--d-d-eg--fh--hi-j---k---l---|';
      var result = e1.pipe(
        operators_1.mergeScan(
          function (acc, x) {
            return inner[+x].pipe(operators_1.startWith(acc));
          },
          'x',
          2
        )
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
      expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
      expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
  });
  it('should mergeScan projects hot Observable with dual concurrency', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inner = [
        hot('           --d--e--f-----|              '),
        hot('           ----g----h------i----|       '),
        hot('           ------j--------k-----l------|'),
      ];
      var xsubs = '   ---^----------!              ';
      var ysubs = '   -------^-------------!       ';
      var zsubs = '   --------------^-------------!';
      var e1 = hot('  ---0---1---2---|             ');
      var e1subs = '  ^--------------!             ';
      var expected = '---x-e-efh----hki----l------|';
      var result = e1.pipe(
        operators_1.mergeScan(
          function (acc, x) {
            return inner[+x].pipe(operators_1.startWith(acc));
          },
          'x',
          2
        )
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(inner[0].subscriptions).toBe(xsubs);
      expectSubscriptions(inner[1].subscriptions).toBe(ysubs);
      expectSubscriptions(inner[2].subscriptions).toBe(zsubs);
    });
  });
  it('should pass current index to accumulator', function () {
    var recorded = [];
    var e1 = rxjs_1.of('a', 'b', 'c', 'd');
    e1.pipe(
      operators_1.mergeScan(function (acc, x, index) {
        recorded.push(index);
        return rxjs_1.of(index);
      }, 0)
    ).subscribe();
    chai_1.expect(recorded).to.deep.equal([0, 1, 2, 3]);
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
        operators_1.mergeScan(function (acc, value) {
          return rxjs_1.of(value);
        }, 0),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=mergeScan-spec.js.map
