'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var intervalProvider_1 = require('rxjs/internal/scheduler/intervalProvider');
describe('intervalProvider', function () {
  var originalSet = global.setInterval;
  var originalClear = global.clearInterval;
  afterEach(function () {
    global.setInterval = originalSet;
    global.clearInterval = originalClear;
  });
  it('should be monkey patchable', function () {
    var setCalled = false;
    var clearCalled = false;
    global.setInterval = function () {
      setCalled = true;
      return 0;
    };
    global.clearInterval = function () {
      clearCalled = true;
    };
    var handle = intervalProvider_1.intervalProvider.setInterval(
      function () {}
    );
    intervalProvider_1.intervalProvider.clearInterval(handle);
    chai_1.expect(setCalled).to.be.true;
    chai_1.expect(clearCalled).to.be.true;
  });
});
//# sourceMappingURL=intervalProvider-spec.js.map
