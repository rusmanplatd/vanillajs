'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('tap', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should mirror multiple values and complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^----------!';
      var expected = '--1--2--3--|';
      var result = e1.pipe(operators_1.tap(function () {}));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should next with a callback', function () {
    var value = null;
    rxjs_1
      .of(42)
      .pipe(
        operators_1.tap(function (x) {
          value = x;
        })
      )
      .subscribe();
    chai_1.expect(value).to.equal(42);
  });
  it('should error with a callback', function () {
    var err = null;
    rxjs_1
      .throwError(function () {
        return 'bad';
      })
      .pipe(
        operators_1.tap({
          error: function (x) {
            err = x;
          },
        })
      )
      .subscribe({
        error: function (ex) {
          chai_1.expect(ex).to.equal('bad');
        },
      });
    chai_1.expect(err).to.equal('bad');
  });
  it('should handle everything with an observer', function (done) {
    var expected = [1, 2, 3];
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.tap({
          next: function (x) {
            results.push(x);
          },
          error: function () {
            done(new Error('should not be called'));
          },
          complete: function () {
            chai_1.expect(results).to.deep.equal(expected);
            done();
          },
        })
      )
      .subscribe();
  });
  it('should handle everything with a Subject', function (done) {
    var expected = [1, 2, 3];
    var results = [];
    var subject = new rxjs_1.Subject();
    subject.subscribe({
      next: function (x) {
        results.push(x);
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(results).to.deep.equal(expected);
        done();
      },
    });
    rxjs_1.of(1, 2, 3).pipe(operators_1.tap(subject)).subscribe();
  });
  it('should handle an error with a callback', function () {
    var errored = false;
    rxjs_1
      .throwError(function () {
        return 'bad';
      })
      .pipe(
        operators_1.tap({
          error: function (err) {
            chai_1.expect(err).to.equal('bad');
          },
        })
      )
      .subscribe({
        error: function (err) {
          errored = true;
          chai_1.expect(err).to.equal('bad');
        },
      });
    chai_1.expect(errored).to.be.true;
  });
  it('should handle an error with observer', function () {
    var errored = false;
    rxjs_1
      .throwError(function () {
        return 'bad';
      })
      .pipe(
        operators_1.tap({
          error: function (err) {
            chai_1.expect(err).to.equal('bad');
          },
        })
      )
      .subscribe({
        error: function (err) {
          errored = true;
          chai_1.expect(err).to.equal('bad');
        },
      });
    chai_1.expect(errored).to.be.true;
  });
  it('should handle complete with observer', function () {
    var completed = false;
    rxjs_1.EMPTY.pipe(
      operators_1.tap({
        complete: function () {
          completed = true;
        },
      })
    ).subscribe();
    chai_1.expect(completed).to.be.true;
  });
  it('should handle next with observer', function () {
    var value = null;
    rxjs_1
      .of('hi')
      .pipe(
        operators_1.tap({
          next: function (x) {
            value = x;
          },
        })
      )
      .subscribe();
    chai_1.expect(value).to.equal('hi');
  });
  it('should raise error if next handler raises error', function () {
    rxjs_1
      .of('hi')
      .pipe(
        operators_1.tap({
          next: function () {
            throw new Error('bad');
          },
        })
      )
      .subscribe({
        error: function (err) {
          chai_1.expect(err.message).to.equal('bad');
        },
      });
  });
  it('should raise error if error handler raises error', function () {
    rxjs_1
      .throwError(function () {
        return 'ops';
      })
      .pipe(
        operators_1.tap({
          error: function () {
            throw new Error('bad');
          },
        })
      )
      .subscribe({
        error: function (err) {
          chai_1.expect(err.message).to.equal('bad');
        },
      });
  });
  it('should raise error if complete handler raises error', function () {
    rxjs_1.EMPTY.pipe(
      operators_1.tap({
        complete: function () {
          throw new Error('bad');
        },
      })
    ).subscribe({
      error: function (err) {
        chai_1.expect(err.message).to.equal('bad');
      },
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --1--2--3--#');
      var unsub = '   -------!    ';
      var e1subs = '  ^------!    ';
      var expected = '--1--2--    ';
      var result = e1.pipe(operators_1.tap(function () {}));
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --1--2--3--#');
      var e1subs = '  ^------!    ';
      var expected = '--1--2--    ';
      var unsub = '   -------!    ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.tap(function () {}),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mirror multiple values and complete', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--|');
      var e1subs = '  ^----------!';
      var expected = '--1--2--3--|';
      var result = e1.pipe(operators_1.tap(function () {}));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should mirror multiple values and terminate with error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' --1--2--3--#');
      var e1subs = '  ^----------!';
      var expected = '--1--2--3--#';
      var result = e1.pipe(operators_1.tap(function () {}));
      expectObservable(result).toBe(expected);
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
      .pipe(
        operators_1.tap(function () {}),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  describe('lifecycle handlers', function () {
    it('should support an unsubscribe event that fires before finalize', function () {
      var results = [];
      var subject = new rxjs_1.Subject();
      var subscription = subject
        .pipe(
          operators_1.tap({
            subscribe: function () {
              return results.push('subscribe');
            },
            next: function (value) {
              return results.push('next ' + value);
            },
            error: function (err) {
              return results.push('error: ' + err.message);
            },
            complete: function () {
              return results.push('complete');
            },
            unsubscribe: function () {
              return results.push('unsubscribe');
            },
            finalize: function () {
              return results.push('finalize');
            },
          })
        )
        .subscribe();
      subject.next(1);
      subject.next(2);
      chai_1.expect(results).to.deep.equal(['subscribe', 'next 1', 'next 2']);
      subscription.unsubscribe();
      chai_1
        .expect(results)
        .to.deep.equal([
          'subscribe',
          'next 1',
          'next 2',
          'unsubscribe',
          'finalize',
        ]);
    });
    it('should not call unsubscribe if source completes', function () {
      var results = [];
      var subject = new rxjs_1.Subject();
      var subscription = subject
        .pipe(
          operators_1.tap({
            subscribe: function () {
              return results.push('subscribe');
            },
            next: function (value) {
              return results.push('next ' + value);
            },
            error: function (err) {
              return results.push('error: ' + err.message);
            },
            complete: function () {
              return results.push('complete');
            },
            unsubscribe: function () {
              return results.push('unsubscribe');
            },
            finalize: function () {
              return results.push('finalize');
            },
          })
        )
        .subscribe();
      subject.next(1);
      subject.next(2);
      chai_1.expect(results).to.deep.equal(['subscribe', 'next 1', 'next 2']);
      subject.complete();
      subscription.unsubscribe();
      chai_1
        .expect(results)
        .to.deep.equal([
          'subscribe',
          'next 1',
          'next 2',
          'complete',
          'finalize',
        ]);
    });
    it('should not call unsubscribe if source errors', function () {
      var results = [];
      var subject = new rxjs_1.Subject();
      var subscription = subject
        .pipe(
          operators_1.tap({
            subscribe: function () {
              return results.push('subscribe');
            },
            next: function (value) {
              return results.push('next ' + value);
            },
            error: function (err) {
              return results.push('error: ' + err.message);
            },
            complete: function () {
              return results.push('complete');
            },
            unsubscribe: function () {
              return results.push('unsubscribe');
            },
            finalize: function () {
              return results.push('finalize');
            },
          })
        )
        .subscribe({
          error: rxjs_1.noop,
        });
      subject.next(1);
      subject.next(2);
      chai_1.expect(results).to.deep.equal(['subscribe', 'next 1', 'next 2']);
      subject.error(new Error('bad'));
      subscription.unsubscribe();
      chai_1
        .expect(results)
        .to.deep.equal([
          'subscribe',
          'next 1',
          'next 2',
          'error: bad',
          'finalize',
        ]);
    });
  });
});
//# sourceMappingURL=tap-spec.js.map
