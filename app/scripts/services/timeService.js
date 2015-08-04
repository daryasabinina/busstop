angular.module('busstopApp')
    .factory('timeService', [function () {
        'use strict';

        var timeService = {},
            currentDate = new Date(),
            currentTime = currentDate.getHours() + '' + currentDate.getMinutes();

        timeService.getClosestTime = function(arr) {
            if (arr === null) {
                return;
            }
            var closestTime = '';
            arr.forEach(function() {
                for (var j=0; arr.length > j; j++) {
                    var busTime = arr[j].replace(':','');
                    if (busTime >= currentTime && !closestTime || j === arr.length && !closestTime) {
                        closestTime = arr[j];
                    }
                }
            });
            return closestTime;
        };

        return timeService;
    }]);