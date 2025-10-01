'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var queue = rxjs_1.queueScheduler;
describe('Scheduler.queue', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
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
        a.pipe(operators_1.delay(ta, queue)),
        b.pipe(operators_1.delay(tb, queue))
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should switch from synchronous to asynchronous at will', function () {
    var sandbox = sinon.createSandbox();
    var fakeTimer = sandbox.useFakeTimers();
    var asyncExec = false;
    var state = [];
    queue.schedule(
      function (index) {
        state.push(index);
        if (index === 0) {
          this.schedule(1, 100);
        } else if (index === 1) {
          asyncExec = true;
          this.schedule(2, 0);
        }
      },
      0,
      0
    );
    chai_1.expect(asyncExec).to.be.false;
    chai_1.expect(state).to.be.deep.equal([0]);
    fakeTimer.tick(100);
    chai_1.expect(asyncExec).to.be.true;
    chai_1.expect(state).to.be.deep.equal([0, 1, 2]);
    sandbox.restore();
  });
  it('should unsubscribe the rest of the scheduled actions if an action throws an error', function () {
    var actions = [];
    var action2Exec = false;
    var action3Exec = false;
    var errorValue = undefined;
    try {
      queue.schedule(function () {
        actions.push(
          queue.schedule(function () {
            throw new Error('oops');
          }),
          queue.schedule(function () {
            action2Exec = true;
          }),
          queue.schedule(function () {
            action3Exec = true;
          })
        );
      });
    } catch (e) {
      errorValue = e;
    }
    chai_1.expect(
      actions.every(function (action) {
        return action.closed;
      })
    ).to.be.true;
    chai_1.expect(action2Exec).to.be.false;
    chai_1.expect(action3Exec).to.be.false;
    chai_1.expect(errorValue).exist;
    chai_1.expect(errorValue.message).to.equal('oops');
  });
});
//# sourceMappingURL=QueueScheduler-spec.js.map
