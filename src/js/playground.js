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

// create the controller and inject Angular's $scope
eveApp.controller('headController', function ($scope) {
    'use strict';
    $scope.pageTitle = '[A-N-P] Against Nuclear Power - Corporation HQ - ';

    window.$rootScope.$on('contentChange', function (event, args) {
        event.currentScope.pageTitle += args.contentName;
    });
});

eveApp.controller('contentController', function ($scope, $routeParams) {
    'use strict';
    $scope.templateUrl = 'pages/' + $routeParams.name + '.html';
    $scope.message = $routeParams.name.capitalize();
    $scope.parent.controller.headController.pageTitle += $routeParams.name;

    window.$rootScope.$emit(
        'contentChange',
        {
            'contentName': $routeParams.name.capitalize()
        }
    );
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
