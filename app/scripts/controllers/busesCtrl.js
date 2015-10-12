'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', 'timeService', '$timeout',
            function ($scope, busesService, timeService, $timeout) {

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

            $scope.showModal = function() {
                $scope.modalShown = true;
                $timeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter({lat: 53.944160, lng: 27.717491});
                });
            };

            $scope.closeModal = function() {
                $scope.modalShown = false;
            };
  }]);
