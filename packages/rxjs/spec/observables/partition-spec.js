'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('partition', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  /**
   *
   * @param result
   * @param expected
   */
  function expectObservableArray(result, expected) {
    for (var idx = 0; idx < result.length; idx++) {
      rxTestScheduler.expectObservable(result[idx]).toBe(expected[idx]);
    }
  }
  it('should partition an observable of integers into even and odd', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --1-2---3------4--5---6--|');
      var e1subs = '   ^------------------------!';
      var expected = [
        '                --1-----3---------5------|',
        '                ----2----------4------6--|',
      ];
      var result = rxjs_1.partition(e1, function (x) {
        return x % 2 === 1;
      });
      expectObservableArray(result, expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition an observable into two using a predicate', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d--a---c--|');
      var e1subs = '   ^------------------------!';
      var expected = [
        '                --a-----a---------a------|',
        '                ----b----------d------c--|',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition an observable into two using a predicate that takes an index', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d--a---c--|');
      var e1subs = '   ^------------------------!';
      var expected = [
        '                --a-----a---------a------|',
        '                ----b----------d------c--|',
      ];
      /**
       *
       * @param value
       * @param index
       */
      function predicate(value, index) {
        return index % 2 === 0;
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition an observable into two using a predicate and thisArg', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d--a---c--|');
      var e1subs = '   ^------------------------!';
      var expected = [
        '                --a-----a---------a------|',
        '                ----b----------d------c--|',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === this.value;
      }
      expectObservableArray(
        rxjs_1.partition(e1, predicate, { value: 'a' }),
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should pass errors to both returned observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---#');
      var e1subs = '   ^-------!';
      var expected = ['                --a-----#', '                ----b---#'];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should pass errors to both returned observables if source throws', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  #   ');
      var e1subs = '   (^!)';
      var expected = ['                 #  ', '                 #  '];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should pass errors to both returned observables if predicate throws', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b--a--|');
      var e1subs = '   ^------!   ';
      var expected = [
        '                --a----#   ',
        '                ----b--#   ',
      ];
      var index = 0;
      var error = 'error';
      /**
       *
       * @param x
       */
      function predicate(x) {
        var match = x === 'a';
        if (match && index++ > 1) {
          throw error;
        }
        return match;
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition empty observable if source does not emits', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   ----|');
      var e1subs = '   ^---!';
      var expected = ['                ----|', '                ----|'];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'x';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition empty observable if source is empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  |   ');
      var e1subs = '   (^!)';
      var expected = ['                |   ', '                |   '];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'x';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition if source emits single elements', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a--|');
      var e1subs = '   ^----!';
      var expected = ['                --a--|', '                -----|'];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition if predicate matches all of source elements', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a--a--a--a--a--a--a--|');
      var e1subs = '   ^----------------------!';
      var expected = [
        '                --a--a--a--a--a--a--a--|',
        '                -----------------------|',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition if predicate does not match all of source elements', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --b--b--b--b--b--b--b--|');
      var e1subs = '   ^----------------------!';
      var expected = [
        '                -----------------------|',
        '                --b--b--b--b--b--b--b--|',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition to infinite observable if source does not completes', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d----');
      var e1subs = '   ^-------------------';
      var expected = [
        '                --a-----a-----------',
        '                ----b----------d----',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition to infinite observable if source never completes', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  -');
      var e1subs = '   ^';
      var expected = ['                -', '                -'];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      expectObservableArray(rxjs_1.partition(e1, predicate), expected);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should partition into two observable with early unsubscription', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d-|');
      var unsub = '    -------!          ';
      var e1subs = '   ^------!          ';
      var expected = [
        '                --a-----          ',
        '                ----b---          ',
      ];
      /**
       *
       * @param x
       */
      function predicate(x) {
        return x === 'a';
      }
      var result = rxjs_1.partition(e1, predicate);
      for (var idx = 0; idx < result.length; idx++) {
        expectObservable(result[idx], unsub).toBe(expected[idx]);
      }
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a-b---a------d-|');
      var e1subs = '   ^------!          ';
      var expected = [
        '                --a-----          ',
        '                ----b---          ',
      ];
      var unsub = '    -------!          ';
      var e1Pipe = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      var result = rxjs_1.partition(e1Pipe, function (x) {
        return x === 'a';
      });
      expectObservable(result[0], unsub).toBe(expected[0]);
      expectObservable(result[1], unsub).toBe(expected[1]);
      expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
  });
  it('should accept thisArg', function () {
    var thisArg = {};
    rxjs_1
      .partition(
        rxjs_1.of(1),
        function (value) {
          chai_1.expect(this).to.deep.equal(thisArg);
          return true;
        },
        thisArg
      )
      .forEach(function (observable) {
        return observable.subscribe();
      });
  });
});
//# sourceMappingURL=partition-spec.js.map
