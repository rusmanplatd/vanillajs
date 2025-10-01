'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var rxjs_1 = require('rxjs');
var interop_helper_1 = require('../helpers/interop-helper');
describe('finalize', function () {
  it('should call finalize after complete', function (done) {
    var completed = false;
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.finalize(function () {
          chai_1.expect(completed).to.be.true;
          done();
        })
      )
      .subscribe({
        complete: function () {
          completed = true;
        },
      });
  });
  it('should call finalize after error', function (done) {
    var thrown = false;
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.map(function (x) {
          if (x === 3) {
            throw x;
          }
          return x;
        }),
        operators_1.finalize(function () {
          chai_1.expect(thrown).to.be.true;
          done();
        })
      )
      .subscribe({
        error: function () {
          thrown = true;
        },
      });
  });
  it('should call finalize upon disposal', function (done) {
    var disposed = false;
    var subscription = rxjs_1
      .timer(100)
      .pipe(
        operators_1.finalize(function () {
          chai_1.expect(disposed).to.be.true;
          done();
        })
      )
      .subscribe();
    disposed = true;
    subscription.unsubscribe();
  });
  it('should call finalize when synchronously subscribing to and unsubscribing from a shared Observable', function (done) {
    rxjs_1
      .interval(50)
      .pipe(operators_1.finalize(done), operators_1.share())
      .subscribe()
      .unsubscribe();
  });
  it('should call two finalize instances in succession on a shared Observable', function (done) {
    var invoked = 0;
    /**
     *
     */
    function checkFinally() {
      invoked += 1;
      if (invoked === 2) {
        done();
      }
    }
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.finalize(checkFinally),
        operators_1.finalize(checkFinally),
        operators_1.share()
      )
      .subscribe();
  });
  it('should handle empty', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle never', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var expected = '-';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.false;
    });
  });
  it('should handle throw', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  #   ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle basic hot observable', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^----------!';
      var expected = '--a--b--c--|';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle basic cold observable', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = cold(' --a--b--c--|');
      var e1subs = '  ^----------!';
      var expected = '--a--b--c--|';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle basic error', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  --a--b--c--#');
      var e1subs = '  ^----------!';
      var expected = '--a--b--c--#';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle unsubscription', function () {
    var testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var executed = false;
      var e1 = hot('  --a--b--c--|');
      var e1subs = '  ^-----!     ';
      var expected = '--a--b-';
      var unsub = '   ------!';
      var result = e1.pipe(
        operators_1.finalize(function () {
          return (executed = true);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      testScheduler.flush();
      chai_1.expect(executed).to.be.true;
    });
  });
  it('should handle interop source observables', function () {
    var finalized = false;
    var subscription = interop_helper_1
      .asInteropObservable(rxjs_1.NEVER)
      .pipe(
        operators_1.finalize(function () {
          return (finalized = true);
        })
      )
      .subscribe();
    subscription.unsubscribe();
    chai_1.expect(finalized).to.be.true;
  });
  it('should finalize sources before sinks', function () {
    var finalized = [];
    rxjs_1
      .of(42)
      .pipe(
        operators_1.finalize(function () {
          return finalized.push('source');
        }),
        operators_1.finalize(function () {
          return finalized.push('sink');
        })
      )
      .subscribe();
    chai_1.expect(finalized).to.deep.equal(['source', 'sink']);
  });
  it('should finalize after the finalization', function () {
    var order = [];
    var source = new rxjs_1.Observable(function () {
      return function () {
        return order.push('finalizer');
      };
    });
    var subscription = source
      .pipe(
        operators_1.finalize(function () {
          return order.push('finalize');
        })
      )
      .subscribe();
    subscription.unsubscribe();
    chai_1.expect(order).to.deep.equal(['finalizer', 'finalize']);
  });
  it('should finalize after the finalizer with synchronous completion', function () {
    var order = [];
    var source = new rxjs_1.Observable(function (subscriber) {
      subscriber.complete();
      return function () {
        return order.push('finalizer');
      };
    });
    source
      .pipe(
        operators_1.finalize(function () {
          return order.push('finalize');
        })
      )
      .subscribe();
    chai_1.expect(order).to.deep.equal(['finalizer', 'finalize']);
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
        operators_1.finalize(function () {}),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should execute finalize even with a sync thrown error', function () {
    var called = false;
    var badObservable = new rxjs_1.Observable(function () {
      throw new Error('bad');
    }).pipe(
      operators_1.finalize(function () {
        called = true;
      })
    );
    badObservable.subscribe({
      error: rxjs_1.noop,
    });
    chai_1.expect(called).to.be.true;
  });
  it('should execute finalize in order even with a sync error', function () {
    var results = [];
    var badObservable = new rxjs_1.Observable(function (subscriber) {
      subscriber.error(new Error('bad'));
    }).pipe(
      operators_1.finalize(function () {
        results.push(1);
      }),
      operators_1.finalize(function () {
        results.push(2);
      })
    );
    badObservable.subscribe({
      error: rxjs_1.noop,
    });
    chai_1.expect(results).to.deep.equal([1, 2]);
  });
  it('should execute finalize in order even with a sync thrown error', function () {
    var results = [];
    var badObservable = new rxjs_1.Observable(function () {
      throw new Error('bad');
    }).pipe(
      operators_1.finalize(function () {
        results.push(1);
      }),
      operators_1.finalize(function () {
        results.push(2);
      })
    );
    badObservable.subscribe({
      error: rxjs_1.noop,
    });
    chai_1.expect(results).to.deep.equal([1, 2]);
  });
  it('should finalize in the proper order', function () {
    var results = [];
    rxjs_1
      .of(1)
      .pipe(
        operators_1.finalize(function () {
          return results.push(1);
        }),
        operators_1.finalize(function () {
          return results.push(2);
        }),
        operators_1.finalize(function () {
          return results.push(3);
        }),
        operators_1.finalize(function () {
          return results.push(4);
        })
      )
      .subscribe();
    chai_1.expect(results).to.deep.equal([1, 2, 3, 4]);
  });
});
//# sourceMappingURL=finalize-spec.js.map
