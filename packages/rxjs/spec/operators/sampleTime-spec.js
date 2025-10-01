'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('sampleTime', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should get samples on a delay', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('     a---b-c---------d--e---f-g-h--|');
      var e1subs = '     ^-----------------------------!';
      var expected = '   -------c-------------e------h-|';
      var period = time('-------|                       ');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should sample nothing if new value has not arrived', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('  ----a-^--b----c--------------f----|');
      var e1subs = '        ^---------------------------!';
      var expected = '      -----------c----------------|';
      var period = time('   -----------|                 ');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should sample if new value has arrived, even if it is the same value', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('----a-^--b----c----------c---f----|');
      var e1subs = '      ^---------------------------!';
      var expected = '    -----------c----------c-----|';
      var period = time(' -----------|                 ');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should sample nothing if source has not nexted by time of sample', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('----a-^-------------b-------------|');
      var e1subs = '      ^---------------------------!';
      var expected = '    ----------------------b-----|';
      var period = time(' -----------|                 ');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source raises error', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('----a-^--b----c----d----#');
      var e1subs = '      ^-----------------!';
      var expected = '    -----------c------#';
      var period = time(' -----------|       ');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('----a-^--b----c----d----e----f----|');
      var unsub = '       ----------------!            ';
      var e1subs = '      ^---------------!            ';
      var expected = '    -----------c-----            ';
      var period = time(' -----------|                 ');
      expectObservable(
        e1.pipe(operators_1.sampleTime(period, rxTest)),
        unsub
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTest.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = hot('----a-^--b----c----d----e----f----|');
      var e1subs = '      ^---------------!            ';
      var period = time(' -----------|                 ');
      var expected = '    -----------c-----            ';
      var unsub = '       ----------------!            ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.sampleTime(period, rxTest),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should completes if source does not emits', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = cold('    |     ');
      var e1subs = '     (^!)  ';
      var expected = '   |     ';
      var period = time('-----|');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error if source throws immediately', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = cold('    #     ');
      var e1subs = '     (^!)  ';
      var expected = '   #     ';
      var period = time('-----|');
      expectObservable(e1.pipe(operators_1.sampleTime(period, rxTest))).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete if source does not complete', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var e1 = cold('    --------');
      var e1subs = '     ^------!';
      var expected = '   --------';
      var period = time('-----|  ');
      var e1unsbs = '    -------!';
      expectObservable(
        e1.pipe(operators_1.sampleTime(period, rxTest)),
        e1unsbs
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=sampleTime-spec.js.map
