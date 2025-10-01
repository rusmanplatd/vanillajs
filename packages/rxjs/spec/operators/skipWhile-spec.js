'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('skipWhile', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should skip all elements until predicate is false', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-^2--3--4--5--6--|');
      var sourceSubs = '   ^---------------!';
      var expected = '     -------4--5--6--|';
      var predicate = function (v) {
        return +v < 4;
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should skip all elements with a true predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-^2--3--4--5--6--|');
      var sourceSubs = '   ^---------------!';
      var expected = '     ----------------|';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should skip all elements with a truthy predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-^2--3--4--5--6--|');
      var sourceSubs = '   ^---------------!';
      var expected = '     ----------------|';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return {};
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should not skip any element with a false predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-^2--3--4--5--6--|');
      var sourceSubs = '   ^---------------!';
      var expected = '     -2--3--4--5--6--|';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return false;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should not skip any elements with a falsy predicate', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('-1-^2--3--4--5--6--|');
      var sourceSubs = '   ^---------------!';
      var expected = '     -2--3--4--5--6--|';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return undefined;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should skip elements on hot source', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--1--2-^-3--4--5--6--7--8--');
      var sourceSubs = '       ^-------------------';
      var expected = '         --------5--6--7--8--';
      var predicate = function (v) {
        return +v < 5;
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it("should be possible to skip using the element's index", function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--|');
      var sourceSubs = '       ^-------------------!';
      var expected = '         --------e--f--g--h--|';
      var predicate = function (_v, index) {
        return index < 2;
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should skip using index with source unsubscribes early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--|');
      var sourceSubs = '       ^----------!         ';
      var unsub = '            -----------!         ';
      var expected = '         -----d--e---         ';
      var predicate = function (_v, index) {
        return index < 1;
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--|');
      var sourceSubs = '       ^----------!         ';
      var expected = '         -----d--e---         ';
      var unsub = '            -----------!         ';
      var predicate = function (_v, index) {
        return index < 1;
      };
      var result = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.skipWhile(predicate),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should skip using value with source throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--#');
      var sourceSubs = '       ^-------------------!';
      var expected = '         -----d--e--f--g--h--#';
      var predicate = function (v) {
        return v !== 'd';
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should invoke predicate while its false and never again', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--|');
      var sourceSubs = '       ^-------------------!';
      var expected = '         --------e--f--g--h--|';
      var invoked = 0;
      var predicate = function (v) {
        invoked++;
        return v !== 'e';
      };
      var result = source.pipe(
        operators_1.skipWhile(predicate),
        operators_1.tap({
          complete: function () {
            chai_1.expect(invoked).to.equal(3);
          },
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should handle predicate that throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('--a--b-^-c--d--e--f--g--h--|');
      var sourceSubs = '       ^-------!            ';
      var expected = '         --------#            ';
      var predicate = function (v) {
        if (v === 'e') {
          throw new Error("nom d'une pipe !");
        }
        return v !== 'f';
      };
      var result = source.pipe(operators_1.skipWhile(predicate));
      expectObservable(result).toBe(
        expected,
        undefined,
        new Error("nom d'une pipe !")
      );
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should handle Observable.empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('|   ');
      var subs = '       (^!)';
      var expected = '   |   ';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle Observable.never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-');
      var subs = '       ^';
      var expected = '   -';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should handle Observable.throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('#   ');
      var subs = '       (^!)';
      var expected = '   #   ';
      var result = source.pipe(
        operators_1.skipWhile(function () {
          return true;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
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
      .pipe(
        operators_1.skipWhile(function (value) {
          return value < 2;
        }),
        operators_1.take(1)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=skipWhile-spec.js.map
