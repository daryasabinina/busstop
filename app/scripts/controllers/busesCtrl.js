'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', 'timeService',
        function ($scope, busesService, timeService) {

        function setFavourites() {
            $scope.busstopsArray.forEach(function(item) {
                if (localStorage.getItem(item.stationName) === 'true') {
                    item.favourite = true;
                } else {
                    item.favourite = false;
                }
            });
        }

        $scope.searchText = '';
        $scope.busstopsArray = [];
        $scope.timeService = timeService;

        busesService.getData().then(function(data){
            $scope.busstopsArray = data;
            setFavourites();
        });

        $scope.addToFavourites = function(stop) {
            stop.favourite = !stop.favourite;
            localStorage.setItem(stop.stationName, stop.favourite);
        };
  }]);
