'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('timer', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should create an observable emitting periodically', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1
        .timer(6, 2, rxTest)
        .pipe(operators_1.take(4), operators_1.concat(rxjs_1.NEVER));
      var expected = '------a-b-c-d-';
      var values = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
      };
      expectObservable(e1).toBe(expected, values);
    });
  });
  it('should schedule a value of 0 then complete', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var dueTime = 5;
      var expected = '    -----(x|)';
      var source = rxjs_1.timer(dueTime, undefined, rxTest);
      expectObservable(source).toBe(expected, { x: 0 });
    });
  });
  it('should emit a single value immediately', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var dueTime = 0;
      var expected = '(x|)';
      var source = rxjs_1.timer(dueTime, rxTest);
      expectObservable(source).toBe(expected, { x: 0 });
    });
  });
  it('should start after delay and periodically emit values', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var dueTime = 4;
      var period = 2;
      var expected = '    ----a-b-c-d-(e|)';
      var source = rxjs_1
        .timer(dueTime, period, rxTest)
        .pipe(operators_1.take(5));
      var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
      expectObservable(source).toBe(expected, values);
    });
  });
  it('should start immediately and periodically emit values', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var dueTime = 0;
      var period = 3;
      var expected = '   a--b--c--d--(e|)';
      var source = rxjs_1
        .timer(dueTime, period, rxTest)
        .pipe(operators_1.take(5));
      var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
      expectObservable(source).toBe(expected, values);
    });
  });
  it('should stop emitting values when subscription is done', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var dueTime = 0;
      var period = 3;
      var expected = '   a--b--c--d--e';
      var unsub = '      ^------------!';
      var source = rxjs_1.timer(dueTime, period, rxTest);
      var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
      expectObservable(source, unsub).toBe(expected, values);
    });
  });
  it('should schedule a value at a specified Date', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var offset = 4;
      var expected = '   ----(a|)';
      var dueTime = new Date(rxTest.now() + offset);
      var source = rxjs_1.timer(dueTime, undefined, rxTest);
      expectObservable(source).toBe(expected, { a: 0 });
    });
  });
  it('should start after delay and periodically emit values', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var offset = 4;
      var period = 2;
      var expected = '   ----a-b-c-d-(e|)';
      var dueTime = new Date(rxTest.now() + offset);
      var source = rxjs_1
        .timer(dueTime, period, rxTest)
        .pipe(operators_1.take(5));
      var values = { a: 0, b: 1, c: 2, d: 3, e: 4 };
      expectObservable(source).toBe(expected, values);
    });
  });
  it(
    'should still target the same date if a date is provided even for the ' +
      'second subscription',
    function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          time = _a.time,
          expectObservable = _a.expectObservable;
        var offset = time('----|    ');
        var t1 = cold('    a|       ');
        var t2 = cold('    --a|     ');
        var expected = '   ----(aa|)';
        var dueTime = new Date(rxTest.now() + offset);
        var source = rxjs_1.timer(dueTime, undefined, rxTest);
        var testSource = rxjs_1.merge(t1, t2).pipe(
          operators_1.mergeMap(function () {
            return source;
          })
        );
        expectObservable(testSource).toBe(expected, { a: 0 });
      });
    }
  );
  it('should accept Infinity as the first argument', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.timer(Infinity, undefined, rxTest);
      var expected = '------';
      expectObservable(source).toBe(expected);
    });
  });
  it('should accept Infinity as the second argument', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      rxTest.maxFrames = 20;
      var source = rxjs_1.timer(4, Infinity, rxTest);
      var expected = '----a-';
      expectObservable(source).toBe(expected, { a: 0 });
    });
  });
  it('should accept negative numbers as the second argument, which should cause immediate completion', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.timer(4, -4, rxTest);
      var expected = '----(a|)';
      expectObservable(source).toBe(expected, { a: 0 });
    });
  });
  it('should accept 0 as the second argument', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.timer(4, 0, rxTest).pipe(operators_1.take(5));
      var expected = '----(abcde|)';
      expectObservable(source).toBe(expected, { a: 0, b: 1, c: 2, d: 3, e: 4 });
    });
  });
  it('should emit after a delay of 0 for Date objects in the past', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var expected = '(a|)';
      var threeSecondsInThePast = new Date(rxTest.now() - 3000);
      var source = rxjs_1.timer(threeSecondsInThePast, undefined, rxTest);
      expectObservable(source).toBe(expected, { a: 0 });
    });
  });
});
//# sourceMappingURL=timer-spec.js.map
