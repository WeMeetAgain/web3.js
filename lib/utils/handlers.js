var simpleHandler = function(storeName) {
  return function(args, response) {
    //console.log('simpleHandler',storeName,args,response)
    if(response) {
      console.log(response);
      this.cache.set(storeName, args.join('.'), response);
      this.emit(storeName + '.' + args.join('.'));
    } else {
      this.cache.set(storeName,storeName, args);
      this.emit(storeName);
    }
  }
}

var exportHandler = function(storeName) {
  return function(formatter) {
    return function() {
      if(formatter) {
        var args = formatter(arguments);
        var cached = this.cache.get(storeName, args.join('.'));
        return cached;
      } else {
        var cached = this.cache.get(storeName, storeName);
        return cached;
      }
    }
  }
}

module.exports = {
    simpleHandler: simpleHandler,
    exportHandler: exportHandler
}
