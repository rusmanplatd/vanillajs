'use strict';
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
var __await =
  (this && this.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  };
var __asyncGenerator =
  (this && this.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb('next'),
      verb('throw'),
      verb('return'),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    /**
     *
     * @param n
     */
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    /**
     *
     * @param n
     * @param v
     */
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    /**
     *
     * @param r
     */
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    /**
     *
     * @param value
     */
    function fulfill(value) {
      resume('next', value);
    }
    /**
     *
     * @param value
     */
    function reject(value) {
      resume('throw', value);
    }
    /**
     *
     * @param f
     * @param v
     */
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  };
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var web_streams_polyfill_1 = require('web-streams-polyfill');
var observableMatcher_1 = require('../helpers/observableMatcher');
/**
 *
 */
function getArguments() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return arguments;
}
describe('from', function () {
  var e_1, _a;
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should create an observable from an array', function () {
    rxTestScheduler.run(function (_a) {
      var expectObservable = _a.expectObservable,
        time = _a.time;
      var delayTime = time('--|');
      var expected = 'x-y-(z|)';
      var e1 = rxjs_1.from([10, 20, 30]).pipe(
        operators_1.concatMap(function (x, i) {
          return rxjs_1.of(x).pipe(operators_1.delay(i === 0 ? 0 : delayTime));
        })
      );
      expectObservable(e1).toBe(expected, { x: 10, y: 20, z: 30 });
    });
  });
  it('should throw for non observable object', function () {
    var r = function () {
      rxjs_1.from({}).subscribe();
    };
    chai_1.expect(r).to.throw();
  });
  it('should finalize an AsyncGenerator', function (done) {
    var results = [];
    var sideEffects = [];
    /**
     *
     */
    function gen() {
      return __asyncGenerator(this, arguments, function gen_1() {
        var i;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, , 6, 7]);
              i = 0;
              _a.label = 1;
            case 1:
              if (!true) return [3, 5];
              sideEffects.push(i);
              return [4, __await(i++)];
            case 2:
              return [4, __await.apply(void 0, [_a.sent()])];
            case 3:
              return [4, _a.sent()];
            case 4:
              _a.sent();
              return [3, 1];
            case 5:
              return [3, 7];
            case 6:
              results.push('finalized generator');
              return [7];
            case 7:
              return [2];
          }
        });
      });
    }
    var source = rxjs_1.from(gen()).pipe(operators_1.take(3));
    source.subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        results.push('done');
        setTimeout(function () {
          chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
          chai_1
            .expect(results)
            .to.deep.equal([0, 1, 2, 'done', 'finalized generator']);
          done();
        });
      },
    });
  });
  it('should finalize an AsyncGenerator on error', function (done) {
    var results = [];
    var sideEffects = [];
    /**
     *
     */
    function gen() {
      return __asyncGenerator(this, arguments, function gen_2() {
        var i;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, , 6, 7]);
              i = 0;
              _a.label = 1;
            case 1:
              if (!true) return [3, 5];
              sideEffects.push(i);
              return [4, __await(i++)];
            case 2:
              return [4, __await.apply(void 0, [_a.sent()])];
            case 3:
              return [4, _a.sent()];
            case 4:
              _a.sent();
              return [3, 1];
            case 5:
              return [3, 7];
            case 6:
              results.push('finalized generator');
              return [7];
            case 7:
              return [2];
          }
        });
      });
    }
    var source = rxjs_1.from(gen()).pipe(
      operators_1.tap({
        next: function (value) {
          if (value === 2) {
            throw new Error('weee');
          }
        },
      })
    );
    source.subscribe({
      next: function (value) {
        return results.push(value);
      },
      error: function () {
        results.push('in error');
        setTimeout(function () {
          chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
          chai_1
            .expect(results)
            .to.deep.equal([0, 1, 'in error', 'finalized generator']);
          done();
        });
      },
    });
  });
  it('should finalize an AsyncGenerator on unsubscribe', function (done) {
    var results = [];
    var sideEffects = [];
    var subscription;
    /**
     *
     */
    function gen() {
      return __asyncGenerator(this, arguments, function gen_3() {
        var i;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, , 6, 7]);
              i = 0;
              _a.label = 1;
            case 1:
              if (!true) return [3, 5];
              sideEffects.push(i);
              return [4, __await(i++)];
            case 2:
              return [4, __await.apply(void 0, [_a.sent()])];
            case 3:
              return [4, _a.sent()];
            case 4:
              _a.sent();
              if (i === 2) {
                subscription.unsubscribe();
              }
              return [3, 1];
            case 5:
              return [3, 7];
            case 6:
              results.push('finalized generator');
              chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
              chai_1
                .expect(results)
                .to.deep.equal([0, 1, 'finalized generator']);
              done();
              return [7];
            case 7:
              return [2];
          }
        });
      });
    }
    var source = rxjs_1.from(gen());
    subscription = source.subscribe(function (value) {
      return results.push(value);
    });
  });
  it('should finalize a generator', function () {
    var results = [];
    /**
     *
     */
    function gen() {
      var i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, , 4, 5]);
            i = 0;
            _a.label = 1;
          case 1:
            if (!true) return [3, 3];
            return [4, i++];
          case 2:
            _a.sent();
            return [3, 1];
          case 3:
            return [3, 5];
          case 4:
            results.push('finalized generator');
            return [7];
          case 5:
            return [2];
        }
      });
    }
    var source = rxjs_1.from(gen()).pipe(operators_1.take(3));
    source.subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('done');
      },
    });
    chai_1
      .expect(results)
      .to.deep.equal([0, 1, 2, 'done', 'finalized generator']);
  });
  var fakervable = function () {
    var _a;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return (
      (_a = {}),
      (_a[rxjs_1.observable] = function () {
        return {
          subscribe: function (observer) {
            var e_2, _a;
            try {
              for (
                var values_1 = __values(values), values_1_1 = values_1.next();
                !values_1_1.done;
                values_1_1 = values_1.next()
              ) {
                var value = values_1_1.value;
                observer.next(value);
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return))
                  _a.call(values_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
            observer.complete();
          },
        };
      }),
      _a
    );
  };
  var fakeArrayObservable = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    var arr = ['bad array!'];
    arr[rxjs_1.observable] = function () {
      return {
        subscribe: function (observer) {
          var e_3, _a;
          try {
            for (
              var values_2 = __values(values), values_2_1 = values_2.next();
              !values_2_1.done;
              values_2_1 = values_2.next()
            ) {
              var value = values_2_1.value;
              observer.next(value);
            }
          } catch (e_3_1) {
            e_3 = { error: e_3_1 };
          } finally {
            try {
              if (values_2_1 && !values_2_1.done && (_a = values_2.return))
                _a.call(values_2);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
          observer.complete();
        },
      };
    };
    return arr;
  };
  var fakerator = function () {
    var _a;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return (
      (_a = {}),
      (_a[Symbol.iterator] = function () {
        var clone = __spreadArray([], __read(values));
        return {
          next: function () {
            return {
              done: clone.length <= 0,
              value: clone.shift(),
            };
          },
        };
      }),
      _a
    );
  };
  var sources = [
    {
      name: 'observable',
      createValue: function () {
        return rxjs_1.of('x');
      },
    },
    {
      name: 'observable-like',
      createValue: function () {
        return fakervable('x');
      },
    },
    {
      name: 'observable-like-array',
      createValue: function () {
        return fakeArrayObservable('x');
      },
    },
    {
      name: 'array',
      createValue: function () {
        return ['x'];
      },
    },
    {
      name: 'promise',
      createValue: function () {
        return Promise.resolve('x');
      },
    },
    {
      name: 'iterator',
      createValue: function () {
        return fakerator('x');
      },
    },
    {
      name: 'array-like',
      createValue: function () {
        var _a;
        return ((_a = {}), (_a[0] = 'x'), (_a.length = 1), _a);
      },
    },
    {
      name: 'readable-stream-like',
      createValue: function () {
        return new web_streams_polyfill_1.ReadableStream({
          pull: function (controller) {
            controller.enqueue('x');
            controller.close();
          },
        });
      },
    },
    {
      name: 'string',
      createValue: function () {
        return 'x';
      },
    },
    {
      name: 'arguments',
      createValue: function () {
        return getArguments('x');
      },
    },
  ];
  if (Symbol && Symbol.asyncIterator) {
    var fakeAsyncIterator_1 = function () {
      var _a;
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
      }
      return (
        (_a = {}),
        (_a[Symbol.asyncIterator] = function () {
          var _a;
          var i = 0;
          return (
            (_a = {
              next: function () {
                var index = i++;
                if (index < values.length) {
                  return Promise.resolve({ done: false, value: values[index] });
                } else {
                  return Promise.resolve({ done: true });
                }
              },
            }),
            (_a[Symbol.asyncIterator] = function () {
              return this;
            }),
            _a
          );
        }),
        _a
      );
    };
    sources.push({
      name: 'async-iterator',
      createValue: function () {
        return fakeAsyncIterator_1('x');
      },
    });
  }
  var _loop_1 = function (source) {
    it('should accept ' + source.name, function (done) {
      var nextInvoked = false;
      rxjs_1.from(source.createValue()).subscribe({
        next: function (x) {
          nextInvoked = true;
          chai_1.expect(x).to.equal('x');
        },
        error: function (x) {
          done(new Error('should not be called'));
        },
        complete: function () {
          chai_1.expect(nextInvoked).to.equal(true);
          done();
        },
      });
    });
    it('should accept ' + source.name + ' and scheduler', function (done) {
      var nextInvoked = false;
      rxjs_1.from(source.createValue(), rxjs_1.asyncScheduler).subscribe({
        next: function (x) {
          nextInvoked = true;
          chai_1.expect(x).to.equal('x');
        },
        error: function (x) {
          done(new Error('should not be called'));
        },
        complete: function () {
          chai_1.expect(nextInvoked).to.equal(true);
          done();
        },
      });
      chai_1.expect(nextInvoked).to.equal(false);
    });
    it('should accept a function that implements [Symbol.observable]', function (done) {
      var subject = new rxjs_1.Subject();
      var handler = function (arg) {
        return subject.next(arg);
      };
      handler[rxjs_1.observable] = function () {
        return subject;
      };
      var nextInvoked = false;
      rxjs_1
        .from(handler)
        .pipe(operators_1.first())
        .subscribe({
          next: function (x) {
            nextInvoked = true;
            chai_1.expect(x).to.equal('x');
          },
          error: function (x) {
            done(new Error('should not be called'));
          },
          complete: function () {
            chai_1.expect(nextInvoked).to.equal(true);
            done();
          },
        });
      handler('x');
    });
    it('should accept a thennable that happens to have a subscribe method', function (done) {
      var input = Promise.resolve('test');
      input.subscribe = rxjs_1.noop;
      rxjs_1.from(input).subscribe({
        next: function (x) {
          chai_1.expect(x).to.equal('test');
          done();
        },
      });
    });
  };
  try {
    for (
      var sources_1 = __values(sources), sources_1_1 = sources_1.next();
      !sources_1_1.done;
      sources_1_1 = sources_1.next()
    ) {
      var source = sources_1_1.value;
      _loop_1(source);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (sources_1_1 && !sources_1_1.done && (_a = sources_1.return))
        _a.call(sources_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  it('should appropriately handle errors from an iterator', function () {
    var erroringIterator = (function () {
      var i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            i = 0;
            _a.label = 1;
          case 1:
            if (!(i < 5)) return [3, 4];
            if (i === 3) {
              throw new Error('bad');
            }
            return [4, i];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            i++;
            return [3, 1];
          case 4:
            return [2];
        }
      });
    })();
    var results = [];
    rxjs_1.from(erroringIterator).subscribe({
      next: function (x) {
        return results.push(x);
      },
      error: function (err) {
        return results.push(err.message);
      },
    });
    chai_1.expect(results).to.deep.equal([0, 1, 2, 'bad']);
  });
  it('should execute the finally block of a generator', function () {
    var finallyExecuted = false;
    var generator = (function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, , 2, 3]);
            return [4, 'hi'];
          case 1:
            _a.sent();
            return [3, 3];
          case 2:
            finallyExecuted = true;
            return [7];
          case 3:
            return [2];
        }
      });
    })();
    rxjs_1.from(generator).subscribe();
    chai_1.expect(finallyExecuted).to.be.true;
  });
  it('should support ReadableStream-like objects', function (done) {
    var input = [0, 1, 2];
    var output = [];
    var readableStream = new web_streams_polyfill_1.ReadableStream({
      pull: function (controller) {
        if (input.length > 0) {
          controller.enqueue(input.shift());
          if (input.length === 0) {
            controller.close();
          }
        }
      },
    });
    rxjs_1.from(readableStream).subscribe({
      next: function (value) {
        output.push(value);
        chai_1.expect(readableStream.locked).to.equal(true);
      },
      complete: function () {
        chai_1.expect(output).to.deep.equal([0, 1, 2]);
        chai_1.expect(readableStream.locked).to.equal(false);
        done();
      },
    });
  });
  it('should lock and release ReadableStream-like objects', function (done) {
    var input = [0, 1, 2];
    var output = [];
    var readableStream = new web_streams_polyfill_1.ReadableStream({
      pull: function (controller) {
        if (input.length > 0) {
          controller.enqueue(input.shift());
          if (input.length === 0) {
            controller.close();
          }
        }
      },
    });
    rxjs_1.from(readableStream).subscribe({
      next: function (value) {
        output.push(value);
        chai_1.expect(readableStream.locked).to.equal(true);
      },
      complete: function () {
        chai_1.expect(output).to.deep.equal([0, 1, 2]);
        chai_1.expect(readableStream.locked).to.equal(false);
        done();
      },
    });
  });
});
//# sourceMappingURL=from-spec.js.map
