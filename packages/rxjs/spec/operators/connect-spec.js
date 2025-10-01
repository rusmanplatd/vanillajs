'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('connect', function () {
  var rxTest;
  beforeEach(function () {
    rxTest = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
  });
  it('should connect a source through a selector function', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable;
      var source = cold('---a----b-----c---|');
      var d = time('        ---|');
      var expected = '   ---a--a-b--b--c--c|';
      var result = source.pipe(
        operators_1.connect(function (shared) {
          return rxjs_1.merge(shared.pipe(operators_1.delay(d)), shared);
        })
      );
      expectObservable(result).toBe(expected);
    });
  });
  it('should connect a source through a selector function and use the provided connector', function () {
    rxTest.run(function (_a) {
      var cold = _a.cold,
        time = _a.time,
        expectObservable = _a.expectObservable;
      var source = cold('--------a---------b---------c-----|');
      var d = time('             ---|');
      var expected = '   S--S----a--a------b--b------c--c--|';
      var result = source.pipe(
        operators_1.connect(
          function (shared) {
            return rxjs_1.merge(shared.pipe(operators_1.delay(d)), shared);
          },
          {
            connector: function () {
              return new rxjs_1.BehaviorSubject('S');
            },
          }
        )
      );
      expectObservable(result).toBe(expected);
    });
  });
});
//# sourceMappingURL=connect-spec.js.map
