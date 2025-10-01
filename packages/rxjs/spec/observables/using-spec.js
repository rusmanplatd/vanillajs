'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
describe('using', function () {
  it('should dispose of the resource when the subscription is disposed', function (done) {
    var disposed = false;
    var source = rxjs_1
      .using(
        function () {
          return new rxjs_1.Subscription(function () {
            return (disposed = true);
          });
        },
        function (resource) {
          return rxjs_1.range(0, 3);
        }
      )
      .pipe(operators_1.take(2));
    source.subscribe();
    if (disposed) {
      done();
    } else {
      done(new Error('disposed should be true but was false'));
    }
  });
  it('should accept factory returns promise resolves', function (done) {
    var expected = 42;
    var disposed = false;
    var e1 = rxjs_1.using(
      function () {
        return new rxjs_1.Subscription(function () {
          return (disposed = true);
        });
      },
      function (resource) {
        return new Promise(function (resolve) {
          resolve(expected);
        });
      }
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
  it('should accept factory returns promise rejects', function (done) {
    var expected = 42;
    var disposed = false;
    var e1 = rxjs_1.using(
      function () {
        return new rxjs_1.Subscription(function () {
          return (disposed = true);
        });
      },
      function (resource) {
        return new Promise(function (resolve, reject) {
          reject(expected);
        });
      }
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
  it('should raise error when resource factory throws', function (done) {
    var expectedError = 'expected';
    var error = 'error';
    var source = rxjs_1.using(
      function () {
        throw expectedError;
      },
      function (resource) {
        throw error;
      }
    );
    source.subscribe({
      next: function (x) {
        done(new Error('should not be called'));
      },
      error: function (x) {
        chai_1.expect(x).to.equal(expectedError);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
  it('should raise error when observable factory throws', function (done) {
    var error = 'error';
    var disposed = false;
    var source = rxjs_1.using(
      function () {
        return new rxjs_1.Subscription(function () {
          return (disposed = true);
        });
      },
      function (resource) {
        throw error;
      }
    );
    source.subscribe({
      next: function (x) {
        done(new Error('should not be called'));
      },
      error: function (x) {
        chai_1.expect(x).to.equal(error);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
});
//# sourceMappingURL=using-spec.js.map
