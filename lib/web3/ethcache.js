var LRU = require('lru-cache');
var options = require('../utils/config').ETH_CACHE_OPTIONS;

var caches = {
  balances: LRU(options.balances),
  transactions: LRU(options.transactions),
  blocks: LRU(options.blocks),
  code: LRU(options.code),
  storage: LRU(options.storage),
  balances: LRU(options.balances),
  uncles: LRU(options.uncles),
  counts: LRU(options.counts),
  transactionCounts: LRU(options.transactionCounts),
  other: LRU(options.other)
}

var ethCache = {
  get: function(storeName, key) {
    if(caches[storeName]) {
      var cachedResult = caches[storeName].get(key);
      return cachedResult;
    } else {
      var cachedResult = caches.other.get(storeName + '.' + key);
      return cachedResult;
    }
  },
  set: function(storeName, key, value) {
    if(caches[storeName]) {
      caches[storeName].set(key, value);
    } else {
      caches.other.set(storeName + '.' + key, value);
    }
  }
}

module.exports = ethCache;
