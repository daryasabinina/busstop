'use strict';
angular.module('busstopApp')
  .controller('stationCtrl', ['$scope', '$routeParams', '$timeout', 'busesService',
        function ($scope, $routeParams, $timeout, busesService) {
            initMap();

            $scope.station = busesService.getBusstopByName($routeParams.busStation);

            $scope.showModal = function(stop) {
                $scope.modalShown = true;
                $timeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter({lat: stop.coordinates.lat, lng: stop.coordinates.lng});
                });
            };

            $scope.closeModal = function() {
                $scope.modalShown = false;
            };
  }]);
