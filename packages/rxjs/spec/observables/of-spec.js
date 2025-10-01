'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('of', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create a cold observable that emits 1, 2, 3', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayValue = time('--|');
      var e1 = rxjs_1.of(1, 2, 3).pipe(
        operators_1.concatMap(function (x, i) {
          return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : delayValue));
        })
      );
      var expected = 'x-y-(z|)';
      expectObservable(e1).toBe(expected, { x: 1, y: 2, z: 3 });
    });
  });
  it('should create an observable from the provided values', function (done) {
    var x = { foo: 'bar' };
    var expected = [1, 'a', x];
    var i = 0;
    rxjs_1.of(1, 'a', x).subscribe({
      next: function (y) {
        chai_1.expect(y).to.equal(expected[i++]);
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should emit one value', function (done) {
    var calls = 0;
    rxjs_1.of(42).subscribe({
      next: function (x) {
        chai_1.expect(++calls).to.equal(1);
        chai_1.expect(x).to.equal(42);
      },
      error: function (err) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should handle an Observable as the only value', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.of(rxjs_1.of('a', 'b', 'c'));
      var result = source.pipe(operators_1.concatAll());
      expectObservable(result).toBe('(abc|)');
    });
  });
  it('should handle many Observable as the given values', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var source = rxjs_1.of(
        rxjs_1.of('a', 'b', 'c'),
        rxjs_1.of('d', 'e', 'f')
      );
      var result = source.pipe(operators_1.concatAll());
      expectObservable(result).toBe('(abcdef|)');
    });
  });
});
//# sourceMappingURL=of-spec.js.map
