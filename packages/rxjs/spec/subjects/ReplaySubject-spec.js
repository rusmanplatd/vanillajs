'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var testing_1 = require('rxjs/testing');
var observableMatcher_1 = require('../helpers/observableMatcher');
describe('ReplaySubject', function () {
  var rxTestScheduler;
  beforeEach(function () {
    rxTestScheduler = new testing_1.TestScheduler(
      observableMatcher_1.observableMatcher
    );
  });
  it('should extend Subject', function () {
    var subject = new rxjs_1.ReplaySubject();
    chai_1.expect(subject).to.be.instanceof(rxjs_1.Subject);
  });
  it('should add the observer before running subscription code', function () {
    var subject = new rxjs_1.ReplaySubject();
    subject.next(1);
    var results = [];
    subject.subscribe(function (value) {
      results.push(value);
      if (value < 3) {
        subject.next(value + 1);
      }
    });
    chai_1.expect(results).to.deep.equal([1, 2, 3]);
  });
  it('should replay values upon subscription', function (done) {
    var subject = new rxjs_1.ReplaySubject();
    var expects = [1, 2, 3];
    var i = 0;
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expects[i++]);
        if (i === 3) {
          subject.complete();
        }
      },
      error: function (err) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  it('should replay values and complete', function (done) {
    var subject = new rxjs_1.ReplaySubject();
    var expects = [1, 2, 3];
    var i = 0;
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expects[i++]);
      },
      complete: done,
    });
  });
  it('should replay values and error', function (done) {
    var subject = new rxjs_1.ReplaySubject();
    var expects = [1, 2, 3];
    var i = 0;
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.error('fooey');
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expects[i++]);
      },
      error: function (err) {
        chai_1.expect(err).to.equal('fooey');
        done();
      },
    });
  });
  it('should only replay values within its buffer size', function (done) {
    var subject = new rxjs_1.ReplaySubject(2);
    var expects = [2, 3];
    var i = 0;
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.subscribe({
      next: function (x) {
        chai_1.expect(x).to.equal(expects[i++]);
        if (i === 2) {
          subject.complete();
        }
      },
      error: function (err) {
        done(new Error('should not be called'));
      },
      complete: function () {
        done();
      },
    });
  });
  describe('with bufferSize=2', function () {
    it('should replay 2 previous values when subscribed', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var replaySubject = new rxjs_1.ReplaySubject(2);
        /**
         *
         * @param x
         */
        function feedNextIntoSubject(x) {
          replaySubject.next(x);
        }
        /**
         *
         * @param err
         */
        function feedErrorIntoSubject(err) {
          replaySubject.error(err);
        }
        /**
         *
         */
        function feedCompleteIntoSubject() {
          replaySubject.complete();
        }
        var sourceTemplate = ' -1-2-3----4------5-6---7--8----9--|';
        var subscriber1 = hot('------(a|)                         ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var unsub1 = '         ---------------------!             ';
        var expected1 = '      ------(23)4------5-6--             ';
        var subscriber2 = hot('------------(b|)                   ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var unsub2 = '         -------------------------!         ';
        var expected2 = '      ------------(34)-5-6---7--         ';
        var subscriber3 = hot('---------------------------(c|)    ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var expected3 = '      ---------------------------(78)9--|';
        expectObservable(
          hot(sourceTemplate).pipe(
            operators_1.tap({
              next: feedNextIntoSubject,
              error: feedErrorIntoSubject,
              complete: feedCompleteIntoSubject,
            })
          )
        ).toBe(sourceTemplate);
        expectObservable(subscriber1, unsub1).toBe(expected1);
        expectObservable(subscriber2, unsub2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
      });
    });
    it('should replay 2 last values for when subscribed after completed', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var replaySubject = new rxjs_1.ReplaySubject(2);
        /**
         *
         * @param x
         */
        function feedNextIntoSubject(x) {
          replaySubject.next(x);
        }
        /**
         *
         * @param err
         */
        function feedErrorIntoSubject(err) {
          replaySubject.error(err);
        }
        /**
         *
         */
        function feedCompleteIntoSubject() {
          replaySubject.complete();
        }
        var sourceTemplate = ' -1-2-3--4--|';
        var subscriber1 = hot('---------------(a|) ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var expected1 = '      ---------------(34|)';
        expectObservable(
          hot(sourceTemplate).pipe(
            operators_1.tap({
              next: feedNextIntoSubject,
              error: feedErrorIntoSubject,
              complete: feedCompleteIntoSubject,
            })
          )
        ).toBe(sourceTemplate);
        expectObservable(subscriber1).toBe(expected1);
      });
    });
    it(
      'should handle subscribers that arrive and leave at different times, ' +
        'subject does not complete',
      function () {
        var subject = new rxjs_1.ReplaySubject(2);
        var results1 = [];
        var results2 = [];
        var results3 = [];
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.next(4);
        var subscription1 = subject.subscribe({
          next: function (x) {
            results1.push(x);
          },
          error: function (err) {
            results1.push('E');
          },
          complete: function () {
            results1.push('C');
          },
        });
        subject.next(5);
        var subscription2 = subject.subscribe({
          next: function (x) {
            results2.push(x);
          },
          error: function (err) {
            results2.push('E');
          },
          complete: function () {
            results2.push('C');
          },
        });
        subject.next(6);
        subject.next(7);
        subscription1.unsubscribe();
        subject.next(8);
        subscription2.unsubscribe();
        subject.next(9);
        subject.next(10);
        var subscription3 = subject.subscribe({
          next: function (x) {
            results3.push(x);
          },
          error: function (err) {
            results3.push('E');
          },
          complete: function () {
            results3.push('C');
          },
        });
        subject.next(11);
        subscription3.unsubscribe();
        chai_1.expect(results1).to.deep.equal([3, 4, 5, 6, 7]);
        chai_1.expect(results2).to.deep.equal([4, 5, 6, 7, 8]);
        chai_1.expect(results3).to.deep.equal([9, 10, 11]);
        subject.complete();
      }
    );
  });
  describe('with windowTime=4', function () {
    it('should replay previous values since 4 time units ago when subscribed', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var replaySubject = new rxjs_1.ReplaySubject(
          Infinity,
          4,
          rxTestScheduler
        );
        /**
         *
         * @param x
         */
        function feedNextIntoSubject(x) {
          replaySubject.next(x);
        }
        /**
         *
         * @param err
         */
        function feedErrorIntoSubject(err) {
          replaySubject.error(err);
        }
        /**
         *
         */
        function feedCompleteIntoSubject() {
          replaySubject.complete();
        }
        var sourceTemplate = ' -1-2-3----4------5-6----7-8----9--|';
        var subscriber1 = hot('------(a|)                         ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var unsub1 = '         ---------------------!             ';
        var expected1 = '      ------(23)4------5-6--             ';
        var subscriber2 = hot('------------(b|)                   ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var unsub2 = '         -------------------------!         ';
        var expected2 = '      ------------4----5-6----7-         ';
        var subscriber3 = hot('---------------------------(c|)    ').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var expected3 = '      ---------------------------(78)9--|';
        expectObservable(
          hot(sourceTemplate).pipe(
            operators_1.tap({
              next: feedNextIntoSubject,
              error: feedErrorIntoSubject,
              complete: feedCompleteIntoSubject,
            })
          )
        ).toBe(sourceTemplate);
        expectObservable(subscriber1, unsub1).toBe(expected1);
        expectObservable(subscriber2, unsub2).toBe(expected2);
        expectObservable(subscriber3).toBe(expected3);
      });
    });
    it('should replay last values since 4 time units ago when subscribed', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var replaySubject = new rxjs_1.ReplaySubject(
          Infinity,
          4,
          rxTestScheduler
        );
        /**
         *
         * @param x
         */
        function feedNextIntoSubject(x) {
          replaySubject.next(x);
        }
        /**
         *
         * @param err
         */
        function feedErrorIntoSubject(err) {
          replaySubject.error(err);
        }
        /**
         *
         */
        function feedCompleteIntoSubject() {
          replaySubject.complete();
        }
        var sourceTemplate = ' -1-2-3----4|';
        var subscriber1 = hot('-------------(a|)').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var expected1 = '      -------------(4|)';
        expectObservable(
          hot(sourceTemplate).pipe(
            operators_1.tap({
              next: feedNextIntoSubject,
              error: feedErrorIntoSubject,
              complete: feedCompleteIntoSubject,
            })
          )
        ).toBe(sourceTemplate);
        expectObservable(subscriber1).toBe(expected1);
      });
    });
    it('should only replay bufferSize items when 4 time units ago more were emitted', function () {
      rxTestScheduler.run(function (_a) {
        var hot = _a.hot,
          expectObservable = _a.expectObservable;
        var replaySubject = new rxjs_1.ReplaySubject(2, 4, rxTestScheduler);
        /**
         *
         * @param x
         */
        function feedNextIntoSubject(x) {
          replaySubject.next(x);
        }
        /**
         *
         * @param err
         */
        function feedErrorIntoSubject(err) {
          replaySubject.error(err);
        }
        /**
         *
         */
        function feedCompleteIntoSubject() {
          replaySubject.complete();
        }
        var sourceTemplate = ' 1234-------|';
        var subscriber1 = hot('----(a|)').pipe(
          operators_1.mergeMapTo(replaySubject)
        );
        var expected1 = '      ----(34)---|';
        expectObservable(
          hot(sourceTemplate).pipe(
            operators_1.tap({
              next: feedNextIntoSubject,
              error: feedErrorIntoSubject,
              complete: feedCompleteIntoSubject,
            })
          )
        ).toBe(sourceTemplate);
        expectObservable(subscriber1).toBe(expected1);
      });
    });
  });
  it('should be an Observer which can be given to Observable.subscribe', function () {
    var source = rxjs_1.of(1, 2, 3, 4, 5);
    var subject = new rxjs_1.ReplaySubject(3);
    var results = [];
    subject.subscribe({
      next: function (x) {
        return results.push(x);
      },
      complete: function () {
        return results.push('done');
      },
    });
    source.subscribe(subject);
    chai_1.expect(results).to.deep.equal([1, 2, 3, 4, 5, 'done']);
    results = [];
    subject.subscribe({
      next: function (x) {
        return results.push(x);
      },
      complete: function () {
        return results.push('done');
      },
    });
    chai_1.expect(results).to.deep.equal([3, 4, 5, 'done']);
  });
  it('should not buffer nexted values after complete', function () {
    var results = [];
    var subject = new rxjs_1.ReplaySubject();
    subject.next(1);
    subject.next(2);
    subject.complete();
    subject.next(3);
    subject.subscribe({
      next: function (value) {
        return results.push(value);
      },
      complete: function () {
        return results.push('C');
      },
    });
    chai_1.expect(results).to.deep.equal([1, 2, 'C']);
  });
  it('should not buffer nexted values after error', function () {
    var results = [];
    var subject = new rxjs_1.ReplaySubject();
    subject.next(1);
    subject.next(2);
    subject.error(new Error('Boom!'));
    subject.next(3);
    subject.subscribe({
      next: function (value) {
        return results.push(value);
      },
      error: function () {
        return results.push('E');
      },
    });
    chai_1.expect(results).to.deep.equal([1, 2, 'E']);
  });
});
//# sourceMappingURL=ReplaySubject-spec.js.map
