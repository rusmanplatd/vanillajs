'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var immediateProvider_1 = require('rxjs/internal/scheduler/immediateProvider');
var intervalProvider_1 = require('rxjs/internal/scheduler/intervalProvider');
var asap = rxjs_1.asapScheduler;
describe('Scheduler.asap', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should exist', function () {
    chai_1.expect(asap).exist;
  });
  it('should act like the async scheduler if delay > 0', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        time = _a.time;
      var a = cold('  a            ');
      var ta = time(' ----|        ');
      var b = cold('  b            ');
      var tb = time(' --------|    ');
      var expected = '----a---b----';
      var result = rxjs_1.merge(
        a.pipe(operators_1.delay(ta, asap)),
        b.pipe(operators_1.delay(tb, asap))
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should cancel asap actions when delay > 0', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        flush = _a.flush,
        time = _a.time;
      var sandbox = sinon.createSandbox();
      var setImmediateSpy = sandbox.spy(
        immediateProvider_1.immediateProvider,
        'setImmediate'
      );
      var setSpy = sandbox.spy(
        intervalProvider_1.intervalProvider,
        'setInterval'
      );
      var clearSpy = sandbox.spy(
        intervalProvider_1.intervalProvider,
        'clearInterval'
      );
      var a = cold('  a            ');
      var ta = time(' ----|        ');
      var subs = '    ^-!          ';
      var expected = '-------------';
      var result = rxjs_1.merge(a.pipe(operators_1.delay(ta, asap)));
      expectObservable(result, subs).toBe(expected);
      flush();
      chai_1.expect(setImmediateSpy).to.have.not.been.called;
      chai_1.expect(setSpy).to.have.been.calledOnce;
      chai_1.expect(clearSpy).to.have.been.calledOnce;
      sandbox.restore();
    });
  });
  it('should reuse the interval for recursively scheduled actions with the same delay', function () {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var stubSetInterval = sandbox.stub(fakeTimer, 'setInterval').callThrough();
    var period = 50;
    var state = { index: 0, period: period };
    /**
     *
     * @param state
     */
    function dispatch(state) {
      state.index += 1;
      if (state.index < 3) {
        this.schedule(state, state.period);
      }
    }
    asap.schedule(dispatch, period, state);
    chai_1.expect(state).to.have.property('index', 0);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
    fakeTimer.tick(period);
    chai_1.expect(state).to.have.property('index', 1);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
    fakeTimer.tick(period);
    chai_1.expect(state).to.have.property('index', 2);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
    sandbox.restore();
  });
  it('should not reuse the interval for recursively scheduled actions with a different delay', function () {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var stubSetInterval = sandbox.stub(fakeTimer, 'setInterval').callThrough();
    var period = 50;
    var state = { index: 0, period: period };
    /**
     *
     * @param state
     */
    function dispatch(state) {
      state.index += 1;
      state.period -= 1;
      if (state.index < 3) {
        this.schedule(state, state.period);
      }
    }
    asap.schedule(dispatch, period, state);
    chai_1.expect(state).to.have.property('index', 0);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 1);
    fakeTimer.tick(period);
    chai_1.expect(state).to.have.property('index', 1);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 2);
    fakeTimer.tick(period);
    chai_1.expect(state).to.have.property('index', 2);
    chai_1.expect(stubSetInterval).to.have.property('callCount', 3);
    sandbox.restore();
  });
  it('should schedule an action to happen later', function (done) {
    var actionHappened = false;
    asap.schedule(function () {
      actionHappened = true;
      done();
    });
    if (actionHappened) {
      done(new Error('Scheduled action happened synchronously'));
    }
  });
  it('should execute recursively scheduled actions in separate asynchronous contexts', function (done) {
    var syncExec1 = true;
    var syncExec2 = true;
    asap.schedule(
      function (index) {
        if (index === 0) {
          this.schedule(1);
          asap.schedule(function () {
            syncExec1 = false;
          });
        } else if (index === 1) {
          this.schedule(2);
          asap.schedule(function () {
            syncExec2 = false;
          });
        } else if (index === 2) {
          this.schedule(3);
        } else if (index === 3) {
          if (!syncExec1 && !syncExec2) {
            done();
          } else {
            done(new Error('Execution happened synchronously.'));
          }
        }
      },
      0,
      0
    );
  });
  it('should schedule asap actions from a delayed one', function (done) {
    asap.schedule(function () {
      asap.schedule(function () {
        done();
      });
    }, 1);
  });
  it('should cancel the setImmediate if all scheduled actions unsubscribe before it executes', function (done) {
    var asapExec1 = false;
    var asapExec2 = false;
    var action1 = asap.schedule(function () {
      asapExec1 = true;
    });
    var action2 = asap.schedule(function () {
      asapExec2 = true;
    });
    chai_1.expect(asap._scheduled).to.exist;
    chai_1.expect(asap.actions.length).to.equal(2);
    action1.unsubscribe();
    action2.unsubscribe();
    chai_1.expect(asap.actions.length).to.equal(0);
    chai_1.expect(asap._scheduled).to.equal(undefined);
    asap.schedule(function () {
      chai_1.expect(asapExec1).to.equal(false);
      chai_1.expect(asapExec2).to.equal(false);
      done();
    });
  });
  it('should execute the rest of the scheduled actions if the first action is canceled', function (done) {
    var actionHappened = false;
    var secondSubscription = null;
    var firstSubscription = asap.schedule(function () {
      actionHappened = true;
      if (secondSubscription) {
        secondSubscription.unsubscribe();
      }
      done(new Error('The first action should not have executed.'));
    });
    secondSubscription = asap.schedule(function () {
      if (!actionHappened) {
        done();
      }
    });
    if (actionHappened) {
      done(new Error('Scheduled action happened synchronously'));
    } else {
      firstSubscription.unsubscribe();
    }
  });
  it('should not execute rescheduled actions when flushing', function (done) {
    var flushCount = 0;
    var scheduledIndices = [];
    var originalFlush = asap.flush;
    asap.flush = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      ++flushCount;
      originalFlush.apply(asap, args);
      if (flushCount === 2) {
        asap.flush = originalFlush;
        try {
          chai_1.expect(scheduledIndices).to.deep.equal([0, 1]);
          done();
        } catch (error) {
          done(error);
        }
      }
    };
    asap.schedule(
      function (index) {
        if (flushCount < 2) {
          this.schedule(index + 1);
          scheduledIndices.push(index + 1);
        }
      },
      0,
      0
    );
    scheduledIndices.push(0);
  });
  it('should execute actions scheduled when flushing in a subsequent flush', function (done) {
    var sandbox = sinon.createSandbox();
    var stubFlush = sandbox.stub(rxjs_1.asapScheduler, 'flush').callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.asapScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
      c = rxjs_1.asapScheduler.schedule(function () {
        chai_1.expect(stubFlush).to.have.callCount(2);
        sandbox.restore();
        done();
      });
    });
    b = rxjs_1.asapScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
    });
  });
  it('should execute actions scheduled when flushing in a subsequent flush when some actions are unsubscribed', function (done) {
    var sandbox = sinon.createSandbox();
    var stubFlush = sandbox.stub(rxjs_1.asapScheduler, 'flush').callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.asapScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
      c = rxjs_1.asapScheduler.schedule(function () {
        chai_1.expect(stubFlush).to.have.callCount(2);
        sandbox.restore();
        done();
      });
      b.unsubscribe();
    });
    b = rxjs_1.asapScheduler.schedule(function () {
      done(new Error('Unexpected execution of b'));
    });
  });
  it('should properly cancel an unnecessary flush', function (done) {
    var sandbox = sinon.createSandbox();
    var clearImmediateStub = sandbox
      .stub(immediateProvider_1.immediateProvider, 'clearImmediate')
      .callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.asapScheduler.schedule(function () {
      chai_1.expect(rxjs_1.asapScheduler.actions).to.have.length(1);
      c = rxjs_1.asapScheduler.schedule(function () {
        done(new Error('Unexpected execution of c'));
      });
      chai_1.expect(rxjs_1.asapScheduler.actions).to.have.length(2);
      c.unsubscribe();
      chai_1.expect(rxjs_1.asapScheduler.actions).to.have.length(1);
      chai_1.expect(clearImmediateStub).to.have.callCount(1);
    });
    b = rxjs_1.asapScheduler.schedule(function () {
      sandbox.restore();
      done();
    });
  });
  it('scheduling inside of an executing action more than once should work', function (done) {
    var results = [];
    var resolve;
    var promise = new Promise(function (r) {
      return (resolve = r);
    });
    rxjs_1.asapScheduler.schedule(function () {
      results.push(1);
      rxjs_1.asapScheduler.schedule(function () {
        results.push(2);
      });
      rxjs_1.asapScheduler.schedule(function () {
        results.push(3);
        resolve();
      });
    });
    promise.then(function () {
      chai_1.expect(results).to.deep.equal([1, 2, 3]);
      done();
    });
  });
});
//# sourceMappingURL=AsapScheduler-spec.js.map
