angular.module('busstopApp')
    .factory('busesService', [ '$rootScope', 'busesResource', function ($rootScope, busesResource) {
        'use strict';

        var busesService = {},
            busstopsArray = [];

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

        busesService.getData = function() {
            return fetchData().then(successHandler, errorHandler);
        };

        busesService.getBusstopByName = function(name) {
            var station;

            busstopsArray.forEach(function(item) {
                if(item.stationName === name) {
                    station = item;
                }
            });

            return station;
        };

        return busesService;

    }]);