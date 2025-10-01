'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var TestScheduler_1 = require('rxjs/internal/testing/TestScheduler');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('pluck', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new TestScheduler_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should dematerialize an Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = {
        a: '{v:1}',
        b: '{v:2}',
        c: '{v:3}',
      };
      var e1 = cold(' --a--b--c--|', inputs);
      var e1subs = '  ^----------!';
      var expected = '--x--y--z--|';
      var result = e1.pipe(
        operators_1.map(function (x) {
          return { v: x.charAt(3) };
        }),
        operators_1.pluck('v')
      );
      expectObservable(result).toBe(expected, { x: '1', y: '2', z: '3' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work for one array', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = { x: ['abc'] };
      var e1 = cold(' --x--|', inputs);
      var e1subs = '  ^----!';
      var expected = '--y--|';
      var result = e1.pipe(operators_1.pluck(0));
      expectObservable(result).toBe(expected, { y: 'abc' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work for one object', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = { x: { prop: 42 } };
      var e1 = cold(' --x--|', inputs);
      var e1subs = '  ^----!';
      var expected = '--y--|';
      var result = e1.pipe(operators_1.pluck('prop'));
      expectObservable(result).toBe(expected, { y: 42 });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work for multiple objects', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = {
        a: { prop: '1' },
        b: { prop: '2' },
        c: { prop: '3' },
        d: { prop: '4' },
        e: { prop: '5' },
      };
      var e1 = cold(' --a-b--c-d---e-|', inputs);
      var e1subs = '  ^--------------!';
      var expected = '--1-2--3-4---5-|';
      var result = e1.pipe(operators_1.pluck('prop'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with deep nested properties', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = {
        a: { a: { b: { c: '1' } } },
        b: { a: { b: { c: '2' } } },
        c: { a: { b: { c: '3' } } },
        d: { a: { b: { c: '4' } } },
        e: { a: { b: { c: '5' } } },
      };
      var e1 = cold(' --a-b--c-d---e-|', inputs);
      var e1subs = '  ^--------------!';
      var expected = '--1-2--3-4---5-|';
      var result = e1.pipe(operators_1.pluck('a', 'b', 'c'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should work with edge cases of deep nested properties', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = {
        a: { i: { j: { k: 1 } } },
        b: { i: { j: 2 } },
        c: { i: { k: { k: 3 } } },
        d: {},
        e: { i: { j: { k: 5 } } },
      };
      var e1 = cold(' --a-b--c-d---e-|', inputs);
      var e1subs = '  ^--------------!';
      var expected = '--v-w--x-y---z-|';
      var values = { v: 1, w: undefined, x: undefined, y: undefined, z: 5 };
      var result = e1.pipe(operators_1.pluck('i', 'j', 'k'));
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should throw an error if not property is passed', function () {
    chai_1
      .expect(function () {
        rxjs_1.of({ prop: 1 }, { prop: 2 }).pipe(operators_1.pluck());
      })
      .to.throw(Error, 'list of properties cannot be empty.');
  });
  it('should propagate errors from observable that emits only errors', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var result = e1.pipe(operators_1.pluck('whatever'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors from observable that emit values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = { a: { prop: '1' }, b: { prop: '2' } };
      var e1 = cold(' --a--b--#', inputs, 'too bad');
      var e1subs = '  ^-------!';
      var expected = '--1--2--#';
      var result = e1.pipe(operators_1.pluck('prop'));
      expectObservable(result).toBe(expected, undefined, 'too bad');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not pluck an empty observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var result = e1.pipe(operators_1.pluck('whatever'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --a--b--c--|', { a: { prop: '1' }, b: { prop: '2' } });
      var e1subs = '  ^-----!     ';
      var expected = '--1--2-     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(operators_1.pluck('prop'));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should pluck twice', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = {
        a: { a: { b: { c: '1' } } },
        b: { a: { b: { c: '2' } } },
        c: { a: { b: { c: '3' } } },
        d: { a: { b: { c: '4' } } },
        e: { a: { b: { c: '5' } } },
      };
      var e1 = cold(' --a-b--c-d---e-|', inputs);
      var e1subs = '  ^--------------!';
      var expected = '--1-2--3-4---5-|';
      var result = e1.pipe(operators_1.pluck('a', 'b'), operators_1.pluck('c'));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = { a: { prop: '1' }, b: { prop: '2' } };
      var e1 = cold(' --a--b--c--|', inputs);
      var e1subs = '  ^-----!     ';
      var expected = '--1--2-     ';
      var unsub = '   ------!     ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.pluck('prop'),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support symbols', function () {
    testScheduler.run(function (_a) {
      var _b;
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var sym = Symbol('sym');
      var inputs = { x: ((_b = {}), (_b[sym] = 'abc'), _b) };
      var e1 = cold(' --x--|', inputs);
      var e1subs = '  ^----!';
      var expected = '--y--|';
      var result = e1.pipe(operators_1.pluck(sym));
      expectObservable(result).toBe(expected, { y: 'abc' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break on null values', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var inputs = { x: null };
      var e1 = cold(' --x--|', inputs);
      var e1subs = '  ^----!';
      var expected = '--y--|';
      var result = e1.pipe(operators_1.pluck('prop'));
      expectObservable(result).toBe(expected, { y: undefined });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
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
      .pipe(operators_1.pluck('whatever'), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=pluck-spec.js.map
