// ## Capture primary dropdown value from index.html reference by referencing it with d3 then storing it
let dropdownMenu = d3.select("#selDataset")

let heatmapLayer;
let map;

// ## Set the dictionaries for Hottest vs. Coldest vs. Severity
let data_values = {"Hottest" :  "max_temp",  "Coldest" : "min_temp",  "Severity" : "severity_rating"}
let map_colors = {"Hottest" :  ["#fee0d2", "#fc9272", "#de2d26", "#c31e18", "#9c100b"],  
                    // "Coldest" : ["#3182bd", "#1f71ab", "#0d588d", "#064674", "#023153"],
                    "Coldest" : ["#023153", "#064674", "#0d588d", "#1f71ab","#3182bd"],
                    "Severity" : ["#efedf5", "#bcbddc", "#756bb1", "#5e5597", "#48407e"]}
let map_gradients = {"Hottest" :  { 0: "#fee0d2", 0.25: "#fc9272", 0.5: "#de2d26", 0.75: "#c31e18", 1: "#9c100b" },  
                    // "Coldest" : {0: "#3182bd", 0.25: "#1f71ab", 0.5: "#0d588d", 0.75: "#064674", 1: "#023153"},
                    "Coldest" : {0: "#023153", 0.25: "#064674", 0.5: "#0d588d", 0.75: "#1f71ab", 1: "#3182bd"},
                    "Severity" : {0: "#efedf5", 0.25: "#bcbddc", 0.5: "#756bb1", 0.75: "#5e5597", 1: "#48407e"}}
let hover_text = {"Hottest" :  "2022 Absolute Max Temp",  
                "Coldest" : "2022 Absolute Min Temp",  
                "Severity" : "2022 Severity Rating"}
let radius_multiplier = {"Hottest" :  10,  "Coldest" : 10,  "Severity" : 500}

// Initialize the map
function init(){

  // Get the initial dropdown value
  let selectedWeather = dropdownMenu.property("value")

  // Create the heatmap
  createHeatmap(selectedWeather);
}

// ## Captures a change in either dropdown and re-initializes data and chart
dropdownMenu.on("change", updateHeatmap)

// ## Create function to get new property value and update chart
function updateHeatmap() {
  // Get new drop down value
  let newWeather = dropdownMenu.property("value")
  console.log("new selection", newWeather)
  
  // clear old map
  map.remove()
  
  //Plot the map
  createHeatmap(newWeather)
}

// Create function to generate heat map
function createHeatmap(weatherType) {

  let stations = stations_all;
  console.log("create map data: ", stations[0])
  
  const heatmapData = [];

  function getRadius(dataPoint, multiplier, mapType) {
    if (mapType == "min_temp"){
      dataPoint += 75
    }
    return dataPoint * multiplier
  }

  function getColor(dataPoint, mapType) {
    const colors = map_colors[mapType];
    const index = Math.floor(dataPoint / 100) % colors.length;
    return colors[index];
  }

  stations.forEach(station => {
    const radius = getRadius(station[data_values[weatherType]], radius_multiplier[weatherType], data_values[weatherType]);
    const color = getColor(station[data_values[weatherType]], weatherType);
    const heatmapPoint = [station.lat, station.lon, radius]; 
    heatmapData.push(heatmapPoint);
  });

  heatmapLayer = L.heatLayer(heatmapData, {
    radius: 20, // Adjust the default radius as needed
    gradient: map_gradients[weatherType] // Specify gradient colors
  });

  const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // initiate the map centered on continental U.S.
  map = L.map("heatmap", {
    center: [39.83, -98.58],
    zoom: 5,
    layers: [streetmap, heatmapLayer]
  });

  stations.forEach(station => {
    const circleMarker = L.circleMarker([station.lat, station.lon], {
      radius: 10,  // Adjust the radius as needed for the desired dot size
      fillColor: "rgba(0, 0, 0, 0)",  // Transparent color
      fillOpacity: 1,
      stroke: false
    });

    circleMarker.bindPopup(`<h4>${station.usaf}: ${station.name}, ${station.state}</h4><h5>${hover_text[[weatherType]]}: ${station[data_values[weatherType]]}</h5>`);
    circleMarker.addTo(map);
  });

  // const baseMaps = {
  //   "Street Map": streetmap
  // };

  // const overlayMaps = {
  //   "Heatmap": heatmapLayer
  // };

  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(map);
}

init()