/*jslint node: true */

var eveonlinejs = require('eveonlinejs'),
    config = require('./../config.json'),

    getFromApi = function (path, user, params) {
        'use strict';
        eveonlinejs.fetch(path, params, function (err, result) {
            eveonlinejs.setParams({
                keyID: config.api[user].keyID,
                vCode: config.api[user].vCode
            });

            if (err) {
                switch (err.code) {
                    case 'ETIMEDOUT':
                        console.log('The request timed out. Sorry...');
                        break;
                    default:
                        throw err;
                }
            }
            return result;
        });
    },

    getSkillTree = function () {
        'use strict';
        return getFromApi('eve:SkillTree', 'ceo');
    };

exports.getSkillTree = getSkillTree;