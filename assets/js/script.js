let query = "";
let apiKey = "febf98a553e74ea73777c8e45f922796";

$("#search-form").submit(function (e) {
    query = $("#city-search").val();
    $("#city-search").val("");
    getWeatherData(query);
    e.preventDefault();
});

async function getWeatherData(query) {
    try {
        let url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();
        let lat = data[0].lat;
        let lon = data[0].lon;
        console.log(lat, lon);
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        response = await fetch(url);
        data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

function pinToHistory() {}

// https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${apiKey}

// geo/1.0/direct
