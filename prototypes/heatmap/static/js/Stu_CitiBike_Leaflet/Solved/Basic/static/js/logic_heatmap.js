// ## Capture primary dropdown value from index.html reference by referencing it with d3 then storing it
let dropdownMenu = d3.select("#selDataset")
let selectedWeather = dropdownMenu.property("value")

let stations = stations_all;
let heatmapLayer;
let map;

// ## Set the dictionaries for Hottest vs. Coldest vs. Severity
let data_values = {"Hottest" :  "max_temp",  "Coldest" : "min_temp",  "Severity" : "severity_rating"}
let map_colors = {"Hottest" :  ["#fee0d2", "#fc9272", "#de2d26", "#c31e18", "#9c100b"],  
                "Coldest" : ["#deebf7", "#9ecae1", "#3182bd", "#1f71ab", "#0d588d"],  
                "Severity" : ["#efedf5", "#bcbddc", "#756bb1", "#5e5597", "#48407e"]}
let hover_text = {"Hottest" :  "2022 Absolute Max Temp",  
                "Coldest" : "2022 Absolute Min Temp",  
                "Severity" : "2022 Severity Rating"}


function init(){

  // Log the data to the console
  console.log("init data", stations[0])

  // Create the heatmap
  createHeatmap();
}

function createHeatmap() {
  console.log("createheat map data: ", stations[0].max_temp)
  
  const heatmapData = [];

  function getRadius(capacity) {
    return capacity * 0.01;
  }

  function getColor(capacity) {
    const colors = ["red", "orange", "yellow", "green", "blue"];
    const index = Math.floor(capacity / 100) % colors.length;
    return colors[index];
  }

  console.log("create heat lat: ", stations[0].lat, stations[0].lon)

  stations.forEach(station => {
    const radius = getRadius(station.max_temp);
    const color = getColor(station.max_temp);
    const heatmapPoint = [station.lat, station.lon, radius]; 
    heatmapData.push(heatmapPoint);
  });

  heatmapLayer = L.heatLayer(heatmapData, {
    radius: 20, // Adjust the default radius as needed
    gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } // Specify gradient colors
  });

  const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // initiate the map centered on continental U.S.
  map = L.map("heatmap", {
    center: [39.83, -98.58],
    zoom: 4,
    layers: [streetmap, heatmapLayer]
  });

  stations.forEach(station => {
    const circleMarker = L.circleMarker([station.lat, station.lon], {
      radius: 10,  // Adjust the radius as needed for the desired dot size
      fillColor: "rgba(0, 0, 0, 0)",  // Transparent color
      fillOpacity: 1,
      stroke: false
    });

    circleMarker.bindPopup(`<h4>${station.usaf}: ${station.name}, ${station.state}</h4><br><h5>Stat from dropdown</h5>`);
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

init()