const requireg = require('requireg');


module.exports = (function(pluginPackage) {
  let specmd = null;
  try {
    specmd = require(pluginPackage);
  }catch(e) {}

  if(!specmd)
    specmd = requireg(pluginPackage);


  return specmd;
});
