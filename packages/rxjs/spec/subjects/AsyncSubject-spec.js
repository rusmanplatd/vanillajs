'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var TestObserver = (function () {
  /**
   *
   */
  function TestObserver() {
    this.results = [];
  }
  TestObserver.prototype.next = function (value) {
    this.results.push(value);
  };
  TestObserver.prototype.error = function (err) {
    this.results.push(err);
  };
  TestObserver.prototype.complete = function () {
    this.results.push('done');
  };
  return TestObserver;
})();
describe('AsyncSubject', function () {
  it('should emit the last value when complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.next(2);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal([2, 'done']);
  });
  it('should emit the last value when subscribing after complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    subject.next(1);
    subject.next(2);
    subject.complete();
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([2, 'done']);
  });
  it('should keep emitting the last value to subsequent subscriptions', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var subscription = subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.next(2);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal([2, 'done']);
    subscription.unsubscribe();
    observer.results = [];
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([2, 'done']);
  });
  it('should not emit values after complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.next(2);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    subject.next(3);
    chai_1.expect(observer.results).to.deep.equal([2, 'done']);
  });
  it('should not allow change value after complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var otherObserver = new TestObserver();
    subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal([1, 'done']);
    subject.next(2);
    subject.subscribe(otherObserver);
    chai_1.expect(otherObserver.results).to.deep.equal([1, 'done']);
  });
  it('should not emit values if unsubscribed before complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var subscription = subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.next(2);
    chai_1.expect(observer.results).to.deep.equal([]);
    subscription.unsubscribe();
    subject.next(3);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal([]);
  });
  it('should just complete if no value has been nexted into it', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal(['done']);
  });
  it('should keep emitting complete to subsequent subscriptions', function () {
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var subscription = subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.complete();
    chai_1.expect(observer.results).to.deep.equal(['done']);
    subscription.unsubscribe();
    observer.results = [];
    subject.error(new Error(''));
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal(['done']);
  });
  it('should only error if an error is passed into it', function () {
    var expected = new Error('bad');
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.error(expected);
    chai_1.expect(observer.results).to.deep.equal([expected]);
  });
  it('should keep emitting error to subsequent subscriptions', function () {
    var expected = new Error('bad');
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var subscription = subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.error(expected);
    chai_1.expect(observer.results).to.deep.equal([expected]);
    subscription.unsubscribe();
    observer.results = [];
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([expected]);
  });
  it('should not allow send complete after error', function () {
    var expected = new Error('bad');
    var subject = new rxjs_1.AsyncSubject();
    var observer = new TestObserver();
    var subscription = subject.subscribe(observer);
    subject.next(1);
    chai_1.expect(observer.results).to.deep.equal([]);
    subject.error(expected);
    chai_1.expect(observer.results).to.deep.equal([expected]);
    subscription.unsubscribe();
    observer.results = [];
    subject.complete();
    subject.subscribe(observer);
    chai_1.expect(observer.results).to.deep.equal([expected]);
  });
  it('should not be reentrant via complete', function () {
    var subject = new rxjs_1.AsyncSubject();
    var calls = 0;
    subject.subscribe({
      next: function (value) {
        calls++;
        if (calls < 2) {
          subject.complete();
        }
      },
    });
    subject.next(1);
    subject.complete();
    chai_1.expect(calls).to.equal(1);
  });
  it('should not be reentrant via next', function () {
    var subject = new rxjs_1.AsyncSubject();
    var calls = 0;
    subject.subscribe({
      next: function (value) {
        calls++;
        if (calls < 2) {
          subject.next(value + 1);
        }
      },
    });
    subject.next(1);
    subject.complete();
    chai_1.expect(calls).to.equal(1);
  });
  it('should allow reentrant subscriptions', function () {
    var subject = new rxjs_1.AsyncSubject();
    var results = [];
    subject.subscribe({
      next: function (value) {
        subject.subscribe({
          next: function (value) {
            return results.push('inner: ' + (value + value));
          },
          complete: function () {
            return results.push('inner: done');
          },
        });
        results.push('outer: ' + value);
      },
      complete: function () {
        return results.push('outer: done');
      },
    });
    subject.next(1);
    chai_1.expect(results).to.deep.equal([]);
    subject.complete();
    chai_1
      .expect(results)
      .to.deep.equal(['inner: 2', 'inner: done', 'outer: 1', 'outer: done']);
  });
});
//# sourceMappingURL=AsyncSubject-spec.js.map
