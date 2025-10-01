'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('windowToggle', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should emit windows governed by openings and closings', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('         ----w--------w--------w--|');
      var e2subs = '          ^------------------------!';
      var e3 = cold('             -----x                ');
      var e3subs = [
        '                       ----^----!                ',
        '                       -------------^----!       ',
        '                       ----------------------^--!',
      ];
      var e1 = hot('  --1--2--^-a--b--c--d--e--f--g--h-|');
      var e1subs = '          ^------------------------!';
      var expected = '        ----x--------y--------z--|';
      var x = cold('              -b--c|                ');
      var y = cold('                       -e--f|       ');
      var z = cold('                                -h-|');
      var values = { x: x, y: y, z: z };
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should emit windows that are opened by an observable from the first argument and closed by an observable returned by the function in the second argument', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('       --------x-------x-------x--|');
      var e2subs = '        ^--------------------------!';
      var e3 = cold('               ----------(x|)      ');
      var e3subs = [
        '                     --------^---------!         ',
        '                     ----------------^---------! ',
        '                     ------------------------^--!',
      ];
      var e1 = hot('--1--2--^--a--b--c--d--e--f--g--h--|');
      var e1subs = '        ^--------------------------!';
      var expected = '      --------x-------y-------z--|';
      var x = cold('                -c--d--e--(f|)      ');
      var y = cold('                        --f--g--h-| ');
      var z = cold('                                ---|');
      var values = { x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.windowToggle(e2, function (value) {
          chai_1.expect(value).to.equal('x');
          return e3;
        })
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should emit windows using varying cold closings', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|            ');
      var e2subs = '     ^--------------------------!            ';
      var close = [
        cold('               ---------------s--|                   '),
        cold('                           ----(s|)                  '),
        cold('                                  ---------------(s|)'),
      ];
      var closeSubs = [
        '                  --^--------------!                      ',
        '                  --------------^---!                     ',
        '                  -----------------------^-----------!    ',
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|    ');
      var e1subs = '     ^----------------------------------!    ';
      var expected = '   --x-----------y--------z-----------|    ';
      var x = cold('       --b---c---d---e|                      ');
      var y = cold('                   --e-|                     ');
      var z = cold('                            -g---h------|    ');
      var values = { x: x, y: y, z: z };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
      expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
      expectSubscriptions(close[2].subscriptions).toBe(closeSubs[2]);
    });
  });
  it('should emit windows using varying hot closings', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|           ');
      var e2subs = '     ^--------------------------!           ';
      var closings = [
        hot('          -1--^----------------s-|                   '),
        hot('              -----3----4-------(s|)                 '),
        hot('              -------3----4-------5----------------s|'),
      ];
      var closingSubs = [
        '                  --^--------------!                     ',
        '                  --------------^---!                    ',
        '                  -----------------------^-----------!   ',
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|   ');
      var e1subs = '     ^----------------------------------!   ';
      var expected = '   --x-----------y--------z-----------|   ';
      var x = cold('       --b---c---d---e|                     ');
      var y = cold('                   --e-|                    ');
      var z = cold('                            -g---h------|   ');
      var values = { x: x, y: y, z: z };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return closings[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(closings[0].subscriptions).toBe(closingSubs[0]);
      expectSubscriptions(closings[1].subscriptions).toBe(closingSubs[1]);
      expectSubscriptions(closings[2].subscriptions).toBe(closingSubs[2]);
    });
  });
  it('should emit windows using varying empty delayed closings', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|           ');
      var e2subs = '     ^--------------------------!           ';
      var close = [
        cold('               ---------------|                     '),
        cold('                           ----|                    '),
        cold('                                    ---------------|'),
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|   ');
      var e1subs = '     ^----------------------------------!   ';
      var expected = '   --x-----------y--------z-----------|   ';
      var x = cold('       --b---c---d---e---f---g---h------|   ');
      var y = cold('                   --e---f---g---h------|   ');
      var z = cold('                            -g---h------|   ');
      var values = { x: x, y: y, z: z };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should emit windows using varying cold closings, outer unsubscribed early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|              ');
      var e2subs = '     ^----------------!                        ';
      var close = [
        cold('               -------------s---|                      '),
        cold('                           -----(s|)                   '),
        cold('                                    ---------------(s|)'),
      ];
      var closeSubs = [
        '                  --^------------!                          ',
        '                  --------------^--!                        ',
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
      var e1subs = '     ^----------------!                        ';
      var expected = '   --x-----------y---                        ';
      var x = cold('       --b---c---d--|                          ');
      var y = cold('                   --e-                        ');
      var unsub = '      -----------------!                        ';
      var values = { x: x, y: y };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
      expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
      expectSubscriptions(close[2].subscriptions).toBe([]);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|              ');
      var e2subs = '     ^--------------!                          ';
      var close = [
        cold('               ---------------s--|                     '),
        cold('                           ----(s|)                    '),
        cold('                                    ---------------(s|)'),
      ];
      var closeSubs = [
        '                  --^------------!                          ',
        '                  --------------^!                          ',
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
      var e1subs = '     ^--------------!                          ';
      var expected = '   --x-----------y-                          ';
      var x = cold('       --b---c---d---                          ');
      var y = cold('                   --                          ');
      var unsub = '      ---------------!                          ';
      var values = { x: x, y: y };
      var i = 0;
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.windowToggle(e2, function () {
          return close[i++];
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(close[0].subscriptions).toBe(closeSubs[0]);
      expectSubscriptions(close[1].subscriptions).toBe(closeSubs[1]);
    });
  });
  it('should dispose window Subjects if the outer is unsubscribed early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var open = cold(' o-------------------------|');
      var e1 = hot('    --a--b--c--d--e--f--g--h--|');
      var e1subs = '    ^--------!                 ';
      var expected = '  x---------                 ';
      var x = cold('    --a--b--c-                 ');
      var unsub = '     ---------!                 ';
      var late = time(' ---------------|           ');
      var values = { x: x };
      var window;
      var result = e1.pipe(
        operators_1.windowToggle(open, function () {
          return rxjs_1.NEVER;
        }),
        operators_1.tap(function (w) {
          window = w;
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      rxTestScheduler.schedule(function () {
        chai_1
          .expect(function () {
            window.subscribe();
          })
          .to.throw(rxjs_1.ObjectUnsubscribedError);
      }, late);
    });
  });
  it('should propagate error thrown from closingSelector', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|              ');
      var e2subs = '     ^-------------!                           ';
      var close = [
        cold('               ---------------s--|                     '),
        cold('                           ----(s|)                    '),
        cold('                                    ---------------(s|)'),
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
      var e1subs = '     ^-------------!                           ';
      var expected = '   --x-----------#----                       ';
      var x = cold('       --b---c---d-#                           ');
      var values = { x: x };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          if (i === 1) {
            throw 'error';
          }
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should propagate error emitted from a closing', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|        ');
      var e2subs = '     ^-------------!                     ';
      var close = [
        cold('               ---------------s--|               '),
        cold('                           #                     '),
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     ^-------------!                     ';
      var expected = '   --x-----------(y#)                  ';
      var x = cold('       --b---c---d-#                     ');
      var y = cold('                   #                     ');
      var values = { x: x, y: y };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should propagate error emitted late from a closing', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|        ');
      var e2subs = '     ^------------------!                ';
      var close = [
        cold('               ---------------s--|               '),
        cold('                           -----#                '),
      ];
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     ^------------------!                ';
      var expected = '   --x-----------y----#                ';
      var x = cold('       --b---c---d---e|                  ');
      var y = cold('                   --e--#                ');
      var values = { x: x, y: y };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle errors', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    --x-----------y--------z---|        ');
      var e2subs = '     ^------------------!                ';
      var close = [
        cold('               ---------------s--|               '),
        cold('                           -------s|             '),
      ];
      var e1 = hot('--a--^---b---c---d---e--#                ');
      var e1subs = '     ^------------------!                ';
      var expected = '   --x-----------y----#                ';
      var x = cold('       --b---c---d---e|                  ');
      var y = cold('                   --e--#                ');
      var values = { x: x, y: y };
      var i = 0;
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return close[i++];
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle empty source', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('--o-----|');
      var e2subs = '   (^!)';
      var e3 = cold('  -----c--|');
      var e1 = cold('  |');
      var e1subs = '   (^!)';
      var expected = ' |';
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold(' --o-----|');
      var e2subs = '  (^!)';
      var e3 = cold(' -----c--|');
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold(' --o-----o------o-----o---o-----|             ');
      var e2subs = '  ^------------------------------!             ';
      var e3 = cold('   --c-|                                      ');
      var e1 = hot('  -                                            ');
      var e1subs = '  ^-------------------------------------------!';
      var expected = '--u-----v------x-----y---z-------------------';
      var u = cold('    --|                                        ');
      var v = cold('          --|                                  ');
      var x = cold('                 --|                           ');
      var y = cold('                       --|                     ');
      var z = cold('                           --|                 ');
      var unsub = '   --------------------------------------------!';
      var values = { u: u, v: v, x: x, y: y, z: z };
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle a never opening Observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    -                                   ');
      var e2subs = '     ^----------------------------------!';
      var e3 = cold('    --c-|                               ');
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     ^----------------------------------!';
      var expected = '   -----------------------------------|';
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle a never closing Observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    ---o---------------o-----------|    ');
      var e2subs = '     ^------------------------------!    ';
      var e3 = cold('       -                                ');
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     ^----------------------------------!';
      var expected = '   ---x---------------y---------------|';
      var x = cold('        -b---c---d---e---f---g---h------|');
      var y = cold('                        -f---g---h------|');
      var values = { x: x, y: y };
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle opening Observable that just throws', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    #                                   ');
      var e2subs = '     (^!)                                ';
      var e3 = cold('    --c-|                               ');
      var subs = '       (^!)                                ';
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     (^!)                                ';
      var expected = '   #                                   ';
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle empty closing observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('    ---o---------------o-----------|    ');
      var e2subs = '     ^------------------------------!    ';
      var e3 = rxjs_1.EMPTY;
      var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
      var e1subs = '     ^----------------------------------!';
      var expected = '   ---x---------------y---------------|';
      var x = cold('        -b---c---d---e---f---g---h------|');
      var y = cold('                        -f---g---h------|');
      var values = { x: x, y: y };
      var result = e1.pipe(
        operators_1.windowToggle(e2, function () {
          return e3;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
});
//# sourceMappingURL=windowToggle-spec.js.map
