'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var Subscriber_1 = require('rxjs/internal/Subscriber');
var rxjs_1 = require('rxjs');
var interop_helper_1 = require('./helpers/interop-helper');
var subscription_1 = require('./helpers/subscription');
describe('SafeSubscriber', function () {
  it('should ignore next messages after unsubscription', function () {
    var times = 0;
    var sub = new Subscriber_1.SafeSubscriber({
      next: function () {
        times += 1;
      },
    });
    sub.next();
    sub.next();
    sub.unsubscribe();
    sub.next();
    chai_1.expect(times).to.equal(2);
  });
  it('should ignore error messages after unsubscription', function () {
    var times = 0;
    var errorCalled = false;
    var sub = new Subscriber_1.SafeSubscriber({
      next: function () {
        times += 1;
      },
      error: function () {
        errorCalled = true;
      },
    });
    sub.next();
    sub.next();
    sub.unsubscribe();
    sub.next();
    sub.error();
    chai_1.expect(times).to.equal(2);
    chai_1.expect(errorCalled).to.be.false;
  });
  it('should ignore complete messages after unsubscription', function () {
    var times = 0;
    var completeCalled = false;
    var sub = new Subscriber_1.SafeSubscriber({
      next: function () {
        times += 1;
      },
      complete: function () {
        completeCalled = true;
      },
    });
    sub.next();
    sub.next();
    sub.unsubscribe();
    sub.next();
    sub.complete();
    chai_1.expect(times).to.equal(2);
    chai_1.expect(completeCalled).to.be.false;
  });
  it('should not be closed when other subscriber with same observer instance completes', function () {
    var observer = {
      next: function () {},
    };
    var sub1 = new Subscriber_1.SafeSubscriber(observer);
    var sub2 = new Subscriber_1.SafeSubscriber(observer);
    sub2.complete();
    chai_1.expect(sub1.closed).to.be.false;
    chai_1.expect(sub2.closed).to.be.true;
  });
  it('should call complete observer without any arguments', function () {
    var argument = null;
    var observer = {
      complete: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        argument = args;
      },
    };
    var sub1 = new Subscriber_1.SafeSubscriber(observer);
    sub1.complete();
    chai_1.expect(argument).to.have.lengthOf(0);
  });
  it('should chain interop unsubscriptions', function () {
    var observableUnsubscribed = false;
    var subscriberUnsubscribed = false;
    var subscriptionUnsubscribed = false;
    var subscriber = new Subscriber_1.SafeSubscriber();
    subscriber.add(function () {
      return (subscriberUnsubscribed = true);
    });
    var source = new rxjs_1.Observable(function () {
      return function () {
        return (observableUnsubscribed = true);
      };
    });
    var subscription = source.subscribe(
      interop_helper_1.asInteropSubscriber(subscriber)
    );
    subscription.add(function () {
      return (subscriptionUnsubscribed = true);
    });
    subscriber.unsubscribe();
    chai_1.expect(observableUnsubscribed).to.be.true;
    chai_1.expect(subscriberUnsubscribed).to.be.true;
    chai_1.expect(subscriptionUnsubscribed).to.be.true;
  });
  it('should have idempotent unsubscription', function () {
    var count = 0;
    var subscriber = new Subscriber_1.SafeSubscriber();
    subscriber.add(function () {
      return ++count;
    });
    chai_1.expect(count).to.equal(0);
    subscriber.unsubscribe();
    chai_1.expect(count).to.equal(1);
    subscriber.unsubscribe();
    chai_1.expect(count).to.equal(1);
  });
  it('should close, unsubscribe, and unregister all finalizers after complete', function () {
    var isUnsubscribed = false;
    var subscriber = new Subscriber_1.SafeSubscriber();
    subscriber.add(function () {
      return (isUnsubscribed = true);
    });
    subscriber.complete();
    chai_1.expect(isUnsubscribed).to.be.true;
    chai_1.expect(subscriber.closed).to.be.true;
    chai_1
      .expect(subscription_1.getRegisteredFinalizers(subscriber).length)
      .to.equal(0);
  });
  it('should close, unsubscribe, and unregister all finalizers after error', function () {
    var isTornDown = false;
    var subscriber = new Subscriber_1.SafeSubscriber({
      error: function () {},
    });
    subscriber.add(function () {
      return (isTornDown = true);
    });
    subscriber.error(new Error('test'));
    chai_1.expect(isTornDown).to.be.true;
    chai_1.expect(subscriber.closed).to.be.true;
    chai_1
      .expect(subscription_1.getRegisteredFinalizers(subscriber).length)
      .to.equal(0);
  });
});
describe('Subscriber', function () {
  it('should finalize and unregister all finalizers after complete', function () {
    var isTornDown = false;
    var subscriber = new rxjs_1.Subscriber();
    subscriber.add(function () {
      isTornDown = true;
    });
    subscriber.complete();
    chai_1.expect(isTornDown).to.be.true;
    chai_1
      .expect(subscription_1.getRegisteredFinalizers(subscriber).length)
      .to.equal(0);
  });
  it('should NOT break this context on next methods from unfortunate consumers', function () {
    var CustomConsumer = (function () {
      /**
       *
       */
      function CustomConsumer() {
        this.valuesProcessed = [];
      }
      CustomConsumer.prototype.next = function (value) {
        if (value === 'reset') {
          this.valuesProcessed = [];
        } else {
          this.valuesProcessed.push(value);
        }
      };
      return CustomConsumer;
    })();
    var consumer = new CustomConsumer();
    rxjs_1.of('old', 'old', 'reset', 'new', 'new').subscribe(consumer);
    chai_1.expect(consumer.valuesProcessed).not.to.equal(['new', 'new']);
  });
  describe('deprecated next context mode', function () {
    beforeEach(function () {
      rxjs_1.config.useDeprecatedNextContext = true;
    });
    afterEach(function () {
      rxjs_1.config.useDeprecatedNextContext = false;
    });
    it('should allow changing the context of `this` in a POJO subscriber', function () {
      var results = [];
      var source = new rxjs_1.Observable(function (subscriber) {
        for (var i = 0; i < 10 && !subscriber.closed; i++) {
          subscriber.next(i);
        }
        subscriber.complete();
        return function () {
          results.push('finalizer');
        };
      });
      source.subscribe({
        next: function (value) {
          chai_1.expect(this.unsubscribe).to.be.a('function');
          results.push(value);
          if (value === 3) {
            this.unsubscribe();
          }
        },
        complete: function () {
          throw new Error('should not be called');
        },
      });
      chai_1.expect(results).to.deep.equal([0, 1, 2, 3, 'finalizer']);
    });
    it('should NOT break this context on next methods from unfortunate consumers', function () {
      var CustomConsumer = (function () {
        /**
         *
         */
        function CustomConsumer() {
          this.valuesProcessed = [];
        }
        CustomConsumer.prototype.next = function (value) {
          if (value === 'reset') {
            this.valuesProcessed = [];
          } else {
            this.valuesProcessed.push(value);
          }
        };
        return CustomConsumer;
      })();
      var consumer = new CustomConsumer();
      rxjs_1.of('old', 'old', 'reset', 'new', 'new').subscribe(consumer);
      chai_1.expect(consumer.valuesProcessed).not.to.equal(['new', 'new']);
    });
  });
  var FinalizationRegistry = global.FinalizationRegistry;
  if (FinalizationRegistry && global.gc) {
    it('should not leak the destination', function (done) {
      var _a;
      var observer = {
        next: function () {},
        error: function () {},
        complete: function () {},
      };
      var registry = new FinalizationRegistry(function (value) {
        chai_1.expect(value).to.equal('observer');
        done();
      });
      registry.register(observer, 'observer');
      var subscription = rxjs_1.of(42).subscribe(observer);
      observer = undefined;
      (_a = global.gc) === null || _a === void 0 ? void 0 : _a.call(global);
    });
  } else {
    console.warn(
      'No support for FinalizationRegistry in Node ' + process.version
    );
  }
});
//# sourceMappingURL=Subscriber-spec.js.map
