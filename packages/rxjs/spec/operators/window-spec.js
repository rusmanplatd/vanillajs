'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
var chai_1 = require('chai');
describe('window', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should emit windows that close and reopen', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  ---a---b---c---d---e---f---g---h---i---|    ');
      var sourceSubs = '  ^--------------------------------------!    ';
      var closings = hot('-------------w------------w----------------|');
      var closingSubs = ' ^--------------------------------------!    ';
      var expected = '    x------------y------------z------------|    ';
      var x = cold('      ---a---b---c-|                              ');
      var y = cold('                   --d---e---f--|                 ');
      var z = cold('                                -g---h---i---|    ');
      var expectedValues = { x: x, y: y, z: z };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should return a single empty window if source is empty and closings are basic', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |        ');
      var sourceSubs = '   (^!)     ';
      var closings = cold('--x--x--|');
      var closingSubs = '  (^!)     ';
      var expected = '     (w|)     ';
      var w = cold('       |        ');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should return a single empty window if source is empty and closing is empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  |   ');
      var sourceSubs = '   (^!)';
      var closings = cold('|   ');
      var closingSubs = '  (^!)';
      var expected = '     (w|)';
      var w = cold('       |   ');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should return a single empty window if source is sync empty and closing is sync empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  (|) ');
      var sourceSubs = '   (^!)';
      var expected = '     (w|)';
      var w = cold('       |   ');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(rxjs_1.EMPTY));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should split a Just source into a single window identical to source, using a Never closing', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  (a|)');
      var sourceSubs = '   (^!)';
      var closings = cold('-   ');
      var closingSubs = '  (^!)';
      var expected = '     (w|)';
      var w = cold('       (a|)');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should return a single Never window if source is Never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  ------');
      var sourceSubs = '   ^-----';
      var closings = cold('------');
      var closingSubs = '  ^-----';
      var expected = '     w-----';
      var w = cold('       ------');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should be able to split a never Observable into timely empty windows', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('   ^--------');
      var sourceSubs = '   ^--------';
      var closings = cold('--x--x--|');
      var closingSubs = '  ^-------!';
      var expected = '     a-b--c---';
      var a = cold('       --|      ');
      var b = cold('         ---|   ');
      var c = cold('            ----');
      var expectedValues = { a: a, b: b, c: c };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should emit an error-only window if outer is a simple throw-Observable', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  #        ');
      var sourceSubs = '   (^!)     ';
      var closings = cold('--x--x--|');
      var closingSubs = '  (^!)     ';
      var expected = '     (w#)     ';
      var w = cold('       #        ');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should handle basic case with window closings', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-|         ');
      var subs = '           ^--------------!         ';
      var closings = hot('---^---x---x---x---x---x---|');
      var closingSubs = '    ^--------------!         ';
      var expected = '       a---b---c---d--|         ';
      var a = cold('         -3-4|                    ');
      var b = cold('             -5-6|                ');
      var c = cold('                 -7-8|            ');
      var d = cold('                     -9-|         ');
      var expectedValues = { a: a, b: b, c: c, d: d };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should handle basic case with window closings, but outer throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-#         ');
      var subs = '           ^--------------!         ';
      var closings = hot('---^---x---x---x---x---x---|');
      var closingSubs = '    ^--------------!         ';
      var expected = '       a---b---c---d--#         ';
      var a = cold('         -3-4|                    ');
      var b = cold('             -5-6|                ');
      var c = cold('                 -7-8|            ');
      var d = cold('                     -9-#         ');
      var expectedValues = { a: a, b: b, c: c, d: d };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should stop emitting windows when outer is unsubscribed early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-|         ');
      var subs = '           ^-------!                ';
      var closings = hot('---^---x---x---x---x---x---|');
      var closingSubs = '    ^-------!                ';
      var expected = '       a---b----                ';
      var a = cold('         -3-4|                    ');
      var b = cold('             -5-6                 ');
      var unsub = '          --------!                ';
      var expectedValues = { a: a, b: b };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result, unsub).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-|         ');
      var subs = '           ^-------!                ';
      var closings = hot('---^---x---x---x---x---x---|');
      var closingSubs = '    ^-------!                ';
      var expected = '       a---b----                ';
      var a = cold('         -3-4|                    ');
      var b = cold('             -5-6-                ');
      var unsub = '          --------!                ';
      var expectedValues = { a: a, b: b };
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.window(closings),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should make outer emit error when closing throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-#');
      var subs = '           ^---!           ';
      var closings = hot('---^---#           ');
      var closingSubs = '    ^---!           ';
      var expected = '       a---#           ';
      var a = cold('         -3-4#           ');
      var expectedValues = { a: a };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should complete the resulting Observable when window closings completes', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-2-^3-4-5-6-7-8-9-|');
      var subs = '           ^--------------!';
      var closings = hot('---^---x---x---|   ');
      var closingSubs = '    ^-----------!   ';
      var expected = '       a---b---c------|';
      var a = cold('         -3-4|           ');
      var b = cold('             -5-6|       ');
      var c = cold('                 -7-8-9-|');
      var expectedValues = { a: a, b: b, c: c };
      var result = source.pipe(operators_1.window(closings));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
      expectSubscriptions(closings.subscriptions).toBe(closingSubs);
    });
  });
  it('should window when Promise resolves', function (done) {
    var e1 = rxjs_1.interval(3).pipe(operators_1.take(5));
    var pos = 0;
    var result = [[], []];
    var expected = [
      [0, 1],
      [2, 3, 4],
    ];
    e1.pipe(
      operators_1.window(
        new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve();
          }, 8);
        })
      )
    ).subscribe({
      next: function (x) {
        x.subscribe({
          next: function (v) {
            return result[pos].push(v);
          },
          complete: function () {
            return pos++;
          },
        });
      },
      error: function () {
        return done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(result).to.deep.equal(expected);
        done();
      },
    });
  });
  it('should raise error when Promise rejects', function (done) {
    var e1 = rxjs_1.interval(1).pipe(operators_1.take(5));
    var error = new Error('err');
    e1.pipe(operators_1.window(Promise.reject(error))).subscribe({
      error: function (err) {
        chai_1.expect(err).to.be.an('error');
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
});
//# sourceMappingURL=window-spec.js.map
