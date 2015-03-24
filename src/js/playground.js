/*global angular */
// script.js
// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var eveApp = angular.module('eveApp', ['ngRoute']);

// configure our routes
eveApp.config(function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/', {
            template: '<div ng-include="templateUrl">Loading...</div>',
            name: 'Home',
            controller: 'contentController'
        })
        .when('/c/:name', {
            template: '<div ng-include="templateUrl">Loading...</div>',
            controller: 'contentController'
        });
});

eveApp.controller('contentController', function ($scope, $routeParams, $rootScope) {
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
eveApp.controller('headController', function ($rootScope) {
    'use strict';
    $rootScope.$on('contentChange', function (event, args) {
        event.currentScope.pageTitle = '[A-N-P] Against Nuclear Power - Corporation HQ - ' + args.contentName;
    });
});

eveApp.directive('activeLink', ['$location', function (location) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var clazz = attrs.activeLink,
                path = attrs.href;
            path = path.substring(1); //hack because path does not return including hashbang
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);
