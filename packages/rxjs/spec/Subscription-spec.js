'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
describe('Subscription', function () {
  describe('add()', function () {
    it('should unsubscribe child subscriptions', function () {
      var main = new rxjs_1.Subscription();
      var isCalled = false;
      var child = new rxjs_1.Subscription(function () {
        isCalled = true;
      });
      main.add(child);
      main.unsubscribe();
      chai_1.expect(isCalled).to.equal(true);
    });
    it('should unsubscribe child subscriptions if it has already been unsubscribed', function () {
      var main = new rxjs_1.Subscription();
      main.unsubscribe();
      var isCalled = false;
      var child = new rxjs_1.Subscription(function () {
        isCalled = true;
      });
      main.add(child);
      chai_1.expect(isCalled).to.equal(true);
    });
    it('should unsubscribe a finalizer function that was passed', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      main.add(function () {
        isCalled = true;
      });
      main.unsubscribe();
      chai_1.expect(isCalled).to.be.true;
    });
    it('should unsubscribe a finalizer function that was passed immediately if it has been unsubscribed', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      main.unsubscribe();
      main.add(function () {
        isCalled = true;
      });
      chai_1.expect(isCalled).to.be.true;
    });
    it('should unsubscribe an Unsubscribable when unsubscribed', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      main.add({
        unsubscribe: function () {
          isCalled = true;
        },
      });
      main.unsubscribe();
      chai_1.expect(isCalled).to.be.true;
    });
    it('should unsubscribe an Unsubscribable if it is already unsubscribed', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      main.unsubscribe();
      main.add({
        unsubscribe: function () {
          isCalled = true;
        },
      });
      chai_1.expect(isCalled).to.be.true;
    });
  });
  describe('remove()', function () {
    it('should remove added Subscriptions', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      var child = new rxjs_1.Subscription(function () {
        isCalled = true;
      });
      main.add(child);
      main.remove(child);
      main.unsubscribe();
      chai_1.expect(isCalled).to.be.false;
    });
    it('should remove added functions', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      var finalizer = function () {
        isCalled = true;
      };
      main.add(finalizer);
      main.remove(finalizer);
      main.unsubscribe();
      chai_1.expect(isCalled).to.be.false;
    });
    it('should remove added unsubscribables', function () {
      var isCalled = false;
      var main = new rxjs_1.Subscription();
      var unsubscribable = {
        unsubscribe: function () {
          isCalled = true;
        },
      };
      main.add(unsubscribable);
      main.remove(unsubscribable);
      main.unsubscribe();
      chai_1.expect(isCalled).to.be.false;
    });
  });
  describe('unsubscribe()', function () {
    it('should unsubscribe from all subscriptions, when some of them throw', function (done) {
      var finalizers = [];
      var source1 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(1);
        };
      });
      var source2 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(2);
          throw new Error('oops, I am a bad unsubscribe!');
        };
      });
      var source3 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(3);
        };
      });
      var subscription = rxjs_1.merge(source1, source2, source3).subscribe();
      setTimeout(function () {
        chai_1
          .expect(function () {
            subscription.unsubscribe();
          })
          .to.throw(rxjs_1.UnsubscriptionError);
        chai_1.expect(finalizers).to.deep.equal([1, 2, 3]);
        done();
      });
    });
    it('should unsubscribe from all subscriptions, when adding a bad custom subscription to a subscription', function (done) {
      var finalizers = [];
      var sub = new rxjs_1.Subscription();
      var source1 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(1);
        };
      });
      var source2 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(2);
          sub.add({
            unsubscribe: function () {
              chai_1.expect(sub.closed).to.be.true;
              throw new Error('Who is your daddy, and what does he do?');
            },
          });
        };
      });
      var source3 = new rxjs_1.Observable(function () {
        return function () {
          finalizers.push(3);
        };
      });
      sub.add(rxjs_1.merge(source1, source2, source3).subscribe());
      setTimeout(function () {
        chai_1
          .expect(function () {
            sub.unsubscribe();
          })
          .to.throw(rxjs_1.UnsubscriptionError);
        chai_1.expect(finalizers).to.deep.equal([1, 2, 3]);
        done();
      });
    });
    it('should have idempotent unsubscription', function () {
      var count = 0;
      var subscription = new rxjs_1.Subscription(function () {
        return ++count;
      });
      chai_1.expect(count).to.equal(0);
      subscription.unsubscribe();
      chai_1.expect(count).to.equal(1);
      subscription.unsubscribe();
      chai_1.expect(count).to.equal(1);
    });
    it('should unsubscribe from all parents', function () {
      var a = new rxjs_1.Subscription(function () {});
      var b = new rxjs_1.Subscription(function () {});
      var c = new rxjs_1.Subscription(function () {});
      var d = new rxjs_1.Subscription(function () {});
      a.add(d);
      b.add(d);
      c.add(d);
      chai_1.expect(a._finalizers).to.have.length(1);
      chai_1.expect(b._finalizers).to.have.length(1);
      chai_1.expect(c._finalizers).to.have.length(1);
      d.unsubscribe();
      chai_1.expect(a._finalizers).to.have.length(0);
      chai_1.expect(b._finalizers).to.have.length(0);
      chai_1.expect(c._finalizers).to.have.length(0);
    });
  });
});
//# sourceMappingURL=Subscription-spec.js.map
