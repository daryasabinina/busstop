'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', 'timeService',
        function ($scope, busesService, timeService) {

        $scope.searchText = '';
        $scope.busstopsArray = [];
        $scope.timeService = timeService;

        busesService.getData();

        $scope.$on('GOT_ALL_DATA', function() {
            $scope.busstopsArray = busesService.getBusstopsArray();
        });
  }]);
