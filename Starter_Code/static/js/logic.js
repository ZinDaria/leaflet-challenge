var myMap = L.map('map').setView([0, 0], 2);

// Add layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(myMap);

// Download the data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
  function getColor(depth) {
    return depth >= 70 ? '#d73027' :
           depth >= 50 ? '#fee08b' :
           depth >= 30 ? '#d9ef8b' :
           depth >= 10 ? '#1a9850' :
                            '#66bd63';
  }

  function getSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier as needed
  }

  // Loop through the data and add markers
  data.features.forEach(function (quake) {
    var coordinates = quake.geometry.coordinates;
    var magnitude = quake.properties.mag;
    var depth = coordinates[2];

    var marker = L.circleMarker([coordinates[1], coordinates[0]], {
      radius: getSize(magnitude),
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(myMap);

    // Add a popups
    marker.bindPopup(`<b>Location:</b> ${quake.properties.place}<br>
                   <b>Magnitude:</b> ${magnitude}<br>
                   <b>Depth:</b> ${depth} km`);
  });

  // Create a legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      depthRanges = [-10, 10, 30, 50, 70, 90];
    labels = ['<strong>Depth (km)</strong>'];

    // Loop through depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depthRanges.length; i++) {
      div.innerHTML +=
        labels.push('<div class="legend-square" style="background:' + getColor(depthRanges[i] + 1) + '"></div>' +
        (depthRanges[i + 1] ? depthRanges[i] + '&ndash;' + depthRanges[i + 1] + ' km' : depthRanges[i] + '+ km'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  // Add legend to the map
  legend.addTo(myMap);
});