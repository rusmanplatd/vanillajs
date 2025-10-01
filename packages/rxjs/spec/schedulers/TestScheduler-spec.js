'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var marble_testing_1 = require('../helpers/marble-testing');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var operators_1 = require('rxjs/operators');
var NotificationFactories_1 = require('rxjs/internal/NotificationFactories');
var animationFrameProvider_1 = require('rxjs/internal/scheduler/animationFrameProvider');
var immediateProvider_1 = require('rxjs/internal/scheduler/immediateProvider');
var intervalProvider_1 = require('rxjs/internal/scheduler/intervalProvider');
var timeoutProvider_1 = require('rxjs/internal/scheduler/timeoutProvider');
describe('TestScheduler', function () {
  it('should exist', function () {
    chai_1.expect(testing_1.TestScheduler).exist;
    chai_1.expect(testing_1.TestScheduler).to.be.a('function');
  });
  it('should have frameTimeFactor set initially', function () {
    chai_1.expect(testing_1.TestScheduler.frameTimeFactor).to.equal(10);
  });
  describe('parseMarbles()', function () {
    it('should parse a marble string into a series of notifications and types', function () {
      var result = testing_1.TestScheduler.parseMarbles('-------a---b---|', {
        a: 'A',
        b: 'B',
      });
      chai_1.expect(result).deep.equal([
        {
          frame: 70,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 110,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 150,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
    it('should parse a marble string, allowing spaces too', function () {
      var result = testing_1.TestScheduler.parseMarbles('--a--b--|   ', {
        a: 'A',
        b: 'B',
      });
      chai_1.expect(result).deep.equal([
        {
          frame: 20,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 50,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 80,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
    it('should parse a marble string with a subscription point', function () {
      var result = testing_1.TestScheduler.parseMarbles('---^---a---b---|', {
        a: 'A',
        b: 'B',
      });
      chai_1.expect(result).deep.equal([
        {
          frame: 40,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 80,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 120,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
    it('should parse a marble string with an error', function () {
      var result = testing_1.TestScheduler.parseMarbles(
        '-------a---b---#',
        { a: 'A', b: 'B' },
        'omg error!'
      );
      chai_1.expect(result).deep.equal([
        {
          frame: 70,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 110,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 150,
          notification: NotificationFactories_1.errorNotification('omg error!'),
        },
      ]);
    });
    it('should default in the letter for the value if no value hash was passed', function () {
      var result = testing_1.TestScheduler.parseMarbles('--a--b--c--');
      chai_1.expect(result).deep.equal([
        {
          frame: 20,
          notification: NotificationFactories_1.nextNotification('a'),
        },
        {
          frame: 50,
          notification: NotificationFactories_1.nextNotification('b'),
        },
        {
          frame: 80,
          notification: NotificationFactories_1.nextNotification('c'),
        },
      ]);
    });
    it('should handle grouped values', function () {
      var result = testing_1.TestScheduler.parseMarbles('---(abc)---');
      chai_1.expect(result).deep.equal([
        {
          frame: 30,
          notification: NotificationFactories_1.nextNotification('a'),
        },
        {
          frame: 30,
          notification: NotificationFactories_1.nextNotification('b'),
        },
        {
          frame: 30,
          notification: NotificationFactories_1.nextNotification('c'),
        },
      ]);
    });
    it('should ignore whitespace when runMode=true', function () {
      var runMode = true;
      var result = testing_1.TestScheduler.parseMarbles(
        '  -a - b -    c |       ',
        { a: 'A', b: 'B', c: 'C' },
        undefined,
        undefined,
        runMode
      );
      chai_1.expect(result).deep.equal([
        {
          frame: 10,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 30,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 50,
          notification: NotificationFactories_1.nextNotification('C'),
        },
        {
          frame: 60,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
    it('should support time progression syntax when runMode=true', function () {
      var runMode = true;
      var result = testing_1.TestScheduler.parseMarbles(
        '10.2ms a 1.2s b 1m c|',
        { a: 'A', b: 'B', c: 'C' },
        undefined,
        undefined,
        runMode
      );
      chai_1.expect(result).deep.equal([
        {
          frame: 10.2,
          notification: NotificationFactories_1.nextNotification('A'),
        },
        {
          frame: 10.2 + 10 + 1.2 * 1000,
          notification: NotificationFactories_1.nextNotification('B'),
        },
        {
          frame: 10.2 + 10 + 1.2 * 1000 + 10 + 1000 * 60,
          notification: NotificationFactories_1.nextNotification('C'),
        },
        {
          frame: 10.2 + 10 + 1.2 * 1000 + 10 + 1000 * 60 + 10,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
    it('should support emoji characters', function () {
      var result = testing_1.TestScheduler.parseMarbles('--🙈--🙉--🙊--|');
      chai_1.expect(result).deep.equal([
        {
          frame: 20,
          notification: NotificationFactories_1.nextNotification('🙈'),
        },
        {
          frame: 50,
          notification: NotificationFactories_1.nextNotification('🙉'),
        },
        {
          frame: 80,
          notification: NotificationFactories_1.nextNotification('🙊'),
        },
        {
          frame: 110,
          notification: NotificationFactories_1.COMPLETE_NOTIFICATION,
        },
      ]);
    });
  });
  describe('parseMarblesAsSubscriptions()', function () {
    it('should parse a subscription marble string into a subscriptionLog', function () {
      var result =
        testing_1.TestScheduler.parseMarblesAsSubscriptions('---^---!-');
      chai_1.expect(result.subscribedFrame).to.equal(30);
      chai_1.expect(result.unsubscribedFrame).to.equal(70);
    });
    it('should parse a subscription marble string with an unsubscription', function () {
      var result = testing_1.TestScheduler.parseMarblesAsSubscriptions('---^-');
      chai_1.expect(result.subscribedFrame).to.equal(30);
      chai_1.expect(result.unsubscribedFrame).to.equal(Infinity);
    });
    it('should parse a subscription marble string with a synchronous unsubscription', function () {
      var result =
        testing_1.TestScheduler.parseMarblesAsSubscriptions('---(^!)-');
      chai_1.expect(result.subscribedFrame).to.equal(30);
      chai_1.expect(result.unsubscribedFrame).to.equal(30);
    });
    it('should ignore whitespace when runMode=true', function () {
      var runMode = true;
      var result = testing_1.TestScheduler.parseMarblesAsSubscriptions(
        '  - -  - -  ^ -   - !  -- -      ',
        runMode
      );
      chai_1.expect(result.subscribedFrame).to.equal(40);
      chai_1.expect(result.unsubscribedFrame).to.equal(70);
    });
    it('should support time progression syntax when runMode=true', function () {
      var runMode = true;
      var result = testing_1.TestScheduler.parseMarblesAsSubscriptions(
        '10.2ms ^ 1.2s - 1m !',
        runMode
      );
      chai_1.expect(result.subscribedFrame).to.equal(10.2);
      chai_1
        .expect(result.unsubscribedFrame)
        .to.equal(10.2 + 10 + 1.2 * 1000 + 10 + 1000 * 60);
    });
    it('should throw if found more than one subscription point', function () {
      chai_1
        .expect(function () {
          return testing_1.TestScheduler.parseMarblesAsSubscriptions(
            '---^-^-!-'
          );
        })
        .to.throw();
    });
    it('should throw if found more than one unsubscription point', function () {
      chai_1
        .expect(function () {
          return testing_1.TestScheduler.parseMarblesAsSubscriptions(
            '---^---!-!'
          );
        })
        .to.throw();
    });
  });
  describe('createTime()', function () {
    it('should parse a simple time marble string to a number', function () {
      var scheduler = new testing_1.TestScheduler(null);
      var time = scheduler.createTime('-----|');
      chai_1.expect(time).to.equal(50);
    });
    it('should progress time with whitespace', function () {
      var scheduler = new testing_1.TestScheduler(null);
      var time = scheduler.createTime('     |');
      chai_1.expect(time).to.equal(50);
    });
    it('should progress time with mix of whitespace and dashes', function () {
      var scheduler = new testing_1.TestScheduler(null);
      var time = scheduler.createTime('  --|');
      chai_1.expect(time).to.equal(40);
    });
    it('should throw if not given good marble input', function () {
      var scheduler = new testing_1.TestScheduler(null);
      chai_1
        .expect(function () {
          scheduler.createTime('-a-b-#');
        })
        .to.throw();
    });
  });
  describe('createColdObservable()', function () {
    it('should create a cold observable', function () {
      var expected = ['A', 'B'];
      var scheduler = new testing_1.TestScheduler(null);
      var source = scheduler.createColdObservable('--a---b--|', {
        a: 'A',
        b: 'B',
      });
      chai_1.expect(source).to.be.an.instanceOf(rxjs_1.Observable);
      source.subscribe(function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      });
      scheduler.flush();
      chai_1.expect(expected.length).to.equal(0);
    });
  });
  describe('createHotObservable()', function () {
    it('should create a hot observable', function () {
      var expected = ['A', 'B'];
      var scheduler = new testing_1.TestScheduler(null);
      var source = scheduler.createHotObservable('--a---b--|', {
        a: 'A',
        b: 'B',
      });
      chai_1.expect(source).to.be.an.instanceof(rxjs_1.Subject);
      source.subscribe(function (x) {
        chai_1.expect(x).to.equal(expected.shift());
      });
      scheduler.flush();
      chai_1.expect(expected.length).to.equal(0);
    });
  });
  describe('jasmine helpers', function () {
    describe('rxTestScheduler', function () {
      it('should exist', function () {
        chai_1
          .expect(rxTestScheduler)
          .to.be.an.instanceof(testing_1.TestScheduler);
      });
    });
    describe('cold()', function () {
      it('should exist', function () {
        chai_1.expect(marble_testing_1.cold).to.exist;
        chai_1.expect(marble_testing_1.cold).to.be.a('function');
      });
      it('should create a cold observable', function () {
        var expected = [1, 2];
        var source = marble_testing_1.cold('-a-b-|', { a: 1, b: 2 });
        source.subscribe({
          next: function (x) {
            chai_1.expect(x).to.equal(expected.shift());
          },
          complete: function () {
            chai_1.expect(expected.length).to.equal(0);
          },
        });
        marble_testing_1
          .expectObservable(source)
          .toBe('-a-b-|', { a: 1, b: 2 });
      });
    });
    describe('hot()', function () {
      it('should exist', function () {
        chai_1.expect(marble_testing_1.hot).to.exist;
        chai_1.expect(marble_testing_1.hot).to.be.a('function');
      });
      it('should create a hot observable', function () {
        var source = marble_testing_1.hot('---^-a-b-|', { a: 1, b: 2 });
        chai_1.expect(source).to.be.an.instanceOf(rxjs_1.Subject);
        marble_testing_1
          .expectObservable(source)
          .toBe('--a-b-|', { a: 1, b: 2 });
      });
    });
    describe('time()', function () {
      it('should exist', function () {
        chai_1.expect(marble_testing_1.time).to.exist;
        chai_1.expect(marble_testing_1.time).to.be.a('function');
      });
      it('should parse a simple time marble string to a number', function () {
        chai_1.expect(marble_testing_1.time('-----|')).to.equal(50);
      });
    });
    describe('expectObservable()', function () {
      it('should exist', function () {
        chai_1.expect(marble_testing_1.expectObservable).to.exist;
        chai_1.expect(marble_testing_1.expectObservable).to.be.a('function');
      });
      it('should return an object with a toBe function', function () {
        chai_1
          .expect(marble_testing_1.expectObservable(rxjs_1.of(1)).toBe)
          .to.be.a('function');
      });
      it('should append to flushTests array', function () {
        marble_testing_1.expectObservable(rxjs_1.EMPTY);
        chai_1.expect(rxTestScheduler.flushTests.length).to.equal(1);
      });
      it('should handle empty', function () {
        marble_testing_1.expectObservable(rxjs_1.EMPTY).toBe('|', {});
      });
      it('should handle never', function () {
        marble_testing_1.expectObservable(rxjs_1.NEVER).toBe('-', {});
        marble_testing_1.expectObservable(rxjs_1.NEVER).toBe('---', {});
      });
      it('should accept an unsubscription marble diagram', function () {
        var source = marble_testing_1.hot('---^-a-b-|');
        var unsubscribe = '---!';
        var expected = '--a';
        marble_testing_1.expectObservable(source, unsubscribe).toBe(expected);
      });
      it('should accept a subscription marble diagram', function () {
        var source = marble_testing_1.hot('-a-b-c|');
        var subscribe = '---^';
        var expected = '---b-c|';
        marble_testing_1.expectObservable(source, subscribe).toBe(expected);
      });
    });
    describe('expectSubscriptions()', function () {
      it('should exist', function () {
        chai_1.expect(marble_testing_1.expectSubscriptions).to.exist;
        chai_1.expect(marble_testing_1.expectSubscriptions).to.be.a('function');
      });
      it('should return an object with a toBe function', function () {
        chai_1
          .expect(marble_testing_1.expectSubscriptions([]).toBe)
          .to.be.a('function');
      });
      it('should append to flushTests array', function () {
        marble_testing_1.expectSubscriptions([]);
        chai_1.expect(rxTestScheduler.flushTests.length).to.equal(1);
      });
      it('should assert subscriptions of a cold observable', function () {
        var source = marble_testing_1.cold('---a---b-|');
        var subs = '^--------!';
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
        source.subscribe();
      });
      it('should support empty subscription marbles', function () {
        var source = marble_testing_1.cold('---a---b-|');
        var subs = '----------';
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
      });
      it('should support empty subscription marbles within arrays', function () {
        var source = marble_testing_1.cold('---a---b-|');
        var subs = ['----------'];
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
      });
    });
    describe('end-to-end helper tests', function () {
      it('should be awesome', function () {
        var values = { a: 1, b: 2 };
        var myObservable = marble_testing_1.cold('---a---b--|', values);
        var subs = '^---------!';
        marble_testing_1
          .expectObservable(myObservable)
          .toBe('---a---b--|', values);
        marble_testing_1
          .expectSubscriptions(myObservable.subscriptions)
          .toBe(subs);
      });
      it('should support testing metastreams', function () {
        var x = marble_testing_1.cold('-a-b|');
        var y = marble_testing_1.cold('-c-d|');
        var myObservable = marble_testing_1.hot('---x---y----|', {
          x: x,
          y: y,
        });
        var expected = '---x---y----|';
        var expectedx = marble_testing_1.cold('-a-b|');
        var expectedy = marble_testing_1.cold('-c-d|');
        marble_testing_1
          .expectObservable(myObservable)
          .toBe(expected, { x: expectedx, y: expectedy });
      });
    });
  });
  describe('TestScheduler.run()', function () {
    var assertDeepEquals = function (actual, expected) {
      chai_1.expect(actual).deep.equal(expected);
    };
    describe('marble diagrams', function () {
      it('should ignore whitespace', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var input = cold('  -a - b -    c |       ');
          var output = input.pipe(
            operators_1.concatMap(function (d) {
              return rxjs_1.of(d).pipe(operators_1.delay(10));
            })
          );
          var expected = '     -- 9ms a 9ms b 9ms (c|) ';
          expectObservable(output).toBe(expected);
          expectSubscriptions(input.subscriptions).toBe('  ^- - - - - !');
        });
      });
      it('should support time progression syntax', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var cold = _a.cold,
            hot = _a.hot,
            flush = _a.flush,
            expectObservable = _a.expectObservable,
            expectSubscriptions = _a.expectSubscriptions;
          var output = cold('10.2ms a 1.2s b 1m c|');
          var expected = '   10.2ms a 1.2s b 1m c|';
          expectObservable(output).toBe(expected);
        });
      });
    });
    it('should provide the correct helpers', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          hot = _a.hot,
          flush = _a.flush,
          expectObservable = _a.expectObservable,
          expectSubscriptions = _a.expectSubscriptions;
        chai_1.expect(cold).to.be.a('function');
        chai_1.expect(hot).to.be.a('function');
        chai_1.expect(flush).to.be.a('function');
        chai_1.expect(expectObservable).to.be.a('function');
        chai_1.expect(expectSubscriptions).to.be.a('function');
        var obs1 = cold('-a-c-e|');
        var obs2 = hot(' ^-b-d-f|');
        var output = rxjs_1.merge(obs1, obs2);
        var expected = ' -abcdef|';
        expectObservable(output).toBe(expected);
        expectObservable(output).toEqual(cold(expected));
        expectSubscriptions(obs1.subscriptions).toBe(['^-----!', '^-----!']);
        expectSubscriptions(obs2.subscriptions).toBe(['^------!', '^------!']);
      });
    });
    it('should have each frame represent a single virtual millisecond', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var output = cold('-a-b-c--------|').pipe(operators_1.debounceTime(5));
        var expected = '   ------ 4ms c---|';
        expectObservable(output).toBe(expected);
      });
    });
    it('should have no maximum frame count', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var output = cold('-a|').pipe(operators_1.delay(1000 * 10));
        var expected = '   - 10s (a|)';
        expectObservable(output).toBe(expected);
      });
    });
    it('should make operators that use AsyncScheduler automatically use TestScheduler for actual scheduling', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var output = cold('-a-b-c--------|').pipe(operators_1.debounceTime(5));
        var expected = '   ----------c---|';
        expectObservable(output).toBe(expected);
      });
    });
    it('should flush automatically', function () {
      var testScheduler = new testing_1.TestScheduler(function (
        actual,
        expected
      ) {
        chai_1.expect(actual).deep.equal(expected);
      });
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable;
        var output = cold('-a-b-c|').pipe(
          operators_1.concatMap(function (d) {
            return rxjs_1.of(d).pipe(operators_1.delay(10));
          })
        );
        var expected = '   -- 9ms a 9ms b 9ms (c|)';
        expectObservable(output).toBe(expected);
        chai_1.expect(testScheduler['flushTests'].length).to.equal(1);
        chai_1.expect(testScheduler['actions'].length).to.equal(1);
      });
      chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
      chai_1.expect(testScheduler['actions'].length).to.equal(0);
    });
    it('should support explicit flushing', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler.run(function (_a) {
        var cold = _a.cold,
          expectObservable = _a.expectObservable,
          flush = _a.flush;
        var output = cold('-a-b-c|').pipe(
          operators_1.concatMap(function (d) {
            return rxjs_1.of(d).pipe(operators_1.delay(10));
          })
        );
        var expected = '   -- 9ms a 9ms b 9ms (c|)';
        expectObservable(output).toBe(expected);
        chai_1.expect(testScheduler['flushTests'].length).to.equal(1);
        chai_1.expect(testScheduler['actions'].length).to.equal(1);
        flush();
        chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
        chai_1.expect(testScheduler['actions'].length).to.equal(0);
      });
      chai_1.expect(testScheduler['flushTests'].length).to.equal(0);
      chai_1.expect(testScheduler['actions'].length).to.equal(0);
    });
    it('should pass-through return values, e.g. Promises', function (done) {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      testScheduler
        .run(function () {
          return Promise.resolve('foo');
        })
        .then(function (value) {
          chai_1.expect(value).to.equal('foo');
          done();
        });
    });
    it('should restore changes upon thrown errors', function () {
      var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
      var frameTimeFactor = testing_1.TestScheduler['frameTimeFactor'];
      var maxFrames = testScheduler.maxFrames;
      var runMode = testScheduler['runMode'];
      try {
        testScheduler.run(function () {
          throw new Error('kaboom!');
        });
      } catch (_a) {}
      chai_1
        .expect(testing_1.TestScheduler['frameTimeFactor'])
        .to.equal(frameTimeFactor);
      chai_1.expect(testScheduler.maxFrames).to.equal(maxFrames);
      chai_1.expect(testScheduler['runMode']).to.equal(runMode);
    });
    it('should flush expectations correctly', function () {
      chai_1
        .expect(function () {
          var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
          testScheduler.run(function (_a) {
            var cold = _a.cold,
              expectObservable = _a.expectObservable,
              flush = _a.flush;
            expectObservable(cold('-x')).toBe('-x');
            expectObservable(cold('-y')).toBe('-y');
            var expectation = expectObservable(cold('-z'));
            flush();
            expectation.toBe('-q');
          });
        })
        .to.throw();
    });
    describe('animate', function () {
      it('should throw if animate() is not called when needed', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        chai_1
          .expect(function () {
            return testScheduler.run(function () {
              animationFrameProvider_1.animationFrameProvider.schedule(
                function () {}
              );
            });
          })
          .to.throw();
      });
      it('should throw if animate() is called more than once', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        chai_1
          .expect(function () {
            return testScheduler.run(function (_a) {
              var animate = _a.animate;
              animate('--x');
              animate('--x');
            });
          })
          .to.throw();
      });
      it('should throw if animate() completes', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        chai_1
          .expect(function () {
            return testScheduler.run(function (_a) {
              var animate = _a.animate;
              animate('--|');
            });
          })
          .to.throw();
      });
      it('should throw if animate() errors', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        chai_1
          .expect(function () {
            return testScheduler.run(function (_a) {
              var animate = _a.animate;
              animate('--#');
            });
          })
          .to.throw();
      });
      it('should schedule async requests within animate()', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var animate = _a.animate;
          animate('--x');
          var values = [];
          var schedule =
            animationFrameProvider_1.animationFrameProvider.schedule;
          testScheduler.schedule(function () {
            schedule(function (t) {
              return values.push('a@' + t);
            });
            chai_1.expect(values).to.deep.equal([]);
          }, 0);
          testScheduler.schedule(function () {
            schedule(function (t) {
              return values.push('b@' + t);
            });
            chai_1.expect(values).to.deep.equal([]);
          }, 1);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@2', 'b@2']);
          }, 2);
        });
      });
      it('should schedule sync requests within animate()', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var animate = _a.animate;
          animate('--x');
          var values = [];
          var schedule =
            animationFrameProvider_1.animationFrameProvider.schedule;
          testScheduler.schedule(function () {
            schedule(function (t) {
              return values.push('a@' + t);
            });
            schedule(function (t) {
              return values.push('b@' + t);
            });
            chai_1.expect(values).to.deep.equal([]);
          }, 1);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@2', 'b@2']);
          }, 2);
        });
      });
      it('should support request cancellation within animate()', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var animate = _a.animate;
          animate('--x');
          var values = [];
          var schedule =
            animationFrameProvider_1.animationFrameProvider.schedule;
          testScheduler.schedule(function () {
            var subscription = schedule(function (t) {
              return values.push('a@' + t);
            });
            schedule(function (t) {
              return values.push('b@' + t);
            });
            subscription.unsubscribe();
            chai_1.expect(values).to.deep.equal([]);
          }, 1);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['b@2']);
          }, 2);
        });
      });
    });
    describe('immediate and interval', function () {
      it('should schedule immediates', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setImmediate = immediateProvider_1.immediateProvider.setImmediate;
          setImmediate(function () {
            values.push('a@' + testScheduler.now());
          });
          chai_1.expect(values).to.deep.equal([]);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@0']);
          }, 10);
        });
      });
      it('should support clearing immediates', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setImmediate = immediateProvider_1.immediateProvider.setImmediate,
            clearImmediate =
              immediateProvider_1.immediateProvider.clearImmediate;
          var handle = setImmediate(function () {
            values.push('a@' + testScheduler.now());
          });
          chai_1.expect(values).to.deep.equal([]);
          clearImmediate(handle);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal([]);
          }, 10);
        });
      });
      it('should schedule intervals', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setInterval = intervalProvider_1.intervalProvider.setInterval,
            clearInterval = intervalProvider_1.intervalProvider.clearInterval;
          var handle = setInterval(function () {
            values.push('a@' + testScheduler.now());
            clearInterval(handle);
          }, 1);
          chai_1.expect(values).to.deep.equal([]);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@1']);
          }, 10);
        });
      });
      it('should reschedule intervals until cleared', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setInterval = intervalProvider_1.intervalProvider.setInterval,
            clearInterval = intervalProvider_1.intervalProvider.clearInterval;
          var handle = setInterval(function () {
            if (testScheduler.now() <= 3) {
              values.push('a@' + testScheduler.now());
            } else {
              clearInterval(handle);
            }
          }, 1);
          chai_1.expect(values).to.deep.equal([]);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@1', 'a@2', 'a@3']);
          }, 10);
        });
      });
      it('should schedule timeouts', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setTimeout = timeoutProvider_1.timeoutProvider.setTimeout;
          setTimeout(function () {
            values.push('a@' + testScheduler.now());
          }, 1);
          chai_1.expect(values).to.deep.equal([]);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['a@1']);
          }, 10);
        });
      });
      it('should schedule immediates before intervals and timeouts', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function () {
          var values = [];
          var setImmediate = immediateProvider_1.immediateProvider.setImmediate;
          var setInterval = intervalProvider_1.intervalProvider.setInterval,
            clearInterval = intervalProvider_1.intervalProvider.clearInterval;
          var setTimeout = timeoutProvider_1.timeoutProvider.setTimeout;
          var handle = setInterval(function () {
            values.push('a@' + testScheduler.now());
            clearInterval(handle);
          }, 0);
          setTimeout(function () {
            values.push('b@' + testScheduler.now());
          }, 0);
          setImmediate(function () {
            values.push('c@' + testScheduler.now());
          });
          chai_1.expect(values).to.deep.equal([]);
          testScheduler.schedule(function () {
            chai_1.expect(values).to.deep.equal(['c@0', 'a@0', 'b@0']);
          }, 10);
        });
      });
    });
    describe('schedulers', function () {
      it('should support animationFrame, async and asap schedulers', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var animate = _a.animate,
            cold = _a.cold,
            expectObservable = _a.expectObservable,
            time = _a.time;
          animate('            ---------x');
          var mapped = cold('--m-------');
          var tb = time('      -----|  ');
          var expected = '   --(dc)-b-a';
          var result = mapped.pipe(
            operators_1.mergeMap(function () {
              return rxjs_1.merge(
                rxjs_1
                  .of('a')
                  .pipe(operators_1.delay(0, rxjs_1.animationFrameScheduler)),
                rxjs_1
                  .of('b')
                  .pipe(operators_1.delay(tb, rxjs_1.asyncScheduler)),
                rxjs_1
                  .of('c')
                  .pipe(operators_1.delay(0, rxjs_1.asyncScheduler)),
                rxjs_1.of('d').pipe(operators_1.delay(0, rxjs_1.asapScheduler))
              );
            })
          );
          expectObservable(result).toBe(expected);
        });
      });
      it('should emit asap notifications before async notifications', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable;
          var mapped = cold('--ab------');
          var expected = '   ---(ba)---';
          var result = mapped.pipe(
            operators_1.mergeMap(function (value) {
              return value === 'a'
                ? rxjs_1
                    .of(value)
                    .pipe(operators_1.delay(1, rxjs_1.asyncScheduler))
                : rxjs_1
                    .of(value)
                    .pipe(operators_1.delay(0, rxjs_1.asapScheduler));
            })
          );
          expectObservable(result).toBe(expected);
        });
      });
      it('should support intervals with zero duration', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var cold = _a.cold,
            expectObservable = _a.expectObservable;
          var mapped = cold('--m-------');
          var expected = '   --(bbbaaa)';
          var result = mapped.pipe(
            operators_1.mergeMap(function () {
              return rxjs_1.merge(
                rxjs_1
                  .interval(0, rxjs_1.asyncScheduler)
                  .pipe(operators_1.mapTo('a'), operators_1.take(3)),
                rxjs_1
                  .interval(0, rxjs_1.asapScheduler)
                  .pipe(operators_1.mapTo('b'), operators_1.take(3))
              );
            })
          );
          expectObservable(result).toBe(expected);
        });
      });
    });
    describe('time', function () {
      it('should parse a simple time marble string to a number', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var time = _a.time;
          var t = time('--|');
          chai_1.expect(t).to.equal(2);
        });
      });
      it('should ignore whitespace', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var time = _a.time;
          var t = time('  --|');
          chai_1.expect(t).to.equal(2);
        });
      });
      it('should throw if not given good marble input', function () {
        var testScheduler = new testing_1.TestScheduler(assertDeepEquals);
        testScheduler.run(function (_a) {
          var time = _a.time;
          chai_1
            .expect(function () {
              time('-a-b-#');
            })
            .to.throw();
        });
      });
    });
  });
});
//# sourceMappingURL=TestScheduler-spec.js.map
