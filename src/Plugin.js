const AggregateError = require('aggregate-error');
const {isFunction, isObject, isString} = require('lodash');
const SemanticReleaseError = require('@semantic-release/error');

const MESSAGES = Object.freeze({
  verifyStart: ()=>('Verifying semantic-release-spec-md conditions...'),
  specMDNotFound: ()=>('spec-md was not found.'),
  specMDFound: ()=>('spec-md was found, continuing...'),
  errDetSpecExistence: ()=>('Could not determine spec existence'),
  specPathDoesNotExist: ()=>('Please verify that spec exists and that your semantic-release configuration is correct.')
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
                          'Please supply an output path')
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
   * Fulfills the [verifyConditions]{@link https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md} release step of semantic-release plugins
   * @param {Object} pluginConfig
   * @param {string} pluginConfig.specPath
   * @param {Object} pluginConfig.specMDPlugin
   * @param {string} pluginConfig.specMDPlugin.package
   * @param {string[]} pluginConfig.specMDPlugin.args
   * @param {string} pluginConfig.outputPath
   * @param {Object} context
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

  async verifyRelease(pluginConfig, context) {
    const specMDSpec = new this.#SpecMDSpec(

    );
  }
}



module.exports = Plugin;
