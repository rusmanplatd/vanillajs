'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var chai_1 = require('chai');
describe('delayWhen', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should delay by duration selector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ---a---b---c--|      ');
      var expected = '-----a------c----(b|)';
      var subs = '    ^-------------!      ';
      var selector = [
        cold('             --x--|            '),
        cold('                 ----------(x|)'),
        cold('                     -x--|     '),
      ];
      var selectorSubs = [
        '               ---^-!               ',
        '               -------^---------!   ',
        '               -----------^!        ',
      ];
      var idx = 0;
      /**
       *
       * @param x
       */
      function durationSelector(x) {
        return selector[idx++];
      }
      var result = e1.pipe(operators_1.delayWhen(durationSelector));
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector[0].subscriptions).toBe(selectorSubs[0]);
      expectSubscriptions(selector[1].subscriptions).toBe(selectorSubs[1]);
      expectSubscriptions(selector[2].subscriptions).toBe(selectorSubs[2]);
    });
  });
  it('should delay by selector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--| ');
      var expected = '   ---a--b-| ';
      var subs = '       ^-------! ';
      var selector = cold('-x--|   ');
      var selectorSubs = [
        '                  --^!      ',
        '                  -----^!   ',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should raise error if source raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('      --a--# ');
      var expected = '    ---a-# ';
      var subs = '        ^----! ';
      var selector = cold(' -x--|');
      var selectorSubs = '--^!   ';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should raise error if selector raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('      --a--b--|');
      var expected = '    ---#     ';
      var subs = '        ^--!     ';
      var selector = cold(' -#     ');
      var selectorSubs = '--^!     ';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should delay by selector and completes after value emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--|       ');
      var expected = '   ---------a--(b|)';
      var subs = '       ^-------!       ';
      var selector = cold('-------x--|   ');
      var selectorSubs = [
        '                  --^------!      ',
        '                  -----^------!   ',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should delay, but not emit if the selector never emits a notification', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--|   ');
      var expected = '   -----------|';
      var subs = '       ^-------!   ';
      var selector = cold('------|   ');
      var selectorSubs = [
        '                  --^-----!   ',
        '                  -----^-----!',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should not emit for async source and sync empty selector', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  a--|');
      var expected = '---|';
      var subs = '    ^--!';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return rxjs_1.EMPTY;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should not emit if selector never emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--|');
      var expected = '   -        ';
      var subs = '       ^-------!';
      var selector = cold('-      ');
      var selectorSubs = [
        '                  --^      ',
        '                  -----^   ',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should delay by first value from selector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--|       ');
      var expected = '   ------a--(b|)   ';
      var subs = '       ^-------!       ';
      var selector = cold('----x--y--|   ');
      var selectorSubs = [
        '                  --^---!         ',
        '                  -----^---!      ',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should delay by selector that does not completes', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('     --a--b--|          ');
      var expected = '   ------a--(b|)      ';
      var subs = '       ^-------!          ';
      var selector = cold('----x-----y---   ');
      var selectorSubs = [
        '                  --^---!            ',
        '                  -----^---!         ',
      ];
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
    });
  });
  it('should raise error if selector throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  --a--b--|');
      var e1subs = '  ^-!      ';
      var expected = '--#      ';
      var err = new Error('error');
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          throw err;
        })
      );
      expectObservable(result).toBe(expected, null, err);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should start subscription when subscription delay emits', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('       -----a---b---| ');
      var expected = '     -------a---b-| ';
      var subs = '         ---^---------! ';
      var selector = cold('     --x--|    ');
      var selectorSubs = [
        '                      -----^-!     ',
        '                      ---------^-! ',
      ];
      var subDelay = cold('---x--|        ');
      var subDelaySub = '  ^--!           ';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        }, subDelay)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
      expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
  });
  it('should start subscription when subscription delay completes without emit value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('       -----a---b---| ');
      var expected = '     -------a---b-| ';
      var subs = '         ---^---------! ';
      var selector = cold('     --x--|    ');
      var selectorSubs = [
        '                    -----^-!       ',
        '                    ---------^-!   ',
      ];
      var subDelay = cold('---|           ');
      var subDelaySub = '  ^--!           ';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        }, subDelay)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
      expectSubscriptions(selector.subscriptions).toBe(selectorSubs);
      expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
  });
  it('should raise error when subscription delay raises error', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('       -----a---b---|');
      var expected = '     ---#          ';
      var selector = cold('     --x--|   ');
      var subDelay = cold('---#          ');
      var subDelaySub = '  ^--!          ';
      var result = e1.pipe(
        operators_1.delayWhen(function (x) {
          return selector;
        }, subDelay)
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe([]);
      expectSubscriptions(selector.subscriptions).toBe([]);
      expectSubscriptions(subDelay.subscriptions).toBe(subDelaySub);
    });
  });
  it('should complete when duration selector returns synchronous observable', function () {
    var next = false;
    var complete = false;
    rxjs_1
      .of(1)
      .pipe(
        operators_1.delayWhen(function () {
          return rxjs_1.of(2);
        })
      )
      .subscribe({
        next: function () {
          return (next = true);
        },
        complete: function () {
          return (complete = true);
        },
      });
    chai_1.expect(next).to.be.true;
    chai_1.expect(complete).to.be.true;
  });
  it('should call predicate with indices starting at 0', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('       --a--b--c--|');
      var e1subs = '       ^----------!';
      var expected = '     --a--b--c--|';
      var selector = cold('  (x|)');
      var indices = [];
      var predicate = function (value, index) {
        indices.push(index);
        return selector;
      };
      var result = e1.pipe(operators_1.delayWhen(predicate));
      expectObservable(
        result.pipe(
          operators_1.tap({
            complete: function () {
              chai_1.expect(indices).to.deep.equal([0, 1, 2]);
            },
          })
        )
      ).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should delayWhen Promise resolves', function (done) {
    var e1 = rxjs_1.interval(1).pipe(rxjs_1.take(5));
    var expected = [0, 1, 2, 3, 4];
    e1.pipe(
      operators_1.delayWhen(function () {
        return Promise.resolve(42);
      })
    ).subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(expected.length).to.equal(0);
        done();
      },
    });
  });
  it('should raise error when Promise rejects', function (done) {
    var e1 = rxjs_1.interval(1).pipe(rxjs_1.take(10));
    var expected = [0, 1, 2];
    var error = new Error('err');
    e1.pipe(
      operators_1.delayWhen(function (x) {
        return x === 3 ? Promise.reject(error) : Promise.resolve(42);
      })
    ).subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function (err) {
        chai_1.expect(err).to.be.an('error');
        chai_1.expect(expected.length).to.equal(0);
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
  });
});
//# sourceMappingURL=delayWhen-spec.js.map
