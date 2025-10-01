'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var test_helper_1 = require('../helpers/test-helper');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('withLatestFrom', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should combine events from cold observables', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold(' --1--2-3-4---|   ');
      var e2subs = '  ^------------!   ';
      var e1 = cold(' -a--b-----c-d-e-|');
      var e1subs = '  ^---------------!';
      var expected = '----B-----C-D-E-|';
      var result = e1.pipe(
        operators_1.withLatestFrom(e2, function (a, b) {
          return String(a) + String(b);
        })
      );
      expectObservable(result).toBe(expected, {
        B: 'b1',
        C: 'c4',
        D: 'd4',
        E: 'e4',
      });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should merge the value with the latest values from the other observables into arrays', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h------|');
      var e2subs = '       ^-------------!   ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^-------------!   ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^-------------!   ';
      var expected = '     ----x---y---z-|   ';
      var values = {
        x: ['b', 'f', 'j'],
        y: ['c', 'g', 'k'],
        z: ['d', 'h', 'l'],
      };
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should merge the value with the latest values from the other observables into arrays and a project argument', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h------|');
      var e2subs = '       ^-------------!   ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^-------------!   ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^-------------!   ';
      var expected = '     ----x---y---z-|   ';
      var values = {
        x: 'bfj',
        y: 'cgk',
        z: 'dhl',
      };
      var project = function (a, b, c) {
        return a + b + c;
      };
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h------|');
      var e2subs = '       ^----------!      ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^----------!      ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^----------!      ';
      var expected = '     ----x---y---      ';
      var unsub = '        -----------!      ';
      var values = {
        x: 'bfj',
        y: 'cgk',
        z: 'dhl',
      };
      var project = function (a, b, c) {
        return a + b + c;
      };
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h------|');
      var e2subs = '       ^----------!      ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^----------!      ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^----------!      ';
      var expected = '     ----x---y---      ';
      var unsub = '        -----------!      ';
      var values = {
        x: 'bfj',
        y: 'cgk',
        z: 'dhl',
      };
      var project = function (a, b, c) {
        return a + b + c;
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.withLatestFrom(e2, e3, project),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h----|');
      var e2subs = '       (^!)            ';
      var e3 = hot('  --i--^-j---k---l----|');
      var e3subs = '       (^!)            ';
      var e1 = cold('      |               ');
      var e1subs = '       (^!)            ';
      var expected = '     |               ';
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('   --e--^-f---g---h----|  ');
      var e2subs = '        ^--------------!  ';
      var e3 = hot('   --i--^-j---k---l----|  ');
      var e3subs = '        ^--------------!  ';
      var e1 = cold('        -                ');
      var e1subs = '         ^----------------';
      var expected = '    --------------------';
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h----|');
      var e2subs = '       (^!)            ';
      var e3 = hot('  --i--^-j---k---l----|');
      var e3subs = '       (^!)            ';
      var e1 = cold('      #               ');
      var e1subs = '       (^!)            ';
      var expected = '     #               ';
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h----|');
      var e2subs = '       ^-------!       ';
      var e3 = hot('  --i--^-j---k---l----|');
      var e3subs = '       ^-------!       ';
      var e1 = hot('  --a--^---b---#       ', undefined, new Error('boo-hoo'));
      var e1subs = '       ^-------!       ';
      var expected = '     ----x---#       ';
      var values = {
        x: ['b', 'f', 'j'],
      };
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected, values, new Error('boo-hoo'));
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle error with project argument', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = hot('  --e--^-f---g---h----|');
      var e2subs = '       ^-------!       ';
      var e3 = hot('  --i--^-j---k---l----|');
      var e3subs = '       ^-------!       ';
      var e1 = hot('  --a--^---b---#       ', undefined, new Error('boo-hoo'));
      var e1subs = '       ^-------!       ';
      var expected = '     ----x---#       ';
      var values = {
        x: 'bfj',
      };
      var project = function (a, b, c) {
        return a + b + c;
      };
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3, project));
      expectObservable(result).toBe(expected, values, new Error('boo-hoo'));
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle merging with empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('      |                 ');
      var e2subs = '       (^!)              ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^-------------!   ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^-------------!   ';
      var expected = '     --------------|   ';
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle merging with never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e2 = cold('      -                 ');
      var e2subs = '       ^-------------!   ';
      var e3 = hot('  --i--^-j---k---l------|');
      var e3subs = '       ^-------------!   ';
      var e1 = hot('  --a--^---b---c---d-|   ');
      var e1subs = '       ^-------------!   ';
      var expected = '     --------------|   ';
      var result = e1.pipe(operators_1.withLatestFrom(e2, e3));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
      expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
  });
  it('should handle promises', function (done) {
    rxjs_1
      .of(1)
      .pipe(
        operators_1.delay(1),
        operators_1.withLatestFrom(Promise.resolve(2), Promise.resolve(3))
      )
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.deep.equal([1, 2, 3]);
        },
        complete: done,
      });
  });
  it('should handle arrays', function () {
    rxjs_1
      .of(1)
      .pipe(
        operators_1.delay(1),
        operators_1.withLatestFrom([2, 3, 4], [4, 5, 6])
      )
      .subscribe(function (x) {
        chai_1.expect(x).to.deep.equal([1, 4, 6]);
      });
  });
  it('should handle lowercase-o observables', function () {
    rxjs_1
      .of(1)
      .pipe(
        operators_1.delay(1),
        operators_1.withLatestFrom(
          test_helper_1.lowerCaseO(2, 3, 4),
          test_helper_1.lowerCaseO(4, 5, 6)
        )
      )
      .subscribe(function (x) {
        chai_1.expect(x).to.deep.equal([1, 4, 6]);
      });
  });
  it('should work with synchronous observables', function () {
    var result = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(operators_1.withLatestFrom(rxjs_1.of(4, 5)))
      .subscribe(function (x) {
        result.push(x);
      });
    chai_1.expect(result.length).to.equal(3);
    chai_1.expect(result[0]).to.deep.equal([1, 5]);
    chai_1.expect(result[1]).to.deep.equal([2, 5]);
    chai_1.expect(result[2]).to.deep.equal([3, 5]);
  });
});
//# sourceMappingURL=withLatestFrom-spec.js.map
