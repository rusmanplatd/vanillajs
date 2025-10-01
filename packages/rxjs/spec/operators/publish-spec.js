'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('publish operator', function () {
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
      var published = source.pipe(operators_1.publish());
      var expected = '   --1-2---3-4--5-|';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should return a ConnectableObservable-ish', function () {
    var source = rxjs_1.of(1).pipe(operators_1.publish());
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
      var published = source.pipe(operators_1.publish());
      var expected = '   -               ';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should multicast the same values to multiple observers', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('   -1-2-3----4-|');
      var sourceSubs = '    ^-----------!';
      var published = source.pipe(operators_1.publish());
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----4-|';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      -----3----4-|';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      ----------4-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
    });
  });
  it('should accept selectors', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('     -1-2-3----4-|');
      var sourceSubs = [
        '                      ^-----------!',
        '                      ----^-------!',
        '                      --------^---!',
      ];
      var published = source.pipe(
        operators_1.publish(function (x) {
          return x.pipe(
            operators_1.zip(x, function (a, b) {
              return (parseInt(a) + parseInt(b)).toString();
            })
          );
        })
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -2-4-6----8-|';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      -----6----8-|';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      ----------8-|';
      expectObservable(subscriber1).toBe(expected1);
      expectObservable(subscriber2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
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
      var published = source.pipe(operators_1.publish());
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----4-#';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      -----3----4-#';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      ----------4-#';
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
      var published = source.pipe(operators_1.publish());
      var unsub = '          ---------u   ';
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      -----3----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      ----------   ';
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
        operators_1.publish()
      );
      var subscriber1 = hot('a|           ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected1 = '      -1-2-3----   ';
      var subscriber2 = hot('----b|       ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected2 = '      -----3----   ';
      var subscriber3 = hot('--------c|   ').pipe(
        operators_1.mergeMapTo(published)
      );
      var expected3 = '      ----------   ';
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
          operators_1.publish(),
          operators_1.refCount()
        );
        var subscriber1 = hot('---a|           ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected1 = '      ----1-2-3----4-|';
        var subscriber2 = hot('-------b|       ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected2 = '      --------3----4-|';
        var subscriber3 = hot('-----------c|   ').pipe(
          operators_1.mergeMapTo(replayed)
        );
        var expected3 = '      -------------4-|';
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
          operators_1.publish(),
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
        var expected2 = '      --------3----   ';
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
        var source = cold('   -1-2-3----4-#');
        var sourceSubs = '    ^-----------!';
        var published = source.pipe(
          operators_1.publish(),
          operators_1.refCount(),
          operators_1.retry(3)
        );
        var subscriber1 = hot('a|           ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected1 = '      -1-2-3----4-#';
        var subscriber2 = hot('----b|       ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected2 = '      -----3----4-#';
        var subscriber3 = hot('--------c|   ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected3 = '      ----------4-#';
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
        var source = cold('    -1-2-3----4-|');
        var sourceSubs = '     ^-----------!';
        var published = source.pipe(
          operators_1.publish(),
          operators_1.refCount(),
          operators_1.repeat(3)
        );
        var subscriber1 = hot('a|           ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected1 = '      -1-2-3----4-|';
        var subscriber2 = hot('----b|       ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected2 = '      -----3----4-|';
        var subscriber3 = hot('--------c|   ').pipe(
          operators_1.mergeMapTo(published)
        );
        var expected3 = '      ----------4-|';
        expectObservable(subscriber1).toBe(expected1);
        expectObservable(subscriber2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
        expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      });
    });
  });
  it('should emit completed when subscribed after completed', function (done) {
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
    var connectable = source.pipe(operators_1.publish());
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
        chai_1.expect(results2).to.deep.equal([]);
        done();
      },
    });
  });
  it('should multicast an empty source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('|   ');
      var sourceSubs = ' (^!)';
      var published = source.pipe(operators_1.publish());
      var expected = '   |   ';
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
      var published = source.pipe(operators_1.publish());
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
      var published = source.pipe(operators_1.publish());
      var expected = '   #   ';
      expectObservable(published).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      published.connect();
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
    var connectable = source.pipe(operators_1.publish());
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
  it('should be referentially-transparent', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source1 = cold('-1-2-3-4-5-|');
      var source1Subs = ' ^----------!';
      var expected1 = '   -1-2-3-4-5-|';
      var source2 = cold('-6-7-8-9-0-|');
      var source2Subs = ' ^----------!';
      var expected2 = '   -6-7-8-9-0-|';
      var partialPipeLine = rxjs_1.pipe(operators_1.publish());
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
//# sourceMappingURL=publish-spec.js.map
