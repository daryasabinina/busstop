'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', 'timeService',
        function ($scope, busesService, timeService) {

        $scope.searchText = '';
        $scope.busstopsArray = [];

        $scope.station = {
            name : '',
            busNumbers : []  //cюда надо положить и автобус и время, время будет урезать по текущему времени
        };

        $scope.timeService = timeService;

        busesService.getData();

        $scope.$on('GOT_ALL_DATA', function() {
            $scope.busstopsArray = busesService.getBusstopsArray();
        });
  }]);
