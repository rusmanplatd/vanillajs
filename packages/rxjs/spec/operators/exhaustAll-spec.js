'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('exhaust', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should handle a hot observable of hot observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   -----a---b---c--|                  ');
      var xsubs = '   ------^---------!                  ';
      var y = hot('   -------d--e---f---|                ');
      var ysubs = [];
      var z = hot('   --------------g--h---i---|         ');
      var zsubs = '   --------------------^----!         ';
      var e1 = hot('  ------x-------y-----z-------------|', {
        x: x,
        y: y,
        z: z,
      });
      var e1subs = '  ^---------------------------------!';
      var expected = '---------b---c-------i------------|';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
    });
  });
  it('should switch to first immediately-scheduled inner Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' (ab|)');
      var e1subs = '  (^!) ';
      var e2 = cold(' (cd|)');
      var e2subs = [];
      var expected = '(ab|)';
      expectObservable(rxjs_1.of(e1, e2).pipe(operators_1.exhaustAll())).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a hot observable of observables', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|               ');
      var xsubs = '   ------^------------!               ';
      var y = cold('                ---d--e---f---|      ');
      var ysubs = [];
      var z = cold('                      ---g--h---i---|');
      var zsubs = '   --------------------^-------------!';
      var e1 = hot('  ------x-------y-----z-------------|', {
        x: x,
        y: y,
        z: z,
      });
      var e1subs = '  ^---------------------------------!';
      var expected = '--------a---b---c------g--h---i---|';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
    });
  });
  it('should handle a hot observable of observables, outer is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^---------!            ';
      var y = cold('                ---d--e---f---|');
      var ysubs = [];
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var unsub = '   ----------------!            ';
      var expected = '--------a---b----            ';
      expectObservable(e1.pipe(operators_1.exhaustAll()), unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^---------!            ';
      var y = cold('                ---d--e---f---|');
      var ysubs = [];
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var unsub = '   ----------------!            ';
      var expected = '--------a---b----            ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.exhaustAll(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, inner never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('     --a---b--|              ');
      var xsubs = '   ---^--------!              ';
      var y = cold('         -d---e-             ');
      var ysubs = [];
      var z = cold('                ---f--g---h--');
      var zsubs = '   --------------^------------';
      var e1 = hot('  ---x---y------z----------| ', { x: x, y: y, z: z });
      var expected = '-----a---b-------f--g---h--';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
    });
  });
  it('should handle a synchronous switch and stay on the first inner observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|   ');
      var xsubs = '   ------^------------!   ';
      var y = cold('        ---d--e---f---|  ');
      var ysubs = [];
      var e1 = hot('  ------(xy)------------|', { x: x, y: y });
      var expected = '--------a---b---c-----|';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, one inner throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---#                ');
      var xsubs = '   ------^-----!                ';
      var y = cold('                ---d--e---f---|');
      var ysubs = [];
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var expected = '--------a---#                ';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^------------!         ';
      var y = cold('                ---d--e---f---|');
      var ysubs = [];
      var e1 = hot('  ------x-------y-------#      ', { x: x, y: y });
      var expected = '--------a---b---c-----#      ';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle an empty hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ------|');
      var e1subs = '  ^-----!';
      var expected = '------|';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never hot observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete not before the outer completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|   ');
      var xsubs = '   ------^------------!   ';
      var e1 = hot('  ------x---------------|', { x: x });
      var expected = '--------a---b---c-----|';
      expectObservable(e1.pipe(operators_1.exhaustAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
    });
  });
  it('should handle an observable of promises', function (done) {
    var expected = [1];
    rxjs_1
      .of(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3))
      .pipe(operators_1.exhaustAll())
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        complete: function () {
          chai_1.expect(expected.length).to.equal(0);
          done();
        },
      });
  });
  it('should handle an observable of promises, where one rejects', function (done) {
    rxjs_1
      .of(Promise.reject(2), Promise.resolve(1))
      .pipe(operators_1.exhaustAll())
      .subscribe({
        next: function (x) {
          done(new Error('should not be called'));
        },
        error: function (err) {
          chai_1.expect(err).to.equal(2);
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
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
    rxjs_1
      .of(synchronousObservable)
      .pipe(operators_1.exhaustAll(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should handle synchronously completing inner observables', function (done) {
    var i = 1;
    rxjs_1
      .of(rxjs_1.of(1), rxjs_1.of(2))
      .pipe(operators_1.exhaustAll())
      .subscribe({
        next: function (v) {
          return chai_1.expect(v).to.equal(i++);
        },
        complete: function () {
          chai_1.expect(i).to.equal(3);
          done();
        },
      });
  });
});
//# sourceMappingURL=exhaustAll-spec.js.map
