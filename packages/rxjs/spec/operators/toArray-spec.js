'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('toArray', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should reduce the values of an observable into an array', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a--b--|   ');
      var e1subs = '  ^--------!   ';
      var expected = '---------(w|)';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, {
        w: ['a', 'b'],
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be never when source is never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be empty when source is empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '(w|)';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, {
        w: [],
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it("should be never when source doesn't complete", function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--x--^--y--');
      var e1subs = '     ^-----';
      var expected = '   ------';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce observable without values into an array of length zero', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^---|   ');
      var e1subs = '   ^---!   ';
      var expected = ' ----(w|)';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, {
        w: [],
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should reduce the a single value of an observable into an array', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--|  ');
      var e1subs = '   ^-----!  ';
      var expected = ' ------(w|)';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected, {
        w: ['y'],
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow multiple subscriptions', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--|   ');
      var e1subs = '   ^-----!   ';
      var expected = ' ------(w|)';
      var result = e1.pipe(operators_1.toArray());
      expectObservable(result).toBe(expected, { w: ['y'] });
      expectObservable(result).toBe(expected, { w: ['y'] });
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b----c-----d----e---|');
      var e1subs = '  ^-------!                 ';
      var expected = '---------                 ';
      var unsub = '   --------!                 ';
      expectObservable(e1.pipe(operators_1.toArray()), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b----c-----d----e---|');
      var e1subs = '  ^-------!                 ';
      var expected = '---------                 ';
      var unsub = '   --------!                 ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.toArray(),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-x-^--y--z--#', { x: 1, y: 2, z: 3 }, 'too bad');
      var e1subs = '   ^--------!';
      var expected = ' ---------#';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(
        expected,
        null,
        'too bad'
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.toArray())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=toArray-spec.js.map
