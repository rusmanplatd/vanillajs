'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('throwError', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should create a cold observable that just emits an error', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var expected = '#';
      var e1 = rxjs_1.throwError(function () {
        return 'error';
      });
      expectObservable(e1).toBe(expected);
    });
  });
  it('should emit one value', function (done) {
    var calls = 0;
    rxjs_1
      .throwError(function () {
        return 'bad';
      })
      .subscribe({
        next: function () {
          done(new Error('should not be called'));
        },
        error: function (err) {
          chai_1.expect(++calls).to.equal(1);
          chai_1.expect(err).to.equal('bad');
          done();
        },
      });
  });
  it('should accept scheduler', function () {
    rxTest.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e = rxjs_1.throwError('error', rxTest);
      expectObservable(e).toBe('#');
    });
  });
  it('should accept a factory function', function () {
    var calls = 0;
    var errors = [];
    var source = rxjs_1.throwError(function () {
      return {
        call: ++calls,
        message: 'LOL',
      };
    });
    source.subscribe({
      next: function () {
        throw new Error('this should not happen');
      },
      error: function (err) {
        errors.push(err);
      },
    });
    source.subscribe({
      next: function () {
        throw new Error('this should not happen');
      },
      error: function (err) {
        errors.push(err);
      },
    });
    chai_1.expect(errors).to.deep.equal([
      {
        call: 1,
        message: 'LOL',
      },
      {
        call: 2,
        message: 'LOL',
      },
    ]);
  });
});
//# sourceMappingURL=throwError-spec.js.map
