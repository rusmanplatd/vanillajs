'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('switchAll', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should switch a hot observable of cold observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    --a---b--c---d--|      ');
      var xsubs = '   --^------!               ';
      var y = cold('           ----e---f--g---|');
      var ysubs = '   ---------^--------------!';
      var e1 = hot('  --x------y-------|       ', { x: x, y: y });
      var e1subs = '  ^----------------!       ';
      var expected = '----a---b----e---f--g---|';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should switch to each immediately-scheduled inner Observable', function (done) {
    var a = rxjs_1.scheduled([1, 2, 3], rxjs_1.queueScheduler);
    var b = rxjs_1.scheduled([4, 5, 6], rxjs_1.queueScheduler);
    var r = [1, 4, 5, 6];
    var i = 0;
    rxjs_1
      .scheduled([a, b], rxjs_1.queueScheduler)
      .pipe(operators_1.switchAll())
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(r[i++]);
        },
        complete: done,
      });
  });
  it('should unsub inner observables', function () {
    var unsubbed = [];
    rxjs_1
      .of('a', 'b')
      .pipe(
        operators_1.map(function (x) {
          return new rxjs_1.Observable(function (subscriber) {
            subscriber.complete();
            return function () {
              unsubbed.push(x);
            };
          });
        }),
        operators_1.switchAll()
      )
      .subscribe();
    chai_1.expect(unsubbed).to.deep.equal(['a', 'b']);
  });
  it('should switch to each inner Observable', function (done) {
    var a = rxjs_1.of(1, 2, 3);
    var b = rxjs_1.of(4, 5, 6);
    var r = [1, 2, 3, 4, 5, 6];
    var i = 0;
    rxjs_1
      .of(a, b)
      .pipe(operators_1.switchAll())
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(r[i++]);
        },
        complete: done,
      });
  });
  it('should handle a hot observable of observables', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^-------!              ';
      var y = cold('                ---d--e---f---|');
      var ysubs = '   --------------^-------------!';
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var e1subs = '  ^--------------------!       ';
      var expected = '--------a---b----d--e---f---|';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, outer is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^-------!              ';
      var y = cold('                ---d--e---f---|');
      var ysubs = '   --------------^-!            ';
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var unsub = '   ----------------!            ';
      var expected = '--------a---b---             ';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^-------!              ';
      var y = cold('                ---d--e---f---|');
      var ysubs = '   --------------^-!            ';
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var expected = '--------a---b----            ';
      var unsub = '   ----------------!            ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.switchAll(),
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
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|          ');
      var xsubs = '   ------^-------!               ';
      var y = cold('                ---d--e---f-----');
      var ysubs = '   --------------^               ';
      var e1 = hot('  ------x-------y------|        ', { x: x, y: y });
      var expected = '--------a---b----d--e---f-----';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a synchronous switch to the second inner observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|   ');
      var xsubs = '   ------(^!)             ';
      var y = cold('        ---d--e---f---|  ');
      var ysubs = '   ------^-------------!  ';
      var e1 = hot('  ------(xy)------------|', { x: x, y: y });
      var expected = '---------d--e---f-----|';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, one inner throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---#                ');
      var xsubs = '   ------^-----!                ';
      var y = cold('                ---d--e---f---|');
      var ysubs = '                                ';
      var e1 = hot('  ------x-------y------|       ', { x: x, y: y });
      var expected = '--------a---#                ';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
    });
  });
  it('should handle a hot observable of observables, outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|         ');
      var xsubs = '   ------^-------!              ';
      var y = cold('                ---d--e---f---|');
      var ysubs = '   --------------^-------!      ';
      var e1 = hot('  ------x-------y-------#      ', { x: x, y: y });
      var expected = '--------a---b----d--e-#      ';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
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
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
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
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete not before the outer completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('        --a---b---c--|   ');
      var xsubs = '   ------^------------!   ';
      var e1 = hot('  ------x---------------|', { x: x });
      var e1subs = '  ^---------------------!';
      var expected = '--------a---b---c-----|';
      var result = e1.pipe(operators_1.switchAll());
      expectObservable(result).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an observable of promises', function (done) {
    var expected = [3];
    rxjs_1
      .of(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3))
      .pipe(operators_1.switchAll())
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
  it('should handle an observable of promises, where last rejects', function (done) {
    rxjs_1
      .of(Promise.resolve(1), Promise.resolve(2), Promise.reject(3))
      .pipe(operators_1.switchAll())
      .subscribe({
        next: function () {
          done(new Error('should not be called'));
        },
        error: function (err) {
          chai_1.expect(err).to.equal(3);
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
        },
      });
  });
  it('should handle an observable with Arrays in it', function () {
    var expected = [1, 2, 3, 4];
    var completed = false;
    rxjs_1
      .of(rxjs_1.NEVER, rxjs_1.NEVER, [1, 2, 3, 4])
      .pipe(operators_1.switchAll())
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        complete: function () {
          completed = true;
          chai_1.expect(expected.length).to.equal(0);
        },
      });
    chai_1.expect(completed).to.be.true;
  });
  it('should not leak when child completes before each switch (prevent memory leaks #2355)', function () {
    var _a, _b;
    var iStream;
    var oStreamControl = new rxjs_1.Subject();
    var oStream = oStreamControl.pipe(
      operators_1.map(function () {
        return (iStream = new rxjs_1.Subject());
      })
    );
    var switcher = oStream.pipe(operators_1.switchAll());
    var result = [];
    var sub = switcher.subscribe(function (x) {
      return result.push(x);
    });
    [0, 1, 2, 3, 4].forEach(function (n) {
      oStreamControl.next(n);
      iStream.complete();
    });
    chai_1
      .expect(
        (_b =
          (_a = sub._finalizers) === null || _a === void 0
            ? void 0
            : _a[0]._finalizers) === null || _b === void 0
          ? void 0
          : _b.length
      )
      .to.equal(1);
    sub.unsubscribe();
  });
  it('should not leak if we switch before child completes (prevent memory leaks #2355)', function () {
    var _a, _b, _c;
    var oStreamControl = new rxjs_1.Subject();
    var oStream = oStreamControl.pipe(
      operators_1.map(function () {
        return new rxjs_1.Subject();
      })
    );
    var switcher = oStream.pipe(operators_1.switchAll());
    var result = [];
    var sub = switcher.subscribe(function (x) {
      return result.push(x);
    });
    [0, 1, 2, 3, 4].forEach(function (n) {
      oStreamControl.next(n);
    });
    chai_1
      .expect(
        (_b =
          (_a = sub._finalizers) === null || _a === void 0
            ? void 0
            : _a[0]._finalizers) === null || _b === void 0
          ? void 0
          : _b.length
      )
      .to.equal(1);
    chai_1
      .expect(
        (_c = sub._finalizers) === null || _c === void 0 ? void 0 : _c.length
      )
      .to.equal(2);
    sub.unsubscribe();
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
      .pipe(operators_1.switchAll(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=switchAll-spec.js.map
