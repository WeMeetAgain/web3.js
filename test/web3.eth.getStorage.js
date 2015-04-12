var chai = require('chai');
var web3 = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getStorage';


var tests = [{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', web3.eth.defaultBlock],
    result: '0x47d33b2',
    formattedResult: '0x47d33b2',
    call: 'eth_'+ method
},{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 0],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', '0x0'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
},{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 0x0],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', '0x0'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
}, {
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'latest'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'latest'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

