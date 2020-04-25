module.exports = (require, requireg)=>(function(packageName) {
  let specmd = null;
  try {
    specmd = require(packageName);
  }catch(e) {}

  if(!specmd)
    specmd = requireg(packageName);


  return specmd;
});
