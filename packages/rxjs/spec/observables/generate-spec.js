'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var testing_1 = require('rxjs/testing');
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var Subscriber_1 = require('rxjs/internal/Subscriber');
var observableMatcher_1 = require('../helpers/observableMatcher');
/**
 *
 */
function err() {
  throw 'error';
}
describe('generate', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should complete if condition does not meet', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate(
        1,
        function (x) {
          return false;
        },
        function (x) {
          return x + 1;
        }
      );
      var expected = '|';
      expectObservable(source).toBe(expected);
    });
  });
  it('should produce first value immediately', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate(
        1,
        function (x) {
          return x == 1;
        },
        function (x) {
          return x + 1;
        }
      );
      var expected = '(1|)';
      expectObservable(source).toBe(expected, { 1: 1 });
    });
  });
  it('should produce all values synchronously', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate(
        1,
        function (x) {
          return x < 3;
        },
        function (x) {
          return x + 1;
        }
      );
      var expected = '(12|)';
      expectObservable(source).toBe(expected, { 1: 1, 2: 2 });
    });
  });
  it('should use result selector', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate(
        1,
        function (x) {
          return x < 3;
        },
        function (x) {
          return x + 1;
        },
        function (x) {
          return (x + 1).toString();
        }
      );
      var expected = '(23|)';
      expectObservable(source).toBe(expected);
    });
  });
  it('should allow omit condition', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1
        .generate({
          initialState: 1,
          iterate: function (x) {
            return x + 1;
          },
          resultSelector: function (x) {
            return x.toString();
          },
        })
        .pipe(operators_1.take(5));
      var expected = '(12345|)';
      expectObservable(source).toBe(expected);
    });
  });
  it('should stop producing when unsubscribed', function () {
    var source = rxjs_1.generate(
      1,
      function (x) {
        return x < 4;
      },
      function (x) {
        return x + 1;
      }
    );
    var count = 0;
    var subscriber = new Subscriber_1.SafeSubscriber(function (x) {
      count++;
      if (x == 2) {
        subscriber.unsubscribe();
      }
    });
    source.subscribe(subscriber);
    chai_1.expect(count).to.be.equal(2);
  });
  it('should accept a scheduler', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        condition: function (x) {
          return x < 4;
        },
        iterate: function (x) {
          return x + 1;
        },
        resultSelector: function (x) {
          return x;
        },
        scheduler: rxTestScheduler,
      });
      var expected = '(123|)';
      var count = 0;
      source.subscribe(function (x) {
        return count++;
      });
      chai_1.expect(count).to.be.equal(0);
      rxTestScheduler.flush();
      chai_1.expect(count).to.be.equal(3);
      expectObservable(source).toBe(expected, { 1: 1, 2: 2, 3: 3 });
    });
  });
  it('should allow minimal possible options', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1
        .generate({
          initialState: 1,
          iterate: function (x) {
            return x * 2;
          },
        })
        .pipe(operators_1.take(3));
      var expected = '(124|)';
      expectObservable(source).toBe(expected, { 1: 1, 2: 2, 4: 4 });
    });
  });
  it('should emit error if result selector throws', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: function (x) {
          return x * 2;
        },
        resultSelector: err,
      });
      var expected = '(#)';
      expectObservable(source).toBe(expected);
    });
  });
  it('should emit error if result selector throws on scheduler', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: function (x) {
          return x * 2;
        },
        resultSelector: err,
        scheduler: rxTestScheduler,
      });
      var expected = '(#)';
      expectObservable(source).toBe(expected);
    });
  });
  it('should emit error after first value if iterate function throws', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: err,
      });
      var expected = '(1#)';
      expectObservable(source).toBe(expected, { 1: 1 });
    });
  });
  it('should emit error after first value if iterate function throws on scheduler', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: err,
        scheduler: rxTestScheduler,
      });
      var expected = '(1#)';
      expectObservable(source).toBe(expected, { 1: 1 });
    });
  });
  it('should emit error if condition function throws', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: function (x) {
          return x + 1;
        },
        condition: err,
      });
      var expected = '(#)';
      expectObservable(source).toBe(expected);
    });
  });
  it('should emit error if condition function throws on scheduler', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.generate({
        initialState: 1,
        iterate: function (x) {
          return x + 1;
        },
        condition: err,
        scheduler: rxTestScheduler,
      });
      var expected = '(#)';
      expectObservable(source).toBe(expected);
    });
  });
});
//# sourceMappingURL=generate-spec.js.map
