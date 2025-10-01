'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('race operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should race cold and cold', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race cold and cold and accept an Array of Observable argument', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = e1.pipe(operators_1.race([e2]));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race hot and hot', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race hot and cold', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|   ');
      var e1subs = '  ^-------------------!   ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----b-----c----|   ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race 2nd and 1st', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ------x-----y-----z----|');
      var e1subs = '  ^--!                    ';
      var e2 = cold(' ---a-----b-----c----|   ');
      var e2subs = '  ^-------------------!   ';
      var expected = '---a-----b-----c----|   ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should race emit and complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -----|                  ');
      var e1subs = '  ^----!                  ';
      var e2 = hot('  ------x-----y-----z----|');
      var e2subs = '  ^----!                  ';
      var expected = '-----|                  ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('---a-----b-----c----|   ');
      var e1subs = ' ^-----------!           ';
      var e2 = hot(' ------x-----y-----z----|');
      var e2subs = '  ^--!                   ';
      var expected = '---a-----b---          ';
      var unsub = '   ------------!          ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--^--b--c---d-| ');
      var e1subs = '       ^--------!    ';
      var e2 = hot('  ---e-^---f--g---h-|');
      var e2subs = '       ^--!    ';
      var expected = '     ---b--c---    ';
      var unsub = '        ---------!    ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.race(e2),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should never emit when given non emitting sources', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---|');
      var e2 = cold(' ---|');
      var e1subs = '  ^--!';
      var expected = '---|';
      var source = e1.pipe(operators_1.race(e2));
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should throw when error occurs mid stream', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----#              ');
      var e1subs = '  ^--------!              ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---a-----#              ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should throw when error occurs before a winner is found', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---#                    ');
      var e1subs = '  ^--!                    ';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!                    ';
      var expected = '---#                    ';
      var result = e1.pipe(operators_1.race(e2));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow observable emits immediately', function (done) {
    var e1 = rxjs_1.of(true);
    var e2 = rxjs_1.timer(200).pipe(
      operators_1.map(function (_) {
        return false;
      })
    );
    e1.pipe(operators_1.race(e2)).subscribe({
      next: function (x) {
        chai_1.expect(x).to.be.true;
      },
      error: done,
      complete: done,
    });
  });
  it('should ignore latter observables if a former one emits immediately', function () {
    var onNext = sinon.spy();
    var onSubscribe = sinon.spy();
    var e1 = rxjs_1.of('a');
    var e2 = rxjs_1.defer(onSubscribe);
    e1.pipe(operators_1.race(e2)).subscribe(onNext);
    chai_1.expect(onNext.calledWithExactly('a')).to.be.true;
    chai_1.expect(onSubscribe.called).to.be.false;
  });
  it('should ignore latter observables if a former one completes immediately', function () {
    var onComplete = sinon.spy();
    var onSubscribe = sinon.spy();
    var e1 = rxjs_1.EMPTY;
    var e2 = rxjs_1.defer(onSubscribe);
    e1.pipe(operators_1.race(e2)).subscribe({ complete: onComplete });
    chai_1.expect(onComplete.calledWithExactly()).to.be.true;
    chai_1.expect(onSubscribe.called).to.be.false;
  });
  it('should ignore latter observables if a former one errors immediately', function () {
    var onError = sinon.spy();
    var onSubscribe = sinon.spy();
    var e1 = rxjs_1.throwError(function () {
      return 'kaboom';
    });
    var e2 = rxjs_1.defer(onSubscribe);
    e1.pipe(operators_1.race(e2)).subscribe({ error: onError });
    chai_1.expect(onError.calledWithExactly('kaboom')).to.be.true;
    chai_1.expect(onSubscribe.called).to.be.false;
  });
  it('should unsubscribe former observables if a latter one emits immediately', function () {
    var onNext = sinon.spy();
    var onUnsubscribe = sinon.spy();
    var e1 = rxjs_1.NEVER.pipe(operators_1.finalize(onUnsubscribe));
    var e2 = rxjs_1.of('b');
    e1.pipe(operators_1.race(e2)).subscribe(onNext);
    chai_1.expect(onNext.calledWithExactly('b')).to.be.true;
    chai_1.expect(onUnsubscribe.calledOnce).to.be.true;
  });
  it('should unsubscribe from immediately emitting observable on unsubscription', function () {
    var onNext = sinon.spy();
    var onUnsubscribe = sinon.spy();
    var e1 = rxjs_1.NEVER.pipe(
      operators_1.startWith('a'),
      operators_1.finalize(onUnsubscribe)
    );
    var e2 = rxjs_1.NEVER;
    var subscription = e1.pipe(operators_1.race(e2)).subscribe(onNext);
    chai_1.expect(onNext.calledWithExactly('a')).to.be.true;
    chai_1.expect(onUnsubscribe.called).to.be.false;
    subscription.unsubscribe();
    chai_1.expect(onUnsubscribe.calledOnce).to.be.true;
  });
});
//# sourceMappingURL=race-legacy-spec.js.map
