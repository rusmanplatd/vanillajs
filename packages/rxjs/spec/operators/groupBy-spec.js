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
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var NotificationFactories_1 = require('rxjs/internal/NotificationFactories');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('groupBy operator', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should group numbers by odd/even', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable;
      var e1 = hot('  --1---2---3---4---5---|');
      var expected = '--x---y---------------|';
      var x = cold('  1-------3-------5---|');
      var y = cold('  2-------4-------|');
      var expectedValues = { x: x, y: y };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return parseInt(val) % 2;
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
    });
  });
  /**
   *
   * @param str
   */
  function reverseString(str) {
    return str.split('').reverse().join('');
  }
  /**
   *
   * @param obj
   * @param fn
   */
  function mapObject(obj, fn) {
    var out = {};
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        out[p] = fn(obj[p]);
      }
    }
    return out;
  }
  it('should group values', function (done) {
    var expectedGroups = [
      { key: 1, values: [1, 3] },
      { key: 0, values: [2] },
    ];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.groupBy(function (x) {
          return x % 2;
        })
      )
      .subscribe({
        next: function (g) {
          var expectedGroup = expectedGroups.shift();
          chai_1.expect(g.key).to.equal(expectedGroup.key);
          g.subscribe(function (x) {
            chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
          });
        },
        complete: done,
      });
  });
  it('should group values with an element selector', function (done) {
    var expectedGroups = [
      { key: 1, values: ['1!', '3!'] },
      { key: 0, values: ['2!'] },
    ];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.groupBy(
          function (x) {
            return x % 2;
          },
          function (x) {
            return x + '!';
          }
        )
      )
      .subscribe({
        next: function (g) {
          var expectedGroup = expectedGroups.shift();
          chai_1.expect(g.key).to.equal(expectedGroup.key);
          g.subscribe(function (x) {
            chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
          });
        },
        complete: done,
      });
  });
  it('should group values with a duration selector', function () {
    var expectedGroups = [
      { key: 1, values: [1, 3] },
      { key: 0, values: [2, 4] },
      { key: 1, values: [5] },
      { key: 0, values: [6] },
    ];
    var resultingGroups = [];
    rxjs_1
      .of(1, 2, 3, 4, 5, 6)
      .pipe(
        operators_1.groupBy(
          function (x) {
            return x % 2;
          },
          {
            duration: function (g) {
              return g.pipe(operators_1.skip(1));
            },
          }
        )
      )
      .subscribe(function (g) {
        var group = { key: g.key, values: [] };
        g.subscribe(function (x) {
          group.values.push(x);
        });
        resultingGroups.push(group);
      });
    chai_1.expect(resultingGroups).to.deep.equal(expectedGroups);
  });
  it('should group values with a subject selector', function (done) {
    var expectedGroups = [
      { key: 1, values: [3] },
      { key: 0, values: [2] },
    ];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.groupBy(
          function (x) {
            return x % 2;
          },
          {
            connector: function () {
              return new rxjs_1.ReplaySubject(1);
            },
          }
        ),
        operators_1.delay(5)
      )
      .subscribe({
        next: function (g) {
          var expectedGroup = expectedGroups.shift();
          chai_1.expect(g.key).to.equal(expectedGroup.key);
          g.subscribe(function (x) {
            chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
          });
        },
        complete: done,
      });
  });
  it('should handle an empty Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |   ');
      var e1subs = '  (^!)';
      var expected = '|   ';
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var expected = '-';
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a just-throw Observable', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  #  ');
      var e1subs = '  (^!)';
      var expected = '#   ';
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an Observable with a single value', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { a: '  foo' };
      var e1 = hot('  ^--a--|', values);
      var e1subs = '  ^-----!';
      var expected = '---g--|';
      var g = cold('     a--|', values);
      var expectedValues = { g: g };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --w---x---y-z-------------|';
      var w = cold('         a-b---d---------i-----l-|', values);
      var x = cold('             c-------g-h---------|', values);
      var y = cold('                 e---------j-k---|', values);
      var z = cold('                   f-------------|', values);
      var expectedValues = { w: w, x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should emit GroupObservables', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
      };
      var e1 = hot('-1--2--^-a-b----|', values);
      var e1subs = '       ^--------!';
      var expected = '     --g------|';
      var expectedValues = { g: 'foo' };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.tap(function (group) {
          chai_1.expect(group.key).to.equal('foo');
          chai_1.expect(group instanceof rxjs_1.Observable).to.be.true;
        }),
        operators_1.map(function (group) {
          return group.key;
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector, assert GroupSubject key', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --w---x---y-z-------------|';
      var expectedValues = { w: 'foo', x: 'bar', y: 'baz', z: 'qux' };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.map(function (g) {
          return g.key;
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector, but outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --w---x---y-z-------------#';
      var expectedValues = { w: 'foo', x: 'bar', y: 'baz', z: 'qux' };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.map(function (g) {
          return g.key;
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector, inners propagate error from outer', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --w---x---y-z-------------#';
      var w = cold('         a-b---d---------i-----l-#', values);
      var x = cold('             c-------g-h---------#', values);
      var y = cold('                 e---------j-k---#', values);
      var z = cold('                   f-------------#', values);
      var expectedValues = { w: w, x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow outer to be unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var unsub = '        -----------!               ';
      var e1subs = '       ^----------!               ';
      var expected = '     --w---x---y-               ';
      var expectedValues = { w: 'foo', x: 'bar', y: 'baz' };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.map(function (group) {
          return group.key;
        })
      );
      expectObservable(source, unsub).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should unsubscribe from the source when the outer and inner subscriptions are disposed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-!                        ';
      var expected = '     --(a|)                     ';
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.take(1),
        operators_1.mergeMap(function (group) {
          return group.pipe(operators_1.take(1));
        })
      );
      expectObservable(source).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chain when unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^----------!               ';
      var expected = '     --w---x---y-               ';
      var unsub = '        -----------!               ';
      var expectedValues = { w: 'foo', x: 'bar', y: 'baz' };
      var source = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.groupBy(function (x) {
          return x.toLowerCase().trim();
        }),
        operators_1.mergeMap(function (group) {
          return rxjs_1.of(group.key);
        })
      );
      expectObservable(source, unsub).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector which eventually throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------!';
      var expected = '     --w---x---y-z-------#';
      var w = cold('         a-b---d---------i-#', values);
      var x = cold('             c-------g-h---#', values);
      var y = cold('                 e---------#', values);
      var z = cold('                   f-------#', values);
      var expectedValues = { w: w, x: x, y: y, z: z };
      var invoked = 0;
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          invoked++;
          if (invoked === 10) {
            throw 'error';
          }
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should group values with a keySelector and elementSelector, but elementSelector throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var reversedValues = mapObject(values, reverseString);
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------!';
      var expected = '     --w---x---y-z-------#';
      var w = cold('         a-b---d---------i-#', reversedValues);
      var x = cold('             c-------g-h---#', reversedValues);
      var y = cold('                 e---------#', reversedValues);
      var z = cold('                   f-------#', reversedValues);
      var expectedValues = { w: w, x: x, y: y, z: z };
      var invoked = 0;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            invoked++;
            if (invoked === 10) {
              throw 'error';
            }
            return reverseString(val);
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow the outer to be unsubscribed early but inners continue', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var unsub = '         ---------!                ';
      var expected = '      --w---x---                ';
      var w = cold('        a-b---d---------i-----l-| ', values);
      var x = cold('            c-------g-h---------| ', values);
      var expectedValues = { w: w, x: x };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      );
      expectObservable(source, unsub).toBe(expected, expectedValues);
    });
  });
  it('should allow an inner to be unsubscribed early but other inners continue', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var expected = '     --w---x---y-z-------------|';
      var w = '            --a-b---d-                 ';
      var unsubw = '       ---------!                 ';
      var x = '            ------c-------g-h---------|';
      var y = '            ----------e---------j-k---|';
      var z = '            ------------f-------------|';
      var expectedGroups = {
        w: testing_1.TestScheduler.parseMarbles(
          w,
          values,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          values,
          undefined,
          undefined,
          true
        ),
        y: testing_1.TestScheduler.parseMarbles(
          y,
          values,
          undefined,
          undefined,
          true
        ),
        z: testing_1.TestScheduler.parseMarbles(
          z,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var fooUnsubscriptionFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          unsubw,
          true
        ).unsubscribedFrame;
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.map(function (group) {
          var arr = [];
          var subscription = group
            .pipe(phonyMarbelize(testScheduler))
            .subscribe(function (value) {
              arr.push(value);
            });
          if (group.key === 'foo') {
            testScheduler.schedule(function () {
              subscription.unsubscribe();
            }, fooUnsubscriptionFrame - testScheduler.frame);
          }
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
    });
  });
  it('should allow inners to be unsubscribed early at different times', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var expected = '     --w---x---y-z-------------|';
      var w = '            --a-b---d-                 ';
      var unsubw = '       ---------!                 ';
      var x = '            ------c------              ';
      var unsubx = '       ------------!              ';
      var y = '            ----------e------          ';
      var unsuby = '       ----------------!          ';
      var z = '            ------------f-------       ';
      var unsubz = '       -------------------!       ';
      var expectedGroups = {
        w: testing_1.TestScheduler.parseMarbles(
          w,
          values,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          values,
          undefined,
          undefined,
          true
        ),
        y: testing_1.TestScheduler.parseMarbles(
          y,
          values,
          undefined,
          undefined,
          true
        ),
        z: testing_1.TestScheduler.parseMarbles(
          z,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var unsubscriptionFrames = {
        foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubw, true)
          .unsubscribedFrame,
        bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubx, true)
          .unsubscribedFrame,
        baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsuby, true)
          .unsubscribedFrame,
        qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubz, true)
          .unsubscribedFrame,
      };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.map(function (group) {
          var arr = [];
          var subscription = group
            .pipe(phonyMarbelize(testScheduler))
            .subscribe(function (value) {
              arr.push(value);
            });
          testScheduler.schedule(function () {
            subscription.unsubscribe();
          }, unsubscriptionFrames[group.key] - testScheduler.frame);
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
    });
  });
  it('should allow subscribing late to an inner Observable, outer completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var values = {
        a: '  foo',
        b: ' FoO ',
        d: 'foO ',
        i: 'FOO ',
        l: '    fOo    ',
      };
      var e1 = hot('          --a-b---d---------i-----l-|  ', values);
      var subs = '            ^-------------------------!  ';
      var subDuration = time('--------------------------|  ');
      var expected = '        ----------------------------|';
      e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      ).subscribe(function (group) {
        testScheduler.schedule(function () {
          expectObservable(group).toBe(expected);
        }, subDuration);
      });
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should allow subscribing late to an inner Observable, outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var values = {
        a: '  foo',
        b: ' FoO ',
        d: 'foO ',
        i: 'FOO ',
        l: '    fOo    ',
      };
      var e1 = hot('           --a-b---d---------i-----l-#', values);
      var subs = '             ^-------------------------! ';
      var subsDuration = time('--------------------------| ');
      var expected = '         ----------------------------#';
      e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        })
      ).subscribe({
        next: function (group) {
          testScheduler.schedule(function () {
            expectObservable(group).toBe(expected);
          }, subsDuration);
        },
        error: function () {},
      });
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });
  it('should allow subscribing late to inner, unsubscribe outer early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions,
        time = _a.time;
      var values = {
        a: '  foo',
        b: ' FoO ',
        d: 'foO ',
        i: 'FOO ',
        l: '    fOo    ',
      };
      var e1 = hot('           --a-b---d---------i-----l-#', values);
      var unsub = '            ------------!              ';
      var e1subs = '           ^-----------!              ';
      var subsDuration = time('------------|              ');
      var expectedOuter = '    --w----------              ';
      var expectedInner = '    -------------              ';
      var outerValues = { w: 'foo' };
      var source = e1.pipe(
        operators_1.groupBy(function (val) {
          return val.toLowerCase().trim();
        }),
        operators_1.tap(function (group) {
          testScheduler.schedule(function () {
            expectObservable(group).toBe(expectedInner);
          }, subsDuration);
        }),
        operators_1.map(function (group) {
          return group.key;
        })
      );
      expectObservable(source, unsub).toBe(expectedOuter, outerValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow using a keySelector, elementSelector, and durationSelector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var reversedValues = mapObject(values, reverseString);
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --v---w---x-y-----z-------|';
      var v = cold('       a-b---(d|)                 ', reversedValues);
      var w = cold('             c-------g-(h|)       ', reversedValues);
      var x = cold('                  e---------j-(k|)', reversedValues);
      var y = cold('                   f-------------|', reversedValues);
      var z = cold('                         i-----l-|', reversedValues);
      var expectedValues = { v: v, w: w, x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return reverseString(val);
          },
          function (group) {
            return group.pipe(operators_1.skip(2));
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow using a keySelector, elementSelector, and durationSelector that throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var reversedValues = mapObject(values, reverseString);
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var expected = '     --v---w---x-y-----z-------|';
      var v = cold('         a-b---(d#)               ', reversedValues);
      var w = cold('             c-------g-(h#)       ', reversedValues);
      var x = cold('                 e---------j-(k#) ', reversedValues);
      var y = cold('                   f-------------|', reversedValues);
      var z = cold('                         i-----l-|', reversedValues);
      var expectedValues = { v: v, w: w, x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return reverseString(val);
          },
          function (group) {
            return group.pipe(
              operators_1.skip(2),
              operators_1.map(function () {
                throw 'error';
              })
            );
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
    });
  });
  it('should allow using a keySelector and a durationSelector, outer throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-#', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --v---w---x-y-----z-------#';
      var v = cold('         a-b---(d|)               ', values);
      var w = cold('             c-------g-(h|)       ', values);
      var x = cold('                 e---------j-(k|) ', values);
      var y = cold('                   f-------------#', values);
      var z = cold('                         i-----l-#', values);
      var expectedValues = { v: v, w: w, x: x, y: y, z: z };
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          {
            duration: function (group) {
              return group.pipe(operators_1.skip(2));
            },
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow using a durationSelector, and outer unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var unsub = '        -----------!               ';
      var expected = '     --v---w---x-               ';
      var v = cold('         a-b---(d|)               ', values);
      var w = cold('             c-------g-(h|)       ', values);
      var x = cold('                 e---------j-(k|) ', values);
      var expectedValues = { v: v, w: w, x: x };
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          {
            duration: function (group) {
              return group.pipe(operators_1.skip(2));
            },
          }
        )
      );
      expectObservable(source, unsub).toBe(expected, expectedValues);
    });
  });
  it('should allow using a durationSelector, outer and all inners unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var unsub = '        -----------!';
      var expected = '     --v---w---x-';
      var v = '            --a-b---(d|)';
      var w = '            ------c-----';
      var x = '            ----------e-';
      var expectedGroups = {
        v: testing_1.TestScheduler.parseMarbles(
          v,
          values,
          undefined,
          undefined,
          true
        ),
        w: testing_1.TestScheduler.parseMarbles(
          w,
          values,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var unsubscriptionFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          unsub,
          true
        ).unsubscribedFrame;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          {
            duration: function (group) {
              return group.pipe(operators_1.skip(2));
            },
          }
        ),
        operators_1.map(function (group) {
          var arr = [];
          var subscription = group
            .pipe(phonyMarbelize(testScheduler))
            .subscribe(function (value) {
              arr.push(value);
            });
          testScheduler.schedule(function () {
            subscription.unsubscribe();
          }, unsubscriptionFrame - testScheduler.frame);
          return arr;
        })
      );
      expectObservable(source, unsub).toBe(expected, expectedGroups);
    });
  });
  it('should dispose a durationSelector after closing the group', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectSubscriptions = _a.expectSubscriptions;
      var obs = hot(' -0-1--------2-| ');
      var sub = '     ^--------------!';
      var unsubs = [
        '              -^--!',
        '              ---^--!',
        '              ------------^-!',
      ];
      var dur = '     ---s';
      var durations = [cold(dur), cold(dur), cold(dur)];
      var unsubscribedFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          sub,
          true
        ).unsubscribedFrame;
      obs
        .pipe(
          operators_1.groupBy(
            function (val) {
              return val;
            },
            {
              duration: function (group) {
                return durations[Number(group.key)];
              },
            }
          )
        )
        .subscribe();
      testScheduler.schedule(function () {
        durations.forEach(function (d, i) {
          expectSubscriptions(d.subscriptions).toBe(unsubs[i]);
        });
      }, unsubscribedFrame);
    });
  });
  it('should allow using a durationSelector, but keySelector throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------!      ';
      var expected = '     --v---w---x-y-----z-#      ';
      var v = cold('         a-b---(d|)               ', values);
      var w = cold('             c-------g-(h|)       ', values);
      var x = cold('                 e---------#      ', values);
      var y = cold('                   f-------#      ', values);
      var z = cold('                         i-#      ', values);
      var expectedValues = { v: v, w: w, x: x, y: y, z: z };
      var invoked = 0;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            invoked++;
            if (invoked === 10) {
              throw 'error';
            }
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          },
          function (group) {
            return group.pipe(operators_1.skip(2));
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow using a durationSelector, but elementSelector throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------!      ';
      var expected = '     --v---w---x-y-----z-#      ';
      var v = cold('         a-b---(d|)               ', values);
      var w = cold('             c-------g-(h|)       ', values);
      var x = cold('                 e---------#      ', values);
      var y = cold('                   f-------#      ', values);
      var z = cold('                         i-#      ', values);
      var expectedValues = { v: v, w: w, x: x, y: y, z: z };
      var invoked = 0;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            invoked++;
            if (invoked === 10) {
              throw 'error';
            }
            return val;
          },
          function (group) {
            return group.pipe(operators_1.skip(2));
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow using a durationSelector which eventually throws', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-----------!              ';
      var expected = '  --v---w---x-(y#)              ';
      var v = cold('         a-b---(d|)               ', values);
      var w = cold('             c-----#              ', values);
      var x = cold('                 e-#              ', values);
      var y = cold('                   #              ', values);
      var expectedValues = { v: v, w: w, x: x, y: y };
      var invoked = 0;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          },
          function (group) {
            invoked++;
            if (invoked === 4) {
              throw 'error';
            }
            return group.pipe(operators_1.skip(2));
          }
        )
      );
      expectObservable(source).toBe(expected, expectedValues);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow an inner to be unsubscribed early but other inners continue, with durationSelector', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var reversedValues = mapObject(values, reverseString);
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --v---w---x-y-----z-------|';
      var v = '            --a-b---                   ';
      var unsubv = '       -------!                   ';
      var w = '            ------c-------g-(h|)       ';
      var x = '             ----------e---------j-(k|)';
      var y = '            ------------f-------------|';
      var z = '            ------------------i-----l-|';
      var expectedGroups = {
        v: testing_1.TestScheduler.parseMarbles(
          v,
          reversedValues,
          undefined,
          undefined,
          true
        ),
        w: testing_1.TestScheduler.parseMarbles(
          w,
          reversedValues,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          reversedValues,
          undefined,
          undefined,
          true
        ),
        y: testing_1.TestScheduler.parseMarbles(
          y,
          reversedValues,
          undefined,
          undefined,
          true
        ),
        z: testing_1.TestScheduler.parseMarbles(
          z,
          reversedValues,
          undefined,
          undefined,
          true
        ),
      };
      var fooUnsubscriptionFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          unsubv,
          true
        ).unsubscribedFrame;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return reverseString(val);
          },
          function (group) {
            return group.pipe(operators_1.skip(2));
          }
        ),
        operators_1.map(function (group, index) {
          var arr = [];
          var subscription = group
            .pipe(phonyMarbelize(testScheduler))
            .subscribe(function (value) {
              arr.push(value);
            });
          if (group.key === 'foo' && index === 0) {
            testScheduler.schedule(function () {
              subscription.unsubscribe();
            }, fooUnsubscriptionFrame - testScheduler.frame);
          }
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should allow inners to be unsubscribed early at different times, with durationSelector', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|', values);
      var e1subs = '       ^-------------------------!';
      var expected = '     --v---w---x-y-----z-------|';
      var v = '            --a-b---                   ';
      var unsubv = '       -------!                   ';
      var w = '            ------c---                 ';
      var unsubw = '       ---------!                 ';
      var x = '            ----------e---------j-     ';
      var unsubx = '       ---------------------!     ';
      var y = '            ------------f----          ';
      var unsuby = '       ----------------!          ';
      var z = '            ------------------i----    ';
      var unsubz = '       ----------------------!    ';
      var expectedGroups = {
        v: testing_1.TestScheduler.parseMarbles(
          v,
          values,
          undefined,
          undefined,
          true
        ),
        w: testing_1.TestScheduler.parseMarbles(
          w,
          values,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          values,
          undefined,
          undefined,
          true
        ),
        y: testing_1.TestScheduler.parseMarbles(
          y,
          values,
          undefined,
          undefined,
          true
        ),
        z: testing_1.TestScheduler.parseMarbles(
          z,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var unsubscriptionFrames = {
        foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubv, true)
          .unsubscribedFrame,
        bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubw, true)
          .unsubscribedFrame,
        baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubx, true)
          .unsubscribedFrame,
        qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsuby, true)
          .unsubscribedFrame,
        foo2: testing_1.TestScheduler.parseMarblesAsSubscriptions(unsubz, true)
          .unsubscribedFrame,
      };
      var hasUnsubscribed = {};
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          },
          function (group) {
            return group.pipe(operators_1.skip(2));
          }
        ),
        operators_1.map(function (group) {
          var arr = [];
          var subscription = group
            .pipe(phonyMarbelize(testScheduler))
            .subscribe(function (value) {
              arr.push(value);
            });
          var unsubscriptionFrame = hasUnsubscribed[group.key]
            ? unsubscriptionFrames[group.key + '2']
            : unsubscriptionFrames[group.key];
          testScheduler.schedule(function () {
            subscription.unsubscribe();
            hasUnsubscribed[group.key] = true;
          }, unsubscriptionFrame - testScheduler.frame);
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return inners that when subscribed late exhibit hot behavior', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        c: 'baR  ',
        d: 'foO ',
        e: ' Baz   ',
        f: '  qux ',
        g: '   bar',
        h: ' BAR  ',
        i: 'FOO ',
        j: 'baz  ',
        k: ' bAZ ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b-c-d-e-f-g-h-i-j-k-l-|    ', values);
      var e1subs = '       ^-------------------------!    ';
      var expected = '     --v---w---x-y-------------|    ';
      var subv = '         ---^                           ';
      var v = '            ----b---d---------i-----l-|    ';
      var subw = '         ---------^                     ';
      var w = '            --------------g-h---------|    ';
      var subx = '         -------------------^           ';
      var x = '            --------------------j-k---|    ';
      var suby = '         ------------------------------^';
      var y = '            ------------------------------|';
      var expectedGroups = {
        v: testing_1.TestScheduler.parseMarbles(
          v,
          values,
          undefined,
          undefined,
          true
        ),
        w: testing_1.TestScheduler.parseMarbles(
          w,
          values,
          undefined,
          undefined,
          true
        ),
        x: testing_1.TestScheduler.parseMarbles(
          x,
          values,
          undefined,
          undefined,
          true
        ),
        y: testing_1.TestScheduler.parseMarbles(
          y,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var subscriptionFrames = {
        foo: testing_1.TestScheduler.parseMarblesAsSubscriptions(subv, true)
          .subscribedFrame,
        bar: testing_1.TestScheduler.parseMarblesAsSubscriptions(subw, true)
          .subscribedFrame,
        baz: testing_1.TestScheduler.parseMarblesAsSubscriptions(subx, true)
          .subscribedFrame,
        qux: testing_1.TestScheduler.parseMarblesAsSubscriptions(suby, true)
          .subscribedFrame,
      };
      var result = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          }
        ),
        operators_1.map(function (group) {
          var innerNotifications = [];
          var subscriptionFrame = subscriptionFrames[group.key];
          testScheduler.schedule(function () {
            group
              .pipe(phonyMarbelize(testScheduler))
              .subscribe(function (value) {
                innerNotifications.push(value);
              });
          }, subscriptionFrame - testScheduler.frame);
          return innerNotifications;
        })
      );
      expectObservable(result).toBe(expected, expectedGroups);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return inner group that when subscribed late emits complete()', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        d: 'foO ',
        i: 'FOO ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b---d---------i-----l-|      ', values);
      var e1subs = '       ^-------------------------!      ';
      var expected = '     --g-----------------------|      ';
      var innerSub = '     --------------------------------^';
      var g = '            --------------------------------|';
      var expectedGroups = {
        g: testing_1.TestScheduler.parseMarbles(
          g,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var innerSubscriptionFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          innerSub,
          true
        ).subscribedFrame;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          },
          function (group) {
            return group.pipe(operators_1.skip(7));
          }
        ),
        operators_1.map(function (group) {
          var arr = [];
          testScheduler.schedule(function () {
            group
              .pipe(phonyMarbelize(testScheduler))
              .subscribe(function (value) {
                arr.push(value);
              });
          }, innerSubscriptionFrame - testScheduler.frame);
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it.skip('should return inner group that when subscribed late emits error()', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: '  foo',
        b: ' FoO ',
        d: 'foO ',
        i: 'FOO ',
        l: '    fOo    ',
      };
      var e1 = hot('-1--2--^-a-b---d---------i-----l-#      ', values);
      var e1subs = '       ^-------------------------!      ';
      var expected = '     --g-----------------------#      ';
      var innerSub = '     --------------------------------^';
      var g = '            --------------------------------#';
      var expectedGroups = {
        g: testing_1.TestScheduler.parseMarbles(
          g,
          values,
          undefined,
          undefined,
          true
        ),
      };
      var innerSubscriptionFrame =
        testing_1.TestScheduler.parseMarblesAsSubscriptions(
          innerSub,
          true
        ).subscribedFrame;
      var source = e1.pipe(
        operators_1.groupBy(
          function (val) {
            return val.toLowerCase().trim();
          },
          function (val) {
            return val;
          },
          function (group) {
            return group.pipe(operators_1.skip(7));
          }
        ),
        operators_1.map(function (group) {
          var arr = [];
          testScheduler.schedule(function () {
            group
              .pipe(phonyMarbelize(testScheduler))
              .subscribe(function (value) {
                arr.push(value);
              });
          }, innerSubscriptionFrame - testScheduler.frame);
          return arr;
        })
      );
      expectObservable(source).toBe(expected, expectedGroups);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not error for late subscribed inners if outer is unsubscribed before inners are subscribed', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var source = hot('-----^----a----b-----a------b----a----b---#');
      var unsub = '          -------------------!                  ';
      var subjects = {
        a: new rxjs_1.Subject(),
        b: new rxjs_1.Subject(),
      };
      var result = source.pipe(
        operators_1.groupBy(function (char) {
          return char;
        }),
        operators_1.tap({
          next: function (group) {
            testScheduler.schedule(function () {
              return group.subscribe(subjects[group.key]);
            }, 1000);
          },
        }),
        operators_1.ignoreElements()
      );
      expectObservable(result, unsub).toBe('-');
      expectObservable(subjects.a).toBe('-');
      expectObservable(subjects.b).toBe('-');
    });
  });
  it('should not break lift() composability', function (done) {
    var MyCustomObservable = (function (_super) {
      __extends(MyCustomObservable, _super);
      /**
       *
       */
      function MyCustomObservable() {
        return (_super !== null && _super.apply(this, arguments)) || this;
      }
      MyCustomObservable.prototype.lift = function (operator) {
        var observable = new MyCustomObservable();
        observable.source = this;
        observable.operator = operator;
        return observable;
      };
      return MyCustomObservable;
    })(rxjs_1.Observable);
    var result = new MyCustomObservable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(
      operators_1.groupBy(
        function (x) {
          return x % 2;
        },
        function (x) {
          return x + '!';
        }
      )
    );
    chai_1.expect(result instanceof MyCustomObservable).to.be.true;
    var expectedGroups = [
      { key: 1, values: ['1!', '3!'] },
      { key: 0, values: ['2!'] },
    ];
    result.subscribe({
      next: function (g) {
        var expectedGroup = expectedGroups.shift();
        chai_1.expect(g.key).to.equal(expectedGroup.key);
        g.subscribe(function (x) {
          chai_1.expect(x).to.deep.equal(expectedGroup.values.shift());
        });
      },
      error: function (x) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should stop listening to a synchronous observable when unsubscribed', function () {
    var sideEffects = [];
    var synchronousObservable = new rxjs_1.Observable(function (subscriber) {
      for (var i = 0; !subscriber.closed && i < 10; i++) {
        sideEffects.push(i);
        subscriber.next(i);
      }
    });
    synchronousObservable
      .pipe(
        operators_1.groupBy(function (value) {
          return value;
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
/**
 *
 * @param testScheduler
 */
function phonyMarbelize(testScheduler) {
  return function (source) {
    return source.pipe(
      operators_1.materialize(),
      operators_1.map(function (notification) {
        return {
          frame: testScheduler.frame,
          notification: NotificationFactories_1.createNotification(
            notification.kind,
            notification.value,
            notification.error
          ),
        };
      })
    );
  };
}
//# sourceMappingURL=groupBy-spec.js.map
