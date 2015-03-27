/*jslint node: true */
var http = require('http');
var __request = http.request;
var _debug = false;

http.request = function (options, callback) {
    'use strict';
    var __options = options,
        config = require('./config.json');
    __options.path = 'http://' + options.host + options.path;
    __options.headers = {'Host': options.host};
    __options.host = config.proxy.http.host;
    __options.port = config.proxy.http.port;
    __options.protocol = 'http:';
    if (_debug) {
        console.log('===.proxy.http.js begin debug ===');
        console.log(JSON.stringify(__options, null, 2));
        console.log('===.proxy.http.js end debug ===');
    }
    var req = __request(__options, function (res) {
        callback(res);
    });
    return req;
};

module.exports = function (debug) {
    'use strict';
    _debug = debug || false;
};