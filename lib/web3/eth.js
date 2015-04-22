/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file eth.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

/**
 * Web3
 *
 * @module web3
 */

/**
 * Eth methods and properties
 *
 * An example method object can look as follows:
 *
 *      {
 *      name: 'getBlock',
 *      call: blockCall,
 *      params: 2,
 *      outputFormatter: formatters.outputBlockFormatter,
 *      inputFormatter: [ // can be a formatter funciton or an array of functions. Where each item in the array will be used for one parameter
 *           utils.toHex, // formats paramter 1
 *           function(param){ return !!param; } // formats paramter 2
 *         ]
 *       },
 *
 * @class [web3] eth
 * @constructor
 */

"use strict";

var formatters = require('./formatters');
var utils = require('../utils/utils');
var handlers = require('../utils/handlers');
var Method = require('./method');
var Property = require('./property');

var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
};

/// @returns an array of objects describing web3.eth api methods

var getBalance = new Method({
    name: 'cacheBalance',
    exportName: 'getBalance',
    call: 'eth_getBalance',
    params: 2,
    inputFormatter: [utils.toAddress, formatters.inputDefaultBlockNumberFormatter],
    outputFormatter: formatters.outputBigNumberFormatter,
    responseHandler: handlers.simpleHandler('balances'),
    exportHandler: handlers.exportHandler('balances')
});

var getStorage = new Method({
    name: 'cacheStorage',
    exportName: 'getStorage',
    call: 'eth_getStorage',
    params: 2,
    inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
    responseHandler: handlers.simpleHandler('storage'),
    exportHandler: handlers.exportHandler('storage')
});

var getStorageAt = new Method({
    name: 'cacheStorageAt',
    exportName: 'getStorageAt',
    call: 'eth_getStorageAt',
    params: 3,
    inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter],
    responseHandler: handlers.simpleHandler('storage'),
    exportHandler: handlers.exportHandler('storage')
});

var getCode = new Method({
    name: 'cacheCode',
    exportName: 'getCode',
    call: 'eth_getCode',
    params: 2,
    inputFormatter: [utils.toAddress, formatters.inputDefaultBlockNumberFormatter],
    responseHandler: handlers.simpleHandler('code'),
    exportHandler: handlers.exportHandler('code')
});

var getBlock = new Method({
    name: 'cacheBlock',
    exportName: 'getBlock',
    call: blockCall,
    params: 2,
    inputFormatter: [utils.toHex, function (val) { return !!val; }],
    outputFormatter: formatters.outputBlockFormatter,
    responseHandler: handlers.simpleHandler('blocks'),
    exportHandler: handlers.exportHandler('blocks')
});

var getUncle = new Method({
    name: 'cacheUncle',
    exportName: 'getUncle',
    call: uncleCall,
    params: 2,
    inputFormatter: [utils.toHex, utils.toHex],
    outputFormatter: formatters.outputBlockFormatter,
    responseHandler: handlers.simpleHandler('uncles'),
    exportHandler: handlers.exportHandler('uncles')
});

var getCompilers = new Method({
    name: 'cacheCompilers',
    exportName: 'getCompilers',
    call: 'eth_getCompilers',
    params: 0,
    responseHandler: handlers.simpleHandler('compilers'),
    exportHandler: handlers.exportHandler('compilers')
});

var getBlockTransactionCount = new Method({
    name: 'cacheBlockTransactionCount',
    exportName: 'getBlockTransactionCount',
    call: getBlockTransactionCountCall,
    params: 1,
    inputFormatter: [formatters.inputBlockNumberFormatter],
    outputFormatter: utils.toDecimal,
    responseHandler: handlers.simpleHandler('counts'),
    exportHandler: handlers.exportHandler('counts')
});

var getBlockUncleCount = new Method({
    name: 'cacheBlockUncleCount',
    exportName: 'getBlockUncleCount',
    call: uncleCountCall,
    params: 1,
    inputFormatter: [formatters.inputBlockNumberFormatter],
    outputFormatter: utils.toDecimal,
    responseHandler: handlers.simpleHandler('counts'),
    exportHandler: handlers.exportHandler('counts')
});

var getTransaction = new Method({
    name: 'cacheTransaction',
    exportName: 'getTransaction',
    call: 'eth_getTransactionByHash',
    params: 1,
    outputFormatter: formatters.outputTransactionFormatter,
    responseHandler: handlers.simpleHandler('transactions'),
    exportHandler: handlers.exportHandler('transactions')
});

var getTransactionFromBlock = new Method({
    name: 'cacheTransactionFromBlock',
    exportName: 'getTransactionFromBlock',
    call: transactionFromBlockCall,
    params: 2,
    inputFormatter: [utils.toHex, utils.toHex],
    outputFormatter: formatters.outputTransactionFormatter,
    responseHandler: handlers.simpleHandler('transactions'),
    exportHandler: handlers.exportHandler('transactions')
});

var getTransactionCount = new Method({
    name: 'cacheTransactionCount',
    exportName: 'getTransactionCount',
    call: 'eth_getTransactionCount',
    params: 2,
    inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
    outputFormatter: utils.toDecimal,
    responseHandler: handlers.simpleHandler('transactionCounts'),
    exportHandler: handlers.exportHandler('transactionCounts')
});

var sendTransaction = new Method({
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    params: 1,
    inputFormatter: [formatters.inputTransactionFormatter],
    responseHandler: function(args, result) {

    },
});

var call = new Method({
    name: 'call',
    call: 'eth_call',
    params: 2,
    inputFormatter: [formatters.inputTransactionFormatter, formatters.inputDefaultBlockNumberFormatter],
    responseHandler: function(args, result) {

    }
});

var compileSolidity = new Method({
    name: 'cacheCompileSolidity',
    call: 'eth_compileSolidity',
    params: 1,
    responseHandler: handlers.simpleHandler('eth.compile.solidity')
});

var compileLLL = new Method({
    name: 'cacheCompileLll',
    call: 'eth_compileLLL',
    params: 1,
    responseHandler: handlers.simpleHandler('eth.compile.lll')
});

var compileSerpent = new Method({
    name: 'cacheCompileSerpent',
    call: 'eth_compileSerpent',
    params: 1,
    responseHandler: handlers.simpleHandler('eth.compile.serpent')
});

var flush = new Method({
    name: 'flush',
    call: 'eth_flush',
    params: 0,
    responseHandler: handlers.simpleHandler('eth.flush')
});

var methods = [
    getBalance,
    getStorage,
    getStorageAt,
    getCode,
    getBlock,
    getUncle,
    getCompilers,
    getBlockTransactionCount,
    getBlockUncleCount,
    getTransaction,
    getTransactionFromBlock,
    getTransactionCount,
    call,
    sendTransaction,
    compileSolidity,
    compileLLL,
    compileSerpent,
    flush
];

/// @returns an array of objects describing web3.eth api properties



var properties = [
    new Property({
        name: 'cacheCoinbase',
        exportName: 'getCoinbase',
        getter: 'eth_coinbase',
        responseHandler: handlers.simpleHandler('coinbase'),
        exportHandler: handlers.exportHandler('coinbase')
    }),
    new Property({
        name: 'cacheMining',
        exportName: 'getMining',
        getter: 'eth_mining',
        responseHandler: handlers.simpleHandler('mining'),
        exportHandler: handlers.exportHandler('mining')
    }),
    new Property({
        name: 'cacheGasPrice',
        exportName: 'getGasPrice',
        getter: 'eth_gasPrice',
        outputFormatter: formatters.outputBigNumberFormatter,
        responseHandler: handlers.simpleHandler('gasPrice'),
        exportHandler: handlers.exportHandler('gasPrice')
    }),
    new Property({
        name: 'cacheAccounts',
        exportName: 'getAccounts',
        getter: 'eth_accounts',
        responseHandler: handlers.simpleHandler('accounts'),
        exportHandler: handlers.exportHandler('accounts')
    }),
    new Property({
        name: 'cacheBlockNumber',
        exportName: 'getBlockNumber',
        getter: 'eth_blockNumber',
        outputFormatter: utils.toDecimal,
        responseHandler: handlers.simpleHandler('blockNumber'),
        exportHandler: handlers.exportHandler('blockNumber')
    })
];

module.exports = {
    methods: methods,
    properties: properties
};
