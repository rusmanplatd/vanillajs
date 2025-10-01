'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var interop_helper_1 = require('../helpers/interop-helper');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('skipUntil', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should skip values until another observable notifies', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--c--d--e----|');
      var e1subs = '    ^------------------!';
      var skip = hot('  ---------x------|   ');
      var skipSubs = '  ^--------!          ';
      var expected = '  -----------d--e----|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should emit elements after notifier emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--c--d--e--|');
      var e1subs = '    ^----------------!';
      var skip = hot('  ---------x----|   ');
      var skipSubs = '  ^--------!        ';
      var expected = '  -----------d--e--|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should emit elements after a synchronous notifier emits', function () {
    var values = [];
    rxjs_1
      .of('a', 'b')
      .pipe(operators_1.skipUntil(rxjs_1.of('x')))
      .subscribe({
        next: function (value) {
          values.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(values).to.deep.equal(['a', 'b']);
        },
      });
  });
  it('should raise an error if notifier throws and source is hot', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = '  ^------------!    ';
      var skip = hot('-------------#    ');
      var skipSubs = '^------------!    ';
      var expected = '-------------#    ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements when notifier does not emit and completes early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = '  ^----------------!';
      var skip = hot('------------|     ');
      var skipSubs = '^-----------!     ';
      var expected = '-----------------|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should allow unsubscribing explicitly and early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--c--d--e----|');
      var unsub = '     ---------!          ';
      var e1subs = '    ^--------!          ';
      var skip = hot('  -------------x--|   ');
      var skipSubs = '  ^--------!          ';
      var expected = '  ----------          ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip)), unsub).toBe(
        expected
      );
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--c--d--e----|');
      var e1subs = '    ^--------!          ';
      var skip = hot('  -------------x--|   ');
      var skipSubs = '  ^--------!          ';
      var expected = '  ----------          ';
      var unsub = '     ---------!          ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.skipUntil(skip),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not break unsubscription chains with interop inners when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('    --a--b--c--d--e----|');
      var e1subs = '    ^--------!          ';
      var skip = hot('  -------------x--|   ');
      var skipSubs = '  ^--------!          ';
      var expected = '  ----------          ';
      var unsub = '     ---------!          ';
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.skipUntil(interop_helper_1.asInteropObservable(skip)),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements when notifier is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a--b--c--d--e--|');
      var e1subs = '   ^----------------!';
      var skip = cold('|                 ');
      var skipSubs = ' (^!)              ';
      var expected = ' -----------------|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should keep subscription to source, to wait for its eventual completion', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ------------------------------|');
      var e1subs = '  ^-----------------------------!';
      var skip = hot('-------|                       ');
      var skipSubs = '^------!                       ';
      var expected = '------------------------------|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not complete if hot source observable does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -                ');
      var e1subs = '  ^                ';
      var skip = hot('-------------x--|');
      var skipSubs = '^------------!   ';
      var expected = '-                ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not complete if cold source observable never completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -                ');
      var e1subs = '  ^                ';
      var skip = hot('-------------x--|');
      var skipSubs = '^------------!   ';
      var expected = '-                ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should raise error if cold source is never and notifier errors', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -             ');
      var e1subs = '  ^------------!';
      var skip = hot('-------------#');
      var skipSubs = '^------------!';
      var expected = '-------------#';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements and complete if notifier is cold never', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --a--b--c--d--e--|');
      var e1subs = '   ^----------------!';
      var skip = cold('-                 ');
      var skipSubs = ' ^----------------!';
      var expected = ' -----------------|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements and complete if notifier is a hot never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = '  ^----------------!';
      var skip = hot('-                 ');
      var skipSubs = '^----------------!';
      var expected = '-----------------|';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements and complete, even if notifier would not complete until later', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ^-a--b--c--d--e--|       ');
      var e1subs = '  ^----------------!       ';
      var skip = hot('^-----------------------|');
      var skipSubs = '^----------------!       ';
      var expected = '-----------------|       ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not complete if source does not complete if notifier completes without emission', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -              ');
      var e1subs = '  ^              ';
      var skip = hot('--------------|');
      var skipSubs = '^-------------!';
      var expected = '-              ';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should not complete if source and notifier are both hot never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  -');
      var e1subs = '  ^';
      var skip = hot('-');
      var skipSubs = '^';
      var expected = '-';
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(skip.subscriptions).toBe(skipSubs);
    });
  });
  it('should skip all elements if notifier is unsubscribed explicitly before the notifier emits', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--c--d--e--|');
      var e1subs = [
        '               ^----------------!',
        '               ^----------------!',
      ];
      var skip = new rxjs_1.Subject();
      var expected = '-----------------|';
      e1.subscribe(function (x) {
        if (x === 'd' && !skip.closed) {
          skip.next('x');
        }
        skip.unsubscribe();
      });
      expectObservable(e1.pipe(operators_1.skipUntil(skip))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should unsubscribe the notifier after its first nexted value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = hot('  -^-o---o---o---o---o---o---|');
      var notifier = hot('-^--------n--n--n--n--n--n-|');
      var nSubs = '        ^--------!                 ';
      var expected = '    -^---------o---o---o---o---|';
      var result = source.pipe(operators_1.skipUntil(notifier));
      expectObservable(result).toBe(expected);
      expectSubscriptions(notifier.subscriptions).toBe(nSubs);
    });
  });
  it('should stop listening to a synchronous notifier after its first nexted value', function () {
    var sideEffects = [];
    var synchronousNotifier = rxjs_1.concat(
      rxjs_1.defer(function () {
        sideEffects.push(1);
        return rxjs_1.of(1);
      }),
      rxjs_1.defer(function () {
        sideEffects.push(2);
        return rxjs_1.of(2);
      }),
      rxjs_1.defer(function () {
        sideEffects.push(3);
        return rxjs_1.of(3);
      })
    );
    rxjs_1
      .of(null)
      .pipe(operators_1.skipUntil(synchronousNotifier))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([1]);
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
      .pipe(operators_1.skipUntil(rxjs_1.of(0)), operators_1.take(3))
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
  it('should skip until Promise resolves', function (done) {
    var e1 = rxjs_1.interval(3).pipe(operators_1.take(5));
    var expected = [2, 3, 4];
    e1.pipe(
      operators_1.skipUntil(
        new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve();
          }, 8);
        })
      )
    ).subscribe({
      next: function (x) {
        chai_1.expect(x).to.deep.equal(expected.shift());
      },
      error: function () {
        return done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        done();
      },
    });
  });
  it('should raise error when Promise rejects', function (done) {
    var e1 = rxjs_1.interval(1).pipe(operators_1.take(5));
    var error = new Error('err');
    e1.pipe(operators_1.skipUntil(Promise.reject(error))).subscribe({
      next: function () {
        done(new Error('should not be called'));
      },
      error: function (err) {
        chai_1.expect(err).to.be.an('error');
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
});
//# sourceMappingURL=skipUntil-spec.js.map
