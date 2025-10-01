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
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var sinon = require('sinon');
var ajax_1 = require('rxjs/ajax');
var testing_1 = require('rxjs/testing');
var rxjs_1 = require('rxjs');
var nodeFormData = require('form-data');
var root =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  global;
if (typeof root.FormData === 'undefined') {
  root.FormData = nodeFormData;
}
describe('ajax', function () {
  var rXHR;
  var sandbox;
  beforeEach(function () {
    sandbox = sinon.createSandbox();
    rXHR = root.XMLHttpRequest;
    root.XMLHttpRequest = MockXMLHttpRequest;
  });
  afterEach(function () {
    sandbox.restore();
    MockXMLHttpRequest.clearRequest();
    root.XMLHttpRequest = rXHR;
    root.XDomainRequest = null;
    root.ActiveXObject = null;
  });
  it('should create default XMLHttpRequest for non CORS', function () {
    var obj = {
      url: '/',
      method: '',
    };
    ajax_1.ajax(obj).subscribe();
    chai_1.expect(MockXMLHttpRequest.mostRecent.withCredentials).to.be.false;
  });
  it('should raise an error if not able to create XMLHttpRequest', function () {
    root.XMLHttpRequest = null;
    root.ActiveXObject = null;
    var obj = {
      url: '/',
      method: '',
    };
    ajax_1.ajax(obj).subscribe({
      error: function (err) {
        return chai_1.expect(err).to.exist;
      },
    });
  });
  it('should create XMLHttpRequest for CORS', function () {
    var obj = {
      url: '/',
      method: '',
      crossDomain: true,
      withCredentials: true,
    };
    ajax_1.ajax(obj).subscribe();
    chai_1.expect(MockXMLHttpRequest.mostRecent.withCredentials).to.be.true;
  });
  it('should raise an error if not able to create CORS request', function () {
    root.XMLHttpRequest = null;
    root.XDomainRequest = null;
    var obj = {
      url: '/',
      method: '',
      crossDomain: true,
      withCredentials: true,
    };
    ajax_1.ajax(obj).subscribe({
      error: function (err) {
        return chai_1.expect(err).to.exist;
      },
    });
  });
  it('should set headers', function () {
    var obj = {
      url: '/talk-to-me-goose',
      headers: {
        'Content-Type': 'kenny/loggins',
        'Fly-Into-The': 'Dangah Zone!',
        'Take-A-Ride-Into-The': 'Danger ZoooOoone!',
      },
      method: '',
    };
    ajax_1.ajax(obj).subscribe();
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.url).to.equal('/talk-to-me-goose');
    chai_1.expect(request.requestHeaders).to.deep.equal({
      'content-type': 'kenny/loggins',
      'fly-into-the': 'Dangah Zone!',
      'take-a-ride-into-the': 'Danger ZoooOoone!',
      'x-requested-with': 'XMLHttpRequest',
    });
    chai_1.expect(obj.headers).to.deep.equal({
      'Content-Type': 'kenny/loggins',
      'Fly-Into-The': 'Dangah Zone!',
      'Take-A-Ride-Into-The': 'Danger ZoooOoone!',
    });
  });
  describe('ajax XSRF cookie in custom header', function () {
    beforeEach(function () {
      global.document = {
        cookie: 'foo=bar',
      };
    });
    afterEach(function () {
      delete global.document;
    });
    it('should send the cookie with a custom header to the same domain', function () {
      var obj = {
        url: '/some/path',
        xsrfCookieName: 'foo',
        xsrfHeaderName: 'Custom-Header-Name',
      };
      ajax_1.ajax(obj).subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.url).to.equal('/some/path');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'Custom-Header-Name': 'bar',
        'x-requested-with': 'XMLHttpRequest',
      });
    });
    it('should send the cookie cross-domain with a custom header when withCredentials is set', function () {
      var obj = {
        url: 'https://some.subresource.net/some/page',
        xsrfCookieName: 'foo',
        xsrfHeaderName: 'Custom-Header-Name',
        crossDomain: true,
        withCredentials: true,
      };
      ajax_1.ajax(obj).subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      chai_1
        .expect(request.url)
        .to.equal('https://some.subresource.net/some/page');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'Custom-Header-Name': 'bar',
      });
    });
    it('should not send the cookie cross-domain with a custom header when withCredentials is not set', function () {
      var obj = {
        url: 'https://some.subresource.net/some/page',
        xsrfCookieName: 'foo',
        xsrfHeaderName: 'Custom-Header-Name',
        crossDomain: true,
      };
      ajax_1.ajax(obj).subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      chai_1
        .expect(request.url)
        .to.equal('https://some.subresource.net/some/page');
      chai_1.expect(request.requestHeaders).to.deep.equal({});
    });
    it('should not send the cookie if there is no xsrfHeaderName option', function () {
      var obj = {
        url: '/some/page',
        xsrfCookieName: 'foo',
      };
      ajax_1.ajax(obj).subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.url).to.equal('/some/page');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'x-requested-with': 'XMLHttpRequest',
      });
    });
  });
  it('should set the X-Requested-With if crossDomain is false', function () {
    ajax_1
      .ajax({
        url: '/test/monkey',
        method: 'GET',
        crossDomain: false,
      })
      .subscribe();
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.requestHeaders).to.deep.equal({
      'x-requested-with': 'XMLHttpRequest',
    });
  });
  it('should NOT set the X-Requested-With if crossDomain is true', function () {
    ajax_1
      .ajax({
        url: '/test/monkey',
        method: 'GET',
        crossDomain: true,
      })
      .subscribe();
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.requestHeaders).to.not.have.key('x-requested-with');
  });
  it('should not alter user-provided X-Requested-With header, even if crossDomain is true', function () {
    ajax_1
      .ajax({
        url: '/test/monkey',
        method: 'GET',
        crossDomain: true,
        headers: {
          'x-requested-with': 'Custom-XMLHttpRequest',
        },
      })
      .subscribe();
    var request = MockXMLHttpRequest.mostRecent;
    chai_1
      .expect(request.requestHeaders['x-requested-with'])
      .to.equal('Custom-XMLHttpRequest');
  });
  it('should not set default Content-Type header when no body is sent', function () {
    var obj = {
      url: '/talk-to-me-goose',
      method: 'GET',
    };
    ajax_1.ajax(obj).subscribe();
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.url).to.equal('/talk-to-me-goose');
    chai_1.expect(request.requestHeaders).to.not.have.keys('Content-Type');
  });
  it('should error if createXHR throws', function () {
    var error;
    ajax_1
      .ajax({
        url: '/flibbertyJibbet',
        responseType: 'text',
        createXHR: function () {
          throw new Error('wokka wokka');
        },
      })
      .subscribe({
        next: function () {
          throw new Error('should not next');
        },
        error: function (err) {
          error = err;
        },
        complete: function () {
          throw new Error('should not complete');
        },
      });
    chai_1.expect(error).to.be.an('error', 'wokka wokka');
  });
  it('should error if send request throws', function (done) {
    var expected = new Error('xhr send failure');
    ajax_1
      .ajax({
        url: '/flibbertyJibbet',
        responseType: 'text',
        method: '',
        createXHR: function () {
          var ret = new MockXMLHttpRequest();
          ret.send = function () {
            throw expected;
          };
          return ret;
        },
      })
      .subscribe({
        next: function () {
          done(new Error('should not be called'));
        },
        error: function (e) {
          chai_1.expect(e).to.be.equal(expected);
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
        },
      });
  });
  it('should succeed on 200', function () {
    var expected = { foo: 'bar' };
    var result;
    var complete = false;
    ajax_1
      .ajax({
        url: '/flibbertyJibbet',
        method: '',
      })
      .subscribe({
        next: function (x) {
          result = x;
        },
        complete: function () {
          complete = true;
        },
      });
    chai_1
      .expect(MockXMLHttpRequest.mostRecent.url)
      .to.equal('/flibbertyJibbet');
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 200,
      responseText: JSON.stringify(expected),
    });
    chai_1.expect(result.xhr).exist;
    chai_1.expect(result.response).to.deep.equal({ foo: 'bar' });
    chai_1.expect(complete).to.be.true;
  });
  it('should fail if fails to parse response in older IE', function () {
    var error;
    var obj = {
      url: '/flibbertyJibbet',
      method: '',
    };
    MockXMLHttpRequest.noResponseProp = true;
    ajax_1.ajax(obj).subscribe({
      next: function () {
        throw new Error('should not next');
      },
      error: function (err) {
        error = err;
      },
      complete: function () {
        throw new Error('should not complete');
      },
    });
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 207,
      responseText: 'Wee! I am text, but should be valid JSON!',
    });
    chai_1.expect(error instanceof SyntaxError).to.be.true;
    chai_1
      .expect(error.message)
      .to.equal('Unexpected token W in JSON at position 0');
  });
  it('should fail on 404', function () {
    var error;
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'text',
      method: '',
    };
    ajax_1.ajax(obj).subscribe({
      next: function () {
        throw new Error('should not next');
      },
      error: function (err) {
        error = err;
      },
      complete: function () {
        throw new Error('should not complete');
      },
    });
    chai_1
      .expect(MockXMLHttpRequest.mostRecent.url)
      .to.equal('/flibbertyJibbet');
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 404,
      responseText: 'Wee! I am text!',
    });
    chai_1.expect(error instanceof ajax_1.AjaxError).to.be.true;
    chai_1.expect(error.name).to.equal('AjaxError');
    chai_1.expect(error.message).to.equal('ajax error 404');
    chai_1.expect(error.status).to.equal(404);
  });
  it('should succeed on 300', function () {
    var result;
    var complete = false;
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'text',
      method: '',
    };
    ajax_1.ajax(obj).subscribe({
      next: function (x) {
        result = x;
      },
      complete: function () {
        complete = true;
      },
    });
    chai_1
      .expect(MockXMLHttpRequest.mostRecent.url)
      .to.equal('/flibbertyJibbet');
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 300,
      responseText: 'Wee! I am text!',
    });
    chai_1.expect(result.xhr).exist;
    chai_1.expect(result.response).to.deep.equal('Wee! I am text!');
    chai_1.expect(complete).to.be.true;
  });
  it('should not fail if fails to parse error response', function () {
    var error;
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'json',
      method: '',
    };
    ajax_1.ajax(obj).subscribe({
      next: function () {
        throw new Error('should not next');
      },
      error: function (err) {
        error = err;
      },
      complete: function () {
        throw new Error('should not complete');
      },
    });
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 404,
      responseText: 'Unparsable as json',
    });
    chai_1.expect(error instanceof ajax_1.AjaxError).to.be.true;
    chai_1.expect(error.response).to.be.null;
  });
  it('should succeed no settings', function () {
    var expected = JSON.stringify({ foo: 'bar' });
    ajax_1.ajax('/flibbertyJibbet').subscribe({
      next: function (x) {
        chai_1.expect(x.status).to.equal(200);
        chai_1.expect(x.xhr.method).to.equal('GET');
        chai_1.expect(x.xhr.responseText).to.equal(expected);
      },
      error: function () {
        throw 'should not have been called';
      },
    });
    chai_1
      .expect(MockXMLHttpRequest.mostRecent.url)
      .to.equal('/flibbertyJibbet');
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 200,
      responseText: expected,
    });
  });
  it('should fail no settings', function () {
    var expected = JSON.stringify({ foo: 'bar' });
    ajax_1.ajax('/flibbertyJibbet').subscribe({
      next: function () {
        throw 'should not have been called';
      },
      error: function (x) {
        chai_1.expect(x.status).to.equal(500);
        chai_1.expect(x.xhr.method).to.equal('GET');
        chai_1.expect(x.xhr.responseText).to.equal(expected);
      },
      complete: function () {
        throw 'should not have been called';
      },
    });
    chai_1
      .expect(MockXMLHttpRequest.mostRecent.url)
      .to.equal('/flibbertyJibbet');
    MockXMLHttpRequest.mostRecent.respondWith({
      status: 500,
      responseText: expected,
    });
  });
  it('should create an asynchronous request', function () {
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'text',
      timeout: 10,
    };
    ajax_1.ajax(obj).subscribe({
      next: function (x) {
        chai_1.expect(x.status).to.equal(200);
        chai_1.expect(x.xhr.method).to.equal('GET');
        chai_1.expect(x.xhr.async).to.equal(true);
        chai_1.expect(x.xhr.timeout).to.equal(10);
        chai_1.expect(x.xhr.responseType).to.equal('text');
      },
      error: function () {
        throw 'should not have been called';
      },
    });
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.url).to.equal('/flibbertyJibbet');
    request.respondWith({
      status: 200,
      responseText: 'Wee! I am text!',
    });
  });
  it('should error on timeout of asynchronous request', function () {
    var rxTestScheduler = new testing_1.TestScheduler(rxjs_1.noop);
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'text',
      timeout: 10,
    };
    ajax_1.ajax(obj).subscribe({
      next: function () {
        throw 'should not have been called';
      },
      error: function (e) {
        chai_1.expect(e.status).to.equal(0);
        chai_1.expect(e.xhr.method).to.equal('GET');
        chai_1.expect(e.xhr.async).to.equal(true);
        chai_1.expect(e.xhr.timeout).to.equal(10);
        chai_1.expect(e.xhr.responseType).to.equal('text');
      },
    });
    var request = MockXMLHttpRequest.mostRecent;
    chai_1.expect(request.url).to.equal('/flibbertyJibbet');
    rxTestScheduler.schedule(function () {
      request.respondWith({
        status: 200,
        responseText: 'Wee! I am text!',
      });
    }, 1000);
    rxTestScheduler.flush();
  });
  it('should create a synchronous request', function () {
    var obj = {
      url: '/flibbertyJibbet',
      responseType: 'text',
      timeout: 10,
      async: false,
    };
    ajax_1.ajax(obj).subscribe();
    var mockXHR = MockXMLHttpRequest.mostRecent;
    chai_1.expect(mockXHR.url).to.equal('/flibbertyJibbet');
    chai_1.expect(mockXHR.async).to.be.false;
    mockXHR.respondWith({
      status: 200,
      responseText: 'Wee! I am text!',
    });
  });
  describe('ajax request body', function () {
    it('can take string body', function () {
      var obj = {
        url: '/flibbertyJibbet',
        method: 'POST',
        body: 'foobar',
      };
      ajax_1.ajax(obj).subscribe();
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.url)
        .to.equal('/flibbertyJibbet');
      chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('foobar');
    });
    it('can take FormData body', function () {
      var body = new root.FormData();
      var obj = {
        url: '/flibbertyJibbet',
        method: 'POST',
        body: body,
      };
      ajax_1.ajax(obj).subscribe();
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.url)
        .to.equal('/flibbertyJibbet');
      chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal(body);
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.requestHeaders)
        .to.deep.equal({
          'x-requested-with': 'XMLHttpRequest',
        });
    });
    it('should send the URLSearchParams straight through to the body', function () {
      var body = new URLSearchParams({
        '🌟': '🚀',
      });
      var obj = {
        url: '/flibbertyJibbet',
        method: 'POST',
        body: body,
      };
      ajax_1.ajax(obj).subscribe();
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.url)
        .to.equal('/flibbertyJibbet');
      chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal(body);
    });
    it('should send by JSON', function () {
      var body = {
        '🌟': '🚀',
      };
      var obj = {
        url: '/flibbertyJibbet',
        method: 'POST',
        body: body,
      };
      ajax_1.ajax(obj).subscribe();
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.url)
        .to.equal('/flibbertyJibbet');
      chai_1.expect(MockXMLHttpRequest.mostRecent.data).to.equal('{"🌟":"🚀"}');
    });
    it('should send json body not mattered on case-sensitivity of HTTP headers', function () {
      var body = {
        hello: 'world',
      };
      var requestObj = {
        url: '/flibbertyJibbet',
        method: '',
        body: body,
        headers: {
          'cOnTeNt-TyPe': 'application/json;charset=UTF-8',
        },
      };
      ajax_1.ajax(requestObj).subscribe();
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.url)
        .to.equal('/flibbertyJibbet');
      chai_1
        .expect(MockXMLHttpRequest.mostRecent.data)
        .to.equal('{"hello":"world"}');
    });
    it('should error if send request throws', function (done) {
      var expected = new Error('xhr send failure');
      var obj = {
        url: '/flibbertyJibbet',
        responseType: 'text',
        method: '',
        body: 'foobar',
        createXHR: function () {
          var ret = new MockXMLHttpRequest();
          ret.send = function () {
            throw expected;
          };
          return ret;
        },
      };
      ajax_1.ajax(obj).subscribe({
        next: function () {
          done(new Error('should not be called'));
        },
        error: function (e) {
          chai_1.expect(e).to.be.equal(expected);
          done();
        },
        complete: function () {
          done(new Error('should not be called'));
        },
      });
    });
  });
  describe('ajax.get', function () {
    it('should succeed on 200', function () {
      var expected = { foo: 'bar' };
      var result;
      var complete = false;
      ajax_1.ajax.get('/flibbertyJibbet').subscribe({
        next: function (x) {
          result = x.response;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      request.respondWith({
        status: 200,
        responseText: JSON.stringify(expected),
      });
      chai_1.expect(result).to.deep.equal(expected);
      chai_1.expect(complete).to.be.true;
    });
    it('should succeed on 204 No Content', function () {
      var result;
      var complete = false;
      ajax_1.ajax.get('/flibbertyJibbet').subscribe({
        next: function (x) {
          result = x.response;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      request.respondWith({
        status: 204,
        responseText: '',
      });
      chai_1.expect(result).to.be.null;
      chai_1.expect(complete).to.be.true;
    });
    it('should able to select json response via getJSON', function () {
      var expected = { foo: 'bar' };
      var result;
      var complete = false;
      ajax_1.ajax.getJSON('/flibbertyJibbet').subscribe({
        next: function (x) {
          result = x;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      request.respondWith({
        status: 200,
        responseText: JSON.stringify(expected),
      });
      chai_1.expect(result).to.deep.equal(expected);
      chai_1.expect(complete).to.be.true;
    });
  });
  describe('ajax.post', function () {
    it('should succeed on 200', function () {
      var expected = { foo: 'bar', hi: 'there you' };
      var result;
      var complete = false;
      ajax_1.ajax.post('/flibbertyJibbet', expected).subscribe({
        next: function (x) {
          result = x;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.method).to.equal('POST');
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'content-type': 'application/json;charset=utf-8',
        'x-requested-with': 'XMLHttpRequest',
      });
      request.respondWith({
        status: 200,
        responseText: JSON.stringify(expected),
      });
      chai_1.expect(request.data).to.equal(JSON.stringify(expected));
      chai_1.expect(result.response).to.deep.equal(expected);
      chai_1.expect(complete).to.be.true;
    });
    it('should succeed on 204 No Content', function () {
      var result;
      var complete = false;
      ajax_1.ajax.post('/flibbertyJibbet', undefined).subscribe({
        next: function (x) {
          result = x;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.method).to.equal('POST');
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'x-requested-with': 'XMLHttpRequest',
      });
      request.respondWith({
        status: 204,
        responseText: '',
      });
      chai_1.expect(result.response).to.be.null;
      chai_1.expect(complete).to.be.true;
    });
    it('should allow partial progressSubscriber ', function () {
      var spy = sinon.spy();
      var progressSubscriber = {
        next: spy,
      };
      ajax_1
        .ajax({
          url: '/flibbertyJibbet',
          progressSubscriber: progressSubscriber,
        })
        .subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      request.respondWith(
        {
          status: 200,
          responseText: JSON.stringify({}),
        },
        { uploadProgressTimes: 3 }
      );
      chai_1.expect(spy).to.be.called.callCount(4);
    });
    it('should emit progress event when progressSubscriber is specified', function () {
      var spy = sinon.spy();
      var progressSubscriber = {
        next: spy,
        error: function () {},
        complete: function () {},
      };
      ajax_1
        .ajax({
          url: '/flibbertyJibbet',
          progressSubscriber: progressSubscriber,
        })
        .subscribe();
      var request = MockXMLHttpRequest.mostRecent;
      request.respondWith(
        {
          status: 200,
          responseText: JSON.stringify({}),
        },
        { uploadProgressTimes: 3 }
      );
      chai_1.expect(spy).to.be.called.callCount(4);
    });
  });
  describe('ajax.patch', function () {
    it('should create an AjaxObservable with correct options', function () {
      var expected = { foo: 'bar', hi: 'there you' };
      var result;
      var complete = false;
      ajax_1.ajax.patch('/flibbertyJibbet', expected).subscribe({
        next: function (x) {
          result = x;
        },
        complete: function () {
          complete = true;
        },
      });
      var request = MockXMLHttpRequest.mostRecent;
      chai_1.expect(request.method).to.equal('PATCH');
      chai_1.expect(request.url).to.equal('/flibbertyJibbet');
      chai_1.expect(request.requestHeaders).to.deep.equal({
        'content-type': 'application/json;charset=utf-8',
        'x-requested-with': 'XMLHttpRequest',
      });
      request.respondWith({
        status: 200,
        responseText: JSON.stringify(expected),
      });
      chai_1.expect(request.data).to.equal(JSON.stringify(expected));
      chai_1.expect(result.response).to.deep.equal(expected);
      chai_1.expect(complete).to.be.true;
    });
  });
  describe('ajax error classes', function () {
    describe('AjaxError', function () {
      it('should extend Error class', function () {
        var error = new ajax_1.AjaxError('Test error', new XMLHttpRequest(), {
          url: '/',
          method: 'GET',
          responseType: 'json',
          headers: {},
          withCredentials: false,
          async: true,
          timeout: 0,
          crossDomain: false,
        });
        chai_1.expect(error).to.be.an.instanceOf(Error);
      });
    });
    describe('AjaxTimeoutError', function () {
      it('should extend Error class', function () {
        var error = new ajax_1.AjaxTimeoutError(new XMLHttpRequest(), {
          url: '/',
          method: 'GET',
          responseType: 'json',
          headers: {},
          withCredentials: false,
          async: true,
          timeout: 0,
          crossDomain: false,
        });
        chai_1.expect(error).to.be.an.instanceOf(Error);
      });
      it('should extend AjaxError class', function () {
        var error = new ajax_1.AjaxTimeoutError(new XMLHttpRequest(), {
          url: '/',
          method: 'GET',
          responseType: 'json',
          headers: {},
          withCredentials: false,
          async: true,
          timeout: 0,
          crossDomain: false,
        });
        chai_1.expect(error).to.be.an.instanceOf(ajax_1.AjaxError);
      });
    });
  });
  it('should error if aborted early', function () {
    var thrown = null;
    ajax_1
      .ajax({
        method: 'GET',
        url: '/flibbertyJibbett',
      })
      .subscribe({
        next: function () {
          throw new Error('should not be called');
        },
        error: function (err) {
          thrown = err;
        },
      });
    var mockXHR = MockXMLHttpRequest.mostRecent;
    chai_1.expect(thrown).to.be.null;
    mockXHR.triggerEvent('abort', { type: 'abort' });
    chai_1.expect(thrown).to.be.an.instanceOf(ajax_1.AjaxError);
    chai_1.expect(thrown.message).to.equal('aborted');
  });
  describe('with includeDownloadProgress', function () {
    it('should emit download progress', function () {
      var results = [];
      ajax_1
        .ajax({
          method: 'GET',
          url: '/flibbertyJibbett',
          includeDownloadProgress: true,
        })
        .subscribe({
          next: function (value) {
            return results.push(value);
          },
          complete: function () {
            return results.push('done');
          },
        });
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith(
        {
          status: 200,
          total: 5,
          loaded: 5,
          responseText: JSON.stringify({ boo: 'I am a ghost' }),
        },
        { uploadProgressTimes: 5, downloadProgressTimes: 5 }
      );
      var request = {
        async: true,
        body: undefined,
        crossDomain: false,
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        includeDownloadProgress: true,
        method: 'GET',
        responseType: 'json',
        timeout: 0,
        url: '/flibbertyJibbett',
        withCredentials: false,
      };
      chai_1.expect(results).to.deep.equal([
        {
          type: 'download_loadstart',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 0,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'loadstart', loaded: 0, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 1,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 1, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 2,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 2, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 3,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 3, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 4,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 4, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 5,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 5, total: 5 },
        },
        {
          type: 'download_load',
          loaded: 5,
          total: 5,
          request: request,
          originalEvent: { type: 'load', loaded: 5, total: 5 },
          xhr: mockXHR,
          response: { boo: 'I am a ghost' },
          responseHeaders: {},
          responseType: 'json',
          status: 200,
        },
        'done',
      ]);
    });
    it('should emit upload and download progress', function () {
      var results = [];
      ajax_1
        .ajax({
          method: 'GET',
          url: '/flibbertyJibbett',
          includeUploadProgress: true,
          includeDownloadProgress: true,
        })
        .subscribe({
          next: function (value) {
            return results.push(value);
          },
          complete: function () {
            return results.push('done');
          },
        });
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith(
        {
          status: 200,
          total: 5,
          loaded: 5,
          responseText: JSON.stringify({ boo: 'I am a ghost' }),
        },
        { uploadProgressTimes: 5, downloadProgressTimes: 5 }
      );
      var request = {
        async: true,
        body: undefined,
        crossDomain: false,
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        includeUploadProgress: true,
        includeDownloadProgress: true,
        method: 'GET',
        responseType: 'json',
        timeout: 0,
        url: '/flibbertyJibbett',
        withCredentials: false,
      };
      chai_1.expect(results).to.deep.equal([
        {
          type: 'upload_loadstart',
          loaded: 0,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'loadstart', loaded: 0, total: 5 },
        },
        {
          type: 'upload_progress',
          loaded: 1,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 1, total: 5 },
        },
        {
          type: 'upload_progress',
          loaded: 2,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 2, total: 5 },
        },
        {
          type: 'upload_progress',
          loaded: 3,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 3, total: 5 },
        },
        {
          type: 'upload_progress',
          loaded: 4,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 4, total: 5 },
        },
        {
          type: 'upload_progress',
          loaded: 5,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 5, total: 5 },
        },
        {
          type: 'upload_load',
          loaded: 5,
          total: 5,
          request: request,
          status: 0,
          response: undefined,
          responseHeaders: {},
          responseType: 'json',
          xhr: mockXHR,
          originalEvent: { type: 'load', loaded: 5, total: 5 },
        },
        {
          type: 'download_loadstart',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 0,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'loadstart', loaded: 0, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 1,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 1, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 2,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 2, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 3,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 3, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 4,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 4, total: 5 },
        },
        {
          type: 'download_progress',
          responseHeaders: {},
          responseType: 'json',
          response: undefined,
          loaded: 5,
          total: 5,
          request: request,
          status: 0,
          xhr: mockXHR,
          originalEvent: { type: 'progress', loaded: 5, total: 5 },
        },
        {
          type: 'download_load',
          loaded: 5,
          total: 5,
          request: request,
          originalEvent: { type: 'load', loaded: 5, total: 5 },
          xhr: mockXHR,
          response: { boo: 'I am a ghost' },
          responseHeaders: {},
          responseType: 'json',
          status: 200,
        },
        'done',
      ]);
    });
  });
  it('should return an object that allows access to response headers', function () {
    var sentResponseHeaders = {
      'content-type': 'application/json',
      'x-custom-header': 'test',
      'x-headers-are-fun': '<whatever/> {"weird": "things"}',
    };
    ajax_1
      .ajax({
        method: 'GET',
        url: '/whatever',
      })
      .subscribe(function (response) {
        chai_1
          .expect(response.responseHeaders)
          .to.deep.equal(sentResponseHeaders);
      });
    var mockXHR = MockXMLHttpRequest.mostRecent;
    mockXHR.respondWith({
      status: 200,
      headers: sentResponseHeaders,
      responseText: JSON.stringify({
        iam: 'tired',
        and: 'should go to bed',
        but: 'I am doing open source for no good reason',
      }),
    });
    chai_1
      .expect(mockXHR.getAllResponseHeaders())
      .to.equal(
        'content-type: application/json\nx-custom-header: test\nx-headers-are-fun: <whatever/> {"weird": "things"}'
      );
  });
  describe('with queryParams', function () {
    it('should allow passing of search queryParams as a dictionary', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: { foo: 'bar', whatever: '123' },
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1.expect(mockXHR.url).to.equal('/whatever?foo=bar&whatever=123');
    });
    it('should allow passing of search queryParams as an entries array', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: [
            ['foo', 'bar'],
            ['whatever', '123'],
          ],
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1.expect(mockXHR.url).to.equal('/whatever?foo=bar&whatever=123');
    });
    it('should allow passing of search queryParams as a string', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: '?foo=bar&whatever=123',
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1.expect(mockXHR.url).to.equal('/whatever?foo=bar&whatever=123');
    });
    it('should allow passing of search queryParams as a URLSearchParams object', function () {
      var queryParams = new URLSearchParams();
      queryParams.set('foo', 'bar');
      queryParams.set('whatever', '123');
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: queryParams,
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1.expect(mockXHR.url).to.equal('/whatever?foo=bar&whatever=123');
    });
    it('should not screw things up if there is an existing search string in the url passed', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever?jays_face=is+a+param&lol=haha',
          queryParams: { foo: 'bar', whatever: '123' },
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1
        .expect(mockXHR.url)
        .to.equal(
          '/whatever?jays_face=is+a+param&lol=haha&foo=bar&whatever=123'
        );
    });
    it('should overwrite existing args from existing search strings in the url passed', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever?terminator=2&uncle_bob=huh',
          queryParams: { uncle_bob: '...okayyyyyyy', movie_quote: 'yes' },
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1
        .expect(mockXHR.url)
        .to.equal(
          '/whatever?terminator=2&uncle_bob=...okayyyyyyy&movie_quote=yes'
        );
    });
    it('should properly encode values', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: {
            'this is a weird param name': '?#* value here rofl !!!',
          },
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1
        .expect(mockXHR.url)
        .to.equal(
          '/whatever?this+is+a+weird+param+name=%3F%23*+value+here+rofl+%21%21%21'
        );
    });
    it('should handle dictionaries that have numbers, booleans, and arrays of numbers, strings or booleans', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: {
            a: 123,
            b: true,
            c: ['one', 'two', 'three'],
            d: [1, 3, 3, 7],
            e: [true, false, true],
          },
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1
        .expect(mockXHR.url)
        .to.equal(
          '/whatever?a=123&b=true&c=one%2Ctwo%2Cthree&d=1%2C3%2C3%2C7&e=true%2Cfalse%2Ctrue'
        );
    });
    it('should handle entries that have numbers, booleans, and arrays of numbers, strings or booleans', function () {
      ajax_1
        .ajax({
          method: 'GET',
          url: '/whatever',
          queryParams: [
            ['a', 123],
            ['b', true],
            ['c', ['one', 'two', 'three']],
            ['d', [1, 3, 3, 7]],
            ['e', [true, false, true]],
          ],
        })
        .subscribe();
      var mockXHR = MockXMLHttpRequest.mostRecent;
      mockXHR.respondWith({
        status: 200,
        responseText: JSON.stringify({ whatever: 'I want' }),
      });
      chai_1
        .expect(mockXHR.url)
        .to.equal(
          '/whatever?a=123&b=true&c=one%2Ctwo%2Cthree&d=1%2C3%2C3%2C7&e=true%2Cfalse%2Ctrue'
        );
    });
  });
});
var MockXHREventTarget = (function () {
  /**
   *
   */
  function MockXHREventTarget() {
    this.registry = new Map();
  }
  MockXHREventTarget.prototype.addEventListener = function (type, handler) {
    var handlers = this.registry.get(type);
    if (!handlers) {
      this.registry.set(type, (handlers = new Set()));
    }
    handlers.add(handler);
  };
  MockXHREventTarget.prototype.removeEventListener = function (type, handler) {
    var _a;
    (_a = this.registry.get(type)) === null || _a === void 0
      ? void 0
      : _a.delete(handler);
  };
  MockXHREventTarget.prototype.dispatchEvent = function (event) {
    var e_1, _a;
    var type = event.type;
    var handlers = this.registry.get(type);
    if (handlers) {
      try {
        for (
          var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next();
          !handlers_1_1.done;
          handlers_1_1 = handlers_1.next()
        ) {
          var handler = handlers_1_1.value;
          handler(event);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return))
            _a.call(handlers_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
  };
  return MockXHREventTarget;
})();
var MockXMLHttpRequest = (function (_super) {
  __extends(MockXMLHttpRequest, _super);
  /**
   *
   */
  function MockXMLHttpRequest() {
    var _this = _super.call(this) || this;
    _this.responseType = '';
    _this.readyState = 0;
    _this.async = true;
    _this.response = undefined;
    _this.requestHeaders = {};
    _this.withCredentials = false;
    _this.upload = new MockXHREventTarget();
    MockXMLHttpRequest.recentRequest = _this;
    MockXMLHttpRequest.requests.push(_this);
    if (MockXMLHttpRequest.noResponseProp) {
      delete _this['response'];
    }
    return _this;
  }
  Object.defineProperty(MockXMLHttpRequest, 'mostRecent', {
    get: function () {
      return MockXMLHttpRequest.recentRequest;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MockXMLHttpRequest, 'allRequests', {
    get: function () {
      return MockXMLHttpRequest.requests;
    },
    enumerable: false,
    configurable: true,
  });
  MockXMLHttpRequest.clearRequest = function () {
    MockXMLHttpRequest.noResponseProp = false;
    MockXMLHttpRequest.requests.length = 0;
    MockXMLHttpRequest.recentRequest = null;
  };
  MockXMLHttpRequest.prototype.send = function (data) {
    var _this = this;
    this.data = data;
    if (this.timeout && this.timeout > 0) {
      setTimeout(function () {
        if (_this.readyState != 4) {
          _this.readyState = 4;
          _this.status = 0;
          _this.triggerEvent('readystatechange');
          _this.triggerEvent('timeout');
        }
      }, this.timeout);
    }
  };
  MockXMLHttpRequest.prototype.abort = function () {};
  MockXMLHttpRequest.prototype.open = function (method, url, async) {
    this.method = method;
    this.url = url;
    this.async = async;
    this.readyState = 1;
    this.triggerEvent('readystatechange');
    var originalProgressHandler = this.upload.onprogress;
    Object.defineProperty(this.upload, 'progress', {
      get: function () {
        return originalProgressHandler;
      },
    });
  };
  MockXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
    this.requestHeaders[key] = value;
  };
  MockXMLHttpRequest.prototype.getAllResponseHeaders = function () {
    return this._responseHeaders
      ? Object.entries(this._responseHeaders)
          .map(function (entryParts) {
            return entryParts.join(': ');
          })
          .join('\n')
      : '';
  };
  MockXMLHttpRequest.prototype.respondWith = function (response, config) {
    var _a, _b;
    var _c = config !== null && config !== void 0 ? config : {},
      _d = _c.uploadProgressTimes,
      uploadProgressTimes = _d === void 0 ? 0 : _d,
      _e = _c.downloadProgressTimes,
      downloadProgressTimes = _e === void 0 ? 0 : _e;
    if (uploadProgressTimes) {
      this.triggerUploadEvent('loadstart', {
        type: 'loadstart',
        total: uploadProgressTimes,
        loaded: 0,
      });
      for (var i = 1; i <= uploadProgressTimes; i++) {
        this.triggerUploadEvent('progress', {
          type: 'progress',
          total: uploadProgressTimes,
          loaded: i,
        });
      }
      this.triggerUploadEvent('load', {
        type: 'load',
        total: uploadProgressTimes,
        loaded: uploadProgressTimes,
      });
    }
    if (downloadProgressTimes) {
      this.triggerEvent('loadstart', {
        type: 'loadstart',
        total: downloadProgressTimes,
        loaded: 0,
      });
      for (var i = 1; i <= downloadProgressTimes; i++) {
        this.triggerEvent('progress', {
          type: 'progress',
          total: downloadProgressTimes,
          loaded: i,
        });
      }
    }
    this._responseHeaders = response.headers;
    this.readyState = 4;
    this.status = response.status || 200;
    this.responseText = response.responseText;
    switch (this.responseType) {
      case 'json':
        try {
          this.response = JSON.parse(response.responseText);
        } catch (err) {
          this.response = null;
        }
        break;
      case 'arraybuffer':
      case 'document':
      case 'blob':
        throw new Error(
          'Test harness does not support the responseType: ' + this.responseType
        );
      case 'text':
      case '':
      default:
        this.response = response.responseText;
        break;
    }
    if (MockXMLHttpRequest.noResponseProp) {
      delete this['response'];
    }
    this.triggerEvent('load', {
      type: 'load',
      total: (_a = response.total) !== null && _a !== void 0 ? _a : 0,
      loaded: (_b = response.loaded) !== null && _b !== void 0 ? _b : 0,
    });
    this.triggerEvent('readystatechange', { type: 'readystatechange' });
  };
  MockXMLHttpRequest.prototype.triggerEvent = function (name, eventObj) {
    var e = eventObj || { type: name };
    this.dispatchEvent(__assign({ type: name }, eventObj));
    if (this['on' + name]) {
      this['on' + name](e);
    }
  };
  MockXMLHttpRequest.prototype.triggerUploadEvent = function (name, eventObj) {
    var e = eventObj || {};
    this.upload.dispatchEvent(__assign({ type: name }, eventObj));
    if (this.upload['on' + name]) {
      this.upload['on' + name](e);
    }
  };
  MockXMLHttpRequest.DONE = 4;
  MockXMLHttpRequest.noResponseProp = false;
  MockXMLHttpRequest.requests = [];
  return MockXMLHttpRequest;
})(MockXHREventTarget);
//# sourceMappingURL=ajax-spec.js.map
