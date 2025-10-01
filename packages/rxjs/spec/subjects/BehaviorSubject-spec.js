'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var interop_helper_1 = require('../helpers/interop-helper');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('BehaviorSubject', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should extend Subject', function () {
    var subject = new rxjs_1.BehaviorSubject(null);
    chai_1.expect(subject).to.be.instanceof(rxjs_1.Subject);
  });
  it('should throw if it has received an error and getValue() is called', function () {
    var subject = new rxjs_1.BehaviorSubject(null);
    subject.error(new Error('derp'));
    chai_1
      .expect(function () {
        subject.getValue();
      })
      .to.throw(Error, 'derp');
  });
  it('should throw an ObjectUnsubscribedError if getValue() is called and the BehaviorSubject has been unsubscribed', function () {
    var subject = new rxjs_1.BehaviorSubject('hi there');
    subject.unsubscribe();
    chai_1
      .expect(function () {
        subject.getValue();
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
  });
  it('should have a getValue() method to retrieve the current value', function () {
    var subject = new rxjs_1.BehaviorSubject('staltz');
    chai_1.expect(subject.getValue()).to.equal('staltz');
    subject.next('oj');
    chai_1.expect(subject.getValue()).to.equal('oj');
  });
  it('should not allow you to set `value` directly', function () {
    var subject = new rxjs_1.BehaviorSubject('flibberty');
    try {
      subject.value = 'jibbets';
    } catch (e) {}
    chai_1.expect(subject.getValue()).to.equal('flibberty');
    chai_1.expect(subject.value).to.equal('flibberty');
  });
  it('should still allow you to retrieve the value from the value property', function () {
    var subject = new rxjs_1.BehaviorSubject('fuzzy');
    chai_1.expect(subject.value).to.equal('fuzzy');
    subject.next('bunny');
    chai_1.expect(subject.value).to.equal('bunny');
  });
  it('should start with an initialization value', function (done) {
    var subject = new rxjs_1.BehaviorSubject('foo');
    var expected = ['foo', 'bar'];
    var i = 0;
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected[i++]);
      },
      complete: done,
    });
    subject.next('bar');
    subject.complete();
  });
  it('should pump values to multiple subscribers', function (done) {
    var subject = new rxjs_1.BehaviorSubject('init');
    var expected = ['init', 'foo', 'bar'];
    var i = 0;
    var j = 0;
    subject.subscribe(function (x) {
      chai_1.expect(x).to.equal(expected[i++]);
    });
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected[j++]);
      },
      complete: done,
    });
    chai_1.expect(subject.observers.length).to.equal(2);
    subject.next('foo');
    subject.next('bar');
    subject.complete();
  });
  it('should not pass values nexted after a complete', function () {
    var subject = new rxjs_1.BehaviorSubject('init');
    var results = [];
    subject.subscribe(function (x) {
      results.push(x);
    });
    chai_1.expect(results).to.deep.equal(['init']);
    subject.next('foo');
    chai_1.expect(results).to.deep.equal(['init', 'foo']);
    subject.complete();
    chai_1.expect(results).to.deep.equal(['init', 'foo']);
    subject.next('bar');
    chai_1.expect(results).to.deep.equal(['init', 'foo']);
  });
  it('should clean out unsubscribed subscribers', function (done) {
    var subject = new rxjs_1.BehaviorSubject('init');
    var sub1 = subject.subscribe(function (x) {
      chai_1.expect(x).to.equal('init');
    });
    var sub2 = subject.subscribe(function (x) {
      chai_1.expect(x).to.equal('init');
    });
    chai_1.expect(subject.observers.length).to.equal(2);
    sub1.unsubscribe();
    chai_1.expect(subject.observers.length).to.equal(1);
    sub2.unsubscribe();
    chai_1.expect(subject.observers.length).to.equal(0);
    done();
  });
  it('should replay the previous value when subscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var behaviorSubject = new rxjs_1.BehaviorSubject('0');
      /**
       *
       * @param x
       */
      function feedNextIntoSubject(x) {
        behaviorSubject.next(x);
      }
      /**
       *
       * @param err
       */
      function feedErrorIntoSubject(err) {
        behaviorSubject.error(err);
      }
      /**
       *
       */
      function feedCompleteIntoSubject() {
        behaviorSubject.complete();
      }
      var sourceTemplate = ' -1-2-3----4------5-6---7--8----9--|';
      var subscriber1 = hot('------(a|)                         ').pipe(
        operators_1.mergeMapTo(behaviorSubject)
      );
      var unsub1 = '         ---------------------!             ';
      var expected1 = '      ------3---4------5-6--             ';
      var subscriber2 = hot('------------(b|)                   ').pipe(
        operators_1.mergeMapTo(behaviorSubject)
      );
      var unsub2 = '         -------------------------!         ';
      var expected2 = '      ------------4----5-6---7--         ';
      var subscriber3 = hot('---------------------------(c|)    ').pipe(
        operators_1.mergeMapTo(behaviorSubject)
      );
      var expected3 = '      ---------------------------8---9--|';
      expectObservable(
        hot(sourceTemplate).pipe(
          operators_1.tap({
            next: feedNextIntoSubject,
            error: feedErrorIntoSubject,
            complete: feedCompleteIntoSubject,
          })
        )
      ).toBe(sourceTemplate);
      expectObservable(subscriber1, unsub1).toBe(expected1);
      expectObservable(subscriber2, unsub2).toBe(expected2);
      expectObservable(subscriber3).toBe(expected3);
    });
  });
  it('should emit complete when subscribed after completed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var behaviorSubject = new rxjs_1.BehaviorSubject('0');
      /**
       *
       * @param x
       */
      function feedNextIntoSubject(x) {
        behaviorSubject.next(x);
      }
      /**
       *
       * @param err
       */
      function feedErrorIntoSubject(err) {
        behaviorSubject.error(err);
      }
      /**
       *
       */
      function feedCompleteIntoSubject() {
        behaviorSubject.complete();
      }
      var sourceTemplate = ' -1-2-3--4--|       ';
      var subscriber1 = hot('---------------(a|)').pipe(
        operators_1.mergeMapTo(behaviorSubject)
      );
      var expected1 = '      ---------------|   ';
      expectObservable(
        hot(sourceTemplate).pipe(
          operators_1.tap({
            next: feedNextIntoSubject,
            error: feedErrorIntoSubject,
            complete: feedCompleteIntoSubject,
          })
        )
      ).toBe(sourceTemplate);
      expectObservable(subscriber1).toBe(expected1);
    });
  });
  it('should be an Observer which can be given to Observable.subscribe', function (done) {
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var subject = new rxjs_1.BehaviorSubject(0);
    var expected = [0, 1, 2, 3, 4, 5];
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(subject.value).to.equal(5);
        done();
      },
    });
    source.subscribe(subject);
  });
  it('should be an Observer which can be given to an interop source', function (done) {
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var subject = new rxjs_1.BehaviorSubject(0);
    var expected = [0, 1, 2, 3, 4, 5];
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(subject.value).to.equal(5);
        done();
      },
    });
    source.subscribe(interop_helper_1.asInteropSubject(subject));
  });
});
//# sourceMappingURL=BehaviorSubject-spec.js.map
