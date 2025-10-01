'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var Subject_1 = require('rxjs/internal/Subject');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('./helpers/observableMatcher');
describe('Subject', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should allow next with undefined or any when created with no type', function (done) {
    var subject = new rxjs_1.Subject();
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.be.a('undefined');
      },
      complete: done,
    });
    var data = undefined;
    subject.next(undefined);
    subject.next(data);
    subject.complete();
  });
  it('should allow empty next when created with void type', function (done) {
    var subject = new rxjs_1.Subject();
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.be.a('undefined');
      },
      complete: done,
    });
    subject.next();
    subject.complete();
  });
  it('should pump values right on through itself', function (done) {
    var subject = new rxjs_1.Subject();
    var expected = ['foo', 'bar'];
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      complete: done,
    });
    subject.next('foo');
    subject.next('bar');
    subject.complete();
  });
  it('should pump values to multiple subscribers', function (done) {
    var subject = new rxjs_1.Subject();
    var expected = ['foo', 'bar'];
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
  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject does not complete',
    function () {
      var subject = new rxjs_1.Subject();
      var results1 = [];
      var results2 = [];
      var results3 = [];
      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.next(4);
      var subscription1 = subject.subscribe({
        next: function (x) {
          results1.push(x);
        },
        error: function (e) {
          results1.push('E');
        },
        complete: function () {
          results1.push('C');
        },
      });
      subject.next(5);
      var subscription2 = subject.subscribe({
        next: function (x) {
          results2.push(x);
        },
        error: function (e) {
          results2.push('E');
        },
        complete: function () {
          results2.push('C');
        },
      });
      subject.next(6);
      subject.next(7);
      subscription1.unsubscribe();
      subject.next(8);
      subscription2.unsubscribe();
      subject.next(9);
      subject.next(10);
      var subscription3 = subject.subscribe({
        next: function (x) {
          results3.push(x);
        },
        error: function (e) {
          results3.push('E');
        },
        complete: function () {
          results3.push('C');
        },
      });
      subject.next(11);
      subscription3.unsubscribe();
      chai_1.expect(results1).to.deep.equal([5, 6, 7]);
      chai_1.expect(results2).to.deep.equal([6, 7, 8]);
      chai_1.expect(results3).to.deep.equal([11]);
    }
  );
  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject completes',
    function () {
      var subject = new rxjs_1.Subject();
      var results1 = [];
      var results2 = [];
      var results3 = [];
      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.next(4);
      var subscription1 = subject.subscribe({
        next: function (x) {
          results1.push(x);
        },
        error: function (e) {
          results1.push('E');
        },
        complete: function () {
          results1.push('C');
        },
      });
      subject.next(5);
      var subscription2 = subject.subscribe({
        next: function (x) {
          results2.push(x);
        },
        error: function (e) {
          results2.push('E');
        },
        complete: function () {
          results2.push('C');
        },
      });
      subject.next(6);
      subject.next(7);
      subscription1.unsubscribe();
      subject.complete();
      subscription2.unsubscribe();
      var subscription3 = subject.subscribe({
        next: function (x) {
          results3.push(x);
        },
        error: function (e) {
          results3.push('E');
        },
        complete: function () {
          results3.push('C');
        },
      });
      subscription3.unsubscribe();
      chai_1.expect(results1).to.deep.equal([5, 6, 7]);
      chai_1.expect(results2).to.deep.equal([6, 7, 'C']);
      chai_1.expect(results3).to.deep.equal(['C']);
    }
  );
  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject terminates with an error',
    function () {
      var subject = new rxjs_1.Subject();
      var results1 = [];
      var results2 = [];
      var results3 = [];
      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.next(4);
      var subscription1 = subject.subscribe({
        next: function (x) {
          results1.push(x);
        },
        error: function (e) {
          results1.push('E');
        },
        complete: function () {
          results1.push('C');
        },
      });
      subject.next(5);
      var subscription2 = subject.subscribe({
        next: function (x) {
          results2.push(x);
        },
        error: function (e) {
          results2.push('E');
        },
        complete: function () {
          results2.push('C');
        },
      });
      subject.next(6);
      subject.next(7);
      subscription1.unsubscribe();
      subject.error(new Error('err'));
      subscription2.unsubscribe();
      var subscription3 = subject.subscribe({
        next: function (x) {
          results3.push(x);
        },
        error: function (e) {
          results3.push('E');
        },
        complete: function () {
          results3.push('C');
        },
      });
      subscription3.unsubscribe();
      chai_1.expect(results1).to.deep.equal([5, 6, 7]);
      chai_1.expect(results2).to.deep.equal([6, 7, 'E']);
      chai_1.expect(results3).to.deep.equal(['E']);
    }
  );
  it(
    'should handle subscribers that arrive and leave at different times, ' +
      'subject completes before nexting any value',
    function () {
      var subject = new rxjs_1.Subject();
      var results1 = [];
      var results2 = [];
      var results3 = [];
      var subscription1 = subject.subscribe({
        next: function (x) {
          results1.push(x);
        },
        error: function (e) {
          results1.push('E');
        },
        complete: function () {
          results1.push('C');
        },
      });
      var subscription2 = subject.subscribe({
        next: function (x) {
          results2.push(x);
        },
        error: function (e) {
          results2.push('E');
        },
        complete: function () {
          results2.push('C');
        },
      });
      subscription1.unsubscribe();
      subject.complete();
      subscription2.unsubscribe();
      var subscription3 = subject.subscribe({
        next: function (x) {
          results3.push(x);
        },
        error: function (e) {
          results3.push('E');
        },
        complete: function () {
          results3.push('C');
        },
      });
      subscription3.unsubscribe();
      chai_1.expect(results1).to.deep.equal([]);
      chai_1.expect(results2).to.deep.equal(['C']);
      chai_1.expect(results3).to.deep.equal(['C']);
    }
  );
  it('should disallow new subscriber once subject has been disposed', function () {
    var subject = new rxjs_1.Subject();
    var results1 = [];
    var results2 = [];
    var results3 = [];
    var subscription1 = subject.subscribe({
      next: function (x) {
        results1.push(x);
      },
      error: function (e) {
        results1.push('E');
      },
      complete: function () {
        results1.push('C');
      },
    });
    subject.next(1);
    subject.next(2);
    var subscription2 = subject.subscribe({
      next: function (x) {
        results2.push(x);
      },
      error: function (e) {
        results2.push('E');
      },
      complete: function () {
        results2.push('C');
      },
    });
    subject.next(3);
    subject.next(4);
    subject.next(5);
    subscription1.unsubscribe();
    subscription2.unsubscribe();
    subject.unsubscribe();
    chai_1
      .expect(function () {
        subject.subscribe({
          next: function (x) {
            results3.push(x);
          },
          error: function (err) {
            chai_1
              .expect(false)
              .to.equal('should not throw error: ' + err.toString());
          },
        });
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
    chai_1.expect(results1).to.deep.equal([1, 2, 3, 4, 5]);
    chai_1.expect(results2).to.deep.equal([3, 4, 5]);
    chai_1.expect(results3).to.deep.equal([]);
  });
  it('should not allow values to be nexted after it is unsubscribed', function (done) {
    var subject = new rxjs_1.Subject();
    var expected = ['foo'];
    subject.subscribe(function (x) {
      chai_1.expect(x).to.equal(expected.shift());
    });
    subject.next('foo');
    subject.unsubscribe();
    chai_1
      .expect(function () {
        return subject.next('bar');
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
    done();
  });
  it('should clean out unsubscribed subscribers', function (done) {
    var subject = new rxjs_1.Subject();
    var sub1 = subject.subscribe(function (x) {});
    var sub2 = subject.subscribe(function (x) {});
    chai_1.expect(subject.observers.length).to.equal(2);
    sub1.unsubscribe();
    chai_1.expect(subject.observers.length).to.equal(1);
    sub2.unsubscribe();
    chai_1.expect(subject.observers.length).to.equal(0);
    done();
  });
  it('should expose observed status', function () {
    var subject = new rxjs_1.Subject();
    chai_1.expect(subject.observed).to.equal(false);
    var sub1 = subject.subscribe(function (x) {});
    chai_1.expect(subject.observed).to.equal(true);
    var sub2 = subject.subscribe(function (x) {});
    chai_1.expect(subject.observed).to.equal(true);
    sub1.unsubscribe();
    chai_1.expect(subject.observed).to.equal(true);
    sub2.unsubscribe();
    chai_1.expect(subject.observed).to.equal(false);
    subject.unsubscribe();
    chai_1.expect(subject.observed).to.equal(false);
  });
  it('should have a static create function that works', function () {
    chai_1.expect(rxjs_1.Subject.create).to.be.a('function');
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var nexts = [];
    var output = [];
    var error;
    var complete = false;
    var outputComplete = false;
    var destination = {
      closed: false,
      next: function (x) {
        nexts.push(x);
      },
      error: function (err) {
        error = err;
        this.closed = true;
      },
      complete: function () {
        complete = true;
        this.closed = true;
      },
    };
    var sub = rxjs_1.Subject.create(destination, source);
    sub.subscribe({
      next: function (x) {
        output.push(x);
      },
      complete: function () {
        outputComplete = true;
      },
    });
    sub.next('a');
    sub.next('b');
    sub.next('c');
    sub.complete();
    chai_1.expect(nexts).to.deep.equal(['a', 'b', 'c']);
    chai_1.expect(complete).to.be.true;
    chai_1.expect(error).to.be.a('undefined');
    chai_1.expect(output).to.deep.equal([1, 2, 3, 4, 5]);
    chai_1.expect(outputComplete).to.be.true;
  });
  it('should have a static create function that works also to raise errors', function () {
    chai_1.expect(rxjs_1.Subject.create).to.be.a('function');
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var nexts = [];
    var output = [];
    var error;
    var complete = false;
    var outputComplete = false;
    var destination = {
      closed: false,
      next: function (x) {
        nexts.push(x);
      },
      error: function (err) {
        error = err;
        this.closed = true;
      },
      complete: function () {
        complete = true;
        this.closed = true;
      },
    };
    var sub = rxjs_1.Subject.create(destination, source);
    sub.subscribe({
      next: function (x) {
        output.push(x);
      },
      complete: function () {
        outputComplete = true;
      },
    });
    sub.next('a');
    sub.next('b');
    sub.next('c');
    sub.error('boom');
    chai_1.expect(nexts).to.deep.equal(['a', 'b', 'c']);
    chai_1.expect(complete).to.be.false;
    chai_1.expect(error).to.equal('boom');
    chai_1.expect(output).to.deep.equal([1, 2, 3, 4, 5]);
    chai_1.expect(outputComplete).to.be.true;
  });
  it('should be an Observer which can be given to Observable.subscribe', function (done) {
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var subject = new rxjs_1.Subject();
    var expected = [1, 2, 3, 4, 5];
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
    source.subscribe(subject);
  });
  it('should be usable as an Observer of a finite delayed Observable', function (done) {
    var source = rxjs_1.of(1, 2, 3).pipe(operators_1.delay(50));
    var subject = new rxjs_1.Subject();
    var expected = [1, 2, 3];
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
    source.subscribe(subject);
  });
  it('should throw ObjectUnsubscribedError when emit after unsubscribed', function () {
    var subject = new rxjs_1.Subject();
    subject.unsubscribe();
    chai_1
      .expect(function () {
        subject.next('a');
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
    chai_1
      .expect(function () {
        subject.error('a');
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
    chai_1
      .expect(function () {
        subject.complete();
      })
      .to.throw(rxjs_1.ObjectUnsubscribedError);
  });
  it('should not next after completed', function () {
    var subject = new rxjs_1.Subject();
    var results = [];
    subject.subscribe({
      next: function (x) {
        return results.push(x);
      },
      complete: function () {
        return results.push('C');
      },
    });
    subject.next('a');
    subject.complete();
    subject.next('b');
    chai_1.expect(results).to.deep.equal(['a', 'C']);
  });
  it('should not next after error', function () {
    var error = new Error('wut?');
    var subject = new rxjs_1.Subject();
    var results = [];
    subject.subscribe({
      next: function (x) {
        return results.push(x);
      },
      error: function (err) {
        return results.push(err);
      },
    });
    subject.next('a');
    subject.error(error);
    subject.next('b');
    chai_1.expect(results).to.deep.equal(['a', error]);
  });
  describe('asObservable', function () {
    it('should hide subject', function () {
      var subject = new rxjs_1.Subject();
      var observable = subject.asObservable();
      chai_1.expect(subject).not.to.equal(observable);
      chai_1.expect(observable instanceof rxjs_1.Observable).to.be.true;
      chai_1.expect(observable instanceof rxjs_1.Subject).to.be.false;
    });
    it('should handle subject never emits', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var observable = hot('-').asObservable();
        expectObservable(observable).toBe('-');
      });
    });
    it('should handle subject completes without emits', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var observable = hot('--^--|').asObservable();
        var expected = '        ---|';
        expectObservable(observable).toBe(expected);
      });
    });
    it('should handle subject throws', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var observable = hot('--^--#').asObservable();
        var expected = '        ---#';
        expectObservable(observable).toBe(expected);
      });
    });
    it('should handle subject emits', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var observable = hot('--^--x--|').asObservable();
        var expected = '        ---x--|';
        expectObservable(observable).toBe(expected);
      });
    });
    it('should work with inherited subject', function () {
      var results = [];
      var subject = new rxjs_1.AsyncSubject();
      subject.next(42);
      subject.complete();
      var observable = subject.asObservable();
      observable.subscribe({
        next: function (x) {
          return results.push(x);
        },
        complete: function () {
          return results.push('done');
        },
      });
      chai_1.expect(results).to.deep.equal([42, 'done']);
    });
  });
  describe('error thrown scenario', function () {
    afterEach(function () {
      rxjs_1.config.onUnhandledError = null;
    });
    it('should not synchronously error when nexted into', function (done) {
      rxjs_1.config.onUnhandledError = function (err) {
        chai_1.expect(err.message).to.equal('Boom!');
        done();
      };
      var source = new rxjs_1.Subject();
      source.subscribe();
      source.subscribe(function () {
        throw new Error('Boom!');
      });
      source.subscribe();
      try {
        source.next(42);
      } catch (err) {
        chai_1.expect(true).to.be.false;
      }
      chai_1.expect(true).to.be.true;
    });
  });
});
describe('AnonymousSubject', function () {
  it('should be exposed', function () {
    chai_1.expect(Subject_1.AnonymousSubject).to.be.a('function');
  });
  it('should not be eager', function () {
    var subscribed = false;
    var subject = rxjs_1.Subject.create(
      null,
      new rxjs_1.Observable(function (observer) {
        subscribed = true;
        var subscription = rxjs_1.of('x').subscribe(observer);
        return function () {
          subscription.unsubscribe();
        };
      })
    );
    var observable = subject.asObservable();
    chai_1.expect(subscribed).to.be.false;
    observable.subscribe();
    chai_1.expect(subscribed).to.be.true;
  });
});
describe('useDeprecatedSynchronousErrorHandling', function () {
  beforeEach(function () {
    rxjs_1.config.useDeprecatedSynchronousErrorHandling = true;
  });
  afterEach(function () {
    rxjs_1.config.useDeprecatedSynchronousErrorHandling = false;
  });
  it('should throw an error when nexting with a flattened, erroring inner observable', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.mergeMap(function () {
          return rxjs_1.throwError(function () {
            return new Error('bad');
          });
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.next('wee');
      })
      .to.throw(Error, 'bad');
  });
  it('should throw an error when nexting with a flattened, erroring inner observable with more than one operator', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.mergeMap(function () {
          return rxjs_1.throwError(function () {
            return new Error('bad');
          });
        }),
        operators_1.map(function (x) {
          return x;
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.next('wee');
      })
      .to.throw(Error, 'bad');
  });
  it('should throw an error when notifying an error with catchError returning an erroring inner observable', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.catchError(function () {
          return rxjs_1.throwError(function () {
            return new Error('bad');
          });
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.error('wee');
      })
      .to.throw(Error, 'bad');
  });
  it('should throw an error when nexting with an operator that errors synchronously', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.mergeMap(function () {
          throw new Error('lol');
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.next('wee');
      })
      .to.throw(Error, 'lol');
  });
  it('should throw an error when notifying an error with a catchError that errors synchronously', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.catchError(function () {
          throw new Error('lol');
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.error('wee');
      })
      .to.throw(Error, 'lol');
  });
  it('should throw an error when nexting with an erroring next handler', function () {
    var subject = new rxjs_1.Subject();
    subject.subscribe(function () {
      throw new Error('lol');
    });
    chai_1
      .expect(function () {
        subject.next('wee');
      })
      .to.throw(Error, 'lol');
  });
  it('should throw an error when notifying with an erroring error handler', function () {
    var subject = new rxjs_1.Subject();
    subject.subscribe({
      error: function () {
        throw new Error('lol');
      },
    });
    chai_1
      .expect(function () {
        subject.error('wee');
      })
      .to.throw(Error, 'lol');
  });
  it('should throw an error when notifying with an erroring complete handler', function () {
    var subject = new rxjs_1.Subject();
    subject.subscribe({
      complete: function () {
        throw new Error('lol');
      },
    });
    chai_1
      .expect(function () {
        subject.complete();
      })
      .to.throw(Error, 'lol');
  });
  it('should throw an error when notifying an complete, and concatenated with another observable that synchronously errors', function () {
    var subject = new rxjs_1.Subject();
    rxjs_1.concat(subject, rxjs_1.throwError(new Error('lol'))).subscribe();
    chai_1
      .expect(function () {
        subject.complete();
      })
      .to.throw(Error, 'lol');
  });
  it('should not throw on second error passed', function () {
    var subject = new rxjs_1.Subject();
    subject.subscribe();
    chai_1
      .expect(function () {
        subject.error(new Error('one'));
      })
      .to.throw(Error, 'one');
    chai_1
      .expect(function () {
        subject.error(new Error('two'));
      })
      .not.to.throw(Error, 'two');
  });
  it('should not throw on second error passed, even after having been operated on', function () {
    var subject = new rxjs_1.Subject();
    subject
      .pipe(
        operators_1.mergeMap(function (x) {
          return [x];
        })
      )
      .subscribe();
    chai_1
      .expect(function () {
        subject.error(new Error('one'));
      })
      .to.throw(Error, 'one');
    chai_1
      .expect(function () {
        subject.error('two');
      })
      .not.to.throw();
  });
  it('deep rethrowing 1', function () {
    var subject1 = new rxjs_1.Subject();
    var subject2 = new rxjs_1.Subject();
    subject2.subscribe();
    subject1.subscribe({
      next: function () {
        return subject2.error(new Error('hahaha'));
      },
    });
    chai_1
      .expect(function () {
        subject1.next('test');
      })
      .to.throw(Error, 'hahaha');
  });
  it('deep rethrowing 2', function () {
    var subject1 = new rxjs_1.Subject();
    subject1.subscribe({
      next: function () {
        rxjs_1.throwError(new Error('hahaha')).subscribe();
      },
    });
    chai_1
      .expect(function () {
        subject1.next('test');
      })
      .to.throw(Error, 'hahaha');
  });
});
//# sourceMappingURL=Subject-spec.js.map
