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

        busesService.getBusesOnStation = function() {
            var busesNumbers = [];
            busstopsArray.forEach(function(item) {
                for (var j=0; item.buses.length > j; j++) {
                    busesNumbers.push(item.buses.j);
                }
            });
            return busesNumbers;
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