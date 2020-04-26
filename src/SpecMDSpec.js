const { isPlainObject, isArray, isString, isFunction, isObjectLike } = require('lodash');
const fs = require('fs');
const path = require('path');
const AggregateError = require('aggregate-error');

const ErrorMessages = {

};

/**
 * Represents a spec-md specification
 */
class SpecMDSpec {
  #specPath = null;
  #pluginInfo = null;
  #metadata = null;
  #specmd = null;
  #plugin = null;
  #astPromise = null;



  /**
   * @constructor
   * @param  {string} specPath - The file path to the specification that this SpecMDSpec represents
   * @param  {Object} [pluginInfo] - A pluginInfo object describing any plugins (if any) that should be used to process the spec. Supply undefined or null to process without a plugin.
   * @param  {string[]} [pluginInfo.args]
   * @param  {string} [pluginInfo.package]
   * @param  {Object} metadata - A plain javascript object holding spec-md metadata information
   * @param  {Function} getPluginFn - A function used to retrieve plugin packages
   * @param  {Object} specmd - A reference to the specmd package (eg retrieved via require)
   */
  constructor(specPath, pluginInfo, metadata, specmd, getPluginFn) {

    this.#specPath = specPath;
    try {
      path.parse(specPath);
    } catch (error) {
      throw new AggregateError([new Error(`There was an error parsing the path ${JSON.stringify({ specPath })}`), error]);
    }

    let specExists = false;
    try {
      specExists = fs.existsSync(specPath);
    } catch (error) {
      throw new AggregateError([new Error(`Error determining if spec exists at ${JSON.stringify({ specPath })}`), error]);
    }

    if (!specExists)
      throw new Error(`specmd spec does not exist at ${JSON.stringify({ specPath })}`);


    this.#pluginInfo = pluginInfo;
    if (pluginInfo
      && (!isPlainObject(pluginInfo)
        || !isArray(pluginInfo.args)
        || !isString(pluginInfo.package))) {
      throw new TypeError(`${JSON.stringify({ pluginInfo })} is not the right shape!`);
    }

    if (pluginInfo && !isFunction(getPluginFn))
      throw new TypeError(`${JSON.stringify({ getPluginFn })} must be supplied!`);

    if (!isObjectLike(specmd) || !isFunction(specmd.parse) || !isFunction(specmd.html))
      throw new TypeError(`${JSON.stringify({ specmd })} is not the right shape!`);

    this.#metadata = metadata;
    this.#specmd = specmd;
    this.#plugin = pluginInfo && pluginInfo.package
      ? getPluginFn(pluginInfo.package)
      : null;
  }


  /**
   * Parses the specmd specification that this SpecMDSpec represents
   */
  parse() {
    return this.#astPromise = this.#specmd.parse(this.#specPath);
  }

  #getHtmlOutput = ()=>{
    if (!this.#astPromise)
      this.parse();

    return this.#specmd.html(this.#specPath, this.#metadata);
  }

  #getPluginOutput = ()=>{
    if (!this.#astPromise)
      this.parse();

    const { args } = this.#pluginInfo;
    return this.#plugin([this.#specPath, ...args],
      this.#astPromise,
      this.#metadata);
  }

  /**
   * Processes the spec-md specification that this SpecMDSpec represents.
   * @returns {Promise} Promise for the resulting output. Output is assumed to be a string, but this class is agnostic of that.
   */
  getOutput() {
    let output = null;

    if (this.#plugin)
      output = this.#getPluginOutput();
    else
      output = this.#getHtmlOutput();

    return output;
  }
}

module.exports = SpecMDSpec;
