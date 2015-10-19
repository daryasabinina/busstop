angular.module('busstopApp')
    .factory('busesResource', [ '$resource', function($resource){
        'use strict';

        var url = 'http://devx.izodev.com/temp/busstops';
        var busesResource =  $resource(url, {}, {});

        return busesResource;

    }]);