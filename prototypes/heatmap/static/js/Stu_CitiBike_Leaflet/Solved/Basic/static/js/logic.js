let stations;
let heatmapLayer;
let map;

d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(response => {
  stations = response.data.stations;

  // Log the data to the console
  console.log(stations);

  // Create the heatmap
  createHeatmap();
});

function createHeatmap() {
  const heatmapData = [];

  function getRadius(capacity) {
    return capacity * 0.01;
  }

  function getColor(capacity) {
    const colors = ["red", "orange", "yellow", "green", "blue"];
    const index = Math.floor(capacity / 100) % colors.length;
    return colors[index];
  }

  stations.forEach(station => {
    const radius = getRadius(station.capacity);
    const color = getColor(station.capacity);
    const heatmapPoint = [station.lat, station.lon, radius]; // Change this line
    heatmapData.push(heatmapPoint);
  });

  heatmapLayer = L.heatLayer(heatmapData, {
    radius: 20, // Adjust the default radius as needed
    gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } // Specify gradient colors
  });

  const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 16,
    layers: [streetmap, heatmapLayer]
  });

  stations.forEach(station => {
    const circleMarker = L.circleMarker([station.lat, station.lon], {
      radius: 10,  // Adjust the radius as needed for the desired dot size
      fillColor: "rgba(0, 0, 0, 0)",  // Transparent color
      fillOpacity: 1,
      stroke: false
    });

     circleMarker.bindPopup(`<strong>Latitude:</strong> ${station.lat}<br><strong>Longitude:</strong> ${station.lon}<br><strong>Capacity:</strong> ${station.capacity}`);
    circleMarker.addTo(map);
  });

  const baseMaps = {
    "Street Map": streetmap
  };

  const overlayMaps = {
    "Heatmap": heatmapLayer
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
