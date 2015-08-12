angular.module('busstopApp')
    .factory('busesService', [ '$rootScope', 'busesResource', function ($rootScope, busesResource) {
        'use strict';

        var busesService = {},
            busstopsArray = [];

        busesService.getData = function() {
            return fetchData().then(successHandler, errorHandler);
        };

        busesService.getBusstopByName = function(name) {
            var station;

            busesService.getBusstopsArray();
            busstopsArray.forEach(function(item) {
                if(item.stationName === name) {
                    station = item;
                }
            });

            return station;
        };

        function fetchData() {
            return busesResource.get().$promise;
        }

        function successHandler(data) {
            busstopsArray = data.respons;
            return busstopsArray;
        }

        function errorHandler() {
            console.log('Something went wrong!');
        }

        return busesService;
    }]);