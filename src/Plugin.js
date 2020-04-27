const AggregateError = require('aggregate-error');
const {isFunction, isObject, isString} = require('lodash');
const SemanticReleaseError = require('@semantic-release/error');

const MESSAGES = Object.freeze({
  verifyStart: ()=>('Verifying semantic-release-spec-md conditions...'),
  specMDNotFound: ()=>('spec-md was not found.'),
  specMDFound: ()=>('spec-md was found, continuing...'),
  errDetSpecExistence: ()=>('Could not determine spec existence'),
  specPathDoesNotExist: ()=>('Please verify that spec exists and that your semantic-release configuration is correct.'),
  convertingSpec: (specPath)=>(`Converting spec at ${specPath}`),
  specConverted: (specPath)=>(`Spec at ${specPath} converted`),
  checkOutputPathExistence: (outputPath)=>(`Checking existence of ${outputPath}`),
  outputPathDoesNotExist: ()=>('Output path does not exist. Creating output path.'),
  outputPathCreated: ()=>('Output path created.'),
  writingOutput: (outputPath)=>(`Writing output to ${outputPath}`),
  outputWritten: (outputPath)=>(`Output written to ${outputPath}`),
  specValid: (specPath)=>(`Spec at ${specPath} is valid.`),
  validatingSpec: (specPath)=>(`Validating spec at ${specPath}`)
});

const ERRORS = Object.freeze({
  missingSpecMD: (error)=>new AggregateError(
                      [
                        new SemanticReleaseError(
                          'Missing spec-md',
                          'E_MISSING_SPEC_MD',
                          'Attempted to find spec-md as a local dependency and as a global install and failed.'
                          ),
                        error
                      ]),
  missingSpecPath: ()=>new SemanticReleaseError(
                          'Missing specPath',
                          'E_MISSING_SPEC_PATH',
                          'Must provide a `specPath` string in your semantic-release-spec-md configuration!'),

  errDetSpecExistence: (error, specPath)=>new AggregateError(
                          [new SemanticReleaseError(
                            'Error determining spec existence',
                            'E_DET_SPEC_EXISTS',
                            `There was an error verifying spec existence at ${specPath}`),
                            error
                          ]),

  specPathDoesNotExist: (specPath)=>new SemanticReleaseError(
                          'Spec does not exist',
                          'E_MISSING_SPEC',
                          `The spec at ${specPath} does not exist`),

  missingPluginPackage: ()=>new SemanticReleaseError(
                          'Missing plugin package',
                          'E_MISSING_PLUGIN_PACKAGE',
                          'Please supply a specMDPlugin.package to load if using a plugin'),

  outputPathMissing: ()=>new SemanticReleaseError(
                          'Missing output path!',
                          'E_MISSING_OUTPUT_PATH',
                          'Please supply an output path'),

  errorParsing: (specPath, error)=>new AggregateError([
                            new SemanticReleaseError(
                              'Error parsing spec',
                              'E_SPEC_PARSE_ERROR',
                              `There was an error parsing the spec at ${specPath}`),
                        error]),
  errorProducingOutput: (error)=>new AggregateError([
                            new SemanticReleaseError(
                              'Error producing output',
                              'E_OUTPUT_ERROR',
                              'An error occurred while trying to produce output'),
                              error
                            ]),
  missingOutput: ()=>new SemanticReleaseError(
                      'Empty output',
                      'E_MISSING_OUTPUT',
                      'No output was produced after execution of spec-md'),

  errorDetOutputPathExistence: (error, outputPath)=>new AggregateError([
                      new SemanticReleaseError(
                        'Error determining output path existence',
                        'E_DET_OUTPUT_PATH',
                        `There was an error determining if ${outputPath} exists`),
                        error]),

  outputWriteError: (error, outputPath)=>new AggregateError([
                      new SemanticReleaseError(
                        'Output write error',
                        'E_OUTPUT_WRITE_ERROR',
                        `There was an issue writing spec-md output to ${outputPath}`),
                        error])
});

/** @module */

/**
 * @typedef getPackageFn
 * @type {Function}
 * @param {string} packageName
 * @returns {any}
 */


/**
 * @typedef getLoggerFn
 * @type {Function}
 * @param {Object} context
 * @param {Stream} context.stdout
 * @param {Stream} context.stderr
 * @returns {external:Signale}
 */

/**
 * @typedef resolveFn
 * @type {Function}
 * @param {string[]} pathSegments
 * @returns {string}
 */


 /**
  * @typedef existsSyncFn
  * @type {Function}
  * @param {PathLike} path
  * @returns {boolean}
  */

/**
 * @typedef mkdirSyncFn
 * @type {Function}
 * @param {PathLike} path
 */

 /**
  * Represents the semantic-release-spec-md plugin
  */
class Plugin {
  #getPackage = null;
  #getLogger = null;
  #path = null;
  #fs = null;
  #MESSAGES = MESSAGES;
  #ERRORS = ERRORS;
  #SpecMDSpec = null;

  get MESSAGES() {
    return this.#MESSAGES;
  }

  get ERRORS() {
    return this.#ERRORS;
  }

  /**
   * @constructor
   * @param {getPackageFn} getPackage
   * @param {getLoggerFn} getLogger
   * @param {Object} path
   * @param {resolveFn} path.resolve
   * @param {Object} fs
   * @param {existsSyncFn} fs.existsSync
   * @param {mkdirSyncFn} fs.mkdirSync
   * @param {Function} SpecMDSpec
   */
  constructor(getPackage, getLogger, path, fs, SpecMDSpec) {
    this.#getPackage = getPackage;
    this.#getLogger = getLogger;
    this.#path = path;
    this.#fs = fs;
    this.#SpecMDSpec = SpecMDSpec;

    if(!getPackage || !isFunction(getPackage))
      throw new TypeError(`${JSON.stringify({getPackage})} must be a function!`);
    if(!getLogger || !isFunction(getLogger))
      throw new TypeError(`${JSON.stringify({getLogger})} must be a function!`);
    if(!path || !isObject(path) || !isFunction(path.resolve))
      throw new TypeError(`${JSON.stringify({path})} must be an object with a 'resolve' method!`);
    if(!fs || !isObject(fs) || !isFunction(fs.existsSync))
      throw new TypeError(`${JSON.stringify({fs})} must be an object with an 'existsSync' method!`);
    if(!SpecMDSpec || !isFunction(SpecMDSpec))
      throw new TypeError(`${JSON.stringify({SpecMDSpec})} must supply SpecMDSPec class to use`)
  }


  /**
   * Fulfills the [verifyConditions]{@link https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md} release step of this semantic-release plugin
   * @param {Object} pluginConfig
   * @param {string} pluginConfig.specPath
   * @param {Object} [pluginConfig.metadata]
   * @param {Object} [pluginConfig.specMDPlugin]
   * @param {string} [pluginConfig.specMDPlugin.package]
   * @param {string[]} [pluginConfig.specMDPlugin.args]
   * @param {string} pluginConfig.outputPath
   * @param {Object} context
   * @param {Stream} context.stdout
   * @param {Stream} context.stderr
   * @param {string} context.cwd
   */
  verifyConditions(pluginConfig, context) {
    const logger = this.#getLogger(context);

    logger.info(this.MESSAGES.verifyStart());
    try {
      this.#getPackage('spec-md');
    } catch(error) {
      logger.fatal(this.MESSAGES.specMDNotFound());
      throw this.ERRORS.missingSpecMD(error);
    }

    logger.info(this.MESSAGES.specMDFound());

    if(!pluginConfig.specPath || !isString(pluginConfig.specPath) || !pluginConfig.specPath.trim())
      throw this.ERRORS.missingSpecPath();

    const specPath = this.#path.resolve(context.cwd, pluginConfig.specPath);
    let specExists = false;
    try {
      specExists = this.#fs.existsSync(specPath);
    }
    catch(error) {
      logger.fatal(this.MESSAGES.errDetSpecExistence());
      throw this.ERRORS.errDetSpecExistence(error, specPath);
    }

    if(!specExists) {
      logger.fatal(this.MESSAGES.specPathDoesNotExist());
      throw this.ERRORS.specPathDoesNotExist(specPath);
    }


    if(pluginConfig.specMDPlugin && (!isString(pluginConfig.specMDPlugin.package) || !pluginConfig.specMDPlugin.package.trim())) {
      throw this.ERRORS.missingPluginPackage();
    }

    if(!pluginConfig.outputPath || !isString(pluginConfig.outputPath) || !pluginConfig.outputPath.trim())
      throw this.ERRORS.outputPathMissing();
  }

  /**
   * Fulfills the [verifyRelease]{@link https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md} release step of this semantic-release plugin
   * @param {Object} pluginConfig
   * @param {string} pluginConfig.specPath
   * @param {Object} [pluginConfig.metadata]
   * @param {Object} [pluginConfig.specMDPlugin]
   * @param {string} [pluginConfig.specMDPlugin.package]
   * @param {string[]} [pluginConfig.specMDPlugin.args]
   * @param {string} pluginConfig.outputPath
   * @param {Object} context
   * @param {Stream} context.stdout
   * @param {Stream} context.stderr
   * @param {string} context.cwd
   * @param {Object} context.nextRelease
   * @returns {Promise}
   */
  async verifyRelease(pluginConfig, context) {
    const logger = getLogger(context);
    const specPath = this.#path.resolve(context.cwd, pluginConfig.specPath);
    logger.info(this.MESSAGES.validatingSpec(specPath));
    try {
      const specmd = this.#getPackage('spec-md');
      const specMDSpec = new this.#SpecMDSpec(
        specPath,
        pluginConfig.specMDPlugin,
        pluginConfig.metadata,
        specmd,
        this.#getPackage
        );
      await specMDSpec.parse();
      context.nextRelease[specPath] = specMDSpec;
    } catch(error) {
      throw this.ERRORS.errorParsing(specPath, error);
    }

    logger.info(this.MESSAGES.specValid(specPath));
  }

  /**
   * Fulfills the [prepare]{@link https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md} release step of this semantic-release plugin
   * @param {Object} pluginConfig
   * @param {string} pluginConfig.specPath
   * @param {Object} [pluginConfig.metadata]
   * @param {Object} [pluginConfig.specMDPlugin]
   * @param {string} [pluginConfig.specMDPlugin.package]
   * @param {string[]} [pluginConfig.specMDPlugin.args]
   * @param {string} pluginConfig.outputPath
   * @param {Object} context
   * @param {Stream} context.stdout
   * @param {Stream} context.stderr
   * @param {string} context.cwd
   * @param {Object} context.nextRelease
   * @returns {Promise}
   */
  async prepare(pluginConfig, context) {
    const logger = getLogger(context);
    const specPath = path.resolve(context.cwd, pluginConfig.specPath);

    logger.info(this.MESSAGES.convertingSpec(specPath));
    let output = null;
    try {
      output = await context.newRelease[specPath].getOutput();
    } catch(error) {
      throw this.ERRORS.errorProducingOutput(error);
    }

    if(!output)
      throw this.ERRORS.missingOutput();
    logger.info(this.MESSAGES.specConverted(specPath));


    logger.info(this.MESSAGES.checkOutputPathExistence(outputPath));
    const outputPath = pluginConfig.outputPath;
    let outputPathExists = false;
    try {
      outputPathExists = this.#fs.existsSync(outputPath);
    } catch(error) {
      throw this.ERRORS.errorDetOutputPathExistence(error, outputPath);
    }

    if(!outputPathExists) {
      logger.info(this.MESSAGES.outputPathDoesNotExist());

      this.#fs.mkdirSync(outputPath);

      logger.info(this.MESSAGES.outputPathCreated());
    }


    logger.info(this.MESSAGES.writingOutput(outputPath));
    try {
      fs.writeFileSync(outputPath, output);
    } catch(error) {
      throw this.ERRORS.outputWriteError(error, outputPath);
    }
    logger.info(this.MESSAGES.outputWritten(outputPath));
  }
}



module.exports = Plugin;
