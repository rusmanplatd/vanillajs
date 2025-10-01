'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('./helpers/observableMatcher');
describe('Notification', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should exist', function () {
    chai_1.expect(rxjs_1.Notification).exist;
    chai_1.expect(rxjs_1.Notification).to.be.a('function');
  });
  it('should not allow convert to observable if given kind is unknown', function () {
    var n = new rxjs_1.Notification('x');
    chai_1
      .expect(function () {
        return n.toObservable();
      })
      .to.throw();
  });
  describe('createNext', function () {
    it('should return a Notification', function () {
      var n = rxjs_1.Notification.createNext('test');
      chai_1.expect(n instanceof rxjs_1.Notification).to.be.true;
      chai_1.expect(n.value).to.equal('test');
      chai_1.expect(n.kind).to.equal('N');
      chai_1.expect(n.error).to.be.a('undefined');
      chai_1.expect(n.hasValue).to.be.true;
    });
  });
  describe('createError', function () {
    it('should return a Notification', function () {
      var n = rxjs_1.Notification.createError('test');
      chai_1.expect(n instanceof rxjs_1.Notification).to.be.true;
      chai_1.expect(n.value).to.be.a('undefined');
      chai_1.expect(n.kind).to.equal('E');
      chai_1.expect(n.error).to.equal('test');
      chai_1.expect(n.hasValue).to.be.false;
    });
  });
  describe('createComplete', function () {
    it('should return a Notification', function () {
      var n = rxjs_1.Notification.createComplete();
      chai_1.expect(n instanceof rxjs_1.Notification).to.be.true;
      chai_1.expect(n.value).to.be.a('undefined');
      chai_1.expect(n.kind).to.equal('C');
      chai_1.expect(n.error).to.be.a('undefined');
      chai_1.expect(n.hasValue).to.be.false;
    });
  });
  describe('toObservable', function () {
    it('should create observable from a next Notification', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var value = 'a';
        var next = rxjs_1.Notification.createNext(value);
        expectObservable(next.toObservable()).toBe('(a|)');
      });
    });
    it('should create observable from a complete Notification', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var complete = rxjs_1.Notification.createComplete();
        expectObservable(complete.toObservable()).toBe('|');
      });
    });
    it('should create observable from a error Notification', function () {
      rxTestScheduler.run(function (_a) {
        var expectObservable = _a.expectObservable;
        var error = rxjs_1.Notification.createError('error');
        expectObservable(error.toObservable()).toBe('#');
      });
    });
  });
  describe('static reference', function () {
    it('should create new next Notification with value', function () {
      var value = 'a';
      var first = rxjs_1.Notification.createNext(value);
      var second = rxjs_1.Notification.createNext(value);
      chai_1.expect(first).not.to.equal(second);
    });
    it('should create new error Notification', function () {
      var first = rxjs_1.Notification.createError();
      var second = rxjs_1.Notification.createError();
      chai_1.expect(first).not.to.equal(second);
    });
    it('should return static complete Notification reference', function () {
      var first = rxjs_1.Notification.createComplete();
      var second = rxjs_1.Notification.createComplete();
      chai_1.expect(first).to.equal(second);
    });
  });
  describe('do', function () {
    it('should invoke on next', function () {
      var n = rxjs_1.Notification.createNext('a');
      var invoked = false;
      n.do(
        function () {
          invoked = true;
        },
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        }
      );
      chai_1.expect(invoked).to.be.true;
    });
    it('should invoke on error', function () {
      var n = rxjs_1.Notification.createError();
      var invoked = false;
      n.do(
        function () {
          throw 'should not be called';
        },
        function () {
          invoked = true;
        },
        function () {
          throw 'should not be called';
        }
      );
      chai_1.expect(invoked).to.be.true;
    });
    it('should invoke on complete', function () {
      var n = rxjs_1.Notification.createComplete();
      var invoked = false;
      n.do(
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        },
        function () {
          invoked = true;
        }
      );
      chai_1.expect(invoked).to.be.true;
    });
  });
  describe('accept', function () {
    it('should accept observer for next Notification', function () {
      var value = 'a';
      var observed = false;
      var n = rxjs_1.Notification.createNext(value);
      var observer = rxjs_1.Subscriber.create(
        function (x) {
          chai_1.expect(x).to.equal(value);
          observed = true;
        },
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        }
      );
      n.accept(observer);
      chai_1.expect(observed).to.be.true;
    });
    it('should accept observer for error Notification', function () {
      var observed = false;
      var n = rxjs_1.Notification.createError();
      var observer = rxjs_1.Subscriber.create(
        function () {
          throw 'should not be called';
        },
        function () {
          observed = true;
        },
        function () {
          throw 'should not be called';
        }
      );
      n.accept(observer);
      chai_1.expect(observed).to.be.true;
    });
    it('should accept observer for complete Notification', function () {
      var observed = false;
      var n = rxjs_1.Notification.createComplete();
      var observer = rxjs_1.Subscriber.create(
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        },
        function () {
          observed = true;
        }
      );
      n.accept(observer);
      chai_1.expect(observed).to.be.true;
    });
    it('should accept function for next Notification', function () {
      var value = 'a';
      var observed = false;
      var n = rxjs_1.Notification.createNext(value);
      n.accept(
        function (x) {
          chai_1.expect(x).to.equal(value);
          observed = true;
        },
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        }
      );
      chai_1.expect(observed).to.be.true;
    });
    it('should accept function for error Notification', function () {
      var observed = false;
      var error = 'error';
      var n = rxjs_1.Notification.createError(error);
      n.accept(
        function () {
          throw 'should not be called';
        },
        function (err) {
          chai_1.expect(err).to.equal(error);
          observed = true;
        },
        function () {
          throw 'should not be called';
        }
      );
      chai_1.expect(observed).to.be.true;
    });
    it('should accept function for complete Notification', function () {
      var observed = false;
      var n = rxjs_1.Notification.createComplete();
      n.accept(
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        },
        function () {
          observed = true;
        }
      );
      chai_1.expect(observed).to.be.true;
    });
  });
  describe('observe', function () {
    it('should observe for next Notification', function () {
      var value = 'a';
      var observed = false;
      var n = rxjs_1.Notification.createNext(value);
      var observer = rxjs_1.Subscriber.create(
        function (x) {
          chai_1.expect(x).to.equal(value);
          observed = true;
        },
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        }
      );
      n.observe(observer);
      chai_1.expect(observed).to.be.true;
    });
    it('should observe for error Notification', function () {
      var observed = false;
      var n = rxjs_1.Notification.createError();
      var observer = rxjs_1.Subscriber.create(
        function () {
          throw 'should not be called';
        },
        function () {
          observed = true;
        },
        function () {
          throw 'should not be called';
        }
      );
      n.observe(observer);
      chai_1.expect(observed).to.be.true;
    });
    it('should observe for complete Notification', function () {
      var observed = false;
      var n = rxjs_1.Notification.createComplete();
      var observer = rxjs_1.Subscriber.create(
        function () {
          throw 'should not be called';
        },
        function () {
          throw 'should not be called';
        },
        function () {
          observed = true;
        }
      );
      n.observe(observer);
      chai_1.expect(observed).to.be.true;
    });
  });
});
//# sourceMappingURL=Notification-spec.js.map
