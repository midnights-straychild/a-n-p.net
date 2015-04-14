/*global angular */
var mapService = angular.module('mapService', ['ngResource']);

mapService.factory('constellation', ['$resource',
        function ($resource) {
            'use strict';
            return $resource('constellation/:constellationId.json', {}, {
                query: {method: 'GET', params: {constellationId: 'constellationId'}, isArray: true}
            });
        }]
);