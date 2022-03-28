var query = "";
var apiKey = "febf98a553e74ea73777c8e45f922796";
var geoData = [];
var data = [];
var currentTemp = "";
var currentIcon = "";
var queryArray = [];

onLoad();

function onLoad() {
    queryArray = JSON.parse(localStorage.getItem("queryArray"));
    queryArray = queryArray || [];
    for (let i = 0; i < queryArray.length; i++) {
        $("#pinned-container").append(`<button type='button' class="button is-dark search-item">${queryArray[i].cityName}</button>`);
        console.log(queryArray[i].cityName);
    }
}

async function getWeatherData(query) {
    try {
        let url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`;
        let response = await fetch(url);
        geoData = await response.json();
        let lat = geoData[0].lat;
        let lon = geoData[0].lon;
        let cityName = geoData[0].name;
        let newEntry = new Entry(cityName, lat, lon);
        if (queryArray.filter((obj) => obj.cityName == cityName).length == 0) {
            $("#pinned-container").append(`<button type='button' class="button is-dark search-item">${cityName}</button>`);
            queryArray.push(newEntry);
        }
        localStorage.setItem("queryArray", JSON.stringify(queryArray));
        console.log(geoData[0].name);
        console.log(lat, lon);
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        response = await fetch(url);
        data = await response.json();
        console.log(data);
        displayWeather(cityName, currentTemp, currentIcon);
    } catch (error) {
        console.log(error);
    }
}

function Entry(cityName, lat, lon) {
    this.cityName = cityName;
    this.lat = lat;
    this.lon = lon;
}

function displayWeather(cityName, currentTemp, currentIcon) {
    let date = dayjs();
    currentTemp = data.current.temp;
    currentWind = data.current.wind_speed;
    currentHumidity = data.current.humidity;
    currentUV = data.current.uvi;
    currentIcon = data.current.weather[0].icon;
    $("#current-weather").html("");
    $("#forecast").html("");
    $("#current-weather").append(
        `<h2 id='city-and-date'>${cityName} (${date.format(
            "MM/DD/YYYY"
        )}) <img id='current-icon' src='https://openweathermap.org/img/w/${currentIcon}.png'></h2> <h4 id='current-temp'>Temperature: ${currentTemp}&deg;F</h4> <h4 id='current-wind'>Wind: ${currentWind} MPH</h4> <h4 id='current-humidity'>Humidity: ${currentHumidity}%</h4> <h4 id='current-uv'>UV index: ${currentUV}</h4>`
    );
    for (let i = 1; i < 6; i++) {
        date = date.add(1, "day");
        let forecastHigh = Math.round(data.daily[i].temp.max);
        let forecastLow = Math.round(data.daily[i].temp.min);
        let forecastWind = data.daily[i].wind_speed;
        let forecastHumidity = data.daily[i].humidity;
        let forecastIcon = data.daily[i].weather[0].icon;
        $("#forecast").append(
            `<div class="forecast-card"> <h4>${date.format(
                "MM/DD/YYYY"
            )}</h4> <img src='https://openweathermap.org/img/w/${forecastIcon}.png'> <h4>High: ${forecastHigh}&deg;F</h4> <h4>Low: ${forecastLow}&deg;F</h4> <h4>Wind: ${forecastWind} MPH</h4> <h4>Humidity: ${forecastHumidity}%</h4> </div>`
        );
    }
}

$("#search-form").submit(function (e) {
    query = $("#city-search").val();
    $("#city-search").val("");
    e.preventDefault();
    getWeatherData(query);
});

$(".search-item").click(function () {
    query = $(this).text();
    getWeatherData(query);
});
