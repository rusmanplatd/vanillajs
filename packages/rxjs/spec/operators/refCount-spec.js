'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('refCount', function () {
  it('should turn a multicasted Observable an automatically (dis)connecting hot one', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1-2---3-4--5-|');
      var e1Subs = '  ^--------------!';
      var expected = '--1-2---3-4--5-|';
      var result = e1.pipe(operators_1.publish(), operators_1.refCount());
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1Subs);
    });
  });
  it('should count references', function () {
    var connectable = rxjs_1.NEVER.pipe(operators_1.publish());
    var refCounted = connectable.pipe(operators_1.refCount());
    var sub1 = refCounted.subscribe({
      next: rxjs_1.noop,
    });
    var sub2 = refCounted.subscribe({
      next: rxjs_1.noop,
    });
    var sub3 = refCounted.subscribe({
      next: rxjs_1.noop,
    });
    chai_1.expect(connectable._refCount).to.equal(3);
    sub1.unsubscribe();
    sub2.unsubscribe();
    sub3.unsubscribe();
  });
  it('should unsub from the source when all other subscriptions are unsubbed', function (done) {
    var unsubscribeCalled = false;
    var connectable = new rxjs_1.Observable(function (observer) {
      observer.next(true);
      return function () {
        unsubscribeCalled = true;
      };
    }).pipe(operators_1.publish());
    var refCounted = connectable.pipe(operators_1.refCount());
    var sub1 = refCounted.subscribe(function () {});
    var sub2 = refCounted.subscribe(function () {});
    var sub3 = refCounted.subscribe(function () {
      chai_1.expect(connectable._refCount).to.equal(1);
    });
    sub1.unsubscribe();
    sub2.unsubscribe();
    sub3.unsubscribe();
    chai_1.expect(connectable._refCount).to.equal(0);
    chai_1.expect(unsubscribeCalled).to.be.true;
    done();
  });
  it('should not unsubscribe when a subscriber synchronously unsubscribes if other subscribers are present', function () {
    var unsubscribeCalled = false;
    var connectable = new rxjs_1.Observable(function (observer) {
      observer.next(true);
      return function () {
        unsubscribeCalled = true;
      };
    }).pipe(operators_1.publishReplay(1));
    var refCounted = connectable.pipe(operators_1.refCount());
    refCounted.subscribe();
    refCounted.subscribe().unsubscribe();
    chai_1.expect(connectable._refCount).to.equal(1);
    chai_1.expect(unsubscribeCalled).to.be.false;
  });
  it('should not unsubscribe when a subscriber synchronously unsubscribes if other subscribers are present and the source is a Subject', function () {
    var arr = [];
    var subject = new rxjs_1.Subject();
    var connectable = subject.pipe(operators_1.publishReplay(1));
    var refCounted = connectable.pipe(operators_1.refCount());
    refCounted.subscribe(function (val) {
      arr.push(val);
    });
    subject.next('the number one');
    refCounted.pipe(operators_1.first()).subscribe().unsubscribe();
    subject.next('the number two');
    chai_1.expect(connectable._refCount).to.equal(1);
    chai_1.expect(arr[0]).to.equal('the number one');
    chai_1.expect(arr[1]).to.equal('the number two');
  });
});
//# sourceMappingURL=refCount-spec.js.map
