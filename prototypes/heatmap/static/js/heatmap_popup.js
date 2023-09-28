// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create an empty array to store the retrieved weather data.
let weatherData = [];

// Create the map with our layers.
let map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [streetmap] // Add the streetmap as the base layer
});

// Perform an API call to the JSON endpoint.
d3.json("https://data.townofcary.org/api/v2/catalog/datasets/rdu-weather-history/exports/json").then(function(infoRes) {
    // Assuming 'infoRes' contains the JSON data you need

    // Store the retrieved data in the 'weatherData' array
    weatherData = infoRes;

    // Create the heatmap layer using the 'weatherData'
    const heatmapLayer = L.heatLayer(weatherData.map(point => new L.LatLng(point.latitude, point.longitude)), {
        radius: 20,
        max: 1,
        gradient: {
            0.4: "blue",
            0.6: "yellow",
            0.8: "orange",
            1: "red",
        },
    });

    // Add the heatmap layer to the map
    heatmapLayer.addTo(map);

    // Add a popup to the heatmap layer
    heatmapLayer.on("click", function(e) {
        // Get the data for the clicked point
        const data = weatherData.find(point => point.latitude === e.latlng.lat && point.longitude === e.latlng.lng);

        // Create the popup content
        const popupContent = `
            <h3>Date: ${data.date}</h3>
            <p>Description: ${data.description}</p>
        `;

        // Open the popup at the clicked point
        L.popup()
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(map);
    });
});
