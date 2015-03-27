/*jslint node: true */

require('./https-proxy.js')(true);
//require('./http-proxy.js')();

console.log('Hello World');

var eveonlinejs = require('eveonlinejs'),
    config = require('./config.json'),
    sqlite3 = require('sqlite3').verbose(),
    fs = require('fs'),
    dbPath = './assets/db/universeDataDx.db',
    db;

fs.stat(dbPath, function (err, stats) {
    'use strict';
    if (err) {
        console.log(err);
    } else {
        console.log('File: "' + dbPath + '": ' + stats.isFile());
    }
});

db = new sqlite3.Database(dbPath);

db.serialize(function () {
    'use strict';
    try {
        db.each('SELECT * FROM mapConstellations WHERE constellationID = 20000001', function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log('C: ' + row.constellationID + ': ' + row.constellationName);
            console.log('x:' + row.x + ' y:' + row.y + ' z:' + row.z);
        });

        db.each('SELECT * FROM mapSolarSystems WHERE constellationID = 20000001', function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log('S: ' + row.solarSystemID + ': ' + row.solarSystemName);
            console.log('x:' + row.x + ' y:' + row.y + ' z:' + row.z);
        });
    } catch (e) {
        console.log(e);
    }
});

db.close();


//eveonlinejs.setParams({
//    keyID: config.api.ceo.keyID,
//    vCode: config.api.ceo.vCode
//});
//
//eveonlinejs.fetch('eve:SkillTree', function (err, result) {
//    'use strict';
//    var groupID;
//
//    if (err) {
//        throw err;
//    }
//
//    for (groupID in result.skillGroups) {
//        console.log(result.skillGroups[groupID].groupName);
//    }
//});