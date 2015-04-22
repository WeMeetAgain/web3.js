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
 * @file property.js
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var RequestManager = require('./requestmanager');

var Property = function (options) {
    this.name = options.name;
    this.getter = options.getter;
    this.setter = options.setter;
    this.outputFormatter = options.outputFormatter;
    this.inputFormatter = options.inputFormatter;
    this.responseHandler = options.responseHandler;
    if(options.exportName) {
      this.exportName = options.exportName;
      this.exportHandler = options.exportHandler();
    }
};

/**
 * Should be called to format input args of method
 *
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */
Property.prototype.formatInput = function (arg) {
    return this.inputFormatter ? this.inputFormatter(arg) : arg;
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */
Property.prototype.formatOutput = function (result) {
    return this.outputFormatter && result !== null ? this.outputFormatter(result) : result;
};

/**
* Should attach function to method -- based on Method#attachToObject
*
* @method attachToObject
* @param {Object}
* @param {Function}
*/
Property.prototype.attachNameToObject = function (fnName, labelName, obj) {
  var func = this[fnName].bind(this);
  var name = this[labelName].split('.');
  if (name.length > 1) {
    obj[name[0]] = obj[name[0]] || {};
    obj[name[0]][name[1]] = func;
  } else {
    obj[name[0]] = func;
  }
};

/**
 * Should attach function(s) to method
 *
 * @method attachToObject
 * @param {Object}
 * @param {Function}
 */
Property.prototype.attachToObject = function (obj) {
    this.attachNameToObject('get','name', obj);
    if(this.setterName) {
      this.attachNameToObject('set','setterName', obj);
    }
};

/**
 * Should be used to get value of the property
 *
 * @method get
 * @return {Object} value of the property
 */
Property.prototype.get = function () {
    var payload = {
        method: this.getter
    }
    var self = this;
    console.log('get',this, this.getter)
    return RequestManager.getInstance().sendAsync(payload, function(err, result) {
        self.responseAction(self.formatOutput(result));
    });
};

/**
 * Should be used to set value of the property
 *
 * @method set
 * @param {Object} new value of the property
 */
Property.prototype.set = function (value) {
    var payload = {
      method: this.setter,
      params: [this.formatInput(value)]
    }
    return RequestManager.getInstance().sendAsync(payload, function(err, result) {
      self.responseAction(result);
    });
};

module.exports = Property;
