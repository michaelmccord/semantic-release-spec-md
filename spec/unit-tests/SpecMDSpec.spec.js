const SpecMDSpec = require('../../src/SpecMDSpec');
const sinon = require('sinon');
const assert = require('assert');

beforeEach(function(){
  sinon.reset();
});

describe('SpecMDSpec', function(){

  describe('constructor', function(){
    it('throws if specPath is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec(null,
        {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('throws if specPath is undefined', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec(undefined,
        {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('throws if specPath is not a string', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec({},
        {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('throws if specPath is not a valid path', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('c;/',
        {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });


    it('does not throw if pluginInfo is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
        null,
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(!theSpy.threw());
    });

    it('throws if pluginInfo.args is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
        {args:null, package: ''},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('throws if pluginInfo.package is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
        {args:[], package: null},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('does not throw if metadata is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        null,
        {parse: sinon.fake(), html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(!theSpy.threw());
    });


    it('throws if specmd is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        {},
        null,
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });


    it('throws if specmd.parse is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        {},
        {parse: null, html: sinon.fake()},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });


    it('throws if specmd.html is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: null},
        ()=>{}));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });


    it('throws if getPluginFn is null', function(){
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        null));

      try {
        theSpy();
      } catch(error){}

      assert(theSpy.threw());
    });

    it('calls getPluginFn if pluginInfo supplied', function(){
      const pluginFnSpy = sinon.spy();
      const theSpy = sinon.spy(()=>new SpecMDSpec('/',
      {args:[], package:'string'},
        {},
        {parse: sinon.fake(), html: sinon.fake()},
        pluginFnSpy));

      try {
        theSpy();
      } catch(error){}

      assert(pluginFnSpy.withArgs('string').calledOnce);
    });
  });


  describe(SpecMDSpec.prototype.parse.name, function(){
      it('calls specmd parse', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const spec = new SpecMDSpec('/',
          {args:[], package:'string'},
          {},
          {parse: parseFake, html: sinon.fake()},
          ()=>{});

          const result = spec.parse();
          assert(fakePromise == result);
          assert(parseFake.withArgs('/').calledOnce);
      });
  });


  describe(SpecMDSpec.prototype.getOutput.name, function(){
    describe('plugin case', function(){
      it('calls parse if parse not already called', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const spec = new SpecMDSpec('/',
          {args:[], package:'string'},
          {},
          {parse: parseFake, html: sinon.fake()},
          ()=>sinon.fake());

          spec.getOutput();
          assert(parseFake.withArgs('/').calledOnce);
      });

      it('does not call parse if parse already called', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const spec = new SpecMDSpec('/',
          {args:[], package:'string'},
          {},
          {parse: parseFake, html: sinon.fake()},
          ()=>sinon.fake());
          spec.parse();
          spec.getOutput();
          assert(parseFake.withArgs('/').calledOnce);
      });

      it('calls plugin', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const args = ['asdf'];
        const package = 'string';
        const metadata = {'asdf':''};
        const pluginArgs = ['/', ...args];
        const pluginFake = sinon.stub();

        const spec = new SpecMDSpec('/',
          {args, package},
          metadata,
          {parse: parseFake, html: sinon.fake()},
          ()=>pluginFake);

        spec.getOutput();

        assert(pluginFake.withArgs(
          pluginArgs,
          fakePromise,
          metadata
        ).calledOnce);

      });

      it('returns output promise', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const args = ['asdf'];
        const package = 'string';
        const metadata = {'asdf':''};
        const pluginArgs = ['/', ...args];
        const pluginPromiseFake = sinon.fake();
        const pluginFake = sinon.stub().returns(pluginPromiseFake);

        const spec = new SpecMDSpec('/',
          {args, package},
          metadata,
          {parse: parseFake, html: sinon.fake()},
          ()=>pluginFake);

        const result = spec.getOutput();

        assert(Object.is(result, pluginPromiseFake));

      });
    });



    describe('html case', function(){
      it('calls parse if parse not already called', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const spec = new SpecMDSpec('/',
          null,
          {},
          {parse: parseFake, html: sinon.fake()},
          null);

          spec.getOutput();
          assert(parseFake.withArgs('/').calledOnce);
      });

      it('does not call parse if parse already called', function(){
        const fakePromise = sinon.fake();
        const parseFake = sinon.stub().returns(fakePromise);
        const spec = new SpecMDSpec('/',
          null,
          {},
          {parse: parseFake, html: sinon.fake()},
          null);
          spec.parse();
          spec.getOutput();
          assert(parseFake.withArgs('/').calledOnce);
      });

      it('calls html', function(){
        const parsePromiseFake = sinon.fake();
        const htmlPromiseFake = sinon.fake();
        const parseFake = sinon.stub().returns(parsePromiseFake);
        const metadata = {'asdf':''};
        const htmlFake = sinon.stub().returns(htmlPromiseFake);

        const spec = new SpecMDSpec('/',
          null,
          metadata,
          {parse: parseFake, html: htmlFake},
          null);

        spec.getOutput();

        assert(htmlFake.withArgs('/',metadata).calledOnce);

      });

      it('returns output promise', function(){
        const parsePromiseFake = sinon.fake();
        const htmlPromiseFake = sinon.fake();
        const parseFake = sinon.stub().returns(parsePromiseFake);
        const metadata = {'asdf':''};
        const htmlFake = sinon.stub().returns(htmlPromiseFake);

        const spec = new SpecMDSpec('/',
          null,
          metadata,
          {parse: parseFake, html: htmlFake},
          null);

        const result = spec.getOutput();

        assert(Object.is(result, htmlPromiseFake));

      });
    });

  });


});
