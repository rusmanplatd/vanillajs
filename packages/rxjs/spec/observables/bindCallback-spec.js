'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('bindCallback', function () {
  describe('when not scheduled', function () {
    it('should emit undefined from a callback without arguments', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb();
      }
      var boundCallback = rxjs_1.bindCallback(callback);
      var results = [];
      boundCallback().subscribe({
        next: function (x) {
          results.push(typeof x);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal(['undefined', 'done']);
    });
    it('should support a resultSelector', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, function (datum) {
        return datum + 1;
      });
      var results = [];
      boundCallback(42).subscribe({
        next: function (value) {
          results.push(value);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([43, 'done']);
    });
    it('should support a resultSelector if its void', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, void 0);
      var results = [];
      boundCallback(42).subscribe({
        next: function (value) {
          results.push(value);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([42, 'done']);
    });
    it('should emit one value from a callback', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback);
      var results = [];
      boundCallback(42).subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([42, 'done']);
    });
    it('should set callback function context to context of returned function', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(this.datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback);
      var results = [];
      boundCallback.apply({ datum: 5 }).subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([5, 'done']);
    });
    it('should not emit, throw or complete if immediately unsubscribed', function (done) {
      var nextSpy = sinon.spy();
      var throwSpy = sinon.spy();
      var completeSpy = sinon.spy();
      var timeout;
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        timeout = setTimeout(function () {
          cb(datum);
        }, 0);
      }
      var subscription = rxjs_1
        .bindCallback(callback)(42)
        .subscribe({ next: nextSpy, error: throwSpy, complete: completeSpy });
      subscription.unsubscribe();
      setTimeout(function () {
        chai_1.expect(nextSpy).not.have.been.called;
        chai_1.expect(throwSpy).not.have.been.called;
        chai_1.expect(completeSpy).not.have.been.called;
        clearTimeout(timeout);
        done();
      });
    });
    it('should create a separate internal subject for each call', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback);
      var results = [];
      boundCallback(42).subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      boundCallback(54).subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([42, 'done', 54, 'done']);
    });
  });
  describe('when scheduled', function () {
    var rxTestScheduler;
    beforeEach(function () {
      rxTestScheduler = new testing_1.TestScheduler(
        observableMatcher_1.observableMatcher
      );
    });
    it('should emit undefined from a callback without arguments', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb();
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback().subscribe({
        next: function (x) {
          results.push(typeof x);
        },
        complete: function () {
          results.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal(['undefined', 'done']);
    });
    it('should emit one value from a callback', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback(42).subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal([42, 'done']);
    });
    it('should set callback function context to context of returned function', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(this.datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback.apply({ datum: 5 }).subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal([5, 'done']);
    });
    it('should error if callback throws', function () {
      var expected = new Error('haha no callback for you');
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        throw expected;
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      boundCallback(42).subscribe({
        next: function (x) {
          throw new Error('should not next');
        },
        error: function (err) {
          chai_1.expect(err).to.equal(expected);
        },
        complete: function () {
          throw new Error('should not complete');
        },
      });
      rxTestScheduler.flush();
    });
    it('should pass multiple inner arguments as an array', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(datum, 1, 2, 3);
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback(42).subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal([[42, 1, 2, 3], 'done']);
    });
    it('should cache value for next subscription and not call callbackFunc again', function () {
      var calls = 0;
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        calls++;
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results1 = [];
      var results2 = [];
      var source = boundCallback(42);
      source.subscribe({
        next: function (x) {
          results1.push(x);
        },
        complete: function () {
          results1.push('done');
        },
      });
      source.subscribe({
        next: function (x) {
          results2.push(x);
        },
        complete: function () {
          results2.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(calls).to.equal(1);
      chai_1.expect(results1).to.deep.equal([42, 'done']);
      chai_1.expect(results2).to.deep.equal([42, 'done']);
    });
    it('should not even call the callbackFn if scheduled and immediately unsubscribed', function () {
      var calls = 0;
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        calls++;
        cb(datum);
      }
      var boundCallback = rxjs_1.bindCallback(callback, rxTestScheduler);
      var results1 = [];
      var source = boundCallback(42);
      var subscription = source.subscribe({
        next: function (x) {
          results1.push(x);
        },
        complete: function () {
          results1.push('done');
        },
      });
      subscription.unsubscribe();
      rxTestScheduler.flush();
      chai_1.expect(calls).to.equal(0);
    });
  });
  it('should emit post-callback errors', function () {
    /**
     *
     * @param callback
     */
    function badFunction(callback) {
      callback(42);
      throw 'kaboom';
    }
    var receivedError;
    rxjs_1
      .bindCallback(badFunction)()
      .subscribe({
        error: function (err) {
          return (receivedError = err);
        },
      });
    chai_1.expect(receivedError).to.equal('kaboom');
  });
});
//# sourceMappingURL=bindCallback-spec.js.map
