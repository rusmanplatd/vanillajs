'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('range', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create an observable with numbers 1 to 10', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayAmount = time('--|');
      var expected = '        a-b-c-d-e-f-g-h-i-(j|)';
      var e1 = rxjs_1.range(1, 10).pipe(
        operators_1.concatMap(function (x, i) {
          return rxjs_1
            .of(x)
            .pipe(operators_1.delay(i === 0 ? 0 : delayAmount));
        })
      );
      var values = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8,
        i: 9,
        j: 10,
      };
      expectObservable(e1).toBe(expected, values);
    });
  });
  it('should work for two subscribers', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayAmount = time('--|');
      var expected = '        a-b-c-d-(e|)';
      var e1 = rxjs_1.range(1, 5).pipe(
        operators_1.concatMap(function (x, i) {
          return rxjs_1
            .of(x)
            .pipe(operators_1.delay(i === 0 ? 0 : delayAmount));
        })
      );
      var values = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      };
      expectObservable(e1).toBe(expected, values);
      expectObservable(e1).toBe(expected, values);
    });
  });
  it('should synchronously create a range of values by default', function () {
    var results = [];
    rxjs_1.range(12, 4).subscribe(function (x) {
      results.push(x);
    });
    chai_1.expect(results).to.deep.equal([12, 13, 14, 15]);
  });
  it('should accept a scheduler', function (done) {
    var expected = [12, 13, 14, 15];
    sinon.spy(rxjs_1.asapScheduler, 'schedule');
    var source = rxjs_1.range(12, 4, rxjs_1.asapScheduler);
    source.subscribe({
      next: function (x) {
        chai_1.expect(rxjs_1.asapScheduler.schedule).have.been.called;
        var exp = expected.shift();
        chai_1.expect(x).to.equal(exp);
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        rxjs_1.asapScheduler.schedule.restore();
        done();
      },
    });
  });
  it('should accept only one argument where count is argument and start is zero', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayAmount = time('--|');
      var expected = '        a-b-c-d-(e|)';
      var e1 = rxjs_1.range(5).pipe(
        operators_1.concatMap(function (x, i) {
          return rxjs_1
            .of(x)
            .pipe(operators_1.delay(i === 0 ? 0 : delayAmount));
        })
      );
      var values = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
      };
      expectObservable(e1).toBe(expected, values);
      expectObservable(e1).toBe(expected, values);
    });
  });
  it('should return empty for range(0)', function () {
    var results = [];
    rxjs_1.range(0).subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal(['done']);
  });
  it('should return empty for range with a negative count', function () {
    var results = [];
    rxjs_1.range(5, -5).subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal(['done']);
  });
});
//# sourceMappingURL=range-spec.js.map
