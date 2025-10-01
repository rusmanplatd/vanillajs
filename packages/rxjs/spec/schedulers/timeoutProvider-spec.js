'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var timeoutProvider_1 = require('rxjs/internal/scheduler/timeoutProvider');
describe('timeoutProvider', function () {
  var originalSet = global.setTimeout;
  var originalClear = global.clearTimeout;
  afterEach(function () {
    global.setTimeout = originalSet;
    global.clearTimeout = originalClear;
  });
  it('should be monkey patchable', function () {
    var setCalled = false;
    var clearCalled = false;
    global.setTimeout = function () {
      setCalled = true;
      return 0;
    };
    global.clearTimeout = function () {
      clearCalled = true;
    };
    var handle = timeoutProvider_1.timeoutProvider.setTimeout(function () {});
    timeoutProvider_1.timeoutProvider.clearTimeout(handle);
    chai_1.expect(setCalled).to.be.true;
    chai_1.expect(clearCalled).to.be.true;
  });
});
//# sourceMappingURL=timeoutProvider-spec.js.map
