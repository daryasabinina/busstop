/**
 * Created by Darya_Sabinina on 9/4/2015.
 */
var map;
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });

    var contentString = '<div id="content">'+
        'Lol, does it work?' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}