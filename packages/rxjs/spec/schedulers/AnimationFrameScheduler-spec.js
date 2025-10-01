'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var animationFrameProvider_1 = require('rxjs/internal/scheduler/animationFrameProvider');
var intervalProvider_1 = require('rxjs/internal/scheduler/intervalProvider');
var animationFrame = rxjs_1.animationFrameScheduler;
describe('Scheduler.animationFrame', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should exist', function () {
    chai_1.expect(animationFrame).exist;
  });
  it('should act like the async scheduler if delay > 0', function () {
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        time = _a.time;
      animate('         ----------x--');
      var a = cold('  a            ');
      var ta = time(' ----|        ');
      var b = cold('  b            ');
      var tb = time(' --------|    ');
      var expected = '----a---b----';
      var result = rxjs_1.merge(
        a.pipe(operators_1.delay(ta, animationFrame)),
        b.pipe(operators_1.delay(tb, animationFrame))
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should cancel animationFrame actions when delay > 0', function () {
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        flush = _a.flush,
        time = _a.time;
      var requestSpy = sinon.spy(
        animationFrameProvider_1.animationFrameProvider,
        'requestAnimationFrame'
      );
      var setSpy = sinon.spy(
        intervalProvider_1.intervalProvider,
        'setInterval'
      );
      var clearSpy = sinon.spy(
        intervalProvider_1.intervalProvider,
        'clearInterval'
      );
      animate('         ----------x--');
      var a = cold('  a            ');
      var ta = time(' ----|        ');
      var subs = '    ^-!          ';
      var expected = '-------------';
      var result = rxjs_1.merge(a.pipe(operators_1.delay(ta, animationFrame)));
      expectObservable(result, subs).toBe(expected);
      flush();
      chai_1.expect(requestSpy).to.have.not.been.called;
      chai_1.expect(setSpy).to.have.been.calledOnce;
      chai_1.expect(clearSpy).to.have.been.calledOnce;
      requestSpy.restore();
      setSpy.restore();
      clearSpy.restore();
    });
  });
  it('should schedule an action to happen later', function (done) {
    var actionHappened = false;
    animationFrame.schedule(function () {
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
    animationFrame.schedule(
      function (index) {
        if (index === 0) {
          this.schedule(1);
          animationFrame.schedule(function () {
            syncExec1 = false;
          });
        } else if (index === 1) {
          this.schedule(2);
          animationFrame.schedule(function () {
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
  it('should cancel the animation frame if all scheduled actions unsubscribe before it executes', function (done) {
    var animationFrameExec1 = false;
    var animationFrameExec2 = false;
    var action1 = animationFrame.schedule(function () {
      animationFrameExec1 = true;
    });
    var action2 = animationFrame.schedule(function () {
      animationFrameExec2 = true;
    });
    chai_1.expect(animationFrame._scheduled).to.exist;
    chai_1.expect(animationFrame.actions.length).to.equal(2);
    action1.unsubscribe();
    action2.unsubscribe();
    chai_1.expect(animationFrame.actions.length).to.equal(0);
    chai_1.expect(animationFrame._scheduled).to.equal(undefined);
    animationFrame.schedule(function () {
      chai_1.expect(animationFrameExec1).to.equal(false);
      chai_1.expect(animationFrameExec2).to.equal(false);
      done();
    });
  });
  it('should execute the rest of the scheduled actions if the first action is canceled', function (done) {
    var actionHappened = false;
    var secondSubscription = null;
    var firstSubscription = animationFrame.schedule(function () {
      actionHappened = true;
      if (secondSubscription) {
        secondSubscription.unsubscribe();
      }
      done(new Error('The first action should not have executed.'));
    });
    secondSubscription = animationFrame.schedule(function () {
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
  it('should schedule next frame actions from a delayed one', function (done) {
    animationFrame.schedule(function () {
      animationFrame.schedule(function () {
        done();
      });
    }, 1);
  });
  it('should schedule 2 actions for a subsequent frame', function (done) {
    var runFirst = false;
    animationFrame.schedule(function () {
      animationFrame.schedule(function () {
        runFirst = true;
      });
      animationFrame.schedule(function () {
        if (runFirst) {
          done();
        } else {
          done(new Error('First action did not run'));
        }
      });
    });
  });
  it('should handle delayed action without affecting next frame actions', function (done) {
    var runDelayed = false;
    var runFirst = false;
    animationFrame.schedule(function () {
      animationFrame.schedule(function () {
        if (!runDelayed) {
          done(new Error('Delayed action did not run'));
          return;
        }
        runFirst = true;
      });
      animationFrame.schedule(function () {
        if (!runFirst) {
          done(new Error('First action did not run'));
        } else {
          done();
        }
      });
      animationFrame.schedule(function () {
        runDelayed = true;
      }, 1);
    });
  });
  it('should not execute rescheduled actions when flushing', function (done) {
    var flushCount = 0;
    var scheduledIndices = [];
    var originalFlush = animationFrame.flush;
    animationFrame.flush = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      ++flushCount;
      originalFlush.apply(animationFrame, args);
      if (flushCount === 2) {
        animationFrame.flush = originalFlush;
        try {
          chai_1.expect(scheduledIndices).to.deep.equal([0, 1]);
          done();
        } catch (error) {
          done(error);
        }
      }
    };
    animationFrame.schedule(
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
    var stubFlush = sandbox
      .stub(rxjs_1.animationFrameScheduler, 'flush')
      .callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.animationFrameScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
      c = rxjs_1.animationFrameScheduler.schedule(function () {
        chai_1.expect(stubFlush).to.have.callCount(2);
        sandbox.restore();
        done();
      });
    });
    b = rxjs_1.animationFrameScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
    });
  });
  it('should execute actions scheduled when flushing in a subsequent flush when some actions are unsubscribed', function (done) {
    var sandbox = sinon.createSandbox();
    var stubFlush = sandbox
      .stub(rxjs_1.animationFrameScheduler, 'flush')
      .callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.animationFrameScheduler.schedule(function () {
      chai_1.expect(stubFlush).to.have.callCount(1);
      c = rxjs_1.animationFrameScheduler.schedule(function () {
        chai_1.expect(stubFlush).to.have.callCount(2);
        sandbox.restore();
        done();
      });
      b.unsubscribe();
    });
    b = rxjs_1.animationFrameScheduler.schedule(function () {
      done(new Error('Unexpected execution of b'));
    });
  });
  it('should properly cancel an unnecessary flush', function (done) {
    var sandbox = sinon.createSandbox();
    var cancelAnimationFrameStub = sandbox
      .stub(
        animationFrameProvider_1.animationFrameProvider,
        'cancelAnimationFrame'
      )
      .callThrough();
    var a;
    var b;
    var c;
    a = rxjs_1.animationFrameScheduler.schedule(function () {
      chai_1.expect(rxjs_1.animationFrameScheduler.actions).to.have.length(1);
      c = rxjs_1.animationFrameScheduler.schedule(function () {
        done(new Error('Unexpected execution of c'));
      });
      chai_1.expect(rxjs_1.animationFrameScheduler.actions).to.have.length(2);
      c.unsubscribe();
      chai_1.expect(rxjs_1.animationFrameScheduler.actions).to.have.length(1);
      chai_1.expect(cancelAnimationFrameStub).to.have.callCount(1);
    });
    b = rxjs_1.animationFrameScheduler.schedule(function () {
      sandbox.restore();
      done();
    });
  });
});
//# sourceMappingURL=AnimationFrameScheduler-spec.js.map
