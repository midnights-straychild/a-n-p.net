/*jslint node: true */

//require('./https-proxy.js')(true);
//require('./http-proxy.js')();

console.log('Hello World');

var express = require('express'),
    app = express(),
//eveonlinejs = require('eveonlinejs'),
//config = require('./config.json'),

    server = app.listen(3000, function () {
        'use strict';
        var host = server.address().address,
            port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });

//db = new sqlite3.Database(dbPath);
//
//db.serialize(function () {
//    'use strict';
//    try {
//        db.each('SELECT * FROM mapConstellations WHERE constellationID = 20000001', function (err, row) {
//            if (err) {
//                console.log(err);
//            }
//            console.log('C: ' + row.constellationID + ': ' + row.constellationName);
//            console.log('x:' + row.x + ' y:' + row.y + ' z:' + row.z);
//        });
//
//        db.each('SELECT * FROM mapSolarSystems WHERE constellationID = 20000001', function (err, row) {
//            if (err) {
//                console.log(err);
//            }
//            console.log('S: ' + row.solarSystemID + ': ' + row.solarSystemName);
//            console.log('x:' + row.x + ' y:' + row.y + ' z:' + row.z);
//        });
//    } catch (e) {
//        console.log(e);
//    }
//});
//
//db.close();

app.get('/solarSystemsByConstellation/:constellationId', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    mapService.getSolarSystemsByConstellation(req.params.constellationId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/solarSystemsByRegion/:regionId', function (req, res) {
    'use strict';
    var mapService = require('./services/map'),
        getSolarSystems;

    if (typeof req.params.regionId === 'string') {
        mapService.getRegionByName(req.params.regionId, function (region) {
            getSolarSystems(region.regionId);
        });
    } else {
        getSolarSystems(req.params.regionId);
    }

    getSolarSystems = function (regionId) {
        mapService.getSolarSystemListByRegion(regionId, function (constellation) {
            res.contentType('application/json');
            res.send(JSON.stringify(constellation));
        });
    };
});

app.get('/constellation/:constellationId', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    mapService.getSolarSystemListByConstellation(req.params.constellationId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/region/:regionId', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    mapService.getRegion(req.params.regionId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/constellationList', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    mapService.getConstellationList(function (constellationList) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellationList));
    });
});

app.get('/regionList', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    mapService.getConstellationList(function (constellationList) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellationList));
    });
});

app.get('/region/:regionId', function (req, res) {
    'use strict';
    var mapService = require('./services/map');

    if (typeof req.params.regionId === 'string') {
        mapService.getRegionByName(req.params.regionId, function (region) {
            res.contentType('application/json');
            res.send(JSON.stringify(region));
        });
    } else {
        mapService.getRegion(req.params.regionId, function (region) {
            res.contentType('application/json');
            res.send(JSON.stringify(region));
        });
    }
});


//eveonlinejs.setParams({
//    keyID: config.api.ceo.keyID,
//    vCode: config.api.ceo.vCode
//});
//
//eveonlinejs.fetch('eve:SkillTree', function (err, result) {
//    'use strict';
//    var groupID, skillGroup, skillID;
//
//    if (err) {
//        switch (err.code) {
//            case 'ETIMEDOUT':
//                console.log('The request timed out. Sorry...');
//                break;
//            default:
//                throw err;
//        }
//    } else {
//        for (groupID in result.skillGroups) {
//            skillGroup = result.skillGroups[groupID];
//            console.log(skillGroup);
//            console.log(skillGroup.groupName);
//            for (skillID in skillGroup) {
//                console.log(skillGroup[skillID]);
//                console.log(skillID + ' ' + skillGroup[skillID].typeName + ': ' + skillGroup[skillID].rank);
//            }
//        }
//    }
//});