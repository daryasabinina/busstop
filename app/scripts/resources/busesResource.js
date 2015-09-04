angular.module('busstopApp')
    .factory('busesResource', [ '$resource', function($resource){
        'use strict';

        var url = '/scripts/json/respons.json';
        var busesResource =  $resource(url, {}, {});

        return busesResource;

    }]);