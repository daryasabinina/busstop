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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'busesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
