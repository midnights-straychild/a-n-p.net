/*global angular */

var eveAppControllers = angular.module('eveAppControllers', []);

eveAppControllers.controller('contentController', function ($scope, $routeParams, $rootScope) {
    'use strict';
    $scope.templateUrl = 'pages/' + $routeParams.name + '.html';
    $scope.message = $routeParams.name.capitalize();
    $scope.$parent.$$childHead.pageTitle = '[A-N-P] Against Nuclear Power - Corporation HQ - ' + $routeParams.name;

    $rootScope.$emit(
        'contentChange',
        {
            'contentName': $routeParams.name.capitalize()
        }
    );
});

// create the controller and inject Angular's $scope
eveAppControllers.controller('headController', function ($rootScope) {
    'use strict';
    $rootScope.$on('contentChange', function (event, args) {
        event.currentScope.pageTitle = '[A-N-P] Against Nuclear Power - Corporation HQ - ' + args.contentName;
    });
});