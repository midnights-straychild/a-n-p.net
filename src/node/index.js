/*jslint node: true */
var express = require('express'),
    app = express(),
    mapService = require('./services/map'),
    eveapiService = require('./services/eve'),

    server = app.listen(20000, function () {
        'use strict';
        var host = server.address().address,
            port = server.address().port;

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

app.get('/region/:regionId', function (req, res) {
    'use strict';

    if ('string' === typeof req.params.regionId) {
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

app.get('/characters/:user', function (req, res) {
    'use strict';

    eveapiService.getCharacters(req.params.user, function (characters) {
        res.contentType('application/json');
        res.send(JSON.stringify(characters));
    });
});

app.get('/blueprints/:user/:characterid', function (req, res) {
    'use strict';

    eveapiService.getBlueprints(req.params.user, req.params.characterid, function (characters) {
        res.contentType('application/json');
        res.send(JSON.stringify(characters));
    });
});
