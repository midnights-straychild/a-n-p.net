/*jslint node: true */
var express = require('express'),
    app = express(),
    mapService = require('./services/map'),

require('./https-proxy.js')(true);
//require('./http-proxy.js')();

        console.log('Example app listening at http://%s:%s', host, port);
    });

app.get('/solarSystemsByConstellation/:constellationId', function (req, res) {
    'use strict';

    mapService.getSolarSystemsByConstellation(req.params.constellationId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/solarSystemsByRegion/:regionId', function (req, res) {
    'use strict';

    mapService.getSolarSystemListByRegion(req.params.regionId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/constellation/:constellationId', function (req, res) {
    'use strict';

    mapService.getSolarSystemListByConstellation(req.params.constellationId, function (constellation) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellation));
    });
});

app.get('/constellationList', function (req, res) {
    'use strict';

    mapService.getConstellationList(function (constellationList) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellationList));
    });
});

app.get('/regionList', function (req, res) {
    'use strict';

    mapService.getConstellationList(function (constellationList) {
        res.contentType('application/json');
        res.send(JSON.stringify(constellationList));
    });
});

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