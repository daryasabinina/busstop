'use strict';

angular.module('busstopApp')
  .controller('stationCtrl', ['$scope', '$routeParams', 'busesService',
        function ($scope, $routeParams, busesService) {

            busesService.getData();
            $scope.station = busesService.getBusstopByName($routeParams.busStation);

  }]);
