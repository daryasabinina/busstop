'use strict';

angular.module('busstopApp')
    .directive('modal', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: false,
            templateUrl: 'views/modal.html'
        };
    });