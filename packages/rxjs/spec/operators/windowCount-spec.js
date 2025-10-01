'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('windowCount', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should emit windows with count 3, no skip specified', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('---a---b---c---d---e---f---g---h---i---|');
      var sourceSubs = '^--------------------------------------!';
      var expected = '  x----------y-----------z-----------w---|';
      var x = cold('    ---a---b---(c|)                         ');
      var y = cold('               ----d---e---(f|)             ');
      var z = cold('                           ----g---h---(i|) ');
      var w = cold('                                       ----|');
      var expectedValues = { x: x, y: y, z: z, w: w };
      var result = source.pipe(operators_1.windowCount(3));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should emit windows with count 2 and skip 1', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('^-a--b--c--d--|');
      var subs = '      ^-------------!';
      var expected = '  u-v--x--y--z--|';
      var u = cold('    --a--(b|)      ');
      var v = cold('      ---b--(c|)   ');
      var x = cold('         ---c--(d|)');
      var y = cold('            ---d--|');
      var z = cold('               ---|');
      var values = { u: u, v: v, x: x, y: y, z: z };
      var result = source.pipe(operators_1.windowCount(2, 1));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should emit windows with count 2, and skip unspecified', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--f--|');
      var subs = '      ^-------------------!';
      var expected = '  x----y-----z-----w--|';
      var x = cold('    --a--(b|)            ');
      var y = cold('         ---c--(d|)      ');
      var z = cold('               ---e--(f|)');
      var w = cold('                     ---|');
      var values = { x: x, y: y, z: z, w: w };
      var result = source.pipe(operators_1.windowCount(2));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should return empty if source is empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('|');
      var subs = '       (^!)';
      var expected = '   (w|)';
      var w = cold('     |');
      var values = { w: w };
      var result = source.pipe(operators_1.windowCount(2, 1));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should return Never if source if Never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-');
      var subs = '       ^';
      var expected = '   w';
      var w = cold('     -');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.windowCount(2, 1));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should propagate error from a just-throw source', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('  #');
      var subs = '         (^!)';
      var expected = '     (w#)';
      var w = cold('       #');
      var expectedValues = { w: w };
      var result = source.pipe(operators_1.windowCount(2, 1));
      expectObservable(result).toBe(expected, expectedValues);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should raise error if source raises error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--d--e--f--#');
      var subs = '      ^-------------------!';
      var expected = '  u-v--w--x--y--z--q--#';
      var u = cold('    --a--b--(c|)         ');
      var v = cold('      ---b--c--(d|)      ');
      var w = cold('         ---c--d--(e|)   ');
      var x = cold('            ---d--e--(f|)');
      var y = cold('               ---e--f--#');
      var z = cold('                  ---f--#');
      var q = cold('                     ---#');
      var values = { u: u, v: v, w: w, x: x, y: y, z: z, q: q };
      var result = source.pipe(operators_1.windowCount(3, 1));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should dispose of inner windows once outer is unsubscribed early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('^-a--b--c--d--|');
      var subs = '      ^--------!     ';
      var expected = '  w-x--y--z-     ';
      var w = cold('    --a--(b|)      ');
      var x = cold('      ---b--(c|)   ');
      var y = cold('         ---c-     ');
      var z = cold('            --     ');
      var unsub = '     ---------!     ';
      var values = { w: w, x: x, y: y, z: z };
      var result = source.pipe(operators_1.windowCount(2, 1));
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('^-a--b--c--d--|');
      var subs = '      ^--------!     ';
      var expected = '  w-x--y--z-     ';
      var w = cold('    --a--(b|)      ');
      var x = cold('      ---b--(c|)   ');
      var y = cold('         ---c-     ');
      var z = cold('            --     ');
      var unsub = '     ---------!     ';
      var values = { w: w, x: x, y: y, z: z };
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.windowCount(2, 1),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(subs);
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
        operators_1.windowCount(3),
        operators_1.mergeAll(),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=windowCount-spec.js.map
