'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var chai_1 = require('chai');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('pairwise operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should group consecutive emissions as arrays of two', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b-c----d--e---|');
      var e1subs = '  ^------------------!';
      var expected = '-----u-v----w--x---|';
      var values = {
        u: ['a', 'b'],
        v: ['b', 'c'],
        w: ['c', 'd'],
        x: ['d', 'e'],
      };
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should pairwise things', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--f--g--|');
      var e1subs = '     ^--------------------!';
      var expected = '   ------v--w--x--y--z--|';
      var values = {
        v: ['b', 'c'],
        w: ['c', 'd'],
        x: ['d', 'e'],
        y: ['e', 'f'],
        z: ['f', 'g'],
      };
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not emit on single-element streams', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b----|');
      var e1subs = '     ^-------!';
      var expected = '   --------|';
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle mid-stream throw', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--d--e--#');
      var e1subs = '     ^--------------!';
      var expected = '   ------v--w--x--#';
      var values = {
        v: ['b', 'c'],
        w: ['c', 'd'],
        x: ['d', 'e'],
      };
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      expectObservable(e1.pipe(operators_1.pairwise())).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should be recursively re-enterable', function () {
    var results = new Array();
    var subject = new rxjs_1.Subject();
    subject
      .pipe(operators_1.pairwise(), operators_1.take(3))
      .subscribe(function (pair) {
        results.push(pair);
        subject.next('c');
      });
    subject.next('a');
    subject.next('b');
    chai_1.expect(results).to.deep.equal([
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'c'],
    ]);
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
      .pipe(operators_1.pairwise(), operators_1.take(2))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=pairwise-spec.js.map
