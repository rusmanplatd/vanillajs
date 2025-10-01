'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null'
        );
      extendStatics(d, b);
      /**
       *
       */
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    /**
     *
     * @param value
     */
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      /**
       *
       * @param value
       */
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      /**
       *
       * @param value
       */
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      /**
       *
       * @param result
       */
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    /**
     *
     * @param n
     */
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    /**
     *
     * @param op
     */
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('./helpers/observableMatcher');
/**
 *
 * @param val
 */
function expectFullObserver(val) {
  chai_1.expect(val).to.be.a('object');
  chai_1.expect(val.next).to.be.a('function');
  chai_1.expect(val.error).to.be.a('function');
  chai_1.expect(val.complete).to.be.a('function');
  chai_1.expect(val.closed).to.be.a('boolean');
}
describe('Observable', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should be constructed with a subscriber function', function (done) {
    var source = new rxjs_1.Observable(function (observer) {
      expectFullObserver(observer);
      observer.next(1);
      observer.complete();
    });
    source.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(1);
      },
      complete: done,
    });
  });
  it('should send errors thrown in the constructor down the error path', function (done) {
    new rxjs_1.Observable(function () {
      throw new Error('this should be handled');
    }).subscribe({
      error: function (err) {
        chai_1
          .expect(err)
          .to.exist.and.be.instanceof(Error)
          .and.have.property('message', 'this should be handled');
        done();
      },
    });
  });
  it('should allow empty ctor, which is effectively a never-observable', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable;
      var result = new rxjs_1.Observable();
      expectObservable(result).toBe('-');
    });
  });
  describe('forEach', function () {
    it('should iterate and return a Promise', function (done) {
      var expected = [1, 2, 3];
      var result = rxjs_1
        .of(1, 2, 3)
        .forEach(function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        }, Promise)
        .then(function () {
          done();
        });
      chai_1.expect(result.then).to.be.a('function');
    });
    it('should reject promise when in error', function (done) {
      rxjs_1
        .throwError(function () {
          return 'bad';
        })
        .forEach(function () {
          done(new Error('should not be called'));
        }, Promise)
        .then(
          function () {
            done(new Error('should not complete'));
          },
          function (err) {
            chai_1.expect(err).to.equal('bad');
            done();
          }
        );
    });
    it('should allow Promise to be globally configured', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wasCalled_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, , 2, 3]);
              wasCalled_1 = false;
              rxjs_1.config.Promise = function MyPromise(callback) {
                wasCalled_1 = true;
                return new Promise(callback);
              };
              return [
                4,
                rxjs_1.of(42).forEach(function (x) {
                  chai_1.expect(x).to.equal(42);
                }),
              ];
            case 1:
              _a.sent();
              chai_1.expect(wasCalled_1).to.be.true;
              return [3, 3];
            case 2:
              rxjs_1.config.Promise = undefined;
              return [7];
            case 3:
              return [2];
          }
        });
      });
    });
    it('should reject promise if nextHandler throws', function (done) {
      var results = [];
      rxjs_1
        .of(1, 2, 3)
        .forEach(function (x) {
          if (x === 3) {
            throw new Error('NO THREES!');
          }
          results.push(x);
        }, Promise)
        .then(
          function () {
            done(new Error('should not be called'));
          },
          function (err) {
            chai_1.expect(err).to.be.an('error', 'NO THREES!');
            chai_1.expect(results).to.deep.equal([1, 2]);
          }
        )
        .then(function () {
          done();
        });
    });
    it('should handle a synchronous throw from the next handler', function () {
      var expected = new Error(
        'I told, you Bobby Boucher, threes are the debil!'
      );
      var syncObservable = new rxjs_1.Observable(function (observer) {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.next(4);
      });
      var results = [];
      return syncObservable
        .forEach(function (x) {
          results.push(x);
          if (x === 3) {
            throw expected;
          }
        })
        .then(
          function () {
            throw new Error('should not be called');
          },
          function (err) {
            results.push(err);
            chai_1.expect(results).to.deep.equal([1, 2, 3, expected]);
          }
        );
    });
    it('should handle an asynchronous throw from the next handler and tear down', function () {
      var expected = new Error(
        'I told, you Bobby Boucher, twos are the debil!'
      );
      var asyncObservable = new rxjs_1.Observable(function (observer) {
        var i = 1;
        var id = setInterval(function () {
          return observer.next(i++);
        }, 1);
        return function () {
          clearInterval(id);
        };
      });
      var results = [];
      return asyncObservable
        .forEach(function (x) {
          results.push(x);
          if (x === 2) {
            throw expected;
          }
        })
        .then(
          function () {
            throw new Error('should not be called');
          },
          function (err) {
            results.push(err);
            chai_1.expect(results).to.deep.equal([1, 2, expected]);
          }
        );
    });
  });
  describe('subscribe', function () {
    it('should work with handlers with hacked bind methods', function () {
      var source = rxjs_1.of('Hi');
      var results = [];
      var next = function (value) {
        results.push(value);
      };
      next.bind = function () {};
      var complete = function () {
        results.push('done');
      };
      complete.bind = function () {};
      source.subscribe({ next: next, complete: complete });
      chai_1.expect(results).to.deep.equal(['Hi', 'done']);
    });
    it('should work with handlers with hacked bind methods, in the error case', function () {
      var source = rxjs_1.throwError(function () {
        return 'an error';
      });
      var results = [];
      var error = function (value) {
        results.push(value);
      };
      source.subscribe({ error: error });
      chai_1.expect(results).to.deep.equal(['an error']);
    });
    it('should be synchronous', function () {
      var subscribed = false;
      var nexted;
      var completed;
      var source = new rxjs_1.Observable(function (observer) {
        subscribed = true;
        observer.next('wee');
        chai_1.expect(nexted).to.equal('wee');
        observer.complete();
        chai_1.expect(completed).to.be.true;
      });
      chai_1.expect(subscribed).to.be.false;
      var mutatedByNext = false;
      var mutatedByComplete = false;
      source.subscribe({
        next: function (x) {
          nexted = x;
          mutatedByNext = true;
        },
        complete: function () {
          completed = true;
          mutatedByComplete = true;
        },
      });
      chai_1.expect(mutatedByNext).to.be.true;
      chai_1.expect(mutatedByComplete).to.be.true;
    });
    it('should work when subscribe is called with no arguments', function () {
      var source = new rxjs_1.Observable(function (subscriber) {
        subscriber.next('foo');
        subscriber.complete();
      });
      source.subscribe();
    });
    it('should not be unsubscribed when other empty subscription completes', function () {
      var unsubscribeCalled = false;
      var source = new rxjs_1.Observable(function () {
        return function () {
          unsubscribeCalled = true;
        };
      });
      source.subscribe();
      chai_1.expect(unsubscribeCalled).to.be.false;
      rxjs_1.empty().subscribe();
      chai_1.expect(unsubscribeCalled).to.be.false;
    });
    it('should not be unsubscribed when other subscription with same observer completes', function () {
      var unsubscribeCalled = false;
      var source = new rxjs_1.Observable(function () {
        return function () {
          unsubscribeCalled = true;
        };
      });
      var observer = {
        next: function () {},
      };
      source.subscribe(observer);
      chai_1.expect(unsubscribeCalled).to.be.false;
      rxjs_1.empty().subscribe(observer);
      chai_1.expect(unsubscribeCalled).to.be.false;
    });
    it('should run unsubscription logic when an error is sent asynchronously and subscribe is called with no arguments', function (done) {
      var sandbox = sinon.createSandbox();
      var fakeTimer = sandbox.useFakeTimers();
      var unsubscribeCalled = false;
      var source = new rxjs_1.Observable(function (observer) {
        var id = setInterval(function () {
          observer.error(0);
        }, 1);
        return function () {
          clearInterval(id);
          unsubscribeCalled = true;
        };
      });
      source.subscribe({
        error: function () {},
      });
      setTimeout(function () {
        var err;
        var errHappened = false;
        try {
          chai_1.expect(unsubscribeCalled).to.be.true;
        } catch (e) {
          err = e;
          errHappened = true;
        } finally {
          if (!errHappened) {
            done();
          } else {
            done(err);
          }
        }
      }, 100);
      fakeTimer.tick(110);
      sandbox.restore();
    });
    it('should return a Subscription that calls the unsubscribe function returned by the subscriber', function () {
      var unsubscribeCalled = false;
      var source = new rxjs_1.Observable(function () {
        return function () {
          unsubscribeCalled = true;
        };
      });
      var sub = source.subscribe(function () {});
      chai_1.expect(sub instanceof rxjs_1.Subscription).to.be.true;
      chai_1.expect(unsubscribeCalled).to.be.false;
      chai_1.expect(sub.unsubscribe).to.be.a('function');
      sub.unsubscribe();
      chai_1.expect(unsubscribeCalled).to.be.true;
    });
    it('should ignore next messages after unsubscription', function (done) {
      var times = 0;
      var subscription = new rxjs_1.Observable(function (observer) {
        var i = 0;
        var id = setInterval(function () {
          observer.next(i++);
        });
        return function () {
          clearInterval(id);
          chai_1.expect(times).to.equal(2);
          done();
        };
      })
        .pipe(
          operators_1.tap(function () {
            return (times += 1);
          })
        )
        .subscribe(function () {
          if (times === 2) {
            subscription.unsubscribe();
          }
        });
    });
    it('should ignore error messages after unsubscription', function (done) {
      var times = 0;
      var errorCalled = false;
      var subscription = new rxjs_1.Observable(function (observer) {
        var i = 0;
        var id = setInterval(function () {
          observer.next(i++);
          if (i === 3) {
            observer.error(new Error());
          }
        });
        return function () {
          clearInterval(id);
          chai_1.expect(times).to.equal(2);
          chai_1.expect(errorCalled).to.be.false;
          done();
        };
      })
        .pipe(
          operators_1.tap(function () {
            return (times += 1);
          })
        )
        .subscribe({
          next: function () {
            if (times === 2) {
              subscription.unsubscribe();
            }
          },
          error: function () {
            errorCalled = true;
          },
        });
    });
    it('should ignore complete messages after unsubscription', function (done) {
      var times = 0;
      var completeCalled = false;
      var subscription = new rxjs_1.Observable(function (observer) {
        var i = 0;
        var id = setInterval(function () {
          observer.next(i++);
          if (i === 3) {
            observer.complete();
          }
        });
        return function () {
          clearInterval(id);
          chai_1.expect(times).to.equal(2);
          chai_1.expect(completeCalled).to.be.false;
          done();
        };
      })
        .pipe(
          operators_1.tap(function () {
            return (times += 1);
          })
        )
        .subscribe({
          next: function () {
            if (times === 2) {
              subscription.unsubscribe();
            }
          },
          complete: function () {
            completeCalled = true;
          },
        });
    });
    describe('when called with an anonymous observer', function () {
      it(
        'should accept an anonymous observer with just a next function and call the next function in the context' +
          ' of the anonymous observer',
        function (done) {
          var o = {
            myValue: 'foo',
            next: function (x) {
              chai_1.expect(this.myValue).to.equal('foo');
              chai_1.expect(x).to.equal(1);
              done();
            },
          };
          rxjs_1.of(1).subscribe(o);
        }
      );
      it(
        'should accept an anonymous observer with just an error function and call the error function in the context' +
          ' of the anonymous observer',
        function (done) {
          var o = {
            myValue: 'foo',
            error: function (err) {
              chai_1.expect(this.myValue).to.equal('foo');
              chai_1.expect(err).to.equal('bad');
              done();
            },
          };
          rxjs_1
            .throwError(function () {
              return 'bad';
            })
            .subscribe(o);
        }
      );
      it(
        'should accept an anonymous observer with just a complete function and call the complete function in the' +
          ' context of the anonymous observer',
        function (done) {
          var o = {
            myValue: 'foo',
            complete: function complete() {
              chai_1.expect(this.myValue).to.equal('foo');
              done();
            },
          };
          rxjs_1.empty().subscribe(o);
        }
      );
      it('should accept an anonymous observer with no functions at all', function () {
        chai_1
          .expect(function () {
            rxjs_1.empty().subscribe({});
          })
          .not.to.throw();
      });
      it('should ignore next messages after unsubscription', function (done) {
        var times = 0;
        var subscription = new rxjs_1.Observable(function (observer) {
          var i = 0;
          var id = setInterval(function () {
            observer.next(i++);
          });
          return function () {
            clearInterval(id);
            chai_1.expect(times).to.equal(2);
            done();
          };
        })
          .pipe(
            operators_1.tap(function () {
              return (times += 1);
            })
          )
          .subscribe({
            next: function () {
              if (times === 2) {
                subscription.unsubscribe();
              }
            },
          });
      });
      it('should ignore error messages after unsubscription', function (done) {
        var times = 0;
        var errorCalled = false;
        var subscription = new rxjs_1.Observable(function (observer) {
          var i = 0;
          var id = setInterval(function () {
            observer.next(i++);
            if (i === 3) {
              observer.error(new Error());
            }
          });
          return function () {
            clearInterval(id);
            chai_1.expect(times).to.equal(2);
            chai_1.expect(errorCalled).to.be.false;
            done();
          };
        })
          .pipe(
            operators_1.tap(function () {
              return (times += 1);
            })
          )
          .subscribe({
            next: function () {
              if (times === 2) {
                subscription.unsubscribe();
              }
            },
            error: function () {
              errorCalled = true;
            },
          });
      });
      it('should ignore complete messages after unsubscription', function (done) {
        var times = 0;
        var completeCalled = false;
        var subscription = new rxjs_1.Observable(function (observer) {
          var i = 0;
          var id = setInterval(function () {
            observer.next(i++);
            if (i === 3) {
              observer.complete();
            }
          });
          return function () {
            clearInterval(id);
            chai_1.expect(times).to.equal(2);
            chai_1.expect(completeCalled).to.be.false;
            done();
          };
        })
          .pipe(
            operators_1.tap(function () {
              return (times += 1);
            })
          )
          .subscribe({
            next: function () {
              if (times === 2) {
                subscription.unsubscribe();
              }
            },
            complete: function () {
              completeCalled = true;
            },
          });
      });
    });
    it('should finalize even with a synchronous thrown error', function () {
      var called = false;
      var badObservable = new rxjs_1.Observable(function (subscriber) {
        subscriber.add(function () {
          called = true;
        });
        throw new Error('bad');
      });
      badObservable.subscribe({
        error: function () {},
      });
      chai_1.expect(called).to.be.true;
    });
    it('should handle empty string sync errors', function () {
      var badObservable = new rxjs_1.Observable(function () {
        throw '';
      });
      var caught = false;
      badObservable.subscribe({
        error: function (err) {
          caught = true;
          chai_1.expect(err).to.equal('');
        },
      });
      chai_1.expect(caught).to.be.true;
    });
    describe('if config.useDeprecatedSynchronousErrorHandling === true', function () {
      beforeEach(function () {
        rxjs_1.config.useDeprecatedSynchronousErrorHandling = true;
      });
      it('should throw synchronously', function () {
        chai_1
          .expect(function () {
            return rxjs_1
              .throwError(function () {
                return new Error('thrown error');
              })
              .subscribe();
          })
          .to.throw(Error, 'thrown error');
      });
      it('should rethrow if next handler throws', function () {
        var observable = new rxjs_1.Observable(function (observer) {
          observer.next(1);
        });
        var sink = rxjs_1.Subscriber.create(function () {
          throw 'error!';
        });
        chai_1
          .expect(function () {
            observable.subscribe(sink);
          })
          .to.throw('error!');
      });
      it('should still rethrow synchronous errors from next handlers on synchronous observables', function () {
        chai_1
          .expect(function () {
            rxjs_1
              .of('test')
              .pipe(
                operators_1.map(function (x) {
                  return x + '!!!';
                }),
                operators_1.map(function (x) {
                  return x + x;
                }),
                operators_1.map(function (x) {
                  return x + x;
                }),
                operators_1.map(function (x) {
                  return x + x;
                })
              )
              .subscribe({
                next: function () {
                  throw new Error('hi there!');
                },
              });
          })
          .to.throw('hi there!');
      });
      it('should rethrow synchronous errors from flattened observables', function () {
        chai_1
          .expect(function () {
            rxjs_1
              .of(1)
              .pipe(
                operators_1.concatMap(function () {
                  return rxjs_1.throwError(function () {
                    return new Error('Ahoy! An error!');
                  });
                })
              )
              .subscribe(console.log);
          })
          .to.throw('Ahoy! An error!');
        chai_1
          .expect(function () {
            rxjs_1
              .of(1)
              .pipe(
                operators_1.switchMap(function () {
                  return rxjs_1.throwError(function () {
                    return new Error('Avast! Thar be a new error!');
                  });
                })
              )
              .subscribe(console.log);
          })
          .to.throw('Avast! Thar be a new error!');
      });
      it('should finalize even with a synchronous error', function () {
        var called = false;
        var badObservable = new rxjs_1.Observable(function (subscriber) {
          subscriber.add(function () {
            called = true;
          });
          subscriber.error(new Error('bad'));
        });
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(called).to.be.true;
      });
      it('should finalize even with a synchronous thrown error', function () {
        var called = false;
        var badObservable = new rxjs_1.Observable(function (subscriber) {
          subscriber.add(function () {
            called = true;
          });
          throw new Error('bad');
        });
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(called).to.be.true;
      });
      it('should handle empty string sync errors', function () {
        var badObservable = new rxjs_1.Observable(function () {
          throw '';
        });
        var caught = false;
        try {
          badObservable.subscribe();
        } catch (err) {
          caught = true;
          chai_1.expect(err).to.equal('');
        }
        chai_1.expect(caught).to.be.true;
      });
      it('should execute finalizer even with a sync error', function () {
        var called = false;
        var badObservable = new rxjs_1.Observable(function (subscriber) {
          subscriber.error(new Error('bad'));
        }).pipe(
          operators_1.finalize(function () {
            called = true;
          })
        );
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(called).to.be.true;
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
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(called).to.be.true;
      });
      it('should execute finalizer in order even with a sync error', function () {
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
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(results).to.deep.equal([1, 2]);
      });
      it('should execute finalizer in order even with a sync thrown error', function () {
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
        try {
          badObservable.subscribe();
        } catch (err) {}
        chai_1.expect(results).to.deep.equal([1, 2]);
      });
      it('should not have a run-time error if no errors are thrown and there are operators', function () {
        chai_1
          .expect(function () {
            rxjs_1
              .of(1, 2, 3)
              .pipe(
                operators_1.map(function (x) {
                  return x + x;
                }),
                operators_1.map(function (x) {
                  return Math.log(x);
                })
              )
              .subscribe();
          })
          .not.to.throw();
      });
      it('should call finalize if sync unsubscribed', function () {
        var called = false;
        var observable = new rxjs_1.Observable(function () {
          return function () {
            return (called = true);
          };
        });
        var subscription = observable.subscribe();
        subscription.unsubscribe();
        chai_1.expect(called).to.be.true;
      });
      it('should call registered finalizer if sync unsubscribed', function () {
        var called = false;
        var observable = new rxjs_1.Observable(function (subscriber) {
          return subscriber.add(function () {
            return (called = true);
          });
        });
        var subscription = observable.subscribe();
        subscription.unsubscribe();
        chai_1.expect(called).to.be.true;
      });
      afterEach(function () {
        rxjs_1.config.useDeprecatedSynchronousErrorHandling = false;
      });
    });
  });
  describe('pipe', function () {
    it('should exist', function () {
      var source = rxjs_1.of('test');
      chai_1.expect(source.pipe).to.be.a('function');
    });
    it('should pipe multiple operations', function (done) {
      rxjs_1
        .of('test')
        .pipe(
          operators_1.map(function (x) {
            return x + x;
          }),
          operators_1.map(function (x) {
            return x + '!!!';
          })
        )
        .subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal('testtest!!!');
          },
          complete: done,
        });
    });
    it('should return the same observable if there are no arguments', function () {
      var source = rxjs_1.of('test');
      var result = source.pipe();
      chai_1.expect(result).to.equal(source);
    });
  });
  it('should not swallow internal errors', function (done) {
    rxjs_1.config.onStoppedNotification = function (notification) {
      chai_1.expect(notification.kind).to.equal('E');
      chai_1.expect(notification).to.have.property('error', 'bad');
      rxjs_1.config.onStoppedNotification = null;
      done();
    };
    new rxjs_1.Observable(function (subscriber) {
      subscriber.error('test');
      throw 'bad';
    }).subscribe({
      error: function (err) {
        chai_1.expect(err).to.equal('test');
      },
    });
  });
  it.skip('should handle sync errors within a test scheduler', function () {
    var observable = rxjs_1.of(4).pipe(
      operators_1.map(function (n) {
        if (n === 4) {
          throw 'four!';
        }
        return n;
      }),
      operators_1.catchError(function (err, source) {
        return source;
      })
    );
    rxTestScheduler.run(function (helpers) {
      var expectObservable = helpers.expectObservable;
      expectObservable(observable).toBe('-');
    });
  });
  it('should emit an error for unhandled synchronous exceptions from something like a stack overflow', function () {
    var source = new rxjs_1.Observable(function () {
      var boom = function () {
        return boom();
      };
      boom();
    });
    var thrownError = undefined;
    source.subscribe({
      error: function (err) {
        return (thrownError = err);
      },
    });
    chai_1.expect(thrownError).to.be.an.instanceOf(RangeError);
    chai_1
      .expect(thrownError.message)
      .to.equal('Maximum call stack size exceeded');
  });
});
describe('Observable.create', function () {
  it('should create an Observable', function () {
    var result = rxjs_1.Observable.create(function () {});
    chai_1.expect(result instanceof rxjs_1.Observable).to.be.true;
  });
  it('should provide an observer to the function', function () {
    var called = false;
    var result = rxjs_1.Observable.create(function (observer) {
      called = true;
      expectFullObserver(observer);
      observer.complete();
    });
    chai_1.expect(called).to.be.false;
    result.subscribe(function () {});
    chai_1.expect(called).to.be.true;
  });
  it('should send errors thrown in the passed function down the error path', function (done) {
    rxjs_1.Observable.create(function () {
      throw new Error('this should be handled');
    }).subscribe({
      error: function (err) {
        chai_1
          .expect(err)
          .to.exist.and.be.instanceof(Error)
          .and.have.property('message', 'this should be handled');
        done();
      },
    });
  });
});
describe('Observable.lift', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  var MyCustomObservable = (function (_super) {
    __extends(MyCustomObservable, _super);
    /**
     *
     */
    function MyCustomObservable() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    MyCustomObservable.from = function (source) {
      var observable = new MyCustomObservable();
      observable.source = source;
      return observable;
    };
    MyCustomObservable.prototype.lift = function (operator) {
      var observable = new MyCustomObservable();
      observable.source = this;
      observable.operator = operator;
      return observable;
    };
    return MyCustomObservable;
  })(rxjs_1.Observable);
  it('should return Observable which calls FinalizationLogic of operator on unsubscription', function (done) {
    var myOperator = {
      call: function (subscriber, source) {
        var subscription = source.subscribe(function (x) {
          return subscriber.next(x);
        });
        return function () {
          subscription.unsubscribe();
          done();
        };
      },
    };
    rxjs_1.NEVER.lift(myOperator).subscribe().unsubscribe();
  });
  it('should be overridable in a custom Observable type that composes', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [10, 20, 30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should compose through multicast and refCount', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.multicast(function () {
        return new rxjs_1.Subject();
      }),
      operators_1.refCount(),
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [10, 20, 30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should compose through publish and refCount', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.publish(),
      operators_1.refCount(),
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [10, 20, 30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should compose through publishLast and refCount', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.publishLast(),
      operators_1.refCount(),
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should compose through publishBehavior and refCount', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.publishBehavior(0),
      operators_1.refCount(),
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [0, 10, 20, 30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should composes Subjects in the simple case', function () {
    var subject = new rxjs_1.Subject();
    var result = subject.pipe(
      operators_1.map(function (x) {
        return 10 * x;
      })
    );
    chai_1.expect(result instanceof rxjs_1.Subject).to.be.true;
    var emitted = [];
    result.subscribe(function (value) {
      return emitted.push(value);
    });
    result.next(10);
    result.next(20);
    result.next(30);
    chai_1.expect(emitted).to.deep.equal([100, 200, 300]);
  });
  it('should demonstrate the horrors of sharing and lifting the Subject through', function () {
    var subject = new rxjs_1.Subject();
    var shared = subject.pipe(operators_1.share());
    var result1 = shared.pipe(
      operators_1.map(function (x) {
        return x * 10;
      })
    );
    var result2 = shared.pipe(
      operators_1.map(function (x) {
        return x - 10;
      })
    );
    chai_1.expect(result1 instanceof rxjs_1.Subject).to.be.true;
    var emitted1 = [];
    result1.subscribe(function (value) {
      return emitted1.push(value);
    });
    var emitted2 = [];
    result2.subscribe(function (value) {
      return emitted2.push(value);
    });
    result1.next(10);
    result2.next(20);
    result1.next(30);
    chai_1.expect(emitted1).to.deep.equal([100, 200, 300]);
    chai_1.expect(emitted2).to.deep.equal([0, 10, 20]);
  });
  describe.skip('The lift through Connectable gaff', function () {
    it('should compose through multicast and refCount, even if it is a Subject', function () {
      var subject = new rxjs_1.Subject();
      var result = subject.pipe(
        operators_1.multicast(function () {
          return new rxjs_1.Subject();
        }),
        operators_1.refCount(),
        operators_1.map(function (x) {
          return 10 * x;
        })
      );
      chai_1.expect(result instanceof rxjs_1.Subject).to.be.true;
      var emitted = [];
      result.subscribe(function (value) {
        return emitted.push(value);
      });
      result.next(10);
      result.next(20);
      result.next(30);
      chai_1.expect(emitted).to.deep.equal([100, 200, 300]);
    });
    it('should compose through publish and refCount, even if it is a Subject', function () {
      var subject = new rxjs_1.Subject();
      var result = subject.pipe(
        operators_1.publish(),
        operators_1.refCount(),
        operators_1.map(function (x) {
          return 10 * x;
        })
      );
      chai_1.expect(result instanceof rxjs_1.Subject).to.be.true;
      var emitted = [];
      result.subscribe(function (value) {
        return emitted.push(value);
      });
      result.next(10);
      result.next(20);
      result.next(30);
      chai_1.expect(emitted).to.deep.equal([100, 200, 300]);
    });
    it('should compose through publishLast and refCount, even if it is a Subject', function () {
      var subject = new rxjs_1.Subject();
      var result = subject.pipe(
        operators_1.publishLast(),
        operators_1.refCount(),
        operators_1.map(function (x) {
          return 10 * x;
        })
      );
      chai_1.expect(result instanceof rxjs_1.Subject).to.be.true;
      var emitted = [];
      result.subscribe(function (value) {
        return emitted.push(value);
      });
      result.next(10);
      result.next(20);
      result.next(30);
      chai_1.expect(emitted).to.deep.equal([100, 200, 300]);
    });
    it('should compose through publishBehavior and refCount, even if it is a Subject', function () {
      var subject = new rxjs_1.Subject();
      var result = subject.pipe(
        operators_1.publishBehavior(0),
        operators_1.refCount(),
        operators_1.map(function (x) {
          return 10 * x;
        })
      );
      chai_1.expect(result instanceof rxjs_1.Subject).to.be.true;
      var emitted = [];
      result.subscribe(function (value) {
        return emitted.push(value);
      });
      result.next(10);
      result.next(20);
      result.next(30);
      chai_1.expect(emitted).to.deep.equal([0, 100, 200, 300]);
    });
  });
  it('should compose through multicast with selector function', function (done) {
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.multicast(
        function () {
          return new rxjs_1.Subject();
        },
        function (shared) {
          return shared.pipe(
            operators_1.map(function (x) {
              return 10 * x;
            })
          );
        }
      )
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expected = [10, 20, 30];
    result.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should compose through combineLatest', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' -a--b-----c-d-e-|');
      var e2 = cold(' --1--2-3-4---|   ');
      var expected = '--A-BC-D-EF-G-H-|';
      var result = MyCustomObservable.from(e1).pipe(
        operators_1.combineLatest(e2, function (a, b) {
          return String(a) + String(b);
        })
      );
      chai_1.expect(result instanceof MyCustomObservable).to.be.true;
      expectObservable(result).toBe(expected, {
        A: 'a1',
        B: 'b1',
        C: 'b2',
        D: 'b3',
        E: 'b4',
        F: 'c4',
        G: 'd4',
        H: 'e4',
      });
    });
  });
  it('should compose through concat', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' --a--b-|');
      var e2 = cold(' --x---y--|');
      var expected = '--a--b---x---y--|';
      var result = MyCustomObservable.from(e1).pipe(
        operators_1.concat(e2, rxTestScheduler)
      );
      chai_1.expect(result instanceof MyCustomObservable).to.be.true;
      expectObservable(result).toBe(expected);
    });
  });
  it('should compose through merge', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' -a--b-| ');
      var e2 = cold(' --x--y-|');
      var expected = '-ax-by-|';
      var result = MyCustomObservable.from(e1).pipe(
        operators_1.merge(e2, rxTestScheduler)
      );
      chai_1.expect(result instanceof MyCustomObservable).to.be.true;
      expectObservable(result).toBe(expected);
    });
  });
  it('should compose through race', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' ---a-----b-----c----|');
      var e1subs = '  ^-------------------!';
      var e2 = cold(' ------x-----y-----z----|');
      var e2subs = '  ^--!';
      var expected = '---a-----b-----c----|';
      var result = MyCustomObservable.from(e1).pipe(operators_1.race(e2));
      chai_1.expect(result instanceof MyCustomObservable).to.be.true;
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should compose through zip', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable;
      var e1 = cold(' -a--b-----c-d-e-|');
      var e2 = cold(' --1--2-3-4---|   ');
      var expected = '--A--B----C-D|   ';
      var result = MyCustomObservable.from(e1).pipe(
        operators_1.zip(e2, function (a, b) {
          return String(a) + String(b);
        })
      );
      chai_1.expect(result instanceof MyCustomObservable).to.be.true;
      expectObservable(result).toBe(expected, {
        A: 'a1',
        B: 'b2',
        C: 'c3',
        D: 'd4',
      });
    });
  });
  it(
    'should allow injecting behaviors into all subscribers in an operator ' +
      'chain when overridden',
    function (done) {
      var log = [];
      var LogSubscriber = (function (_super) {
        __extends(LogSubscriber, _super);
        /**
         *
         */
        function LogSubscriber() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }
        LogSubscriber.prototype.next = function (value) {
          log.push('next ' + value);
          if (!this.isStopped) {
            this._next(value);
          }
        };
        return LogSubscriber;
      })(rxjs_1.Subscriber);
      var LogOperator = (function () {
        /**
         *
         * @param childOperator
         */
        function LogOperator(childOperator) {
          this.childOperator = childOperator;
        }
        LogOperator.prototype.call = function (subscriber, source) {
          return this.childOperator.call(new LogSubscriber(subscriber), source);
        };
        return LogOperator;
      })();
      var LogObservable = (function (_super) {
        __extends(LogObservable, _super);
        /**
         *
         */
        function LogObservable() {
          return (_super !== null && _super.apply(this, arguments)) || this;
        }
        LogObservable.prototype.lift = function (operator) {
          var observable = new LogObservable();
          observable.source = this;
          observable.operator = new LogOperator(operator);
          return observable;
        };
        return LogObservable;
      })(rxjs_1.Observable);
      var result = new LogObservable(function (observer) {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      }).pipe(
        operators_1.map(function (x) {
          return 10 * x;
        }),
        operators_1.filter(function (x) {
          return x > 15;
        }),
        operators_1.count()
      );
      chai_1.expect(result instanceof LogObservable).to.be.true;
      var expected = [2];
      result.subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal(expected.shift());
        },
        error: function () {
          done(new Error('should not be called'));
        },
        complete: function () {
          chai_1
            .expect(log)
            .to.deep.equal([
              'next 10',
              'next 20',
              'next 20',
              'next 30',
              'next 30',
              'next 2',
            ]);
          done();
        },
      });
    }
  );
});
//# sourceMappingURL=Observable-spec.js.map
