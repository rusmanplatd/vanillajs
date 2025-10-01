'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var booleans = { T: true, F: false };
describe('sequenceEqual', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should return true for two equal sequences', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d--e--f--g--|       ');
      var s1subs = '     ^--------------------!       ';
      var s2 = hot('-----^-----b--c--d-e-f------g-|   ');
      var s2subs = '     ^------------------------!   ';
      var expected = '   -------------------------(T|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false for two sync observables that are unequal in length', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' (abcdefg|)');
      var s2 = cold(' (abc|)    ');
      var expected = '(F|)      ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
    });
  });
  it('should return true for two sync observables that match', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' (abcdefg|)');
      var s2 = cold(' (abcdefg|)');
      var expected = '(T|)      ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
    });
  });
  it('should return true for two observables that match when the last one emits and completes in the same frame', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d--e--f--g--|       ');
      var s1subs = '     ^--------------------!       ';
      var s2 = hot('-----^--b--c--d--e--f--g------|   ');
      var s2subs = '     ^------------------------!   ';
      var expected = '   -------------------------(T|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return true for two observables that match when the last one emits and completes in the same frame', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d--e--f--g--|       ');
      var s1subs = '     ^--------------------!       ';
      var s2 = hot('-----^--b--c--d--e--f---------(g|)');
      var s2subs = '     ^------------------------!   ';
      var expected = '   -------------------------(T|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should error with an errored source', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b---c---#  ');
      var s2 = hot('--a--^--b---c-----|');
      var expected = '   -----------#  ';
      var sub = '        ^----------!  ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(sub);
      expectSubscriptions(s2.subscriptions).toBe(sub);
    });
  });
  it('should error with an errored compareTo', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b---c-----|');
      var s2 = hot('--a--^--b---c---#  ');
      var expected = '   -----------#  ';
      var sub = '        ^----------!  ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(sub);
      expectSubscriptions(s2.subscriptions).toBe(sub);
    });
  });
  it('should error if the source is a throw', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' #            ');
      var s2 = cold(' ---a--b--c--|');
      var expected = '#            ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected);
    });
  });
  it('should never return if source is a never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' ------------');
      var s2 = cold(' --a--b--c--|');
      var expected = '------------';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected);
    });
  });
  it('should never return if compareTo is a never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' --a--b--c--|');
      var s2 = cold(' ------------');
      var expected = '------------';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected);
    });
  });
  it('should return false if source is empty and compareTo is not', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = cold(' |            ');
      var s1subs = '  (^!)          ';
      var s2 = cold(' ------a------');
      var s2subs = '  ^-----!      ';
      var expected = '------(F|)   ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false if compareTo is empty and source is not', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = cold(' ------a------');
      var s2 = cold(' |            ');
      var expected = '------(F|)   ';
      var s1subs = '  ^-----!      ';
      var s2subs = '  (^!)         ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return never if compareTo is empty and source is never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' -');
      var s2 = cold(' |');
      var expected = '-';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected);
    });
  });
  it('should return never if source is empty and compareTo is never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' |');
      var s2 = cold(' -');
      var expected = '-';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected);
    });
  });
  it('should error if the comparator function errors', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: null,
        b: { value: 'bees knees' },
        c: { value: 'carpy dumb' },
        d: { value: 'derp' },
        x: { value: 'bees knees', foo: 'lol' },
        y: { value: 'carpy dumb', scooby: 'doo' },
        z: { value: 'derp', weCouldBe: 'dancin, yeah' },
      };
      var s1 = hot('--a--^--b-----c------d--|      ', values);
      var s1subs = '     ^------------!            ';
      var s2 = hot('-----^--------x---y---z-------|', values);
      var s2subs = '     ^------------!            ';
      var expected = '   -------------#            ';
      var i = 0;
      var source = s1.pipe(
        operators_1.sequenceEqual(s2, function (a, b) {
          if (++i === 2) {
            throw new Error('shazbot');
          }
          return a.value === b.value;
        })
      );
      expectObservable(source).toBe(expected, booleans, new Error('shazbot'));
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should use the provided comparator function', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: null,
        b: { value: 'bees knees' },
        c: { value: 'carpy dumb' },
        d: { value: 'derp' },
        x: { value: 'bees knees', foo: 'lol' },
        y: { value: 'carpy dumb', scooby: 'doo' },
        z: { value: 'derp', weCouldBe: 'dancin, yeah' },
      };
      var s1 = hot('--a--^--b-----c------d--|         ', values);
      var s1subs = '     ^------------------!         ';
      var s2 = hot('-----^--------x---y---z-------|   ', values);
      var s2subs = '     ^------------------------!   ';
      var expected = '   -------------------------(T|)';
      var source = s1.pipe(
        operators_1.sequenceEqual(s2, function (a, b) {
          return a.value === b.value;
        })
      );
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false for two unequal sequences, compareTo finishing last', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d--e--f--g--|    ');
      var s1subs = '     ^--------------------!    ';
      var s2 = hot('-----^-----b--c--d-e-f------z-|');
      var s2subs = '     ^----------------------!   ';
      var expected = '   -----------------------(F|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false for two unequal sequences, early wrong value from source', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c---x-----------|');
      var s1subs = '     ^---------!            ';
      var s2 = hot('-----^--b--c--d--e--f--|    ');
      var s2subs = '     ^---------!            ';
      var expected = '   ----------(F|)         ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false when the source emits an extra value after the compareTo completes', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d--e--f--g--h--|');
      var s1subs = '     ^-----------!            ';
      var s2 = hot('-----^--b--c--d-|             ');
      var s2subs = '     ^----------!             ';
      var expected = '   ------------(F|)         ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return false when the compareTo emits an extra value after the source completes', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('--a--^--b--c--d-|             ');
      var s1subs = '     ^----------!             ';
      var s2 = hot('-----^--b--c--d--e--f--g--h--|');
      var s2subs = '     ^-----------!            ';
      var expected = '   ------------(F|)         ';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
      expectSubscriptions(s1.subscriptions).toBe(s1subs);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
    });
  });
  it('should return true for two empty observables', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' |   ');
      var s2 = cold(' |   ');
      var expected = '(T|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
    });
  });
  it('should return false for an empty observable and an observable that emits', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var s1 = cold(' |      ');
      var s2 = cold(' ---a--|');
      var expected = '---(F|)';
      var source = s1.pipe(operators_1.sequenceEqual(s2));
      expectObservable(source).toBe(expected, booleans);
    });
  });
  it('should return compare hot and cold observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var s1 = hot('---a--^---b---c---d---e---f---g---h---i---j---|   ');
      var s2 = cold('     ----b---c-|                                 ');
      var s2subs = '      ^---------!                                 ';
      var expected1 = '   ------------(F|)                            ';
      var s3 = cold('                        -f---g---h---i---j---|   ');
      var test2subs = '   -------------------^                        ';
      var expected2 = '   ----------------------------------------(T|)';
      var s3subs = '      -------------------^--------------------!   ';
      var test1 = s1.pipe(operators_1.sequenceEqual(s2));
      var test2 = s1.pipe(operators_1.sequenceEqual(s3));
      expectObservable(test1).toBe(expected1, booleans);
      expectObservable(test2, test2subs).toBe(expected2, booleans);
      expectSubscriptions(s2.subscriptions).toBe(s2subs);
      expectSubscriptions(s3.subscriptions).toBe(s3subs);
    });
  });
});
//# sourceMappingURL=sequenceEqual-spec.js.map
