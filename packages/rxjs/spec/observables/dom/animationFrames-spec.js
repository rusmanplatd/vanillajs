'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../../helpers/observableMatcher');
var animationFrameProvider_1 = require('rxjs/internal/scheduler/animationFrameProvider');
describe('animationFrames', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should animate', function () {
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        time = _a.time;
      animate('            ---x---x---x');
      var mapped = cold('-m          ');
      var tm = time('    -|          ');
      var ta = time('    ---|        ');
      var tb = time('    -------|    ');
      var tc = time('    -----------|');
      var expected = '   ---a---b---c';
      var subs = '       ^----------!';
      var result = mapped.pipe(
        operators_1.mergeMapTo(rxjs_1.animationFrames())
      );
      expectObservable(result, subs).toBe(expected, {
        a: { elapsed: ta - tm, timestamp: ta },
        b: { elapsed: tb - tm, timestamp: tb },
        c: { elapsed: tc - tm, timestamp: tc },
      });
    });
  });
  it('should use any passed timestampProvider', function () {
    var i = 0;
    var timestampProvider = {
      now: sinon.stub().callsFake(function () {
        return [50, 100, 200, 300][i++];
      }),
    };
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable;
      animate('            ---x---x---x');
      var mapped = cold('-m          ');
      var expected = '   ---a---b---c';
      var subs = '       ^----------!';
      var result = mapped.pipe(
        operators_1.mergeMapTo(rxjs_1.animationFrames(timestampProvider))
      );
      expectObservable(result, subs).toBe(expected, {
        a: { elapsed: 50, timestamp: 100 },
        b: { elapsed: 150, timestamp: 200 },
        c: { elapsed: 250, timestamp: 300 },
      });
    });
  });
  it('should compose with take', function () {
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        time = _a.time;
      var requestSpy = sinon.spy(
        animationFrameProvider_1.animationFrameProvider.delegate,
        'requestAnimationFrame'
      );
      var cancelSpy = sinon.spy(
        animationFrameProvider_1.animationFrameProvider.delegate,
        'cancelAnimationFrame'
      );
      animate('            ---x---x---x');
      var mapped = cold('-m          ');
      var tm = time('    -|          ');
      var ta = time('    ---|        ');
      var tb = time('    -------|    ');
      var expected = '   ---a---b    ';
      var result = mapped.pipe(
        operators_1.mergeMapTo(
          rxjs_1.animationFrames().pipe(operators_1.take(2))
        )
      );
      expectObservable(result).toBe(expected, {
        a: { elapsed: ta - tm, timestamp: ta },
        b: { elapsed: tb - tm, timestamp: tb },
      });
      testScheduler.flush();
      chai_1.expect(requestSpy.callCount).to.equal(2);
      chai_1.expect(cancelSpy.callCount).to.equal(0);
    });
  });
  it('should compose with takeUntil', function () {
    testScheduler.run(function (_a) {
      var animate = _a.animate,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        hot = _a.hot,
        time = _a.time;
      var requestSpy = sinon.spy(
        animationFrameProvider_1.animationFrameProvider.delegate,
        'requestAnimationFrame'
      );
      var cancelSpy = sinon.spy(
        animationFrameProvider_1.animationFrameProvider.delegate,
        'cancelAnimationFrame'
      );
      animate('            ---x---x---x');
      var mapped = cold('-m          ');
      var tm = time('    -|          ');
      var ta = time('    ---|        ');
      var tb = time('    -------|    ');
      var signal = hot(' ^--------s--');
      var expected = '   ---a---b    ';
      var result = mapped.pipe(
        operators_1.mergeMapTo(
          rxjs_1.animationFrames().pipe(operators_1.takeUntil(signal))
        )
      );
      expectObservable(result).toBe(expected, {
        a: { elapsed: ta - tm, timestamp: ta },
        b: { elapsed: tb - tm, timestamp: tb },
      });
      testScheduler.flush();
      chai_1.expect(requestSpy.callCount).to.equal(3);
      chai_1.expect(cancelSpy.callCount).to.equal(1);
    });
  });
});
//# sourceMappingURL=animationFrames-spec.js.map
