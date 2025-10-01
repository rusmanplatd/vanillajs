'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('onErrorResumeNext', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should continue with observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('  --a--b--#                     ');
      var s2 = cold('         --c--d--#             ');
      var s3 = cold('                 --e--#        ');
      var s4 = cold('                      --f--g--|');
      var subs1 = '   ^-------!                     ';
      var subs2 = '   --------^-------!             ';
      var subs3 = '   ----------------^----!        ';
      var subs4 = '   ---------------------^-------!';
      var expected = '--a--b----c--d----e----f--g--|';
      expectObservable(rxjs_1.onErrorResumeNext(s1, s2, s3, s4)).toBe(expected);
      expectSubscriptions(s1.subscriptions).toBe(subs1);
      expectSubscriptions(s2.subscriptions).toBe(subs2);
      expectSubscriptions(s3.subscriptions).toBe(subs3);
      expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
  });
  it('should continue array of observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('  --a--b--#                     ');
      var s2 = cold('         --c--d--#             ');
      var s3 = cold('                 --e--#        ');
      var s4 = cold('                      --f--g--|');
      var subs1 = '   ^-------!                     ';
      var subs2 = '   --------^-------!             ';
      var subs3 = '   ----------------^----!        ';
      var subs4 = '   ---------------------^-------!';
      var expected = '--a--b----c--d----e----f--g--|';
      expectObservable(rxjs_1.onErrorResumeNext([s1, s2, s3, s4])).toBe(
        expected
      );
      expectSubscriptions(s1.subscriptions).toBe(subs1);
      expectSubscriptions(s2.subscriptions).toBe(subs2);
      expectSubscriptions(s3.subscriptions).toBe(subs3);
      expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
  });
  it('should complete single observable throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('#   ');
      var subs = '      (^!)';
      var expected = '  |   ';
      expectObservable(rxjs_1.onErrorResumeNext(source)).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
  it('should skip invalid sources and move on', function () {
    var results = [];
    rxjs_1
      .onErrorResumeNext(
        rxjs_1.of(1),
        [2, 3, 4],
        { notValid: 'LOL' },
        rxjs_1.of(5, 6)
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1.expect(results).to.deep.equal([1, 2, 3, 4, 5, 6, 'complete']);
  });
  it('should call finalize after each sync observable', function () {
    var results = [];
    rxjs_1
      .onErrorResumeNext(
        rxjs_1.of(1).pipe(
          operators_1.finalize(function () {
            return results.push('finalize 1');
          })
        ),
        rxjs_1.of(2).pipe(
          operators_1.finalize(function () {
            return results.push('finalize 2');
          })
        ),
        rxjs_1.of(3).pipe(
          operators_1.finalize(function () {
            return results.push('finalize 3');
          })
        ),
        rxjs_1.of(4).pipe(
          operators_1.finalize(function () {
            return results.push('finalize 4');
          })
        )
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
        complete: function () {
          return results.push('complete');
        },
      });
    chai_1
      .expect(results)
      .to.deep.equal([
        1,
        'finalize 1',
        2,
        'finalize 2',
        3,
        'finalize 3',
        4,
        'finalize 4',
        'complete',
      ]);
  });
});
//# sourceMappingURL=onErrorResumeNext-spec.js.map
