'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('fromEventPattern', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create an observable from the handler API', function () {
    rxTestScheduler.run(function (_a) {
      var time = _a.time,
        expectObservable = _a.expectObservable;
      var time1 = time('-----|     ');
      var time2 = time('     --|   ');
      var expected = '  -----x-x---';
      /**
       *
       * @param h
       */
      function addHandler(h) {
        rxjs_1
          .timer(time1, time2, rxTestScheduler)
          .pipe(
            operators_1.mapTo('ev'),
            operators_1.take(2),
            operators_1.concat(rxjs_1.NEVER)
          )
          .subscribe(h);
      }
      var e1 = rxjs_1.fromEventPattern(addHandler);
      expectObservable(e1).toBe(expected, { x: 'ev' });
    });
  });
  it('should call addHandler on subscription', function () {
    var addHandler = sinon.spy();
    rxjs_1.fromEventPattern(addHandler, rxjs_1.noop).subscribe(rxjs_1.noop);
    var call = addHandler.getCall(0);
    chai_1.expect(addHandler).calledOnce;
    chai_1.expect(call.args[0]).to.be.a('function');
  });
  it('should call removeHandler on unsubscription', function () {
    var removeHandler = sinon.spy();
    rxjs_1
      .fromEventPattern(rxjs_1.noop, removeHandler)
      .subscribe(rxjs_1.noop)
      .unsubscribe();
    var call = removeHandler.getCall(0);
    chai_1.expect(removeHandler).calledOnce;
    chai_1.expect(call.args[0]).to.be.a('function');
  });
  it('should work without optional removeHandler', function () {
    var addHandler = sinon.spy();
    rxjs_1.fromEventPattern(addHandler).subscribe(rxjs_1.noop);
    chai_1.expect(addHandler).calledOnce;
  });
  it('should deliver return value of addHandler to removeHandler as signal', function () {
    var expected = { signal: true };
    var addHandler = function () {
      return expected;
    };
    var removeHandler = sinon.spy();
    rxjs_1
      .fromEventPattern(addHandler, removeHandler)
      .subscribe(rxjs_1.noop)
      .unsubscribe();
    var call = removeHandler.getCall(0);
    chai_1.expect(call).calledWith(sinon.match.any, expected);
  });
  it('should send errors in addHandler down the error path', function (done) {
    rxjs_1
      .fromEventPattern(function (h) {
        throw 'bad';
      }, rxjs_1.noop)
      .subscribe({
        next: function () {
          return done(new Error('should not be called'));
        },
        error: function (err) {
          chai_1.expect(err).to.equal('bad');
          done();
        },
        complete: function () {
          return done(new Error('should not be called'));
        },
      });
  });
  it('should accept a selector that maps outgoing values', function (done) {
    var target;
    var trigger = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (target) {
        target.apply(null, arguments);
      }
    };
    var addHandler = function (handler) {
      target = handler;
    };
    var removeHandler = function (handler) {
      target = null;
    };
    var selector = function (a, b) {
      return a + b + '!';
    };
    rxjs_1
      .fromEventPattern(addHandler, removeHandler, selector)
      .pipe(operators_1.take(1))
      .subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal('testme!');
        },
        error: function (err) {
          done(new Error('should not be called'));
        },
        complete: function () {
          done();
        },
      });
    trigger('test', 'me');
  });
  it('should send errors in the selector down the error path', function (done) {
    var target;
    var trigger = function (value) {
      if (target) {
        target(value);
      }
    };
    var addHandler = function (handler) {
      target = handler;
    };
    var removeHandler = function (handler) {
      target = null;
    };
    var selector = function (x) {
      throw 'bad';
    };
    rxjs_1.fromEventPattern(addHandler, removeHandler, selector).subscribe({
      next: function (x) {
        done(new Error('should not be called'));
      },
      error: function (err) {
        chai_1.expect(err).to.equal('bad');
        done();
      },
      complete: function () {
        done(new Error('should not be called'));
      },
    });
    trigger('test');
  });
});
//# sourceMappingURL=fromEventPattern-spec.js.map
