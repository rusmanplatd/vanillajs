'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('bindNodeCallback', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  describe('when not scheduled', function () {
    it('should emit undefined when callback is called without success arguments', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(null);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback);
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
    it('should a resultSelector', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(null, 42);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback, function (x) {
        return x + 1;
      });
      var results = [];
      boundCallback().subscribe({
        next: function (x) {
          results.push(x);
        },
        complete: function () {
          results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([43, 'done']);
    });
    it('should emit one value from a callback', function () {
      /**
       *
       * @param datum
       * @param cb
       */
      function callback(datum, cb) {
        cb(null, datum);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback);
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
    it('should set context of callback to context of boundCallback', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(null, this.datum);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback);
      var results = [];
      boundCallback.call({ datum: 42 }).subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([42, 'done']);
    });
    it('should raise error from callback', function () {
      var error = new Error();
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(error);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback);
      var results = [];
      boundCallback().subscribe({
        next: function () {
          throw new Error('should not next');
        },
        error: function (err) {
          results.push(err);
        },
        complete: function () {
          throw new Error('should not complete');
        },
      });
      chai_1.expect(results).to.deep.equal([error]);
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
          cb(null, datum);
        }, 0);
      }
      var subscription = rxjs_1
        .bindNodeCallback(callback)(42)
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
        cb(null, datum);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback);
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
    it('should emit undefined when callback is called without success arguments', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(null);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
        cb(null, datum);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
    it('should set context of callback to context of boundCallback', function () {
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(null, this.datum);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback.call({ datum: 42 }).subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('done');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal([42, 'done']);
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
      var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
    it('should raise error from callback', function () {
      var error = new Error();
      /**
       *
       * @param cb
       */
      function callback(cb) {
        cb(error);
      }
      var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
      var results = [];
      boundCallback().subscribe({
        next: function () {
          throw new Error('should not next');
        },
        error: function (err) {
          results.push(err);
        },
        complete: function () {
          throw new Error('should not complete');
        },
      });
      rxTestScheduler.flush();
      chai_1.expect(results).to.deep.equal([error]);
    });
  });
  it('should pass multiple inner arguments as an array', function () {
    /**
     *
     * @param datum
     * @param cb
     */
    function callback(datum, cb) {
      cb(null, datum, 1, 2, 3);
    }
    var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
      cb(null, datum);
    }
    var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
  it('should emit post callback errors', function () {
    /**
     *
     * @param callback
     */
    function badFunction(callback) {
      callback(null, 42);
      throw 'kaboom';
    }
    var receivedError;
    rxjs_1
      .bindNodeCallback(badFunction)()
      .subscribe({
        error: function (err) {
          return (receivedError = err);
        },
      });
    chai_1.expect(receivedError).to.equal('kaboom');
  });
  it('should not call the function if subscribed twice in a row before it resolves', function () {
    var executeCallback;
    var calls = 0;
    /**
     *
     * @param callback
     */
    function myFunc(callback) {
      calls++;
      if (calls > 1) {
        throw new Error('too many calls to myFunc');
      }
      executeCallback = callback;
    }
    var source$ = rxjs_1.bindNodeCallback(myFunc)();
    var result1;
    var result2;
    source$.subscribe(function (value) {
      return (result1 = value);
    });
    source$.subscribe(function (value) {
      return (result2 = value);
    });
    chai_1.expect(calls).to.equal(1);
    executeCallback(null, 'test');
    chai_1.expect(result1).to.equal('test');
    chai_1.expect(result2).to.equal('test');
    chai_1.expect(calls).to.equal(1);
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
      cb(null, datum);
    }
    var boundCallback = rxjs_1.bindNodeCallback(callback, rxTestScheduler);
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
//# sourceMappingURL=bindNodeCallback-spec.js.map
