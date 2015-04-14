/*jslint node: true */

var dbService = require('./db'),

    getSolarSystemListByConstellation = function (constellationId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapSolarSystems', {'constellationID': constellationId}, callback);
    },

    getSolarSystemListByRegion = function (regionId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapSolarSystems', {'regionId': regionId}, callback);
    },

    getSolarSystem = function (solarSystemId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapSolarSystems', {'solarSystemId': solarSystemId}, callback);
    },

    getSolarSystemList = function (callback) {
        'use strict';
        dbService.getFromTable('mapSolarSystems', callback);
    },

    getConstellationListByRegion = function (regionId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapConstellations', {'regionId': regionId}, callback);
    },

    getConstellation = function (constellationId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapConstellations', {'constellationID': constellationId}, callback);
    },

    getConstellationList = function (callback) {
        'use strict';
        dbService.getFromTable('mapConstellations', callback);
    },

    getRegion = function (regionId, callback) {
        'use strict';
        dbService.getFromTableWhere('mapRegions', {'regionId': regionId}, callback);
    },

    getRegionList = function (callback) {
        'use strict';
        dbService.getFromTable('mapRegions', callback);
    },

    getRegionByName = function (regionName, callback) {
        'use strict';
        dbService.getFromTableWhere('mapRegions', {'regionName': regionName}, callback);
    };

exports.getSolarSystemListByConstellation = getSolarSystemListByConstellation;
exports.getSolarSystemListByRegion = getSolarSystemListByRegion;
exports.getSolarSystem = getSolarSystem;
exports.getSolarSystemList = getSolarSystemList;

exports.getConstellationListByRegion = getConstellationListByRegion;
exports.getConstellation = getConstellation;
exports.getConstellationList = getConstellationList;

exports.getRegionByName = getRegionByName;
exports.getRegion = getRegion;
exports.getRegionList = getRegionList;
