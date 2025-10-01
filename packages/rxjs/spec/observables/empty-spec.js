'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('empty', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should return EMPTY', function () {
    chai_1.expect(rxjs_1.empty()).to.equal(rxjs_1.EMPTY);
  });
  it('should create a cold observable with only complete', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var expected = '|';
      var e1 = rxjs_1.empty();
      expectObservable(e1).toBe(expected);
    });
  });
  it('should return the same instance EMPTY', function () {
    var s1 = rxjs_1.empty();
    var s2 = rxjs_1.empty();
    chai_1.expect(s1).to.equal(s2);
  });
  it('should be synchronous by default', function () {
    var source = rxjs_1.empty();
    var hit = false;
    source.subscribe({
      complete: function () {
        hit = true;
      },
    });
    chai_1.expect(hit).to.be.true;
  });
  it('should equal EMPTY', function () {
    chai_1.expect(rxjs_1.empty()).to.equal(rxjs_1.EMPTY);
  });
  it('should take a scheduler', function () {
    var source = rxjs_1.empty(rxTestScheduler);
    var hit = false;
    source.subscribe({
      complete: function () {
        hit = true;
      },
    });
    chai_1.expect(hit).to.be.false;
    rxTestScheduler.flush();
    chai_1.expect(hit).to.be.true;
  });
});
//# sourceMappingURL=empty-spec.js.map
