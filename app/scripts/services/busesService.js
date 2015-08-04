angular.module('busstopApp')
    .factory('busesService', [ '$rootScope', 'busesResource', function ($rootScope, busesResource) {
        'use strict';

        var busesService = {},
            busstopsArray = [];

        busesService.getData = function() {
            fetchData().then(successHandler, errorHandler);
        };

        busesService.getBusstopsArray = function() {
            return busstopsArray;
        };

        function fetchData() {
            return busesResource.get().$promise;
        }

        function successHandler(data) {
            busstopsArray =  data.respons;
            $rootScope.$broadcast('GOT_ALL_DATA', data);
        }

        function errorHandler() {
            console.log('Something went wrong!');
        }

        return busesService;
    }]);