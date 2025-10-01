'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
describe('ObjectUnsubscribedError', function () {
  var error = new rxjs_1.ObjectUnsubscribedError();
  it('Should have a name', function () {
    chai_1.expect(error.name).to.be.equal('ObjectUnsubscribedError');
  });
  it('Should have a message', function () {
    chai_1.expect(error.message).to.be.equal('object unsubscribed');
  });
  it('Should have a stack', function () {
    chai_1.expect(error.stack).to.be.a('string');
  });
});
//# sourceMappingURL=ObjectUnsubscribedError-spec.js.map
