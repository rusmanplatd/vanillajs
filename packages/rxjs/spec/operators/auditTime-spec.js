'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('auditTime', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should emit the last value in each time window', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a-x-y----b---x-cx---|');
      var e1subs = '  ^--------------------!';
      var t = time('   -----|               ');
      var expected = '------y--------x-----(x|)';
      var result = e1.pipe(operators_1.auditTime(t));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should auditTime events by 5 time units', function (done) {
    var expected = 3;
    rxjs_1
      .of(1, 2, 3)
      .pipe(operators_1.auditTime(5))
      .subscribe(function (x) {
        chai_1.expect(x).to.equal(expected);
        done();
      });
  });
  it('should auditTime events multiple times', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -012-----01234---|');
      var e1subs = '  ^----------------!';
      var t = time('   -----|           ');
      var expected = '------2-------4--|';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay the source if values are not emitted often enough', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--------b-----c----|');
      var e1subs = '  ^--------------------!';
      var t = time('   -----|               ');
      var expected = '------a--------b-----(c|)';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a busy producer emitting a regular repeating sequence', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  abcdefabcdefabcdefabcdefa|');
      var e1subs = '  ^------------------------!';
      var t = time('  -----|                    ');
      var expected = '-----f-----f-----f-----f-----(a|)';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source does not emit', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----|');
      var e1subs = '  ^----!';
      var t = time('  --|   ');
      var expected = '-----|';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source does not emit and raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -----#');
      var e1subs = '  ^----!';
      var t = time('  --|   ');
      var expected = '-----#';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var t = time('  ---|');
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -  ');
      var e1subs = '  ^  ';
      var t = time('  --|');
      var expected = '-  ';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var t = time('  ---|');
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not complete when source does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--(bc)-------d----------------');
      var e1subs = '  ^------------------------------!';
      var t = time('   -----|                         ');
      var expected = '------c-------------d-----------';
      var unsub = '   -------------------------------!';
      expectObservable(e1.pipe(operators_1.auditTime(t)), unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--(bc)-------d----------------');
      var e1subs = '  ^------------------------------!';
      var t = time('   -----|                         ');
      var expected = '------c-------------d-----------';
      var unsub = '   -------------------------------!';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.auditTime(t),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should auditTime values until source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--(bc)-------d---------------#');
      var e1subs = '  ^------------------------------!';
      var t = time('   -----|                         ');
      var expected = '------c-------------d----------#';
      expectObservable(e1.pipe(operators_1.auditTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
});
//# sourceMappingURL=auditTime-spec.js.map
