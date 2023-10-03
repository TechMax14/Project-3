// Get the Station dropdown from index.html by referencing it with d3
let stationDDMenu = d3.select("#stationSelect")

// ## Create a list of the table cell ids
tableIDs = ["station_identifier", "min_temp", "mean_temp", "max_temp", "total_snow", "total_precipitation", "tornado_funnel_cloud", "hail"]

// ## Create the function to initialize the dropdown and table
function init(){

    // Get the Station Data
    let stationsData = stations_all
    console.log("data init:", stationsData)

    // Set up the dropdown menu for the table    
    // Add the state + station name to the dropdown menu
    stationsData.forEach((stationsData) => {
        stationDDMenu.append("option").text(stationsData.state + ': ' + stationsData.name).property("value", stationsData.usaf)
    })

    // Get the drop down value
    let selectedStation = stationDDMenu.property("value")
    
    // Populate the table
    populateTable(selectedStation)
}

// ## Captures a change in station dropdown and re-initializes the data
stationDDMenu.on("change", updateTable)


// ## Create function to get new property value and update chart
function updateTable() {
    // Get new drop down values
    let newStation = stationDDMenu.property("value")
    //Update the table
    populateTable(newStation)
}

// ## Create a function for populating the table
function populateTable(selectedStation) {
    // Get the single station data
    let station = stations_all.filter(data => data.usaf == selectedStation)
    console.log("populate station data:", station)
    // Update the header by selecting the header by id and then changing text
    let header = d3.select("#" + tableIDs[0])
    header.text(station[0].usaf + ": " + station[0].name + ", " + station[0].state)
    console.log("populate header", station[0].name)
    // Iterate through the data ids to update the table
    for (i=1; i < tableIDs.length; i++){
        let cell = d3.select("#" + tableIDs[i])
        cell.text(station[0][tableIDs[i]])
        // console.log("tableID data", station[0][tableIDs[i]])
    }  
}

init()