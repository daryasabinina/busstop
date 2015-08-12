'use strict';

angular.module('busstopApp')
  .controller('busesCtrl', [ '$scope', 'busesService', 'timeService',
        function ($scope, busesService, timeService) {

        $scope.searchText = '';
        $scope.busstopsArray = [];
        $scope.timeService = timeService;

        busesService.getData().then(function(data){
            $scope.busstopsArray = data;
        });
  }]);
