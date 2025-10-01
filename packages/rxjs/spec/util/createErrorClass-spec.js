'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var createErrorClass_1 = require('rxjs/internal/util/createErrorClass');
var chai_1 = require('chai');
describe('createErrorClass', function () {
  it('should create a class that subclasses error and has the right properties', function () {
    var MySpecialError = createErrorClass_1.createErrorClass(function (_super) {
      return function MySpecialError(arg1, arg2) {
        _super(this);
        this.message = 'Super special error!';
        this.arg1 = arg1;
        this.arg2 = arg2;
      };
    });
    chai_1.expect(MySpecialError).to.be.a('function');
    var err = new MySpecialError(123, 'Test');
    chai_1.expect(err).to.be.an.instanceOf(Error);
    chai_1.expect(err).to.be.an.instanceOf(MySpecialError);
    chai_1.expect(err.constructor).to.equal(MySpecialError);
    chai_1.expect(err.stack).to.be.a('string');
    chai_1.expect(err.message).to.equal('Super special error!');
    chai_1.expect(err.arg1).to.equal(123);
    chai_1.expect(err.arg2).to.equal('Test');
  });
});
//# sourceMappingURL=createErrorClass-spec.js.map
