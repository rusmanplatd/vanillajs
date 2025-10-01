'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('connectable', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should mirror a simple source Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2---3-4--5-|');
      var sourceSubs = ' ^--------------!';
      var expected = '   --1-2---3-4--5-|';
      var obs = rxjs_1.connectable(source);
      expectObservable(obs).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
      obs.connect();
    });
  });
  it('should do nothing if connect is not called, despite subscriptions', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var source = cold('--1-2---3-4--5-|');
      var sourceSubs = [];
      var expected = '   -';
      var obs = rxjs_1.connectable(source);
      expectObservable(obs).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(sourceSubs);
    });
  });
  it('should support resetOnDisconnect = true', function () {
    var values = [];
    var source = rxjs_1.of(1, 2, 3);
    var obs = rxjs_1.connectable(source, {
      connector: function () {
        return new rxjs_1.ReplaySubject(1);
      },
      resetOnDisconnect: true,
    });
    obs.subscribe(function (value) {
      return values.push(value);
    });
    var connection = obs.connect();
    chai_1.expect(values).to.deep.equal([1, 2, 3]);
    connection.unsubscribe();
    obs.subscribe(function (value) {
      return values.push(value);
    });
    obs.connect();
    chai_1.expect(values).to.deep.equal([1, 2, 3, 1, 2, 3]);
  });
  it('should support resetOnDisconnect = false', function () {
    var values = [];
    var source = rxjs_1.of(1, 2, 3);
    var obs = rxjs_1.connectable(source, {
      connector: function () {
        return new rxjs_1.ReplaySubject(1);
      },
      resetOnDisconnect: false,
    });
    obs.subscribe(function (value) {
      return values.push(value);
    });
    var connection = obs.connect();
    chai_1.expect(values).to.deep.equal([1, 2, 3]);
    connection.unsubscribe();
    obs.subscribe(function (value) {
      return values.push(value);
    });
    obs.connect();
    chai_1.expect(values).to.deep.equal([1, 2, 3, 3]);
  });
});
//# sourceMappingURL=connectable-spec.js.map
