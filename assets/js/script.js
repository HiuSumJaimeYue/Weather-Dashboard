var userFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var boxTitleEl = document.querySelector("#box-city");
var infoContainerEl = document.querySelector("#info-container");
// var repoContainerEl = document.querySelector("#repos-container");
// var repoSearchTerm = document.querySelector("#repo-search-term");
// var languageButtonsEl = document.querySelector("#language-buttons");

var apiKey = "f3f7d17f109405ec564d7743e0ecdd7c";
// var latitude;
// var longitude;

var getWeatherAPI = function (longitude, latitude) {

    console.log(longitude);
    console.log(latitude);

    // format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,daily" +
        "&units=imperial&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    // console.log(data.current.temp);
                    // var fToC = FahrenheitToCelcius(data.current.temp);
                    // console.log(fToC);
                    displayWeather(data);
                });
            } else {
                alert('Error: Place Not Found on OpenWeatherAPI');
            }
        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeatherAPI");
        });
};
var getGeoAPI = function (place) {
    // format the OpenWeather Geo api url
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + place
        + "&limit=1&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);
                    //set longitude and latitude
                    var longitude = data[0].lon;
                    var latitude = data[0].lat;
                    console.log(longitude);
                    console.log(latitude);
                    getWeatherAPI(longitude, latitude);
                });
            } else {
                alert('Error: Place Not Found on OpenWeatherGEOAPI');
            }
        })
        .catch(function (error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeatherGEOAPI");
        });
}
var displayWeather = function (weatherData) {
    // box.style.display = 'flex';
    //Clear old p
    infoContainerEl.innerHTML = "";
    var fToC = FahrenheitToCelcius(weatherData.current.temp);
    console.log(fToC);

    //might add display:block and none 
    boxTitleEl.textContent = "Search City";
    var infoPEl = document.createElement("p");
    infoPEl.textContent = "Temp: " + fToC + " °C";
    infoContainerEl.append(infoPEl);
}

var FahrenheitToCelcius = function (fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}
getGeoAPI("Ottawa");
// getWeatherAPI();
