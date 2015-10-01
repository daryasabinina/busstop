'use strict';

/**
 * @ngdoc overview
 * @name busstopApp
 * @description
 * # busstopApp
 *
 * Main module of the application.
 */
angular
  .module('busstopApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'busesCtrl'
      })
      .when('/details/:busStation', {
        templateUrl: 'views/station.html',
        controller: 'stationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
