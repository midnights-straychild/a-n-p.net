/*jslint node: true */

//require('./https-proxy.js')(true);
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


eveonlinejs.setParams({
    keyID: config.api.ceo.keyID,
    vCode: config.api.ce.vCode
});

eveonlinejs.fetch('eve:SkillTree', function (err, result) {
    'use strict';
    var groupID, skillGroup, skillID;

    if (err) {
        switch (err.code) {
            case 'ETIMEDOUT':
                console.log('The request timed out. Sorry...');
                break;
            default:
                throw err;
        }
    } else {
        for (groupID in result.skillGroups) {
            skillGroup = result.skillGroups[groupID];
            console.log(skillGroup);
            console.log(skillGroup.groupName);
            for (skillID in skillGroup) {
                console.log(skillGroup[skillID]);
                console.log(skillID + ' ' + skillGroup[skillID].typeName + ': ' + skillGroup[skillID].rank);
            }
        }
    }
});