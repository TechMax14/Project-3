// source: https://makeshiftinsights.com/blog/heatmaps-leaflet-heatmap-js/

// notes: 
// heatmap color scheme defined in heatmaps.js

console.log("sales", sales)

// Create the base Leaflet layer (the map itself)

let baseLayer = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }
)

// Configure and create the heatmap.js layer. Check out the heatmap.js Leaflet plugin docs for additional configuration options.
// Bekah hopes we can use more inputs to modify color scheme based on layer but isn't seeing it within heatmap.js

let cfg = {
    "radius": 40,
    "useLocalExtrema": true,
    valueField: 'price'
};
let heatmapLayer = new HeatmapOverlay(cfg);

// Determine min/max (from JSON data exposed as variable in sales.js) for the heatmap.js plugin

let min = Math.min(...sales.map(sale => sale.value))
let max = Math.max(...sales.map(sale => sale.value))

// Create the overall Leaflet map using the two layers we created

let propertyHeatMap = new L.Map('map', {
    center: new L.LatLng(39.275, -76.613),
    zoom: 15,
    layers: [baseLayer, heatmapLayer]
})

// Add data (from JSON data exposed as variable in sales.js) to the heatmap.js layer

heatmapLayer.setData({
    min: min,
    max: max,
    data: sales
});