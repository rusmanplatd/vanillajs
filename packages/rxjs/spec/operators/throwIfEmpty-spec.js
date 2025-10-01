'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('throwIfEmpty', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  describe('with errorFactory', function () {
    it('should error when empty', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var source = cold('----|');
        var expected = '   ----#';
        var result = source.pipe(
          operators_1.throwIfEmpty(function () {
            return new Error('test');
          })
        );
        expectObservable(result).toBe(expected, undefined, new Error('test'));
      });
    });
    it('should throw if empty', function () {
      var error = new Error('So empty inside');
      var thrown;
      rxjs_1.EMPTY.pipe(
        operators_1.throwIfEmpty(function () {
          return error;
        })
      ).subscribe({
        error: function (err) {
          thrown = err;
        },
      });
      chai_1.expect(thrown).to.equal(error);
    });
    it('should NOT throw if NOT empty', function () {
      var error = new Error('So empty inside');
      var thrown;
      rxjs_1
        .of('test')
        .pipe(
          operators_1.throwIfEmpty(function () {
            return error;
          })
        )
        .subscribe({
          error: function (err) {
            thrown = err;
          },
        });
      chai_1.expect(thrown).to.be.undefined;
    });
    it('should pass values through', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('----a---b---c---|');
        var sub1 = '       ^---------------!';
        var expected = '   ----a---b---c---|';
        var result = source.pipe(
          operators_1.throwIfEmpty(function () {
            return new Error('test');
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should never when never', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('-');
        var sub1 = '       ^';
        var expected = '   -';
        var result = source.pipe(
          operators_1.throwIfEmpty(function () {
            return new Error('test');
          })
        );
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should error when empty', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('----|');
        var sub1 = '       ^---!';
        var expected = '   ----#';
        var result = source.pipe(
          operators_1.throwIfEmpty(function () {
            return new Error('test');
          })
        );
        expectObservable(result).toBe(expected, undefined, new Error('test'));
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should throw if empty after retry', function () {
      var error = new Error('So empty inside');
      var thrown;
      var sourceIsEmpty = false;
      var source = rxjs_1.defer(function () {
        if (sourceIsEmpty) {
          return rxjs_1.EMPTY;
        }
        sourceIsEmpty = true;
        return rxjs_1.of(1, 2);
      });
      source
        .pipe(
          operators_1.throwIfEmpty(function () {
            return error;
          }),
          operators_1.mergeMap(function (value) {
            if (value > 1) {
              return rxjs_1.throwError(function () {
                return new Error();
              });
            }
            return rxjs_1.of(value);
          }),
          operators_1.retry(1)
        )
        .subscribe({
          error: function (err) {
            thrown = err;
          },
        });
      chai_1.expect(thrown).to.equal(error);
    });
  });
  describe('without errorFactory', function () {
    it('should throw EmptyError if empty', function () {
      var thrown;
      rxjs_1.EMPTY.pipe(operators_1.throwIfEmpty()).subscribe({
        error: function (err) {
          thrown = err;
        },
      });
      chai_1.expect(thrown).to.be.instanceof(rxjs_1.EmptyError);
    });
    it('should NOT throw if NOT empty', function () {
      var thrown;
      rxjs_1
        .of('test')
        .pipe(operators_1.throwIfEmpty())
        .subscribe({
          error: function (err) {
            thrown = err;
          },
        });
      chai_1.expect(thrown).to.be.undefined;
    });
    it('should pass values through', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('----a---b---c---|');
        var sub1 = '       ^---------------!';
        var expected = '   ----a---b---c---|';
        var result = source.pipe(operators_1.throwIfEmpty());
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should never when never', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('-');
        var sub1 = '       ^';
        var expected = '   -';
        var result = source.pipe(operators_1.throwIfEmpty());
        expectObservable(result).toBe(expected);
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should error when empty', function () {
      rxTestScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('----|');
        var sub1 = '       ^---!';
        var expected = '   ----#';
        var result = source.pipe(operators_1.throwIfEmpty());
        expectObservable(result).toBe(
          expected,
          undefined,
          new rxjs_1.EmptyError()
        );
        expectSubscriptions(source.subscriptions).toBe([sub1]);
      });
    });
    it('should throw if empty after retry', function () {
      var thrown;
      var sourceIsEmpty = false;
      var source = rxjs_1.defer(function () {
        if (sourceIsEmpty) {
          return rxjs_1.EMPTY;
        }
        sourceIsEmpty = true;
        return rxjs_1.of(1, 2);
      });
      source
        .pipe(
          operators_1.throwIfEmpty(),
          operators_1.mergeMap(function (value) {
            if (value > 1) {
              return rxjs_1.throwError(function () {
                return new Error();
              });
            }
            return rxjs_1.of(value);
          }),
          operators_1.retry(1)
        )
        .subscribe({
          error: function (err) {
            thrown = err;
          },
        });
      chai_1.expect(thrown).to.be.instanceof(rxjs_1.EmptyError);
    });
  });
  it('should stop listening to a synchronous observable when unsubscribed', function () {
    var sideEffects = [];
    var synchronousObservable = new rxjs_1.Observable(function (subscriber) {
      for (var i = 0; !subscriber.closed && i < 10; i++) {
        sideEffects.push(i);
        subscriber.next(i);
      }
    });
    synchronousObservable
      .pipe(operators_1.throwIfEmpty(), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=throwIfEmpty-spec.js.map
