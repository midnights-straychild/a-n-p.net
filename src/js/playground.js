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
            templateUrl: 'pages/home.html',
            controller: 'mainController'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'aboutController'
        })
        .when('/impressum', {
            templateUrl: 'pages/impressum.html',
            controller: 'impressumController'
        })
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactController'
        });
});

// create the controller and inject Angular's $scope
eveApp.controller('mainController', function ($scope) {
    'use strict';
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

eveApp.controller('aboutController', function ($scope) {
    'use strict';
    $scope.message = 'Look! I am an about page.';
});

eveApp.controller('contactController', function ($scope) {
    'use strict';
    $scope.message = 'Contact us! JK. This is just a demo.';
});

eveApp.controller('impressumController', function ($scope) {
    'use strict';
    $scope.message = 'Impressum';
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
