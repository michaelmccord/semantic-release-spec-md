
/* Represents a spec-md specification */
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
   * @param  {Object} pluginInfo - A pluginInfo object describing any plugins (if any) that should be used to process the spec. Supply undefined or null to process without a plugin.
   * @param  {Object} metadata - A plain javascript object holding spec-md metadata information
   * @param  {Function} getPluginFn - A function used to retrieve plugin packages
   * @param  {Object} specmd - A reference to the specmd package (eg retrieved via require)
   */
  constructor(specPath, pluginInfo, metadata, specmd, getPluginFn) {
    this.#specPath = specPath;
    this.#pluginInfo = pluginInfo;
    this.#metadata = metadata;
    this.#specmd = specmd;

    if(pluginInfo && pluginInfo.package && !getPluginFn)
      throw new RangeError('pluginInfo.package specified but getPluginFn not supplied!');

    if(!specmd)
      throw new TypeError('specmd not supplied');

    this.#plugin = pluginInfo && pluginInfo.package
      ? getPluginFn(pluginInfo.package)
      : null;
  }


  /**
   * Parses the specmd specification that this SpecMDSpec represents
   */
  parse = ()=>{
    this.#astPromise = this.#specmd.parse(specPath);
  }

  #htmlOutput = ()=>{
    if(!this.#astPromise)
      this.parse();

    return this.#specmd.html(this.specPath, this.#metadata);
  }

  #pluginOutput = ()=>{
    if(!this.#astPromise)
      this.parse();

    if(!this.pluginInfo)
      throw new Error('Plugin information not specified');

    const {args} = this.#pluginInfo;
    return this.#plugin([this.specPath, ...args], this.#astPromise, this.#metadata);
  }

  /**
   * Processes the spec-md specification that this SpecMDSpec represents.
   * @returns {Promise} - Promise for the resulting output. Output is assumed to be a string, but this class is agnostic of that.
   */
  output = async ()=>{
    let output = null;

    if(this.#pluginInfo && this.#pluginInfo.package)
      output = await this.#pluginOutput();
    else
      output = await this.#htmlOutput();

    return output;
  }
}
