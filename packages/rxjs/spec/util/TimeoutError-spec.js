'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var chai_1 = require('chai');
var rxjs_1 = require('rxjs');
describe('TimeoutError', function () {
  var error = new rxjs_1.TimeoutError();
  it('Should have a name', function () {
    chai_1.expect(error.name).to.be.equal('TimeoutError');
  });
  it('Should have a message', function () {
    chai_1.expect(error.message).to.be.equal('Timeout has occurred');
  });
  it('Should have a stack', function () {
    chai_1.expect(error.stack).to.be.a('string');
  });
});
//# sourceMappingURL=TimeoutError-spec.js.map
