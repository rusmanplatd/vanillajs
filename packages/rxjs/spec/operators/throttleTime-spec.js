'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('throttleTime operator', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  describe('default behavior { leading: true, trailing: false }', function () {
    it('should immediately emit the first value in each time window', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-x-y----b---x-cx---|');
        var expected = '-a--------b-----c----|';
        var subs = '    ^--------------------!';
        var result = e1.pipe(operators_1.throttleTime(5));
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should throttle events by 5 time units', function (done) {
      rxjs_1
        .of(1, 2, 3)
        .pipe(operators_1.throttleTime(5))
        .subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal(1);
          },
          complete: done,
        });
    });
    it('should throttle events multiple times', function () {
      var expected = ['1-0', '2-0'];
      rxjs_1
        .concat(
          rxjs_1.timer(0, 1).pipe(
            operators_1.take(3),
            operators_1.map(function (x) {
              return '1-' + x;
            })
          ),
          rxjs_1.timer(8, 1).pipe(
            operators_1.take(5),
            operators_1.map(function (x) {
              return '2-' + x;
            })
          )
        )
        .pipe(operators_1.throttleTime(5, rxTest))
        .subscribe(function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        });
      rxTest.flush();
    });
    it('should simply mirror the source if values are not emitted often enough', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--------b-----c----|');
        var subs = '    ^--------------------!';
        var expected = '-a--------b-----c----|';
        expectObservable(e1.pipe(operators_1.throttleTime(5))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should handle a busy producer emitting a regular repeating sequence', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  abcdefabcdefabcdefabcdefa|');
        var subs = '    ^------------------------!';
        var expected = 'a-----a-----a-----a-----a|';
        expectObservable(e1.pipe(operators_1.throttleTime(5))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should complete when source does not emit', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -----|');
        var subs = '    ^----!';
        var expected = '-----|';
        expectObservable(e1.pipe(operators_1.throttleTime(5))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should raise error when source does not emit and raises error', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -----#');
        var subs = '    ^----!';
        var expected = '-----#';
        expectObservable(e1.pipe(operators_1.throttleTime(10))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should handle an empty source', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = cold(' |');
        var subs = '    (^!)';
        var expected = '|';
        expectObservable(e1.pipe(operators_1.throttleTime(30))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should handle a never source', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = cold(' -');
        var subs = '    ^';
        var expected = '-';
        expectObservable(e1.pipe(operators_1.throttleTime(30))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should handle a throw source', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = cold(' #');
        var subs = '    (^!)';
        var expected = '#';
        expectObservable(e1.pipe(operators_1.throttleTime(30))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should throttle and does not complete when source does not completes', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--(bc)-------d----------------');
        var unsub = '   -------------------------------!';
        var subs = '    ^------------------------------!';
        var expected = '-a-------------d----------------';
        expectObservable(e1.pipe(operators_1.throttleTime(5)), unsub).toBe(
          expected
        );
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--(bc)-------d----------------');
        var subs = '    ^------------------------------!';
        var expected = '-a-------------d----------------';
        var unsub = '   -------------------------------!';
        var result = e1.pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          }),
          operators_1.throttleTime(5),
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
    it('should throttle values until source raises error', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a--(bc)-------d---------------#');
        var subs = '    ^------------------------------!';
        var expected = '-a-------------d---------------#';
        expectObservable(e1.pipe(operators_1.throttleTime(5))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
      });
    });
  });
  describe('throttleTime(fn, { leading: true, trailing: true })', function () {
    it('should immediately emit the first and last values in each time window', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-xy-----b--x--cxxx--|');
        var e1subs = '  ^---------------------!';
        var t = time('   ----|                 ');
        var expected = '-a---y----b---x---x---(x|)';
        var result = e1.pipe(
          operators_1.throttleTime(t, rxTest, { trailing: true })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should emit the value if only a single one is given', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          time = _a.time,
          expectObservable = _a.expectObservable;
        var e1 = hot('  -a--------------------|');
        var t = time('   ----|                 ');
        var expected = '-a--------------------|';
        var result = e1.pipe(
          operators_1.throttleTime(t, rxTest, { trailing: true })
        );
        expectObservable(result).toBe(expected);
      });
    });
  });
  describe('throttleTime(fn, { leading: false, trailing: true })', function () {
    it('should immediately emit the last value in each time window', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-xy-----b--x--cxxx--|');
        var e1subs = '  ^---------------------!';
        var t = time('   ----|                 ');
        var expected = '-----y--------x---x---(x|)';
        var result = e1.pipe(
          operators_1.throttleTime(t, rxTest, {
            leading: false,
            trailing: true,
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should emit the last throttled value when complete', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          time = _a.time,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  -a-xy-----b--x--cxx-|');
        var e1subs = '  ^-------------------!';
        var t = time('   ----|               ');
        var expected = '-----y--------x---x-|';
        var result = e1.pipe(
          operators_1.throttleTime(t, rxTest, {
            leading: false,
            trailing: true,
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      });
    });
    it('should emit the value if only a single one is given', function () {
      rxTest.run(function (_a) {
        var hot = _a.hot,
          time = _a.time,
          expectObservable = _a.expectObservable;
        var e1 = hot('  -a--------------------|');
        var t = time('   ----|                 ');
        var expected = '-----a----------------|';
        var result = e1.pipe(
          operators_1.throttleTime(t, rxTest, {
            leading: false,
            trailing: true,
          })
        );
        expectObservable(result).toBe(expected);
      });
    });
  });
});
//# sourceMappingURL=throttleTime-spec.js.map
