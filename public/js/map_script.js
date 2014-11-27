var map;
var latitude_temp = 0, longitude_temp = 0;

// Atributes
var mapAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        mapUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale = L.tileLayer(mapUrl, {id: 'floramap.jppahgl2', attribution: mapAttr}),
        streets = L.tileLayer(mapUrl, {id: 'examples.map-i875mjb7', attribution: mapAttr});


var markers_added = []; // Markers loaded from the database
var marker_temp = []; // Temporally markers

map = new L.map('map', {
    zoom: 10,
    minZoom: 2,
    zoomControl: false,
    layers: [streets]
});



/**
 * This function add the markers which are saved in the database
 **/
function showPlantMarkers() {
    var plantList = new PlantCollection(); // findAll()

    plantList.fetch({success: function() {
            var plantListSaved = plantList.toJSON();
        
            for (var i = 0; i < plantListSaved.length; i++) {

                var lat = plantListSaved[i].latitude;
                var lng = plantListSaved[i].longitude;
                
                var popup_content = "<div class='popup_marker'>"+
                                    "<h5 class='title_popup_marker'>"+plantListSaved[i].name+
                                    "<h6>("+lat+"&#176; , "+lng+"&#176;)</h6></h5>" 
                                "</div>";
                
                var popup_title = plantListSaved[i].name;
                var iconMarker = L.icon({
                                    iconUrl: '/img/marker_plants_black.png',
                                    iconSize: [35, 35], // size of the icon
                                    iconAnchor: [17, 39], // point of the icon which will correspond to marker's location
                                    popupAnchor: [0, -26] // point from which the popup should open relative to the iconAnchor
                                });
                
                // Add the new marker
                var m = L.marker([lat, lng],{icon: iconMarker, draggable: true,})
                                .addTo(map)
                                .bindPopup(popup_content)
                                .openPopup();

                // Add the id to the marker
                m._markerID = plantListSaved[i]._id;

                // When the marker is dragged 
                m.on('move', onMoveMarker);  
                
                // Add an event which will get the marker ID
                map.on('popupopen', function(e) {
                    var id = e.popup._source._markerID;
                    if(id != undefined){
                        if($('.hover').length > 0){
                            $('.hover').removeClass('hover');
                        }
                        
                        $("#pl_"+id).parent().parent().parent().addClass("hover");
                        var tag_target = $("a[id='pl_"+ id +"']").parent().parent().parent();
                        $('html,body').animate({scrollTop: tag_target.offset().top-50},'fast');
                    }
                });
                
                // Also, add the marker to an array
                markers_added.push(m);
                                
            }

    }});
    
}

// Remove all markers from the map (except the current position)
function removeMarkers(markers){
    for(var i = 0; i < markers.length; i++){
       map.removeLayer(markers[i]);
    }
    
    for(var i = 0; i < markers.length; i++){
       markers_added.pop();
    }    

}

// Update the map by removing the elements and adding again
function updateMap(){
    removeMarkers(markers_added);
    removeMarkers(marker_temp);
    showPlantMarkers();
}

/**
 * This function add new controls to the map
 */
function addControls() {
    // Add the zoom control on the top right position
    new L.Control.Zoom({position: 'topleft'}).addTo(map);

    // Add options of layers 
    //new L.control.layers(baseLayers).addTo(map);

    // Add new custom control to the map. It will get the current user location 
    L.Control.CurrentPosition = L.Control.extend({
        options: {
            position: 'topright',
        },
        onAdd: function(map) {
            var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');
            L.DomEvent
                    .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
                    .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
                    .addListener(controlDiv, 'click', function() {
                        mylocation();
                    });

            var controlUI = L.DomUtil.create('div', 'glyphicon glyphicon-home leaflet-control-command-interior', controlDiv);
            controlUI.title = 'Where am I?';
            return controlDiv;
        }
    });

    new L.Control.CurrentPosition({}).addTo(map);
}

// Locate the current location
function mylocation() {
    map.locate({setView: true, maxZoom: 12});
}

// Get the current latitude and longitude as a Object
function getCurrentCoordinates(){
    var coordinates = Object();
    mylocation();
    
    coordinates['lat'] = latitude_temp;
    coordinates['lng'] = longitude_temp;
    
    return coordinates;
}

// If the location is found
function onLocationFound(e) {
    addMarkerCurrentLocation(e);
    
    latitude_temp = e.latlng.lat;
    longitude_temp = e.latlng.lng;
}

// Add a marker on the point where is the current location (user's position on the map)
function addMarkerCurrentLocation(e){
    var radius = e.accuracy / 2;

    var iconMarker = L.icon({
        iconUrl: '/img/marker_you.png',
        iconSize: [35, 35], // size of the icon
        iconAnchor: [17, 39], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -26] // point from which the popup should open relative to the iconAnchor
    });

    var popup = '<div class="popup_marker">You are <strong>here!</strong></div>';
   // var marker = L.marker(e.latlng, {icon: iconMarker}).addTo(map);
    var marker = L.marker(e.latlng, {icon: iconMarker}).addTo(map).bindPopup(popup).openPopup();
    
    marker.on('click', onMarkerCurrentClick);
    
    fillFieldsLatlng(e.latlng);
}

function onLocationError(e) {
    alert(e.message);
}

// Click on the marker
function onMarkerCurrentClick(e) {
    var coord = e.latlng; 
    removeMarkers(marker_temp);
    fillFieldsLatlng(coord)
}

function verifyElementExists(elem_id){
    if($('#'+elem_id).length > 0)
        return true;
    return false;
}

// When the user clicks on the map, the field of latitude and longitude are filled with 
// the coordinates of the point where the user clicked
function onClickMap(e) {        
        var popLocation= e.latlng;
    
        if (verifyElementExists('plant-view-form')){

            fillFieldsLatlng(popLocation);

            var iconMarker = L.icon({
                iconUrl: '/img/marker_plants_blue.png',
                iconSize: [35, 35], // size of the icon
                iconAnchor: [17, 39], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -26] // point from which the popup should open relative to the iconAnchor
            });
            // Remove a previous temporally marker
            removeMarkers(marker_temp);

            var popup = '<p>This position was set up to the form.</p>';
            
            // Add a marker on the map, this one is used to mark the position where the user has clicked
            var new_marker_temp = new L.marker(e.latlng, {icon: iconMarker}).addTo(map).bindPopup(popup).openPopup();
            marker_temp.push( new_marker_temp );
            new_marker_temp.on('click', function(e){                
                var popLocation= e.latlng;
                fillFieldsLatlng(popLocation);
            });
        }
}

// Used to fill the fields when the marker is being dragged
function onMoveMarker(e) {        
        var popLocation= e.latlng;
    
        fillFieldsLatlng(popLocation);    
    
}

// Fill the lt and lng fields on the form of add/update plants
function fillFieldsLatlng(coord) {
    $(document).ready(function() {
        var latfield = $('#plant-view-form #latitude');
        var lngfield = $('#plant-view-form #longitude');
        
        if ((verifyElementExists('plant-view-form #latitude')) && (verifyElementExists('plant-view-form #longitude'))) { 
            latfield.val(coord.lat);
            lngfield.val(coord.lng);
            
            // Ativate the "change" event with JQeury in order to the app be able to save the coordinates
            latfield.trigger("change");
            lngfield.trigger("change");
        }
        else{
            console.log("Form not found.");
        }
    })
}

function currentLocation(){
    var coord = getCurrentCoordinates();
    fillFieldsLatlng(coord);
    latitude_temp = 0;
    longitude_temp = 0;
}

// Initialize the map adding controls, markers and current location
function init_map(){
    
    showPlantMarkers();
    addControls();    

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);  
    map.on('click', onClickMap);      
    
    mylocation();
}