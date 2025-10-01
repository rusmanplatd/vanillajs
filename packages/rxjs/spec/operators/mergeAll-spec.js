'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('mergeAll', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should merge a hot observable of cold observables', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    --a---b--c---d--|      ');
      var xsubs = '   --^---------------!      ';
      var y = cold('           ----e---f--g---|');
      var ysubs = '   ---------^--------------!';
      var e1 = hot('  --x------y-------|       ', { x: x, y: y });
      var e1subs = '  ^----------------!       ';
      var expected = '----a---b--c-e-d-f--g---|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge all observables in an observable', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.from([rxjs_1.of('a'), rxjs_1.of('b'), rxjs_1.of('c')]);
      var expected = '(abc|)';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
    });
  });
  it('should throw if any child observable throws', function () {
    testScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.from([
        rxjs_1.of('a'),
        rxjs_1.throwError(function () {
          return 'error';
        }),
        rxjs_1.of('c'),
      ]);
      var expected = '(a#)';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
    });
  });
  it('should handle merging a hot observable of observables', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a---b---c---|   ');
      var xsubs = '   --^-----------!   ';
      var y = cold('       d---e---f---|');
      var ysubs = '   -----^-----------!';
      var e1 = hot('  --x--y--|         ', { x: x, y: y });
      var e1subs = '  ^-------!         ';
      var expected = '--a--db--ec--f---|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge one cold Observable at a time with parameter concurrency=1', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a---b---c---|            ');
      var xsubs = '   --^-----------!            ';
      var y = cold('                d---e---f---|');
      var ysubs = '   --------------^-----------!';
      var e1 = hot('  --x--y--|                  ', { x: x, y: y });
      var e1subs = '  ^-------!                  ';
      var expected = '--a---b---c---d---e---f---|';
      expectObservable(e1.pipe(operators_1.mergeAll(1))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge two cold Observables at a time with parameter concurrency=2', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a---b---c---|        ');
      var xsubs = '   --^-----------!        ';
      var y = cold('       d---e---f---|     ');
      var ysubs = '   -----^-----------!     ';
      var z = cold('                --g---h-|');
      var zsubs = '   --------------^-------!';
      var e1 = hot('  --x--y--z--|           ', { x: x, y: y, z: z });
      var e1subs = '  ^----------!           ';
      var expected = '--a--db--ec--f--g---h-|';
      expectObservable(e1.pipe(operators_1.mergeAll(2))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge one hot Observable at a time with parameter concurrency=1', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   ---a---b---c---|          ');
      var xsubs = '   --^------------!          ';
      var y = hot('   -------------d---e---f---|');
      var ysubs = '   ---------------^---------!';
      var e1 = hot('  --x--y--|                 ', { x: x, y: y });
      var e1subs = '  ^-------!                 ';
      var expected = '---a---b---c-----e---f---|';
      expectObservable(e1.pipe(operators_1.mergeAll(1))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge two hot Observables at a time with parameter concurrency=2', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = hot('   i--a---b---c---|        ');
      var xsubs = '   --^------------!        ';
      var y = hot('   -i-i--d---e---f---|     ');
      var ysubs = '   -----^------------!     ';
      var z = hot('   --i--i--i--i-----g---h-|');
      var zsubs = '   ---------------^-------!';
      var e1 = hot('  --x--y--z--|            ', { x: x, y: y, z: z });
      var e1subs = '  ^----------!            ';
      var expected = '---a--db--ec--f--g---h-|';
      expectObservable(e1.pipe(operators_1.mergeAll(2))).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle merging a hot observable of observables, outer unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a---b---c---|   ');
      var xsubs = '   --^---------!     ';
      var y = cold('       d---e---f---|');
      var ysubs = '   -----^------!     ';
      var e1 = hot('  --x--y--|         ', { x: x, y: y });
      var e1subs = '  ^-------!         ';
      var expected = '--a--db--ec--     ';
      var unsub = '   ------------!     ';
      expectObservable(e1.pipe(operators_1.mergeAll()), unsub).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a---b---c---|   ');
      var xsubs = '   --^---------!     ';
      var y = cold('       d---e---f---|');
      var ysubs = '   -----^------!     ';
      var e1 = hot('  --x--y--|         ', { x: x, y: y });
      var e1subs = '  ^-------!         ';
      var expected = '--a--db--ec--     ';
      var unsub = '   ------------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.mergeAll(),
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
  it('should merge parallel emissions', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    ----a----b----c---|');
      var xsubs = '   --^-----------------!';
      var y = cold('       -d----e----f---|');
      var ysubs = '   -----^--------------!';
      var e1 = hot('  --x--y--|            ', { x: x, y: y });
      var e1subs = '  ^-------!            ';
      var expected = '------(ad)-(be)-(cf)|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge empty and empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    |      ');
      var xsubs = '   --(^!)   ';
      var y = cold('       |   ');
      var ysubs = '   -----(^!)';
      var e1 = hot('  --x--y--|', { x: x, y: y });
      var e1subs = '  ^-------!';
      var expected = '--------|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge three empties', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    |         ');
      var xsubs = '   --(^!)      ';
      var y = cold('       |      ');
      var ysubs = '   -----(^!)   ';
      var z = cold('         |    ');
      var zsubs = '   -------(^!) ';
      var e1 = hot('  --x--y-z---|', { x: x, y: y, z: z });
      var e1subs = '  ^----------!';
      var expected = '-----------|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge never and empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    -      ');
      var xsubs = '   --^      ';
      var y = cold('       |   ');
      var ysubs = '   -----(^!)';
      var e1 = hot('  --x--y--|', { x: x, y: y });
      var e1subs = '  ^-------!';
      var expected = '---------';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge never and never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    -      ');
      var xsubs = '   --^      ';
      var y = cold('       -   ');
      var ysubs = '   -----^   ';
      var e1 = hot('  --x--y--|', { x: x, y: y });
      var e1subs = '  ^-------!';
      var expected = '---------';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge empty and throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    |      ');
      var xsubs = '   --(^!)   ';
      var y = cold('       #   ');
      var ysubs = '   -----(^!)';
      var e1 = hot('  --x--y--|', { x: x, y: y });
      var e1subs = '  ^----!   ';
      var expected = '-----#   ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge never and throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    -      ');
      var xsubs = '   --^--!   ';
      var y = cold('       #   ');
      var ysubs = '   -----(^!)';
      var e1 = hot('  --x--y--|', { x: x, y: y });
      var e1subs = '  ^----!   ';
      var expected = '-----#   ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge empty and eventual error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    |         ');
      var xsubs = '   --(^!)      ';
      var y = cold('       ------#');
      var ysubs = '   -----^-----!';
      var e1 = hot('  --x--y--|   ', { x: x, y: y });
      var e1subs = '  ^-------!   ';
      var expected = '-----------#';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge never and eventual error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    -         ');
      var xsubs = '   --^--------!';
      var y = cold('       ------#');
      var ysubs = '   -----^-----!';
      var e1 = hot('  --x--y--|   ', { x: x, y: y });
      var e1subs = '  ^-------!   ';
      var expected = '-----------#';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take an empty source and return empty too', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take a never source and return never too', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should take a throw source and return throw too', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle merging a hot observable of non-overlapped observables', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a-b---------|                 ');
      var xsubs = '   --^-----------!                 ';
      var y = cold('              c-d-e-f-|           ');
      var ysubs = '   ------------^-------!           ';
      var z = cold('                       g-h-i-j-k-|');
      var zsubs = '   ---------------------^---------!';
      var e1 = hot('  --x---------y--------z--------| ', { x: x, y: y, z: z });
      var e1subs = '  ^-----------------------------! ';
      var expected = '--a-b-------c-d-e-f--g-h-i-j-k-|';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if inner observable raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a-b---------|                 ');
      var xsubs = '   --^-----------!                 ';
      var y = cold('              c-d-e-f-#           ');
      var ysubs = '   ------------^-------!           ';
      var z = cold('                       g-h-i-j-k-|');
      var zsubs = [];
      var e1 = hot('  --x---------y--------z--------| ', { x: x, y: y, z: z });
      var e1subs = '  ^-------------------!           ';
      var expected = '--a-b-------c-d-e-f-#           ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(z.subscriptions).toBe(zsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if outer observable raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var x = cold('    a-b---------|      ');
      var xsubs = '   --^-----------!      ';
      var y = cold('              c-d-e-f-|');
      var ysubs = '   ------------^---!    ';
      var e1 = hot('  --x---------y---#    ', { x: x, y: y });
      var e1subs = '  ^---------------!    ';
      var expected = '--a-b-------c-d-#    ';
      expectObservable(e1.pipe(operators_1.mergeAll())).toBe(expected);
      expectSubscriptions(x.subscriptions).toBe(xsubs);
      expectSubscriptions(y.subscriptions).toBe(ysubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should merge all promises in an observable', function (done) {
    var e1 = rxjs_1.from([
      new Promise(function (res) {
        res('a');
      }),
      new Promise(function (res) {
        res('b');
      }),
      new Promise(function (res) {
        res('c');
      }),
      new Promise(function (res) {
        res('d');
      }),
    ]);
    var expected = ['a', 'b', 'c', 'd'];
    var res = [];
    e1.pipe(operators_1.mergeAll()).subscribe({
      next: function (x) {
        res.push(x);
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(res).to.deep.equal(expected);
        done();
      },
    });
  });
  it('should raise error when promise rejects', function (done) {
    var error = 'error';
    var e1 = rxjs_1.from([
      new Promise(function (res) {
        res('a');
      }),
      new Promise(function (res, rej) {
        rej(error);
      }),
      new Promise(function (res) {
        res('c');
      }),
      new Promise(function (res) {
        res('d');
      }),
    ]);
    var res = [];
    e1.pipe(operators_1.mergeAll()).subscribe({
      next: function (x) {
        res.push(x);
      },
      error: function (err) {
        chai_1.expect(res.length).to.equal(1);
        chai_1.expect(err).to.equal('error');
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
  it('should finalize generators when merged if the subscription ends', function () {
    var _a;
    var iterable =
      ((_a = {
        finalized: false,
        next: function () {
          return { value: 'duck', done: false };
        },
        return: function () {
          this.finalized = true;
        },
      }),
      (_a[Symbol.iterator] = function () {
        return this;
      }),
      _a);
    var results = [];
    var iterableObservable = rxjs_1.from(iterable);
    rxjs_1
      .of(iterableObservable)
      .pipe(operators_1.mergeAll(), operators_1.take(3))
      .subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('GOOSE!');
        },
      });
    chai_1.expect(results).to.deep.equal(['duck', 'duck', 'duck', 'GOOSE!']);
    chai_1.expect(iterable.finalized).to.be.true;
  });
  it('should merge two observables', function (done) {
    var a = rxjs_1.of(1, 2, 3);
    var b = rxjs_1.of(4, 5, 6, 7, 8);
    var r = [1, 2, 3, 4, 5, 6, 7, 8];
    rxjs_1
      .of(a, b)
      .pipe(operators_1.mergeAll())
      .subscribe({
        next: function (val) {
          chai_1.expect(val).to.equal(r.shift());
        },
        complete: done,
      });
  });
  it('should merge two immediately-scheduled observables', function (done) {
    var a = rxjs_1.of(1, 2, 3, rxjs_1.queueScheduler);
    var b = rxjs_1.of(4, 5, 6, 7, 8, rxjs_1.queueScheduler);
    var r = [1, 2, 4, 3, 5, 6, 7, 8];
    rxjs_1
      .of(a, b, rxjs_1.queueScheduler)
      .pipe(operators_1.mergeAll())
      .subscribe({
        next: function (val) {
          chai_1.expect(val).to.equal(r.shift());
        },
        complete: done,
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
      .pipe(operators_1.mergeAll(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=mergeAll-spec.js.map
