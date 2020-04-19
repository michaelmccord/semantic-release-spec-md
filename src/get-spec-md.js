const requireg = require('requireg');


module.exports = (function() {
  let specmd = null;
  try {
    specmd = require('spec-md');
  }catch(e) {}

  if(!specmd)
    specmd = requireg('spec-md');


  return specmd;
})();
