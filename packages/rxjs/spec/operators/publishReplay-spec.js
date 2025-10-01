'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('publishReplay operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should mirror a simple source Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2---3-4--5-|');
      var sourceSubs = ' ^--------------!';
      var published = source.pipe(operators_1.publishReplay(1));
      var expected = '   --1-2---3-4--5-|';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should return a ConnectableObservable-ish', function () {
    var source = rxjs_1.of(1).pipe(operators_1.publishReplay());
    chai_1.expect(typeof source._subscribe === 'function').to.be.true;
    chai_1.expect(typeof source.getSubject === 'function').to.be.true;
    chai_1.expect(typeof source.connect === 'function').to.be.true;
    chai_1.expect(typeof source.refCount === 'function').to.be.true;
  });
  it('should do nothing if connect is not called, despite subscriptions', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2---3-4--5-|');
      var sourceSubs = [];
      var published = source.pipe(operators_1.publishReplay(1));
      var expected = '   -';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should multicast the same values to multiple observers, bufferSize=1', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('    -1-2-3----4-|');
      var sourceSubs = '     ^-----------!';
      var published = source.pipe(operators_1.publishReplay(1));
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----4-|';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      ----23----4-|';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      --------3-4-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should multicast the same values to multiple observers, bufferSize=2', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('    -1-2-----3------4-|');
      var sourceSubs = '     ^-----------------!';
      var published = source.pipe(operators_1.publishReplay(2));
      var subscriber1 = hot('a|                 ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-----3------4-|';
      var subscriber2 = hot('----b|             ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      ----(12)-3------4-|';
      var subscriber3 = hot('-----------c|      ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      -----------(23)-4-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should multicast an error from the source to multiple observers', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('    -1-2-3----4-#');
      var sourceSubs = '     ^-----------!';
      var published = source.pipe(operators_1.publishReplay(1));
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----4-#';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      ----23----4-#';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      --------3-4-#';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should multicast the same values to multiple observers, but is unsubscribed explicitly and early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('    -1-2-3----4-|');
      var sourceSubs = '     ^--------!   ';
      var published = source.pipe(operators_1.publishReplay(1));
      var unsub = '          ---------u   ';
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      ----23----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      --------3-   ';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      var connection;
      expectObservable(
        hot(unsub).pipe(
          operators_1.tap(function () {
            connection.unsubscribe();
          })
        )
      ).toBe(unsub);
      connection = published.connect();
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('    -1-2-3----4-|');
      var sourceSubs = '     ^--------!   ';
      var published = source.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.publishReplay(1)
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      ----23----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      --------3-   ';
      var unsub = '          ---------u   ';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      var connection;
      expectObservable(
        hot(unsub).pipe(
          operators_1.tap(function () {
            connection.unsubscribe();
          })
        )
      ).toBe(unsub);
      connection = published.connect();
    });
  });
  describe('with refCount()', function () {
    it('should connect when first subscriber subscribes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('       -1-2-3----4-|');
        var sourceSubs = '     ---^-----------!';
        var replayed = source.pipe(
          operators_1.publishReplay(1),
          operators_1.refCount()
        );
        var subscriber1 = hot('---a|           ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected1 = '      ----1-2-3----4-|';
        var subscriber2 = hot('-------b|       ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected2 = '      -------23----4-|';
        var subscriber3 = hot('-----------c|   ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected3 = '      -----------3-4-|';
        expectObservable(subscriber1).toBe(expected1);
        expectObservable(subscriber2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should disconnect when last subscriber unsubscribes', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('       -1-2-3----4-|');
        var sourceSubs = '     ---^--------!   ';
        var replayed = source.pipe(
          operators_1.publishReplay(1),
          operators_1.refCount()
        );
        var subscriber1 = hot('---a|           ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var unsub1 = '         ----------!     ';
        var expected1 = '      ----1-2-3--     ';
        var subscriber2 = hot('-------b|       ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var unsub2 = '         ------------!   ';
        var expected2 = '      -------23----   ';
        expectObservable(subscriber1, unsub1).toBe(expected1);
        expectObservable(subscriber2, unsub2).toBe(expected2);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should NOT be retryable', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('    -1-2-3----4-#     ');
        var sourceSubs = '     ^-----------!     ';
        var published = source.pipe(
          operators_1.publishReplay(1),
          operators_1.refCount(),
          operators_1.retry(3)
        );
        var subscriber1 = hot('a|                ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected1 = '      -1-2-3----4-(444#)';
        var subscriber2 = hot('----b|            ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected2 = '      ----23----4-(444#)';
        var subscriber3 = hot('--------c|        ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected3 = '      --------3-4-(444#)';
        expectObservable(subscriber1).toBe(expected1);
        expectObservable(subscriber2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
    it('should NOT be repeatable', function () {
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        var source = cold('    -1-2-3----4-|    ');
        var sourceSubs = '     ^-----------!    ';
        var published = source.pipe(
          operators_1.publishReplay(1),
          operators_1.refCount(),
          operators_1.repeat(3)
        );
        var subscriber1 = hot('a|               ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected1 = '      -1-2-3----4-(44|)';
        var subscriber2 = hot('----b|           ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected2 = '      ----23----4-(44|)';
        var subscriber3 = hot('--------c|       ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected3 = '      --------3-4-(44|)';
        expectObservable(subscriber1).toBe(expected1);
        expectObservable(subscriber2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
  });
  it('should multicast one observable to multiple observers', function (done) {
    var results1 = [];
    var results2 = [];
    var subscriptions = 0;
    var source = new rxjs_1.Observable(function (observer) {
      subscriptions++;
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);
      observer.complete();
    });
    var connectable = source.pipe(operators_1.publishReplay());
    connectable.subscribe(function (x) {
      results1.push(x);
    });
    connectable.subscribe(function (x) {
      results2.push(x);
    });
    chai_1.expect(results1).to.deep.equal([]);
    chai_1.expect(results2).to.deep.equal([]);
    connectable.connect();
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(subscriptions).to.equal(1);
    done();
  });
  it('should replay as many events as specified by the bufferSize', function (done) {
    var results1 = [];
    var results2 = [];
    var subscriptions = 0;
    var source = new rxjs_1.Observable(function (observer) {
      subscriptions++;
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);
      observer.complete();
    });
    var connectable = source.pipe(operators_1.publishReplay(2));
    connectable.subscribe(function (x) {
      results1.push(x);
    });
    chai_1.expect(results1).to.deep.equal([]);
    chai_1.expect(results2).to.deep.equal([]);
    connectable.connect();
    connectable.subscribe(function (x) {
      results2.push(x);
    });
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([3, 4]);
    chai_1.expect(subscriptions).to.equal(1);
    done();
  });
  it('should emit replayed values and resubscribe to the source when reconnected without source completion', function () {
    var results1 = [];
    var results2 = [];
    var subscriptions = 0;
    var source = new rxjs_1.Observable(function (observer) {
      subscriptions++;
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);
    });
    var connectable = source.pipe(operators_1.publishReplay(2));
    var subscription1 = connectable.subscribe(function (x) {
      results1.push(x);
    });
    chai_1.expect(results1).to.deep.equal([]);
    chai_1.expect(results2).to.deep.equal([]);
    connectable.connect().unsubscribe();
    subscription1.unsubscribe();
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([]);
    chai_1.expect(subscriptions).to.equal(1);
    var subscription2 = connectable.subscribe(function (x) {
      results2.push(x);
    });
    connectable.connect().unsubscribe();
    subscription2.unsubscribe();
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([3, 4, 1, 2, 3, 4]);
    chai_1.expect(subscriptions).to.equal(2);
  });
  it('should emit replayed values plus completed when subscribed after completed', function (done) {
    var results1 = [];
    var results2 = [];
    var subscriptions = 0;
    var source = new rxjs_1.Observable(function (observer) {
      subscriptions++;
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);
      observer.complete();
    });
    var connectable = source.pipe(operators_1.publishReplay(2));
    connectable.subscribe(function (x) {
      results1.push(x);
    });
    chai_1.expect(results1).to.deep.equal([]);
    chai_1.expect(results2).to.deep.equal([]);
    connectable.connect();
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4]);
    chai_1.expect(results2).to.deep.equal([]);
    chai_1.expect(subscriptions).to.equal(1);
    connectable.subscribe({
      next: function (x) {
        results2.push(x);
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(results2).to.deep.equal([3, 4]);
        done();
      },
    });
  });
  it('should multicast an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('|  ');
      var sourceSubs = ' (^!)';
      var published = source.pipe(operators_1.publishReplay(1));
      var expected = '   |';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should multicast a never source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('-');
      var sourceSubs = ' ^';
      var published = source.pipe(operators_1.publishReplay(1));
      var expected = '   -';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should multicast a throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('#   ');
      var sourceSubs = ' (^!)';
      var published = source.pipe(operators_1.publishReplay(1));
      var expected = '   #   ';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should mirror a simple source Observable with selector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: 2, b: 4, c: 6, d: 8 };
      var selector = function (observable) {
        return observable.pipe(
          operators_1.map(function (v) {
            return 2 * +v;
          })
        );
      };
      var source = cold('--1-2---3-4---|');
      var sourceSubs = ' ^-------------!';
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   --a-b---c-d---|';
      expectObservable(published).toBe(expected, values);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should EMIT an error when the selector throws an exception', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var error = "It's broken";
      var selector = function () {
        throw error;
      };
      var source = cold('--1-2---3-4---|');
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   #              ';
      expectObservable(published).toBe(expected, undefined, "It's broken");
    });
  });
  it('should emit an error when the selector returns an Observable that emits an error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var error = "It's broken";
      var innerObservable = cold('--5-6----#', undefined, error);
      var selector = function (observable) {
        return observable.pipe(operators_1.mergeMapTo(innerObservable));
      };
      var source = cold('--1--2---3---|');
      var sourceSubs = ' ^----------!  ';
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   ----5-65-6-#  ';
      expectObservable(published).toBe(expected, undefined, error);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should terminate immediately when the selector returns an empty Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var selector = function () {
        return rxjs_1.EMPTY;
      };
      var source = cold('--1--2---3---|');
      var sourceSubs = ' (^!)          ';
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   |             ';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should not emit and should not complete/error when the selector returns never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var selector = function () {
        return rxjs_1.NEVER;
      };
      var source = cold('-');
      var sourceSubs = ' ^';
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   -';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should emit error when the selector returns Observable.throw', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var error = "It's broken";
      var selector = function () {
        return rxjs_1.throwError(function () {
          return error;
        });
      };
      var source = cold('--1--2---3---|');
      var sourceSubs = ' (^!)          ';
      var published = source.pipe(
        operators_1.publishReplay(1, Infinity, selector)
      );
      var expected = '   #             ';
      expectObservable(published).toBe(expected, undefined, error);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should be referentially-transparent', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source1 = cold('-1-2-3-4-5-|');
      var source1Subs = ' ^----------!';
      var expected1 = '   -1-2-3-4-5-|';
      var source2 = cold('-6-7-8-9-0-|');
      var source2Subs = ' ^----------!';
      var expected2 = '   -6-7-8-9-0-|';
      var partialPipeLine = rxjs_1.pipe(operators_1.publishReplay(1));
      var published1 = source1.pipe(partialPipeLine);
      var published2 = source2.pipe(partialPipeLine);
      expectObservable(published1).toBe(expected1);
      expectSubscriptions(source1.subscriptions).toBe(source1Subs);
      expectObservable(published2).toBe(expected2);
      expectSubscriptions(source2.subscriptions).toBe(source2Subs);
      published1.connect();
      published2.connect();
    });
  });
});
//# sourceMappingURL=publishReplay-spec.js.map
