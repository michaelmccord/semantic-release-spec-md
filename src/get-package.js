/**
 * requireg function
 * @external requireg
 * @see {@link https://github.com/h2non/requireg}
 */
const requireg = require('requireg');

/**
 * @module
 */

/**
 * Gets {@link packageName} from local dependency cache or from a global install
 * @typedef GetPackageReturnedFn
 * @type {Function}
 * @param {string} packageName
*/


/**
 * Uses {@link requireFn} or {@link requiregFn} to get a [package]{@link packageName} from either the local dependency cache or from a global install
 * @param  {Function} [requireFn = require] The function to use to retrieve from the local dependency cache (node_modules)
 * @param  {Function} [requiregFn = requireg] The function to use to retrieve from a global installation (defaults to {@link external:requireg})
 * @returns {GetPackageReturnedFn}
 */
module.exports = (requireFn = require, requiregFn = requireg)=>(
function(packageName) {
  let specmd = null;
  try {
    specmd = requireFn(packageName);
  }catch(e) {}

  if(!specmd)
    specmd = requiregFn(packageName);


  return specmd;
});
