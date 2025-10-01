'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var AnimationFrameAction_1 = require('rxjs/internal/scheduler/AnimationFrameAction');
var AnimationFrameScheduler_1 = require('rxjs/internal/scheduler/AnimationFrameScheduler');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var VirtualTimeScheduler_1 = require('../../src/internal/scheduler/VirtualTimeScheduler');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('debounceTime', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should debounce values by 2 time units', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--bc--d---|');
      var e1subs = '  ^-----------!';
      var expected = '---a---c--d-|';
      var t = time('  --|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay all elements by the specified time', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--------b------c----|');
      var e1subs = '  ^---------------------!';
      var expected = '------a--------b------(c|)';
      var t = time('  -----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce and delay element by the specified time', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--(bc)-----------d-------|');
      var e1subs = '  ^--------------------------!';
      var expected = '---------c--------------d--|';
      var t = time('  -----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
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
      var expected = '-----|';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should complete when source is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var expected = '|';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
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
      var expected = '-----#';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should raise error when source throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #');
      var e1subs = '  (^!)';
      var expected = '#';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^------!       ';
      var expected = '----a---       ';
      var unsub = '   -------!       ';
      var t = time('  --|');
      var result = e1.pipe(operators_1.debounceTime(t));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--bc--d----|');
      var e1subs = '  ^------!       ';
      var expected = '----a---       ';
      var unsub = '   -------!       ';
      var t = time('  --|');
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.debounceTime(t),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce and does not complete when source does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--(bc)-----------d-------');
      var e1subs = '  ^--------------------------';
      var expected = '---------c--------------d--';
      var t = time('  -----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not completes when source does not completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not completes when source never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var t = time('  -|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delay all elements until source raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -a--------b------c----#');
      var e1subs = '  ^---------------------!';
      var expected = '------a--------b------#';
      var t = time('  -----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce all elements while source emits within given time', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--h-|');
      var e1subs = '  ^------------------------!';
      var expected = '-------------------------(h|)';
      var t = time('  ----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce all element while source emits within given time until raises error', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        time = _a.time,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--f--g--h-#');
      var e1subs = '  ^------------------------!';
      var expected = '-------------------------#';
      var t = time('  ----|');
      expectObservable(e1.pipe(operators_1.debounceTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should debounce correctly when synchronously reentered', function () {
    var results = [];
    var source = new rxjs_1.Subject();
    var scheduler = new VirtualTimeScheduler_1.VirtualTimeScheduler();
    source
      .pipe(operators_1.debounceTime(0, scheduler))
      .subscribe(function (value) {
        results.push(value);
        if (value === 1) {
          source.next(2);
        }
      });
    source.next(1);
    scheduler.flush();
    chai_1.expect(results).to.deep.equal([1, 2]);
  });
  it('should unsubscribe from the scheduled debounce action when downstream unsubscribes', function () {
    var scheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(
      AnimationFrameAction_1.AnimationFrameAction
    );
    chai_1.expect(scheduler._scheduled).to.not.exist;
    chai_1.expect(scheduler.actions).to.be.empty;
    var subscription = rxjs_1.NEVER.pipe(
      operators_1.startWith(1),
      operators_1.debounceTime(0, scheduler)
    ).subscribe();
    chai_1.expect(scheduler._scheduled).to.exist;
    chai_1.expect(scheduler.actions.length).to.equal(1);
    subscription.unsubscribe();
    chai_1.expect(scheduler._scheduled).to.not.exist;
    chai_1.expect(scheduler.actions).to.be.empty;
  });
});
//# sourceMappingURL=debounceTime-spec.js.map
