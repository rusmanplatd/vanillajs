'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('NEVER', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create a cold observable that never emits', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var expected = '-';
      var e1 = rxjs_1.NEVER;
      expectObservable(e1).toBe(expected);
    });
  });
  it('should return the same instance every time', function () {
    chai_1.expect(rxjs_1.NEVER).to.equal(rxjs_1.NEVER);
  });
});
//# sourceMappingURL=never-spec.js.map
