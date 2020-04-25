const getPackageFn = require('../../src/get-package');
const sinon = require('sinon');
const assert = require('assert');

afterEach(function(){
  sinon.reset();
});

describe('get-package', function(){
  it('calls require', function(){
    const requireSpy = sinon.spy();
    const requiregSpy = sinon.spy();
    const result = getPackageFn(requireSpy, requiregSpy)('spec-md');
    assert(requireSpy.withArgs('spec-md').calledOnce);
  });

  it('calls requireg', function(){
    const requireSpy = sinon.stub();
    const requiregSpy = sinon.stub();
    const result = getPackageFn(requireSpy, requiregSpy)('spec-md');
    assert(requiregSpy.withArgs('spec-md').calledOnce);
  });

  it('does not call requireg if found on require', function(){
    const requireSpy = sinon.stub().returns(true)
    const requiregSpy = sinon.stub();
    const result = getPackageFn(requireSpy, requiregSpy)('spec-md');
    assert(requiregSpy.notCalled);
  });
});
