'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var sinon = require('sinon');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('interval', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should set up an interval', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var period = time(
        '----------|                                                                 '
      );
      var unsubs =
        '     ---------------------------------------------------------------------------!';
      var expected =
        '   ----------0---------1---------2---------3---------4---------5---------6-----';
      expectObservable(rxjs_1.interval(period), unsubs).toBe(
        expected,
        [0, 1, 2, 3, 4, 5, 6]
      );
    });
  });
  it('should emit when relative interval set to zero', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var period = time('|         ');
      var expected = '   (0123456|)';
      var e1 = rxjs_1.interval(period).pipe(operators_1.take(7));
      expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6]);
    });
  });
  it('should consider negative interval as zero', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var expected = '(0123456|)';
      var e1 = rxjs_1.interval(-1).pipe(operators_1.take(7));
      expectObservable(e1).toBe(expected, [0, 1, 2, 3, 4, 5, 6]);
    });
  });
  it('should emit values until unsubscribed', function (done) {
    var values = [];
    var expected = [0, 1, 2, 3, 4, 5, 6];
    var e1 = rxjs_1.interval(5);
    var subscription = e1.subscribe({
      next: function (x) {
        values.push(x);
        if (x === 6) {
          subscription.unsubscribe();
          chai_1.expect(values).to.deep.equal(expected);
          done();
        }
      },
      error: function (err) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
  it('should create an observable emitting periodically with the AsapScheduler', function (done) {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var period = 10;
    var events = [0, 1, 2, 3, 4, 5];
    var source = rxjs_1
      .interval(period, rxjs_1.asapScheduler)
      .pipe(operators_1.take(6));
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(events.shift());
      },
      error: function (e) {
        sandbox.restore();
        done(e);
      },
      complete: function () {
        chai_1.expect(rxjs_1.asapScheduler.actions.length).to.equal(0);
        chai_1.expect(rxjs_1.asapScheduler._scheduled).to.equal(undefined);
        sandbox.restore();
        done();
      },
    });
    var i = -1,
      n = events.length;
    while (++i < n) {
      fakeTimer.tick(period);
    }
  });
  it('should create an observable emitting periodically with the QueueScheduler', function (done) {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var period = 10;
    var events = [0, 1, 2, 3, 4, 5];
    var source = rxjs_1
      .interval(period, rxjs_1.queueScheduler)
      .pipe(operators_1.take(6));
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(events.shift());
      },
      error: function (e) {
        sandbox.restore();
        done(e);
      },
      complete: function () {
        chai_1.expect(rxjs_1.queueScheduler.actions.length).to.equal(0);
        chai_1.expect(rxjs_1.queueScheduler._scheduled).to.equal(undefined);
        sandbox.restore();
        done();
      },
    });
    var i = -1,
      n = events.length;
    while (++i < n) {
      fakeTimer.tick(period);
    }
  });
  it('should create an observable emitting periodically with the AnimationFrameScheduler', function (done) {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var period = 10;
    var events = [0, 1, 2, 3, 4, 5];
    var source = rxjs_1
      .interval(period, rxjs_1.animationFrameScheduler)
      .pipe(operators_1.take(6));
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(events.shift());
      },
      error: function (e) {
        sandbox.restore();
        done(e);
      },
      complete: function () {
        chai_1
          .expect(rxjs_1.animationFrameScheduler.actions.length)
          .to.equal(0);
        chai_1
          .expect(rxjs_1.animationFrameScheduler._scheduled)
          .to.equal(undefined);
        sandbox.restore();
        done();
      },
    });
    var i = -1,
      n = events.length;
    while (++i < n) {
      fakeTimer.tick(period);
    }
  });
});
//# sourceMappingURL=interval-spec.js.map
