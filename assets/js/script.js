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
        "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely" +
        "&units=imperial&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
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
                    // console.log(longitude);
                    // console.log(latitude);
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


    var currentDate = moment().format('l');
    console.log(currentDate);
    // var nextDate = moment().add(1, 'days').format('l');  
    // console.log(nextDate);

    //might add display:block and none 
    var iconWeather = weatherData.current.weather[0].icon;
    console.log(iconWeather);
    var iconSrc = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";

    var iconImg = document.createElement('img');
    iconImg.src = iconSrc;
    iconImg.alt = "weatherIcon";

    boxTitleEl.textContent = "Search City " + "(" + currentDate + ") ";
    boxTitleEl.appendChild(iconImg);

    // uvIndexEl.innerHTML = "UV Index:  <span>" + uvIndex + "</span>";
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + fToC + " °C";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    var HumidityEl = document.createElement("p");
    HumidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %";
    var uvIndexEl = document.createElement("p");

    var uvIndex = weatherData.current.uvi;
    //Compare and put in different color
    //whether the conditions are favorable, moderate, or severe

    uvIndexEl.innerHTML = "UV Index:  <span>" + uvIndex + "</span>";

    infoContainerEl.append(tempEl, windEl, HumidityEl, uvIndexEl);
}

var FahrenheitToCelcius = function (fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}
getGeoAPI("London");
// getWeatherAPI();
