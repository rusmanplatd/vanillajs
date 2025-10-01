'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
var queueScheduler = rxjs_1.queueScheduler;
describe('static combineLatest', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should return EMPTY if passed an empty array as the only argument', function () {
    var results = [];
    rxjs_1.combineLatest([]).subscribe({
      next: function () {
        throw new Error('should not emit');
      },
      complete: function () {
        results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal(['done']);
  });
  it('should return EMPTY if passed an empty POJO as the only argument', function () {
    var results = [];
    rxjs_1.combineLatest({}).subscribe({
      next: function () {
        throw new Error('should not emit');
      },
      complete: function () {
        results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal(['done']);
  });
  it('should return EMPTY if passed an empty array and scheduler as the only argument', function () {
    var results = [];
    rxjs_1.combineLatest([], rxTestScheduler).subscribe({
      next: function () {
        throw new Error('should not emit');
      },
      complete: function () {
        results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal([]);
    rxTestScheduler.flush();
    chai_1.expect(results).to.deep.equal(['done']);
  });
  it('should combineLatest the provided observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var firstSource = hot(' ----a----b----c----|');
      var secondSource = hot('--d--e--f--g--|');
      var expected = '        ----uv--wx-y--z----|';
      var combined = rxjs_1.combineLatest(
        firstSource,
        secondSource,
        function (a, b) {
          return '' + a + b;
        }
      );
      expectObservable(combined).toBe(expected, {
        u: 'ad',
        v: 'ae',
        w: 'af',
        x: 'bf',
        y: 'bg',
        z: 'cg',
      });
    });
  });
  it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
    var a = rxjs_1.of(1, 2, 3, queueScheduler);
    var b = rxjs_1.of(4, 5, 6, 7, 8, queueScheduler);
    var r = [
      [1, 4],
      [2, 4],
      [2, 5],
      [3, 5],
      [3, 6],
      [3, 7],
      [3, 8],
    ];
    var actual = [];
    rxjs_1.combineLatest(a, b, queueScheduler).subscribe({
      next: function (vals) {
        actual.push(vals);
      },
      error: function () {
        done(new Error('should not be called'));
      },
      complete: function () {
        chai_1.expect(actual).to.deep.equal(r);
        done();
      },
    });
  });
  it('should accept array of observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var firstSource = hot(' ----a----b----c----|');
      var secondSource = hot('--d--e--f--g--|');
      var expected = '        ----uv--wx-y--z----|';
      var combined = rxjs_1.combineLatest(
        [firstSource, secondSource],
        function (a, b) {
          return '' + a + b;
        }
      );
      expectObservable(combined).toBe(expected, {
        u: 'ad',
        v: 'ae',
        w: 'af',
        x: 'bf',
        y: 'bg',
        z: 'cg',
      });
    });
  });
  it('should accept a dictionary of observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable;
      var firstSource = hot('----a----b----c----|');
      var secondSource = hot('--d--e--f--g--|');
      var expected = '        ----uv--wx-y--z----|';
      var combined = rxjs_1
        .combineLatest({ a: firstSource, b: secondSource })
        .pipe(
          operators_1.map(function (_a) {
            var a = _a.a,
              b = _a.b;
            return '' + a + b;
          })
        );
      expectObservable(combined).toBe(expected, {
        u: 'ad',
        v: 'ae',
        w: 'af',
        x: 'bf',
        y: 'bg',
        z: 'cg',
      });
    });
  });
  it('should work with two nevers', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var e2 = cold(' -');
      var e2subs = '  ^';
      var expected = '-';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with never and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' -');
      var e1subs = '  ^';
      var e2 = cold(' |');
      var e2subs = '  (^!)';
      var expected = '-';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with empty and never', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var e2 = cold(' -');
      var e2subs = '  ^';
      var expected = '-';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with empty and empty', function () {
    rxTestScheduler.run(function (_a) {
      var cold = _a.cold,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = cold(' |');
      var e1subs = '  (^!)';
      var e2 = cold(' |');
      var e2subs = '  (^!)';
      var expected = '|';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with hot-empty and hot-single', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 2,
        c: 3,
        r: 1 + 3,
      };
      var e1 = hot('-a-^-|', values);
      var e1subs = '   ^-!';
      var e2 = hot('-b-^-c-|', values);
      var e2subs = '   ^---!';
      var expected = ' ----|';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with hot-single and hot-empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 2,
        c: 3,
      };
      var e1 = hot('-a-^-|', values);
      var e1subs = '   ^-!';
      var e2 = hot('-b-^-c-|', values);
      var e2subs = '   ^---!';
      var expected = ' ----|';
      var result = rxjs_1.combineLatest(e2, e1, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with hot-single and never', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
      };
      var e1 = hot('-a-^-|', values);
      var e1subs = '   ^-!';
      var e2 = hot('------', values);
      var e2subs = '   ^  ';
      var expected = ' -';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with never and hot-single', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var values = {
        a: 1,
        b: 2,
      };
      var e1 = hot('--------', values);
      var e1subs = '   ^----';
      var e2 = hot('-a-^-b-|', values);
      var e2subs = '   ^---!';
      var expected = ' -----';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with hot and hot', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
      var e1subs = '     ^--------!';
      var e2 = hot('---e-^---f--g--|', { e: 'e', f: 'f', g: 'g' });
      var e2subs = '     ^---------!';
      var expected = '   ----x-yz--|';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, { x: 'bf', y: 'cf', z: 'cg' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with empty and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('  ----------|');
      var e1subs = '  ^-----!';
      var e2 = hot('  ------#', undefined, 'shazbot!');
      var e2subs = '  ^-----!';
      var expected = '------#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'shazbot!');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with error and empty', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--^---#', undefined, 'too bad, honk');
      var e1subs = '  ^---!';
      var e2 = hot('--^--------|');
      var e2subs = '  ^---!';
      var expected = '----#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'too bad, honk');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with hot and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
      var e1subs = '   ^-!';
      var e2 = hot('---^-#', undefined, 'bazinga');
      var e2subs = '   ^-!';
      var expected = ' --#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'bazinga');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with throw and hot', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^-#', undefined, 'bazinga');
      var e1subs = '   ^-!';
      var e2 = hot('-a-^--b--c--|', { a: 1, b: 2, c: 3 });
      var e2subs = '   ^-!';
      var expected = ' --#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'bazinga');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with throw and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^----#', undefined, 'jenga');
      var e1subs = '   ^-!';
      var e2 = hot('---^-#', undefined, 'bazinga');
      var e2subs = '   ^-!';
      var expected = ' --#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'bazinga');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with error and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
      var e1subs = '   ^-!';
      var e2 = hot('---^-#', undefined, 'flurp');
      var e2subs = '   ^-!';
      var expected = ' --#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'flurp');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with throw and error', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^-#', undefined, 'flurp');
      var e1subs = '   ^-!';
      var e2 = hot('-a-^--b--#', { a: 1, b: 2 }, 'wokka wokka');
      var e2subs = '   ^-!';
      var expected = ' --#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'flurp');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with never and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^-----------');
      var e1subs = '   ^-----!';
      var e2 = hot('---^-----#', undefined, 'wokka wokka');
      var e2subs = '   ^-----!';
      var expected = ' ------#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'wokka wokka');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with throw and never', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^----#', undefined, 'wokka wokka');
      var e1subs = '   ^----!';
      var e2 = hot('---^-----------');
      var e2subs = '   ^----!';
      var expected = ' -----#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'wokka wokka');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with some and throw', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^----a---b--|', { a: 1, b: 2 });
      var e1subs = '   ^--!';
      var e2 = hot('---^--#', undefined, 'wokka wokka');
      var e2subs = '   ^--!';
      var expected = ' ---#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should work with throw and some', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('---^--#', undefined, 'wokka wokka');
      var e1subs = '   ^--!';
      var e2 = hot('---^----a---b--|', { a: 1, b: 2 });
      var e2subs = '   ^--!';
      var expected = ' ---#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, { a: 1, b: 2 }, 'wokka wokka');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle throw after complete left', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var left = hot(' --a--^--b---|', { a: 1, b: 2 });
      var leftSubs = '      ^------!';
      var right = hot('-----^--------#', undefined, 'bad things');
      var rightSubs = '     ^--------!';
      var expected = '      ---------#';
      var result = rxjs_1.combineLatest(left, right, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'bad things');
      expectSubscriptions(left.subscriptions).toBe(leftSubs);
      expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
  });
  it('should handle throw after complete right', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var left = hot(' -----^--------#', undefined, 'bad things');
      var leftSubs = '      ^--------!';
      var right = hot('--a--^--b---|', { a: 1, b: 2 });
      var rightSubs = '     ^------!';
      var expected = '      ---------#';
      var result = rxjs_1.combineLatest(left, right, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'bad things');
      expectSubscriptions(left.subscriptions).toBe(leftSubs);
      expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
  });
  it('should handle interleaved with tail', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('-a--^--b---c---|', { a: 'a', b: 'b', c: 'c' });
      var e1subs = '    ^----------!';
      var e2 = hot('--d-^----e---f--|', { d: 'd', e: 'e', f: 'f' });
      var e2subs = '    ^-----------!';
      var expected = '  -----x-y-z--|';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, { x: 'be', y: 'ce', z: 'cf' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle two consecutive hot observables', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
      var e1subs = '     ^--------!';
      var e2 = hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
      var e2subs = '     ^-------------------!';
      var expected = '   -----------x--y--z--|';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, { x: 'cd', y: 'ce', z: 'cf' });
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should handle two consecutive hot observables with error left', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var left = hot(' --a--^--b--c--#', { a: 'a', b: 'b', c: 'c' }, 'jenga');
      var leftSubs = '      ^--------!';
      var right = hot('-----^----------d--e--f--|', { d: 'd', e: 'e', f: 'f' });
      var rightSubs = '     ^--------!';
      var expected = '      ---------#';
      var result = rxjs_1.combineLatest(left, right, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(expected, null, 'jenga');
      expectSubscriptions(left.subscriptions).toBe(leftSubs);
      expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
  });
  it('should handle two consecutive hot observables with error right', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var left = hot(' --a--^--b--c--|', { a: 'a', b: 'b', c: 'c' });
      var leftSubs = '      ^--------!';
      var right = hot(
        '-----^----------d--e--f--#',
        { d: 'd', e: 'e', f: 'f' },
        'dun dun dun'
      );
      var rightSubs = '     ^-------------------!';
      var expected = '      -----------x--y--z--#';
      var result = rxjs_1.combineLatest(left, right, function (x, y) {
        return x + y;
      });
      expectObservable(result).toBe(
        expected,
        { x: 'cd', y: 'ce', z: 'cf' },
        'dun dun dun'
      );
      expectSubscriptions(left.subscriptions).toBe(leftSubs);
      expectSubscriptions(right.subscriptions).toBe(rightSubs);
    });
  });
  it('should handle selector throwing', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--|', { a: 1, b: 2 });
      var e1subs = '     ^--!';
      var e2 = hot('--c--^--d--|', { c: 3, d: 4 });
      var e2subs = '     ^--!';
      var expected = '   ---#';
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        throw 'ha ha ' + x + ', ' + y;
      });
      expectObservable(result).toBe(expected, null, 'ha ha 2, 4');
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should allow unsubscribing early and explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c---d-| ');
      var e1subs = '     ^--------!    ';
      var e2 = hot('---e-^---f--g---h-|');
      var e2subs = '     ^--------!    ';
      var expected = '   ----x-yz--    ';
      var unsub = '      ---------!    ';
      var values = { x: 'bf', y: 'cf', z: 'cg' };
      var result = rxjs_1.combineLatest(e1, e2, function (x, y) {
        return x + y;
      });
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
  it('should not break unsubscription chains when unsubscribed explicitly', function () {
    rxTestScheduler.run(function (_a) {
      var hot = _a.hot,
        expectObservable = _a.expectObservable,
        expectSubscriptions = _a.expectSubscriptions;
      var e1 = hot('--a--^--b--c---d-| ');
      var e1subs = '     ^--------!    ';
      var e2 = hot('---e-^---f--g---h-|');
      var e2subs = '     ^--------!    ';
      var expected = '   ----x-yz--    ';
      var unsub = '      ---------!    ';
      var values = { x: 'bf', y: 'cf', z: 'cg' };
      var result = rxjs_1
        .combineLatest(
          e1.pipe(
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            })
          ),
          e2.pipe(
            operators_1.mergeMap(function (x) {
              return rxjs_1.of(x);
            })
          ),
          function (x, y) {
            return x + y;
          }
        )
        .pipe(
          operators_1.mergeMap(function (x) {
            return rxjs_1.of(x);
          })
        );
      expectObservable(result, unsub).toBe(expected, values);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
      expectSubscriptions(e2.subscriptions).toBe(e2subs);
    });
  });
});
//# sourceMappingURL=combineLatest-spec.js.map
