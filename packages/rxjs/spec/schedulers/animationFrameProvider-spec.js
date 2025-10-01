'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var animationFrameProvider_1 = require('rxjs/internal/scheduler/animationFrameProvider');
describe('animationFrameProvider', function () {
  var originalRequest = global.requestAnimationFrame;
  var originalCancel = global.cancelAnimationFrame;
  afterEach(function () {
    global.requestAnimationFrame = originalRequest;
    global.cancelAnimationFrame = originalCancel;
  });
  it('should be monkey patchable', function () {
    var requestCalled = false;
    var cancelCalled = false;
    global.requestAnimationFrame = function () {
      requestCalled = true;
      return 0;
    };
    global.cancelAnimationFrame = function () {
      cancelCalled = true;
    };
    var handle =
      animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(
        function () {}
      );
    animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(
      handle
    );
    chai_1.expect(requestCalled).to.be.true;
    chai_1.expect(cancelCalled).to.be.true;
  });
});
//# sourceMappingURL=animationFrameProvider-spec.js.map
