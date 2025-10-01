'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('Observable.prototype.concatMap', function () {
  var testScheduler;
  beforeEach(function () {
    testScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should map-and-flatten each item to an Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('   --1-----3--5-------|');
      var e1subs = '   ^------------------!';
      var e2 = cold('  x-x-x|              ', { x: 10 });
      var expected = ' --x-x-x-y-y-yz-z-z-|';
      var values = { x: 10, y: 30, z: 50 };
      var result = e1.pipe(
        operators_1.concatMap(function (x) {
          return e2.pipe(
            operators_1.map(function (i) {
              return i * parseInt(x);
            })
          );
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should support the deprecated resultSelector', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.concatMap(
          function (x) {
            return rxjs_1.of(x, x + 1, x + 2);
          },
          function (a, b, i, ii) {
            return [a, b, i, ii];
          }
        )
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([
            [1, 1, 0, 0],
            [1, 2, 0, 1],
            [1, 3, 0, 2],
            [2, 2, 1, 0],
            [2, 3, 1, 1],
            [2, 4, 1, 2],
            [3, 3, 2, 0],
            [3, 4, 2, 1],
            [3, 5, 2, 2],
          ]);
        },
      });
  });
  it('should support a void resultSelector (still deprecated)', function () {
    var results = [];
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.concatMap(
          function (x) {
            return rxjs_1.of(x, x + 1, x + 2);
          },
          void 0
        )
      )
      .subscribe({
        next: function (value) {
          results.push(value);
        },
        error: function (err) {
          throw err;
        },
        complete: function () {
          chai_1.expect(results).to.deep.equal([1, 2, 3, 2, 3, 4, 3, 4, 5]);
        },
      });
  });
  it('should concatenate many regular interval inners', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold('  --a-a-a-(a|)                            ');
      var asubs = '   ^-------!                               ';
      var b = cold('          ----b--b--(b|)                  ');
      var bsubs = '   --------^---------!                     ';
      var c = cold('                           -c-c-(c|)      ');
      var csubs = '   -------------------------^----!         ';
      var d = cold('                                ------(d|)');
      var dsubs = '   ------------------------------^-----!   ';
      var e1 = hot('  a---b--------------------c-d----|       ');
      var e1subs = '  ^-------------------------------!       ';
      var expected = '--a-a-a-a---b--b--b-------c-c-c-----(d|)';
      var observableLookup = { a: a, b: b, c: c, d: d };
      var source = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(source).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer values to many inner values', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|                        ');
      var e1subs = '    ^----------------!                        ';
      var inner = cold(' --i-j-k-l-|                              ', values);
      var innersubs = [
        '                 -^---------!                              ',
        '                 -----------^---------!                    ',
        '                 ---------------------^---------!          ',
        '                 -------------------------------^---------!',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l-|';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle an empty source', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   |');
      var e1subs = '    (^!)';
      var inner = cold('-1-2-3|');
      var innersubs = [];
      var expected = '  |';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should handle a never source', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   -');
      var e1subs = '    ^';
      var inner = cold('-1-2-3|');
      var innersubs = [];
      var expected = '  -';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should error immediately if given a just-throw source', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   #');
      var e1subs = '    (^!)';
      var inner = cold('-1-2-3|');
      var innersubs = [];
      var expected = '  #';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return a silenced version of the source if the mapped inner is empty', function () {
    testScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('   --a-b--c-| ');
      var e1subs = '    ^--------! ';
      var inner = cold('  |');
      var innersubs = [
        '                 --(^!)     ',
        '                 ----(^!)   ',
        '                 -------(^!)',
      ];
      var expected = '  ---------| ';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should return a never if the mapped inner is never', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  --a-b--c-|');
      var e1subs = '   ^--------!';
      var inner = cold(' -');
      var innersubs = '--^-------';
      var expected = ' ----------';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should propagate errors if the mapped inner is a just-throw Observable', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold('  --a-b--c-|');
      var e1subs = '   ^-!       ';
      var inner = cold(' #');
      var innersubs = '--(^!)    ';
      var expected = ' --#       ';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, complete late', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d----------------------------------|');
      var e1subs = '    ^-----------------------------------------------!';
      var inner = cold(
        ' --i-j-k-l-|                                     ',
        values
      );
      var innersubs = [
        '                 -^---------!                                     ',
        '                 -----------^---------!                           ',
        '                 ---------------------^---------!                 ',
        '                 -------------------------------^---------!       ',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l--------|';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, outer never completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d-----------------------------------');
      var e1subs = '    ^------------------------------------------------';
      var inner = cold(
        ' --i-j-k-l-|                                     ',
        values
      );
      var innersubs = [
        '                 -^---------!                                     ',
        '                 -----------^---------!                           ',
        '                 ---------------------^---------!                 ',
        '                 -------------------------------^---------!       ',
      ];
      var expected = '  ---i-j-k-l---i-j-k-l---i-j-k-l---i-j-k-l---------';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, inner never completes', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|');
      var e1subs = '    ^----------------!';
      var inner = cold(' --i-j-k-l-       ', values);
      var innersubs = ' -^----------------';
      var expected = '  ---i-j-k-l--------';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, and inner throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---|');
      var e1subs = '    ^----------!      ';
      var inner = cold(' --i-j-k-l-#      ', values);
      var innersubs = ' -^---------!      ';
      var expected = '  ---i-j-k-l-#      ';
      var result = e1.pipe(
        operators_1.concatMap(function () {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, and outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---#');
      var e1subs = '    ^----------------!';
      var inner = cold(' --i-j-k-l-|      ', values);
      var innersubs = [
        '                 -^---------!      ',
        '                 -----------^-----!',
      ];
      var expected = '  ---i-j-k-l---i-j-#';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to many inner, both inner and outer throw', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = { i: 'foo', j: 'bar', k: 'baz', l: 'qux' };
      var e1 = hot('    -a---b---c---d---#');
      var e1subs = '    ^----------!      ';
      var inner = cold(' --i-j-k-l-#      ', values);
      var innersubs = ' -^---------!      ';
      var expected = '  ---i-j-k-l-#      ';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return inner;
        })
      );
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(inner.subscriptions).toBe(innersubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, where all inners are finite', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs =
        '         ---------------------------^------------------!        ';
      var f = cold(
        '                                                      --|      '
      );
      var fsubs =
        '         ----------------------------------------------^-!      ';
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs =
        '         ------------------------------------------------^-----!';
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^--------------------------------------!               ';
      var expected =
        '      ---2--3--4--5----6-----2--3-1------2--3-4-5--------1-2|';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, all inners finite except one', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3-                           '
      );
      var dsubs =
        '         -------------------^-----------------------------------';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs = [];
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^--------------------------------------!               ';
      var expected =
        '      ---2--3--4--5----6-----2--3----------------------------';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, inners finite, outer does not complete', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs =
        '         ---------------------------^------------------!        ';
      var f = cold(
        '                                                      --|      '
      );
      var fsubs =
        '         ----------------------------------------------^-!      ';
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs =
        '         ------------------------------------------------^-----!';
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g---             '
      );
      var e1subs =
        '        ^                                                      ';
      var expected =
        '      ---2--3--4--5----6-----2--3-1------2--3-4-5--------1-2-';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, all inners finite, and outer throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs =
        '         ---------------------------^-----------!               ';
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g#               '
      );
      var e1subs =
        '        ^--------------------------------------!               ';
      var expected =
        '      ---2--3--4--5----6-----2--3-1------2--3#               ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, all inners complete except one throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-#                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs = [];
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs = [];
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^------------------!                                   ';
      var expected =
        '      ---2--3--4--5----6-#                                   ';
      var observableLookup = { a: a, b: b, c: c, d: d, e: e, f: f, g: g };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, all inners finite, outer is unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs =
        '         ---------------------------^--!                        ';
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^-----------------------------!                        ';
      var unsub =
        '         ^-----------------------------!                        ';
      var expected =
        '      ---2--3--4--5----6-----2--3-1--                        ';
      var observableLookup = {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g,
      };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '   -#                                                          '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs =
        '         ---------------------------^--!                        ';
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^-----------------------------!                        ';
      var unsub =
        '         ^-----------------------------!                        ';
      var expected =
        '      ---2--3--4--5----6-----2--3-1--                        ';
      var observableLookup = {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g,
      };
      var result = e1.pipe(
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        }),
        operators_1.concatMap(function (value) {
          return observableLookup[value];
        }),
        operators_1.mergeMap(function (x) {
          return rxjs_1.of(x);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many complex, all inners finite, project throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var a = cold(
        '   -#                                                          '
      );
      var asubs = [];
      var b = cold(
        '     -#                                                        '
      );
      var bsubs = [];
      var c = cold(
        '          -2--3--4--5----6-|                                   '
      );
      var csubs =
        '         --^----------------!                                   ';
      var d = cold(
        '                           ----2--3|                           '
      );
      var dsubs =
        '         -------------------^-------!                           ';
      var e = cold(
        '                                   -1------2--3-4-5---|        '
      );
      var esubs = [];
      var f = cold(
        '                                                      --|      '
      );
      var fsubs = [];
      var g = cold(
        '                                                        ---1-2|'
      );
      var gsubs = [];
      var e1 = hot(
        '  -a-b--^-c-----d------e----------------f-----g|               '
      );
      var e1subs =
        '        ^--------------------------!                           ';
      var expected =
        '      ---2--3--4--5----6-----2--3#                           ';
      var observableLookup = {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g,
      };
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          if (value === 'e') {
            throw 'error';
          }
          return observableLookup[value];
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(a.subscriptions).toBe(asubs);
      expectSubscriptions(b.subscriptions).toBe(bsubs);
      expectSubscriptions(c.subscriptions).toBe(csubs);
      expectSubscriptions(d.subscriptions).toBe(dsubs);
      expectSubscriptions(e.subscriptions).toBe(esubs);
      expectSubscriptions(f.subscriptions).toBe(fsubs);
      expectSubscriptions(g.subscriptions).toBe(gsubs);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should finalize before moving to the next observable', function () {
    var results = [];
    var create = function (n) {
      return rxjs_1.defer(function () {
        results.push('init ' + n);
        return rxjs_1.of('next ' + n).pipe(
          operators_1.delay(100, testScheduler),
          operators_1.finalize(function () {
            results.push('finalized ' + n);
          })
        );
      });
    };
    rxjs_1
      .of(1, 2, 3)
      .pipe(
        operators_1.concatMap(function (n) {
          return create(n);
        })
      )
      .subscribe({
        next: function (value) {
          return results.push(value);
        },
      });
    testScheduler.flush();
    chai_1
      .expect(results)
      .to.deep.equal([
        'init 1',
        'next 1',
        'finalized 1',
        'init 2',
        'next 2',
        'finalized 2',
        'init 3',
        'next 3',
        'finalized 3',
      ]);
  });
  /**
   *
   * @param value
   * @param times
   */
  function arrayRepeat(value, times) {
    var results = [];
    for (var i = 0; i < times; i++) {
      results.push(value);
    }
    return results;
  }
  it('should concatMap many outer to an array for each value', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^-------------------------------!';
      var expected = '(22)--(4444)---(333)----(22)----|';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to inner arrays, outer unsubscribed early', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^------------!                   ';
      var unsub = '   ^------------!                   ';
      var expected = '(22)--(4444)--                   ';
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should concatMap many outer to inner arrays, project throws', function () {
    testScheduler.run(function (_a) {
      var hot = _a.hot,
        cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  2-----4--------3--------2-------|');
      var e1subs = '  ^--------------!                 ';
      var expected = '(22)--(4444)---#                 ';
      var invoked = 0;
      var result = e1.pipe(
        operators_1.concatMap(function (value) {
          invoked++;
          if (invoked === 3) {
            throw 'error';
          }
          return arrayRepeat(value, +value);
        })
      );
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });
  it('should map values to constant resolved promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value) {
      return rxjs_1.from(Promise.resolve(42));
    };
    var results = [];
    source.pipe(operators_1.concatMap(project)).subscribe({
      next: function (x) {
        results.push(x);
      },
      error: function (err) {
        done(new Error('Subscriber error handler not supposed to be called.'));
      },
      complete: function () {
        chai_1.expect(results).to.deep.equal([42, 42, 42, 42]);
        done();
      },
    });
  });
  it('should map values to constant rejected promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value) {
      return rxjs_1.from(Promise.reject(42));
    };
    source.pipe(operators_1.concatMap(project)).subscribe({
      next: function (x) {
        done(new Error('Subscriber next handler not supposed to be called.'));
      },
      error: function (err) {
        chai_1.expect(err).to.deep.equal(42);
        done();
      },
      complete: function () {
        done(
          new Error('Subscriber complete handler not supposed to be called.')
        );
      },
    });
  });
  it('should map values to resolved promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value, index) {
      return rxjs_1.from(Promise.resolve(value + index));
    };
    var results = [];
    source.pipe(operators_1.concatMap(project)).subscribe({
      next: function (x) {
        results.push(x);
      },
      error: function (err) {
        done(new Error('Subscriber error handler not supposed to be called.'));
      },
      complete: function () {
        chai_1.expect(results).to.deep.equal([4, 4, 4, 4]);
        done();
      },
    });
  });
  it('should map values to rejected promises and concatenate', function (done) {
    var source = rxjs_1.from([4, 3, 2, 1]);
    var project = function (value, index) {
      return rxjs_1.from(Promise.reject('' + value + '-' + index));
    };
    source.pipe(operators_1.concatMap(project)).subscribe({
      next: function (x) {
        done(new Error('Subscriber next handler not supposed to be called.'));
      },
      error: function (err) {
        chai_1.expect(err).to.deep.equal('4-0');
        done();
      },
      complete: function () {
        done(
          new Error('Subscriber complete handler not supposed to be called.')
        );
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
        operators_1.concatMap(function (value) {
          return rxjs_1.of(value);
        }),
        operators_1.take(3)
      )
      .subscribe(function () {});
    chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
  });
});
//# sourceMappingURL=concatMap-spec.js.map
