/*jslint node: true */

var eveonlinejs = require('eveonlinejs'),
    config = require('./../config.json'),

    getFromApi = function (path, user, callback, params) {
        'use strict';
        eveonlinejs.setCache(new eveonlinejs.cache.FileCache({path: config.apicachePath}))
        eveonlinejs.setParams({
            keyID: config.api[user].keyID,
            vCode: config.api[user].vCode
        });
        eveonlinejs.fetch(path, params, function (err, result) {
            if (err) {
                switch (err.code) {
                    case 'ETIMEDOUT':
                        console.log('The request timed out. Sorry...');
                        break;
                    default:
                        throw err;
                }
            }
            callback(result);
        });
    },

    getCharacters = function (user, callback) {
        'use strict';
        getFromApi('account:Characters', user, callback);
    },

    getBlueprints = function (user, characterid, callback) {
        'use strict';
        getFromApi('char:Blueprints', user, callback, {characterID: characterid});
    },

   getSkillTree = function (user, callback) {
        'use strict';
        getFromApi('eve:SkillTree', user, callback);
    };

exports.getCharacters = getCharacters;
exports.getBlueprints = getBlueprints;
exports.getSkillTree = getSkillTree;
