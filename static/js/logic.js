// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  // Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


function determineColor(mag) {
  if ( mag > 5) {
    return '#bd0026';
  } else if ( mag > 4 ) {
    return '#f03b20';
  } else if ( mag > 3 ) {
    return '#fd8d3c';
  } else if ( mag > 2 ) {
    return '#fecc5c';
  } else if ( mag > 1 ) {
    return '#fecc5c';
  } else {
    return '#ffffd4';
  }
}
function onEachFeature(feature, layer) {
// Set mouse events to change map styling
    layer.on({

      // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
      mouseover: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 5.9
        });
      },

     // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.5
        });
      },
      });
// // Giving each feature a pop-up with information pertinent to it
layer.bindPopup("<h1>" + (feature.properties.place) + "</h1>" + "<hr>" + "<h2>" + "Magnitude" + (feature.properties.mag) + "</h2>");
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);

  L.geoJSON(data,{
    pointToLayer: function (feature,latlng) {
        return L.circleMarker(latlng,{
          radius: feature.properties.mag*15 ,
          fillColor: determineColor(feature.properties.mag),
          color: "#FFFF00",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8  
        })
      },
    onEachFeature: onEachFeature
    }).addTo(myMap)
  })

  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + determineColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
