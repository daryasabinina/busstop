'use strict';
var map, stations;
function initMap() {
    setTimeout(function() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 17
        });

        $.getJSON('http://devx.izodev.com/temp/busstops', function( data ) {
            stations =  data.respons;
            for (var i = 0; i < stations.length; i++) {
                var station = stations[i],
                    infoText = '<div style="color: black; font-size: 14px">Available buses: <br>',
                    infowindow = new google.maps.InfoWindow();

                station.buses.forEach(function(item) {
                    if (item.times !== null) {
                        infoText = infoText + '<b>№' + item.number + '</b> ' + ': ' + item.times.join(', ') + '<br>';
                    }
                });

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng (station.coordinates.lat, station.coordinates.lng),
                    map: map,
                    title: station.stationName,
                    info: infoText+'</div>'
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(this.info);
                    infowindow.open(map, this);
                });

            }
        });

    }, 1000);

}
