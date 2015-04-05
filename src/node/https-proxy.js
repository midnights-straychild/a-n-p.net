/*jslint node: true */
var https = require('https');
var __request = https.request;
var _debug = false;

https.request = function (options, callback) {
    'use strict';
    var __options = options,
        config = require('./config.json');
    __options.hostname = config.proxy.https.hostname;
    __options.headers = {Host: options.host};
    __options.href = config.proxy.https.host;
    __options.host = config.proxy.https.host;
    __options.port = config.proxy.https.port;
    __options.method = 'GET';
    __options.auth = config.proxy.https.username + ':' + config.proxy.https.password;
    if (_debug) {
        console.log('=== http-proxy.js begin debug ===');
        console.log(JSON.stringify(__options, null, 2));
        console.log('=== http-proxy.js end debug ===');
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