var flux = require('flux-react');
var eth = require('./eth');
var ethCache = require('./ethcache');

/**
* create mixin for eth's portion of store (for now just create the store)
* - 1. create actions
* - -. iterate over methods:
*     - 2. set method's responseAction, which will be the corresponding Action
*     - 3. method's response handler attaches to handlers obj
*     - 4. methods attach to handlers obj
* - -. iterate over properties:
*     - 5. set property's responseAction, which will be the corresponding Action
*     - 6. property's response handler attaches to handlers obj
*     - 7. property attach to handlers obj
*/

var actionNames = eth.methods.map(function(method) {
  return method.name;
}).concat(eth.properties.map(function(property) {
  return property.name;
}), eth.properties.map(function(property) {
  return property.setterName;
}).filter(function(name) {
  return !!name;
}));

var responsePrefix = function(name) {
  return name + 'Response';
}

var responseActionNames = actionNames.map(responsePrefix);

var actions = flux.createActions(actionNames.concat(responseActionNames));

var handlers = {};
var ethExports = {};

eth.methods.forEach(function(method) {
  method.responseAction = actions[responsePrefix(method.name)];
  handlers[responsePrefix(method.name)] = method.responseHandler;
  method.attachToObject(handlers);

  if(method.exportName) {
    ethExports[method.exportName] = method.exportHandler;
  }
});

eth.properties.forEach(function(property) {
  property.responseAction = actions[responsePrefix(property.name)];
  handlers[responsePrefix(property.name)] = property.responseHandler;
  property.attachToObject(handlers);

  if(property.exportName) {
    ethExports[property.exportName] = property.exportHandler;
  }
});

handlers.cache = ethCache;
handlers.exports = ethExports;
handlers.actions = Object.keys(actions).map(function(action) {
  return actions[action];
});

var ethStore = flux.createStore(handlers);
ethStore.actions = actions;
module.exports = ethStore;
