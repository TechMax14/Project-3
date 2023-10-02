
// ## Capture primary dropdown value from index.html reference by referencing it with d3 then storing it
let dropdownMenu = d3.select("#selDataset")

// ## Set the dictionaries for Hottest vs. Coldest vs. Severity
let data_values = {"Hottest" :  "max_temp",  "Coldest" : "min_temp",  "Severity" : "severity_rating"}
let data_file = {"Hottest" :  "state_station_hot",  "Coldest" : "state_station_cold",  "Severity" : "state_station_severity"}
let data_sort = {"Hottest" :  "descending",  "Coldest" : "ascending",  "Severity" : "descending"}
let xAxisTitle = {"Hottest" : "Temperature (F)", "Coldest" : "Temperature (F)", "Severity" : "Rating"}
let yAxisSelection = {"Hottest" : "y", "Coldest" : "y2", "Severity" : "y"}

// ## Set up the dropdown menu for the top 10

// Set the list of state abbreviations
let stateAbbs = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 
'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 
'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN','TX', 'UT', 'VA', 'VI', 
'VT', 'WA', 'WI', 'WV', 'WY']
// Get the dropdown from index.html by referencing it with d3
let stateDDMenu = d3.select("#stateDataset")
// Add the state abbreviation list to the menu by appending each one
stateAbbs.forEach((stateAbbs) => {
    stateDDMenu.append("option").text(stateAbbs).property("value", stateAbbs)
})


// ## Create the function to initialize the chart
function init(){
    // Get the drop down values
    let selectedWeather = dropdownMenu.property("value")
    let selectedState = stateDDMenu.property("value")
    // Get the data
    let topTenStations = getTop10Data(selectedWeather, selectedState)
    console.log("top data init:", topTenStations)
    //Plot the chart
    makeTop10Chart(topTenStations, selectedWeather)
}

// ## Captures a change in either dropdown and re-initializes data and chart
dropdownMenu.on("change", updateCharts)
stateDDMenu.on("change", updateCharts)

// ## Create function to get new property value and update chart
function updateCharts() {
    // Get new drop down values
    let selectedWeather = dropdownMenu.property("value")
    let selectedState = stateDDMenu.property("value")
    // Get the data
    let topTenStations = getTop10Data(selectedWeather, selectedState)
    console.log("top data update:", topTenStations)
    //Plot the chart
    makeTop10Chart(topTenStations, selectedWeather)
}


// ## Create function to filter and sort the data based on page inputs data = stations_all
function getTop10Data(weather_type, selectedState) {

    console.log("weather type get", weather_type)
    console.log("state get", selectedState)
    // Filter the data by desired state
    let stateStations = stations_all.filter(data => data.state == selectedState)
    // console.log("data:", stateStations)

    // Sort data based on defined order; don't sort if not defined
    let sortedStStations

    if (data_sort[weather_type] == "descending"){
        // Sort the data by descending
        sortedStStations = stateStations.sort((a, b) => b[data_values[weather_type]] - a[data_values[weather_type]])    
        console.log("desc sorted: ", sortedStStations)
    }
    else if (data_sort[weather_type] == "ascending"){
        // Sort the data by ascending
        sortedStStations = stateStations.sort((a, b) => a[data_values[weather_type]] - b[data_values[weather_type]])
        console.log("asc sorted: ", sortedStStations)
    }
    else {
        sortedStStations = stateStations
        console.log("no sort: ", sortedStStations)
    }

    // console.log("sorted: ", sortedStStations)

    // Slice the first 10 objects for plotting
    let topTen = sortedStStations.slice(0,10)
    console.log("top data get:", topTen)

    return topTen
}

// ## Create a function for the horizontal bar chart plot
function makeTop10Chart(topTenStations, weather_type) {
    // Reverse the array to accommodate Plotly's defaults (note to self: reverse operates on the original array!)
    topTenStations.reverse()
    // console.log("top reverse:", topTenStations)

    // Horizontal bar chart trace for the Data
    let trace1 = {
        y: topTenStations.map(item => item.name),
        x: topTenStations.map(item => item[data_values[weather_type]]),
        type: 'bar',
        orientation: 'h',
        marker: {color: "#6c6c6c"},
        yaxis: yAxisSelection[weather_type]
    }

    // Apply a title to the layout
    let layout = {title: "Top 10 Stations by Selected State", 
        xaxis:{title: xAxisTitle[weather_type]},
        plot_bgcolor:"#f5f6d8",
        paper_bgcolor:"#e6e7d1",
        // Prevent labels from being cutoff
        yaxis: {automargin: true},
        yaxis2: {side: 'right', automargin: true}
    }

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("top10_plot", [trace1], layout)
}

init()