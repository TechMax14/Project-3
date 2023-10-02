// ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN','TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY']
// https://getbootstrap.com/docs/3.3/css/#tables
// https://getbootstrap.com/docs/3.3/javascript/#dropdowns

// Load JSON data from a .json file
d3.json("data/stations_all.json").then(function(stationsData) {

    console.log(stationsData);

    // Use D3 to select the dropdown menu
    let stationSelect = d3.select("#stationSelect");

    // Use D3 to select the table
    let tbody = d3.select("#stationTable tbody");

    // Define a function to update the table based on the selected station
    function updateTable(selectedStation) {
    
        // Clear table
        tbody.html("");

        // Get data for selected station
        let selectedData = stationsData.find(station => station.usaf === selectedStation);

        console.log("Selected Data:", selectedData);

        // Update station info
        d3.select("#stationInfo").text(`Station ID: ${selectedData.usaf}, Station Name: ${selectedData.name}, State: ${selectedData.state}`);

        // Add data rows to the table
        tbody.append("tr")
            .html(`<td>${selectedData.min_temp}</td>
                   <td>${selectedData.mean_temp}</td>
                   <td>${selectedData.max_temp}</td>
                   <td>${selectedData.total_snow}</td>
                   <td>${selectedData.total_precipitation}</td>
                   <td>${selectedData.tornado_funnel_cloud}</td>
                   <td>${selectedData.hail}</td>`);


        // Populate data values vertically
        // d3.select("#minTemp").text(selectedData.min_temp);
        // d3.select("#meanTemp").text(selectedData.mean_temp);
        // d3.select("#maxTemp").text(selectedData.max_temp);
        // d3.select("#totalSnow").text(selectedData.total_snow);
        // d3.select("#totalPrecipitation").text(selectedData.total_precipitation);
    }

    // Populate the dropdown menu with station options
    stationsData.forEach(station => {
        stationSelect.append("option")
            .attr("value", station.usaf)
            .text(`${station.usaf} - ${station.name}, ${station.state}`);

        console.log(stationSelect);
    });

    

    // Add an event listener to the dropdown menu to update the table
    stationSelect.on("change", function () {
        let selectedStation = this.value;
        updateTable(selectedStation);

        console.log(selectedStation);
    });

    // Initial table update (you can select a default station if needed)
    updateTable(stationSelect.node().value);

});