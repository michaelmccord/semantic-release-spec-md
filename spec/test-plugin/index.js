

module.exports = function(args, parsePromise, _options) {
  return parsePromise.then(function(){
    return 'This is the output from the test plugin';
  });
}
