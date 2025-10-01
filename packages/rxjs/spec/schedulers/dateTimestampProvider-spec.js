'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var dateTimestampProvider_1 = require('rxjs/internal/scheduler/dateTimestampProvider');
describe('dateTimestampProvider', function () {
  var originalDate = global.Date;
  afterEach(function () {
    global.Date = originalDate;
  });
  it('should be monkey patchable', function () {
    var nowCalled = false;
    global.Date = {
      now: function () {
        nowCalled = true;
        return 0;
      },
    };
    dateTimestampProvider_1.dateTimestampProvider.now();
    chai_1.expect(nowCalled).to.be.true;
  });
});
//# sourceMappingURL=dateTimestampProvider-spec.js.map
