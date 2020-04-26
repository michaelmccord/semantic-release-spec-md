const Plugin = require('../../src/Plugin');
const sinon = require('sinon');
const assert = require('assert');


beforeEach(function(){
  sinon.reset();
});




describe('Plugin', function(){
  describe('constructor', function(){

    it('throws if getPackage is null', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        null,
        sinon.fake(),
        {resolve: sinon.fake()},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });

    it('throws if getPackage is not a function', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        {},
        sinon.fake(),
        {resolve: sinon.fake()},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });

    it('throws if getPackage is not a function', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        {},
        sinon.fake(),
        {resolve: sinon.fake()},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });

    it('throws if getLogger is null', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        null,
        {resolve: sinon.fake()},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if getLogger is not a function', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        null,
        {resolve: sinon.fake()},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if path is null', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        null,
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });

    it('throws if path.resolve is not a function', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        {resolve: null},
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if path is not an object', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        sinon.fake(),
        {existsSync: sinon.fake()}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if fs is null', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        {resolve: sinon.fake()},
        null
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if fs is not an object', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        {resolve: sinon.fake()},
        sinon.fake()
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });


    it('throws if fs.existSync is not a function', function(){
      const theSpy = sinon.spy(()=>new Plugin(
        sinon.fake(),
        sinon.fake(),
        {resolve: sinon.fake()},
        {existsSync: null}
      ));

      try {
        theSpy();
      } catch(error) {
      }

      assert(theSpy.threw());
    });



  });

  describe(Plugin.prototype.verifyConditions.name, function(){
    it('calls getLogger', function(){
      const fakeLogger = {
        info: sinon.fake(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.fake();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      plugin.verifyConditions(pluginConfig, context);

      assert(getLoggerFake.withArgs(context).calledOnce);
    });


    it('logs info message denoting verify start', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.fake();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      plugin.verifyConditions(pluginConfig, context);

      assert(fakeLogger.info.withArgs('Verifying semantic-release-spec-md conditions...').calledOnce);

    });


    it('gets spec-md package', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      plugin.verifyConditions(pluginConfig, context);

      assert(getPackageFake.withArgs('spec-md').calledOnce);
    });

    it('logs fatal message if getting spec-md package fails', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const getPackageFake = sinon.stub().throws(new Error());
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      try {
        plugin.verifyConditions(pluginConfig, context);
      }catch(error){}

      assert(fakeLogger.fatal.withArgs(plugin.MESSAGES.specMDNotFound()).calledOnce);
    });


    it('throws missingSpecMD error if spec-md not found', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const thrownError = new Error();
      const getPackageFake = sinon.stub().throws(thrownError);
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      }catch(error){
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.missingSpecMD().name);
      assert(caughtError._errors[0].name === plugin.ERRORS.missingSpecMD()._errors[0].name);
      assert(caughtError._errors[0].code === plugin.ERRORS.missingSpecMD()._errors[0].code);
      assert(caughtError._errors[1] === thrownError);
    });


    it('logs info message if spec-md package found', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: '/test.md',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      plugin.verifyConditions(pluginConfig, context);

      assert(fakeLogger.info.withArgs(plugin.MESSAGES.specMDFound()).calledOnce);
    });

    it('throws error if specPath is undefined', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try{
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError.name === plugin.ERRORS.missingSpecPath().name);
      assert(caughtError.code === plugin.ERRORS.missingSpecPath().code);
    });


    it('throws error if specPath is empty', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: ' ',
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try{
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError.name === plugin.ERRORS.missingSpecPath().name);
      assert(caughtError.code === plugin.ERRORS.missingSpecPath().code);
    });


    it('throws error if specPath is not a string', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.fake();
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: {},
        outputPath: '/output'
      };

      const context = {
        cwd: '/',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try{
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }


      assert(caughtError.code === plugin.ERRORS.missingSpecPath().code);
    });


    it('resolves specPath against cwd', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };


      plugin.verifyConditions(pluginConfig, context);

      assert(pathResolveFake.withArgs(context.cwd, pluginConfig.specPath).calledOnce);
    });


    it('checks for resolved specPath existence', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };


      plugin.verifyConditions(pluginConfig, context);

      assert(fsExistsSyncFake.withArgs('returnedPath').calledOnce);
    });


    it('logs fatal if error checking resolved path existence', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const thrownError = new Error();
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().throws(thrownError);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      try {
        plugin.verifyConditions(pluginConfig, context);
      }catch(error) {}

      assert(fakeLogger.fatal.withArgs(plugin.MESSAGES.errDetSpecExistence()).calledOnce);
    });


    it('throws if error checking resolved path existence', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const thrownError = new Error();
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().throws(thrownError);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      }catch(error) {
        caughtError = error;
      }

      assert(caughtError.name === plugin.ERRORS.errDetSpecExistence(thrownError, pluginConfig.specPath).name);
      assert(caughtError._errors[0].name === plugin.ERRORS.errDetSpecExistence(thrownError, pluginConfig.specPath)._errors[0].name);
      assert(caughtError._errors[0].code === plugin.ERRORS.errDetSpecExistence(thrownError, pluginConfig.specPath)._errors[0].code);
      assert(caughtError._errors[1] === thrownError);
    });


    it('logs fatal if specPath does not exist', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(false);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {}

      assert(fakeLogger.fatal.withArgs(plugin.MESSAGES.specPathDoesNotExist()).calledOnce);
    });


    it('throws if specPath does not exist', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.stub()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(false);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError.name === plugin.ERRORS.specPathDoesNotExist('returnedPath').name);
      assert(caughtError.code === plugin.ERRORS.specPathDoesNotExist('returnedPath').code);
    });


    it('throws if missing plugin package', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output',
        specMDPlugin: {}
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.missingPluginPackage().name);
      assert(caughtError.code === plugin.ERRORS.missingPluginPackage().code);
    });


    it('throws if plugin package is not string', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output',
        specMDPlugin: {
          package: {}
        }
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.missingPluginPackage().name);
      assert(caughtError.code === plugin.ERRORS.missingPluginPackage().code);
    });


    it('throws if plugin package is empty', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: '/output',
        specMDPlugin: {
          package: ' '
        }
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.missingPluginPackage().name);
      assert(caughtError.code === plugin.ERRORS.missingPluginPackage().code);
    });


    it('throws if output path is missing', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath'
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.outputPathMissing().name);
      assert(caughtError.code === plugin.ERRORS.outputPathMissing().code);
    });


    it('throws if output path is not string', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: {}
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.outputPathMissing().name);
      assert(caughtError.code === plugin.ERRORS.outputPathMissing().code);
    });


    it('throws if output path is empty', function(){
      const fakeLogger = {
        info: sinon.stub(),
        fatal: sinon.fake()
      };
      const getPackageFake = sinon.stub();
      const getLoggerFake = sinon.stub().returns(fakeLogger);
      const pathResolveFake = sinon.stub().returns('returnedPath');
      const fsExistsSyncFake = sinon.stub().returns(true);

      const plugin = new Plugin(
        getPackageFake,
        getLoggerFake,
        {resolve: pathResolveFake},
        {existsSync: fsExistsSyncFake}
      );

      const pluginConfig = {
        specPath: 'thePath',
        outputPath: ' '
      };

      const context = {
        cwd: '/cwd',
        stdout: sinon.fake(),
        stderr: sinon.fake()
      };

      let caughtError = null;
      try {
        plugin.verifyConditions(pluginConfig, context);
      } catch(error) {
        caughtError = error;
      }

      assert(caughtError);
      assert(caughtError.name === plugin.ERRORS.outputPathMissing().name);
      assert(caughtError.code === plugin.ERRORS.outputPathMissing().code);
    });

  });
});
