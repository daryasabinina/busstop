/**
 * Created by Darya_Sabinina on 9/4/2015.
 */
var map, marker;
function initMap() {
    setTimeout(function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 53.944160, lng: 27.717491},
            zoom: 17
        });
        marker = new google.maps.Marker({
            position: {lat: 53.944160, lng: 27.717491},
            map: map,
            title: 'Hello World!'
        });
    }, 1000);


}
