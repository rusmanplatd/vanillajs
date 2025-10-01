'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var test_helper_1 = require('../helpers/test-helper');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('static merge(...observables)', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should merge cold and cold', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^----------------------!';
      var expected = '---a--x--b--y--c--z----|';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should return itself when try to merge single observable', function () {
    var e1 = rxjs_1.of('a');
    var result = rxjs_1.merge(e1);
    chai_1.expect(e1).to.equal(result);
  });
  it('should merge hot and hot', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot(' ---a---^-b-----c----|   ');
      var e1subs = '        ^------------!   ';
      var e2 = hot(' -----x-^----y-----z----|');
      var e2subs = '        ^---------------!';
      var expected = '      --b--y--c--z----|';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge hot and cold', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot(' ---a-^---b-----c----|    ');
      var e1subs = '      ^--------------!    ';
      var e2 = cold('     --x-----y-----z----|');
      var e2subs = '      ^------------------!';
      var expected = '    --x-b---y-c---z----|';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge parallel emissions', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a----b----c----|');
      var e1subs = '  ^-----------------!';
      var e2 = hot('  ---x----y----z----|');
      var e2subs = '  ^-----------------!';
      var expected = '---(ax)-(by)-(cz)-|';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge empty and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('|   ');
      var e1subs = ' (^!)';
      var e2 = cold('|   ');
      var e2subs = ' (^!)';
      var expected = '|  ';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge three empties', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('|   ');
      var e1subs = ' (^!)';
      var e2 = cold('|   ');
      var e2subs = ' (^!)';
      var e3 = cold('|   ');
      var e3subs = ' (^!)';
      var expected = '|  ';
      var result = rxjs_1.merge(e1, e2, e3);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should merge never and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('-   ');
      var e1subs = ' ^   ';
      var e2 = cold('|   ');
      var e2subs = ' (^!)';
      var expected = '-  ';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge never and never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var e2 = cold(' -');
      var e2subs = '  ^';
      var expected = '-';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge empty and throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var e2 = cold(' #   ');
      var e2subs = '  (^!)';
      var expected = '#';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge hot and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  (^!)        ';
      var e2 = cold(' #           ');
      var e2subs = '  (^!)        ';
      var expected = '#           ';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge never and throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -   ');
      var e1subs = '  (^!)';
      var e2 = cold(' #   ');
      var e2subs = '  (^!)';
      var expected = '#   ';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge empty and eventual error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |       ');
      var e1subs = '  (^!)    ';
      var e2 = hot('  -------#');
      var e2subs = '  ^------!';
      var expected = '-------#';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge hot and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^------!    ';
      var e2 = hot('  -------#    ');
      var e2subs = '  ^------!    ';
      var expected = '--a--b-#    ';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge never and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --------');
      var e1subs = '  ^------!';
      var e2 = hot('  -------#');
      var e2subs = '  ^------!';
      var expected = '-------#';
      var result = rxjs_1.merge(e1, e2);
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge single lowerCaseO into RxJS Observable', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
      var result = rxjs_1.merge(e1);
      chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
      expectObservable(result).toBe('(abc|)');
    });
  });
  it('should merge two lowerCaseO into RxJS Observable', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
      var e2 = test_helper_1.lowerCaseO('d', 'e', 'f');
      var result = rxjs_1.merge(e1, e2);
      chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
      expectObservable(result).toBe('(abcdef|)');
    });
  });
});
describe('merge(...observables, Scheduler)', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should merge single lowerCaseO into RxJS Observable', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = test_helper_1.lowerCaseO('a', 'b', 'c');
      var result = rxjs_1.merge(e1, rxTestScheduler);
      chai_1.expect(result).to.be.instanceof(rxjs_1.Observable);
      expectObservable(result).toBe('(abc|)');
    });
  });
});
describe('merge(...observables, Scheduler, number)', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should handle concurrency limits', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' ---a---b---c---|            ');
      var e2 = cold(' -d---e---f--|               ');
      var e3 = cold('             ---x---y---z---|');
      var expected = '-d-a-e-b-f-c---x---y---z---|';
      expectObservable(rxjs_1.merge(e1, e2, e3, 2)).toBe(expected);
    });
  });
  it('should handle scheduler', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayTime = time('--|');
      var e1 = rxjs_1.of('a');
      var e2 = rxjs_1.of('b').pipe(operators_1.delay(delayTime));
      var expected = 'a-(b|)';
      expectObservable(rxjs_1.merge(e1, e2, rxTestScheduler)).toBe(expected);
    });
  });
  it('should handle scheduler with concurrency limits', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' ---a---b---c---|            ');
      var e2 = cold(' -d---e---f--|               ');
      var e3 = cold('             ---x---y---z---|');
      var expected = '-d-a-e-b-f-c---x---y---z---|';
      expectObservable(rxjs_1.merge(e1, e2, e3, 2, rxTestScheduler)).toBe(
        expected
      );
    });
  });
  it('should use the scheduler even when one Observable is merged', function (done) {
    var e1Subscribed = false;
    var e1 = rxjs_1.defer(function () {
      e1Subscribed = true;
      return rxjs_1.of('a');
    });
    rxjs_1.merge(e1, rxjs_1.asyncScheduler).subscribe({
      error: done,
      complete: function () {
        chai_1.expect(e1Subscribed).to.be.true;
        done();
      },
    });
    chai_1.expect(e1Subscribed).to.be.false;
  });
  it('should deem a single array argument to be an ObservableInput', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var array = ['foo', 'bar'];
      var expected = '(fb|)';
      expectObservable(rxjs_1.merge(array)).toBe(expected, {
        f: 'foo',
        b: 'bar',
      });
    });
  });
});
//# sourceMappingURL=merge-spec.js.map
