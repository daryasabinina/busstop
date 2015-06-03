'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', function ($scope, busesService) {

        $scope.searchText = '';
        $scope.busstopsArray = [];

        $scope.station = {
            name : '',
            busNumbers : []
        };

        busesService.getData();

        $scope.$on('GOT_ALL_DATA', function() {
            $scope.busstopsArray = busesService.getBusstopsArray();
            $scope.station.busNumbers = busesService.getBusesOnStation();
        });



  }]);
