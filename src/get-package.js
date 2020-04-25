module.exports = (require, requireg)=>(function(package) {
  let specmd = null;
  try {
    specmd = require(package);
  }catch(e) {}

  if(!specmd)
    specmd = requireg(package);


  return specmd;
});
