'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var test_helper_1 = require('../helpers/test-helper');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('forkJoin', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should join the last values of the provided observables into an array', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = hot('  -a--b-----c-d-e-|');
      var s2 = hot('  --------f--g-h-i--j-|');
      var s3 = cold(' --1--2-3-4---|');
      var e1 = rxjs_1.forkJoin([s1, s2, s3]);
      var expected = '--------------------(x|)';
      expectObservable(e1).toBe(expected, { x: ['e', 'j', '4'] });
    });
  });
  it('should support a resultSelector with an Array of ObservableInputs', function () {
    var results = [];
    rxjs_1
      .forkJoin(
        [rxjs_1.of(1, 2, 3), rxjs_1.of(4, 5, 6), rxjs_1.of(7, 8, 9)],
        function (a, b, c) {
          return a + b + c;
        }
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          results.push('done');
        },
      });
    chai_1.expect(results).to.deep.equal([18, 'done']);
  });
  it('should support a resultSelector with a spread of ObservableInputs', function () {
    var results = [];
    rxjs_1
      .forkJoin(
        rxjs_1.of(1, 2, 3),
        rxjs_1.of(4, 5, 6),
        rxjs_1.of(7, 8, 9),
        function (a, b, c) {
          return a + b + c;
        }
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          results.push('done');
        },
      });
    chai_1.expect(results).to.deep.equal([18, 'done']);
  });
  it('should accept single observable', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var e1 = rxjs_1.forkJoin(hot('--a--b--c--d--|'));
      var expected = '       --------------(x|)';
      expectObservable(e1).toBe(expected, { x: ['d'] });
    });
  });
  describe('forkJoin([input1, input2, input3])', function () {
    it('should join the last values of the provided observables into an array', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = hot('  --1--2--3--|');
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
      });
    });
    it('should allow emit null or undefined', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e2 = rxjs_1.forkJoin([
          hot('            --a--b--c--d--|', { d: null }),
          hot('            (b|)'),
          hot('            --1--2--3--|'),
          hot('            -----r--t--u--|', { u: undefined }),
        ]);
        var expected2 = '--------------(x|)';
        expectObservable(e2).toBe(expected2, {
          x: [null, 'b', '3', undefined],
        });
      });
    });
    it('should accept array of observable contains single', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var e1 = rxjs_1.forkJoin([s1]);
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, { x: ['d'] });
      });
    });
    it('should accept lowercase-o observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = test_helper_1.lowerCaseO('1', '2', '3');
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
      });
    });
    it('should accept empty lowercase-o observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = test_helper_1.lowerCaseO();
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should accept promise', function (done) {
      rxTestScheduler.run(function () {
        var e1 = rxjs_1.forkJoin([rxjs_1.of(1), Promise.resolve(2)]);
        e1.subscribe({
          next: function (x) {
            return chai_1.expect(x).to.deep.equal([1, 2]);
          },
          complete: done,
        });
      });
    });
    it('should accept array of observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = hot('  --1--2--3--|');
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, { x: ['d', 'b', '3'] });
      });
    });
    it('should not emit if any of source observable is empty', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = hot('  ------------------|');
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '------------------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete early if any of source is empty and completes before than others', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --a--b--c--d--|');
        var s2 = hot('  (b|)');
        var s3 = hot('  ---------|');
        var e1 = rxjs_1.forkJoin([s1, s2, s3]);
        var expected = '---------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete when all sources are empty', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --------------|');
        var s2 = hot('  ---------|');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '---------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should not complete when only source never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin([hot('--------------')]);
        var expected = '        --------------';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should not complete when one of the sources never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('--------------');
        var s2 = hot('-a---b--c--|');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '-';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete when one of the sources never completes but other completes without values', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  --------------');
        var s2 = hot('  ------|');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete if source is not provided', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin();
        var expected = '|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete if sources list is empty', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin([]);
        var expected = '|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when any of source raises error with empty observable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  ------#');
        var s2 = hot('  ---------|');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when any of source raises error with source that never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  ------#');
        var s2 = hot('  ----------');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when source raises error', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var s1 = hot('  ------#');
        var s2 = hot('  ---a-----|');
        var e1 = rxjs_1.forkJoin([s1, s2]);
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should allow unsubscribing early and explicitly', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('--a--^--b--c---d-| ');
        var e1subs = '     ^--------!    ';
        var e2 = hot('---e-^---f--g---h-|');
        var e2subs = '     ^--------!    ';
        var expected = '   ----------    ';
        var unsub = '      ---------!    ';
        var result = rxjs_1.forkJoin([e1, e2]);
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should unsubscribe other Observables, when one of them errors', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('--a--^--b--c---d-| ');
        var e1subs = '     ^--------!    ';
        var e2 = hot('---e-^---f--g-#');
        var e2subs = '     ^--------!    ';
        var expected = '   ---------#    ';
        var result = rxjs_1.forkJoin([e1, e2]);
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
  });
  it('should finalize in the proper order', function () {
    var results = [];
    var source = rxjs_1.forkJoin(
      [1, 2, 3, 4].map(function (n) {
        return rxjs_1.timer(100, rxTestScheduler).pipe(
          rxjs_1.map(function () {
            return n;
          }),
          rxjs_1.finalize(function () {
            return results.push('finalized ' + n);
          })
        );
      })
    );
    source.subscribe(function (value) {
      return results.push(value);
    });
    rxTestScheduler.flush();
    chai_1
      .expect(results)
      .to.deep.equal([
        'finalized 1',
        'finalized 2',
        'finalized 3',
        'finalized 4',
        [1, 2, 3, 4],
      ]);
  });
  describe('forkJoin({ foo, bar, baz })', function () {
    it('should join the last values of the provided observables into an array', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: hot('      --1--2--3--|'),
        });
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, {
          x: { foo: 'd', bar: 'b', baz: '3' },
        });
      });
    });
    it('should allow emit null or undefined', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e2 = rxjs_1.forkJoin({
          foo: hot('       --a--b--c--d--|', { d: null }),
          bar: hot('       (b|)'),
          baz: hot('       --1--2--3--|'),
          qux: hot('       -----r--t--u--|', { u: undefined }),
        });
        var expected2 = '--------------(x|)';
        expectObservable(e2).toBe(expected2, {
          x: { foo: null, bar: 'b', baz: '3', qux: undefined },
        });
      });
    });
    it('should accept array of observable contains single', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
        });
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, { x: { foo: 'd' } });
      });
    });
    it('should accept lowercase-o observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: test_helper_1.lowerCaseO('1', '2', '3'),
        });
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, {
          x: { foo: 'd', bar: 'b', baz: '3' },
        });
      });
    });
    it('should accept empty lowercase-o observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: test_helper_1.lowerCaseO(),
        });
        var expected = '|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should accept promise', function (done) {
      var e1 = rxjs_1.forkJoin({
        foo: rxjs_1.of(1),
        bar: Promise.resolve(2),
      });
      e1.subscribe({
        next: function (x) {
          return chai_1.expect(x).to.deep.equal({ foo: 1, bar: 2 });
        },
        complete: done,
      });
    });
    it('should accept an object of observables', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: hot('      --1--2--3--|'),
        });
        var expected = '--------------(x|)';
        expectObservable(e1).toBe(expected, {
          x: { foo: 'd', bar: 'b', baz: '3' },
        });
      });
    });
    it('should not emit if any of source observable is empty', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: hot('      ------------------|'),
        });
        var expected = '------------------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete early if any of source is empty and completes before than others', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --a--b--c--d--|'),
          bar: hot('      (b|)'),
          baz: hot('      ---------|'),
        });
        var expected = '---------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete when all sources are empty', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --------------|'),
          bar: hot('      ---------|'),
        });
        var expected = '---------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should not complete when only source never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --------------'),
        });
        var expected = '--------------';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should not complete when one of the sources never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --------------'),
          bar: hot('      -a---b--c--|'),
        });
        var expected = '--------------';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should complete when one of the sources never completes but other completes without values', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          foo: hot('      --------------'),
          bar: hot('      ------|'),
        });
        var expected = '------|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should have same v5/v6 throwing behavior full argument of null', function (done) {
      rxTestScheduler.run(function () {
        chai_1
          .expect(function () {
            return rxjs_1.forkJoin(null);
          })
          .not.to.throw();
        chai_1
          .expect(function () {
            return rxjs_1.forkJoin(null).subscribe({
              error: function () {
                return done();
              },
            });
          })
          .not.to.throw();
      });
    });
    it('should complete if sources object is empty', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({});
        var expected = '|';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when any of source raises error with empty observable', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          lol: hot('      ------#'),
          wut: hot('      ---------|'),
        });
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when any of source raises error with source that never completes', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          lol: hot('      ------#'),
          wut: hot('      ----------'),
        });
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should raise error when source raises error', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var e1 = rxjs_1.forkJoin({
          lol: hot('      ------#'),
          foo: hot('      ---a-----|'),
        });
        var expected = '------#';
        expectObservable(e1).toBe(expected);
      });
    });
    it('should allow unsubscribing early and explicitly', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('--a--^--b--c---d-| ');
        var e1subs = '     ^--------!    ';
        var e2 = hot('---e-^---f--g---h-|');
        var e2subs = '     ^--------!    ';
        var expected = '   ----------    ';
        var unsub = '      ---------!    ';
        var result = rxjs_1.forkJoin({
          e1: e1,
          e2: e2,
        });
        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should unsubscribe other Observables, when one of them errors', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var e1 = hot('  --a--^--b--c---d-| ');
        var e1subs = '       ^--------!    ';
        var e2 = hot('  ---e-^---f--g-#');
        var e2subs = '       ^--------!    ';
        var expected = '     ---------#    ';
        var result = rxjs_1.forkJoin({
          e1: e1,
          e2: e2,
        });
        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      });
    });
    it('should accept promise as the first arg', function (done) {
      var e1 = rxjs_1.forkJoin(Promise.resolve(1));
      var values = [];
      e1.subscribe({
        next: function (x) {
          return values.push(x);
        },
        complete: function () {
          chai_1.expect(values).to.deep.equal([[1]]);
          done();
        },
      });
    });
  });
});
//# sourceMappingURL=forkJoin-spec.js.map
