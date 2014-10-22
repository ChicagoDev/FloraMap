var map;
// Atributes
var mapAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        mapUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale = L.tileLayer(mapUrl, {id: 'floramap.jppahgl2', attribution: mapAttr}),
        streets = L.tileLayer(mapUrl, {id: 'examples.map-i875mjb7', attribution: mapAttr});

var baseLayers = {
    "Grayscale": grayscale,
    "Streets": streets
};

var markers_added = [];

map = new L.map('map', {
    zoom: 10,
    minZoom: 2,
    zoomControl: false,
    layers: [grayscale, streets]
});



/**
 * This function add the markers which are saved in the database
 **/
function showPlantMarkers() {
    var plantList = new PlantCollection();

    plantList.fetch({success: function() {
            var plantListSaved = plantList.toJSON();
        
            for (var i = 0; i < plantListSaved.length; i++) {

                var lat = plantListSaved[i].latitude;
                var lng = plantListSaved[i].longitude;
                
                var popup_content = "<div class='popup_marker'><strong class='title_popup_marker'>"+plantListSaved[i].name+"</strong>"
                                    +"<p>"+plantListSaved[i].description+"</p></div>";
                
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
                    
                    if(e.popup._source._markerID != undefined){
                        console.log(e.popup._source._markerID);                  
                    }
                });
                
                // Also, add the marker to an array
                markers_added.push(m);
                                
            }

    }});
    
}

// Remove all markers from the map (except the current position)
function removeMarkers(){
    for(var i = 0; i < markers_added.length; i++){
       map.removeLayer(markers_added[i]);
    }
    
    for(var i = 0; i < markers_added.length; i++){
       markers_added.pop();
    }
    
}

// Update the map by removing the elements and adding again
function updateMap(){
    removeMarkers();
    showPlantMarkers();
}

/**
 * This function add new controls to the map
 */
function addControls() {
    // Add the zoom control on the top right position
    new L.Control.Zoom({position: 'topleft'}).addTo(map);

    // Add options of layers 
    new L.control.layers(baseLayers).addTo(map);

    // Add new custom control to the map. It will get the current user location 
    L.Control.CurrentPosition = L.Control.extend({
        options: {
            position: 'topleft',
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


function mylocation() {
    map.locate({setView: true, maxZoom: 12});
}


function onLocationFound(e) {
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
    marker
    marker.on('click', onMarkerClick);

}

function onLocationError(e) {
    alert(e.message);
}

// Click on the marker
function onMarkerClick(e) {
    var coord = e.latlng; 
    fillFieldsLatlng(coord)
}

// When the user clicks on the map, the field of latitude and longitude are filled with 
// the coordinates of the point where the user clicked
function onClickMap(e) {        
        var popLocation= e.latlng;
    
        fillFieldsLatlng(popLocation);
        
        var iconMarker = L.icon({
            iconUrl: '/img/marker_plants_blue.png',
            iconSize: [35, 35], // size of the icon
            iconAnchor: [17, 39], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -26] // point from which the popup should open relative to the iconAnchor
        });

        var popup = '<p>This position was set up to the form.</p>';
       // var marker = L.marker(e.latlng, {icon: iconMarker}).addTo(map);
        var marker = L.marker(e.latlng, {icon: iconMarker}).addTo(map).bindPopup(popup).openPopup();
        markers_added.push(marker);
}

function onMoveMarker(e) {        
        var popLocation= e.latlng;
    
        fillFieldsLatlng(popLocation);    
    
}

function fillFieldsLatlng(coord) {
    $(document).ready(function() {
        var latfield = $('#plant-view-form #latitude');
        var lngfield = $('#plant-view-form #longitude');
        
        if ((latfield.length > 0) && (lngfield.length > 0)) { 
            latfield.val(coord.lat);
            lngfield.val(coord.lng);
            latfield.trigger("change");
            lngfield.trigger("change");
        }
        else{
            console.log("Form not found.");
        }
    })
}

function init_map(){
    
    showPlantMarkers();
    addControls();    

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);  
    map.on('click', onClickMap);      
    
    map.locate({setView: true, maxZoom: 12});
}