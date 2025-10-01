'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('defer', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should defer the creation of a simple Observable', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var expected = '-a--b--c--|';
      var e1 = rxjs_1.defer(function () {
        return cold('-a--b--c--|');
      });
      expectObservable(e1).toBe(expected);
    });
  });
  it('should create an observable from the provided observable factory', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--|');
      var sourceSubs = '^----------!';
      var expected = '  --a--b--c--|';
      var e1 = rxjs_1.defer(function () {
        return source;
      });
      expectObservable(e1).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should create an observable from completed', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('|');
      var sourceSubs = '(^!)';
      var expected = '  |';
      var e1 = rxjs_1.defer(function () {
        return source;
      });
      expectObservable(e1).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should accept factory returns promise resolves', function (done) {
    var expected = 42;
    var e1 = rxjs_1.defer(function () {
      return new Promise(function (resolve) {
        resolve(expected);
      });
    });
    e1.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected);
        done();
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
    });
  });
  it('should accept factory returns promise rejects', function (done) {
    var expected = 42;
    var e1 = rxjs_1.defer(function () {
      return new Promise(function (resolve, reject) {
        reject(expected);
      });
    });
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
  it('should create an observable from error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('#');
      var sourceSubs = '(^!)';
      var expected = '  #';
      var e1 = rxjs_1.defer(function () {
        return source;
      });
      expectObservable(e1).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should create an observable when factory does not throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = rxjs_1.defer(function () {
        if (1 !== Infinity) {
          throw 'error';
        }
        return rxjs_1.of();
      });
      var expected = '#';
      expectObservable(e1).toBe(expected);
    });
  });
  it('should error when factory throws', function (done) {
    var e1 = rxjs_1.defer(function () {
      if (1 + 2 === 3) {
        throw 'error';
      }
      return rxjs_1.of();
    });
    e1.subscribe({
      error: function () {
        return done();
      },
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--|');
      var sourceSubs = '^-----!     ';
      var expected = '  --a--b-     ';
      var unsub = '     ------!     ';
      var e1 = rxjs_1.defer(function () {
        return source;
      });
      expectObservable(e1, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b--c--|');
      var sourceSubs = '^-----!     ';
      var expected = '  --a--b-     ';
      var unsub = '     ------!     ';
      var e1 = rxjs_1.defer(function () {
        return source.pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          }),
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
      });
      expectObservable(e1, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
});
//# sourceMappingURL=defer-spec.js.map
