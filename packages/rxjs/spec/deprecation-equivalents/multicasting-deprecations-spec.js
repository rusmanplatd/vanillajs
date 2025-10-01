'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('multicasting equivalent tests', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  testEquivalents(
    'multicast(() => new Subject()), refCount() and share()',
    function (source) {
      return source.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        }),
        operators_1.refCount()
      );
    },
    function (source) {
      return source.pipe(operators_1.share());
    }
  );
  testEquivalents(
    'multicast(new Subject()), refCount() and share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })',
    function (source) {
      return source.pipe(
        operators_1.multicast(new rxjs_1.Subject()),
        operators_1.refCount()
      );
    },
    function (source) {
      return source.pipe(
        operators_1.share({
          resetOnError: false,
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }
  );
  testEquivalents(
    'publish(), refCount() and share({ resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })',
    function (source) {
      return source.pipe(operators_1.publish(), operators_1.refCount());
    },
    function (source) {
      return source.pipe(
        operators_1.share({
          resetOnError: false,
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }
  );
  testEquivalents(
    'publishLast(), refCount() and share({ connector: () => new AsyncSubject(), resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })',
    function (source) {
      return source.pipe(operators_1.publishLast(), operators_1.refCount());
    },
    function (source) {
      return source.pipe(
        operators_1.share({
          connector: function () {
            return new rxjs_1.AsyncSubject();
          },
          resetOnError: false,
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }
  );
  testEquivalents(
    'publishBehavior("X"), refCount() and share({ connector: () => new BehaviorSubject("X"), resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })',
    function (source) {
      return source.pipe(
        operators_1.publishBehavior('X'),
        operators_1.refCount()
      );
    },
    function (source) {
      return source.pipe(
        operators_1.share({
          connector: function () {
            return new rxjs_1.BehaviorSubject('X');
          },
          resetOnError: false,
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }
  );
  testEquivalents(
    'publishReplay(3, 10), refCount() and share({ connector: () => new ReplaySubject(3, 10), resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })',
    function (source) {
      return source.pipe(
        operators_1.publishReplay(3, 10),
        operators_1.refCount()
      );
    },
    function (source) {
      return source.pipe(
        operators_1.share({
          connector: function () {
            return new rxjs_1.ReplaySubject(3, 10);
          },
          resetOnError: false,
          resetOnComplete: false,
          resetOnRefCountZero: false,
        })
      );
    }
  );
  var fn = function (source) {
    return rxjs_1.merge(source, source);
  };
  testEquivalents(
    'publish(fn) and connect({ setup: fn })',
    function (source) {
      return source.pipe(operators_1.publish(fn));
    },
    function (source) {
      return source.pipe(operators_1.connect(fn));
    }
  );
  testEquivalents(
    'publishReplay(3, 10, fn) and `subject = new ReplaySubject(3, 10), connect({ connector: () => subject , setup: fn })`',
    function (source) {
      return source.pipe(operators_1.publishReplay(3, 10, fn));
    },
    function (source) {
      var subject = new rxjs_1.ReplaySubject(3, 10);
      return source.pipe(
        operators_1.connect(fn, {
          connector: function () {
            return subject;
          },
        })
      );
    }
  );
  /**
   *
   * @param name
   * @param oldExpression
   * @param updatedExpression
   */
  function testEquivalents(name, oldExpression, updatedExpression) {
    it('should be equivalent for ' + name + ' for async sources', function () {
      rxTest.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var source = cold('----a---b---c----d---e----|');
        var old = oldExpression(source);
        var updated = updatedExpression(source);
        expectObservable(updated).toEqual(old);
      });
    });
    it(
      'should be equivalent for ' + name + ' for async sources that repeat',
      function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable;
          var source = cold('----a---b---c----d---e----|');
          var old = oldExpression(source).pipe(operators_1.repeat(3));
          var updated = updatedExpression(source).pipe(operators_1.repeat(3));
          expectObservable(updated).toEqual(old);
        });
      }
    );
    it(
      'should be equivalent for ' + name + ' for async sources that retry',
      function () {
        rxTest.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable;
          var source = cold('----a---b---c----d---e----#');
          var old = oldExpression(source).pipe(operators_1.retry(3));
          var updated = updatedExpression(source).pipe(operators_1.retry(3));
          expectObservable(updated).toEqual(old);
        });
      }
    );
    it('should be equivalent for ' + name + ' for async sources', function () {
      rxTest.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var source = rxjs_1.of('a', 'b', 'c');
        var old = oldExpression(source);
        var updated = updatedExpression(source);
        expectObservable(updated).toEqual(old);
      });
    });
    it(
      'should be equivalent for ' + name + ' for async sources that repeat',
      function () {
        rxTest.run(function (_a) {
          var expectObservable = _a.expectObservable;
          var source = rxjs_1.of('a', 'b', 'c');
          var old = oldExpression(source).pipe(operators_1.repeat(3));
          var updated = updatedExpression(source).pipe(operators_1.repeat(3));
          expectObservable(updated).toEqual(old);
        });
      }
    );
    it(
      'should be equivalent for ' + name + ' for async sources that retry',
      function () {
        rxTest.run(function (_a) {
          var expectObservable = _a.expectObservable;
          var source = rxjs_1.of('a', 'b', 'c');
          var old = oldExpression(source).pipe(operators_1.retry(3));
          var updated = updatedExpression(source).pipe(operators_1.retry(3));
          expectObservable(updated).toEqual(old);
        });
      }
    );
  }
});
//# sourceMappingURL=multicasting-deprecations-spec.js.map
