'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('pairs', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create an observable emits key-value pair', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.pairs({ a: 1, b: 2 });
      var expected = '(ab|)';
      var values = {
        a: ['a', 1],
        b: ['b', 2],
      };
      expectObservable(e1).toBe(expected, values);
    });
  });
  it('should create an observable without scheduler', function (done) {
    var expected = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    rxjs_1.pairs({ a: 1, b: 2, c: 3 }).subscribe({
      next: function (x) {
        chai_1.expect(x).to.deep.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(expected).to.be.empty;
        done();
      },
    });
  });
  it('should work with empty object', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.pairs({});
      var expected = '|';
      expectObservable(e1).toBe(expected);
    });
  });
});
//# sourceMappingURL=pairs-spec.js.map
