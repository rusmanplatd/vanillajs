'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var config_1 = require('../src/internal/config');
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var timeoutProvider_1 = require('rxjs/internal/scheduler/timeoutProvider');
describe('config', function () {
  it('should have a Promise property that defaults to nothing', function () {
    chai_1.expect(config_1.config).to.have.property('Promise');
    chai_1.expect(config_1.config.Promise).to.be.undefined;
  });
  describe('onUnhandledError', function () {
    afterEach(function () {
      config_1.config.onUnhandledError = null;
    });
    it('should default to null', function () {
      chai_1.expect(config_1.config.onUnhandledError).to.be.null;
    });
    it('should call asynchronously if an error is emitted and not handled by the consumer observer', function (done) {
      var called = false;
      var results = [];
      config_1.config.onUnhandledError = function (err) {
        called = true;
        chai_1.expect(err).to.equal('bad');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.next(1);
        subscriber.error('bad');
      });
      source.subscribe({
        next: function (value) {
          return results.push(value);
        },
      });
      chai_1.expect(called).to.be.false;
      chai_1.expect(results).to.deep.equal([1]);
    });
    it('should call asynchronously if an error is emitted and not handled by the consumer next callback', function (done) {
      var called = false;
      var results = [];
      config_1.config.onUnhandledError = function (err) {
        called = true;
        chai_1.expect(err).to.equal('bad');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.next(1);
        subscriber.error('bad');
      });
      source.subscribe(function (value) {
        return results.push(value);
      });
      chai_1.expect(called).to.be.false;
      chai_1.expect(results).to.deep.equal([1]);
    });
    it('should call asynchronously if an error is emitted and not handled by the consumer in the empty case', function (done) {
      var called = false;
      config_1.config.onUnhandledError = function (err) {
        called = true;
        chai_1.expect(err).to.equal('bad');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.error('bad');
      });
      source.subscribe();
      chai_1.expect(called).to.be.false;
    });
    it('should not be called if two errors are sent to the subscriber', function (done) {
      var called = false;
      config_1.config.onUnhandledError = function () {
        called = true;
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.error('handled');
        subscriber.error('swallowed');
      });
      var syncSentError;
      source.subscribe({
        error: function (err) {
          syncSentError = err;
        },
      });
      chai_1.expect(syncSentError).to.equal('handled');
      timeoutProvider_1.timeoutProvider.setTimeout(function () {
        chai_1.expect(called).to.be.false;
        done();
      });
    });
  });
  describe('onStoppedNotification', function () {
    afterEach(function () {
      config_1.config.onStoppedNotification = null;
    });
    it('should default to null', function () {
      chai_1.expect(config_1.config.onStoppedNotification).to.be.null;
    });
    it('should be called asynchronously if a subscription setup errors after the subscription is closed by an error', function (done) {
      var called = false;
      config_1.config.onStoppedNotification = function (notification) {
        called = true;
        chai_1.expect(notification.kind).to.equal('E');
        chai_1.expect(notification).to.have.property('error', 'bad');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.error('handled');
        throw 'bad';
      });
      var syncSentError;
      source.subscribe({
        error: function (err) {
          syncSentError = err;
        },
      });
      chai_1.expect(syncSentError).to.equal('handled');
      chai_1.expect(called).to.be.false;
    });
    it('should be called asynchronously if a subscription setup errors after the subscription is closed by a completion', function (done) {
      var called = false;
      var completed = false;
      config_1.config.onStoppedNotification = function (notification) {
        called = true;
        chai_1.expect(notification.kind).to.equal('E');
        chai_1.expect(notification).to.have.property('error', 'bad');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.complete();
        throw 'bad';
      });
      source.subscribe({
        error: function () {
          throw 'should not be called';
        },
        complete: function () {
          completed = true;
        },
      });
      chai_1.expect(completed).to.be.true;
      chai_1.expect(called).to.be.false;
    });
    it('should be called if a next is sent to the stopped subscriber', function (done) {
      var called = false;
      config_1.config.onStoppedNotification = function (notification) {
        called = true;
        chai_1.expect(notification.kind).to.equal('N');
        chai_1.expect(notification).to.have.property('value', 2);
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.next(1);
        subscriber.complete();
        subscriber.next(2);
      });
      var syncSentValue;
      source.subscribe({
        next: function (value) {
          syncSentValue = value;
        },
      });
      chai_1.expect(syncSentValue).to.equal(1);
      chai_1.expect(called).to.be.false;
    });
    it('should be called if two errors are sent to the subscriber', function (done) {
      var called = false;
      config_1.config.onStoppedNotification = function (notification) {
        called = true;
        chai_1.expect(notification.kind).to.equal('E');
        chai_1.expect(notification).to.have.property('error', 'swallowed');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.error('handled');
        subscriber.error('swallowed');
      });
      var syncSentError;
      source.subscribe({
        error: function (err) {
          syncSentError = err;
        },
      });
      chai_1.expect(syncSentError).to.equal('handled');
      chai_1.expect(called).to.be.false;
    });
    it('should be called if two completes are sent to the subscriber', function (done) {
      var called = false;
      config_1.config.onStoppedNotification = function (notification) {
        called = true;
        chai_1.expect(notification.kind).to.equal('C');
        done();
      };
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.complete();
        subscriber.complete();
      });
      source.subscribe();
      chai_1.expect(called).to.be.false;
    });
  });
});
//# sourceMappingURL=config-spec.js.map
