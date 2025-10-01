'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('iif', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should subscribe to thenSource when the conditional returns true', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.iif(
        function () {
          return true;
        },
        rxjs_1.of('a'),
        rxjs_1.of()
      );
      var expected = '(a|)';
      expectObservable(e1).toBe(expected);
    });
  });
  it('should subscribe to elseSource when the conditional returns false', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.iif(
        function () {
          return false;
        },
        rxjs_1.of('a'),
        rxjs_1.of('b')
      );
      var expected = '(b|)';
      expectObservable(e1).toBe(expected);
    });
  });
  it('should complete without an elseSource when the conditional returns false', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.iif(
        function () {
          return false;
        },
        rxjs_1.of('a'),
        rxjs_1.of()
      );
      var expected = '|';
      expectObservable(e1).toBe(expected);
    });
  });
  it('should raise error when conditional throws', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var e1 = rxjs_1.iif(
        function () {
          throw 'error';
        },
        rxjs_1.of('a'),
        rxjs_1.of()
      );
      var expected = '#';
      expectObservable(e1).toBe(expected);
    });
  });
  it('should accept resolved promise as thenSource', function (done) {
    var expected = 42;
    var e1 = rxjs_1.iif(
      function () {
        return true;
      },
      new Promise(function (resolve) {
        resolve(expected);
      }),
      rxjs_1.of()
    );
    e1.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected);
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should accept resolved promise as elseSource', function (done) {
    var expected = 42;
    var e1 = rxjs_1.iif(
      function () {
        return false;
      },
      rxjs_1.of('a'),
      new Promise(function (resolve) {
        resolve(expected);
      })
    );
    e1.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected);
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should accept rejected promise as elseSource', function (done) {
    var expected = 42;
    var e1 = rxjs_1.iif(
      function () {
        return false;
      },
      rxjs_1.of('a'),
      new Promise(function (resolve, reject) {
        reject(expected);
      })
    );
    e1.subscribe({
      next: function (x) {
        done(new Error('should not be called'));
      },
      error: function (x) {
        chai_1.expect(x).to.equal(expected);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
  it('should accept rejected promise as thenSource', function (done) {
    var expected = 42;
    var e1 = rxjs_1.iif(
      function () {
        return true;
      },
      new Promise(function (resolve, reject) {
        reject(expected);
      }),
      rxjs_1.of()
    );
    e1.subscribe({
      next: function (x) {
        done(new Error('should not be called'));
      },
      error: function (x) {
        chai_1.expect(x).to.equal(expected);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
});
//# sourceMappingURL=if-spec.js.map
