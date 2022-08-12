//API Key for WeatherAPI and GeoWeatherAPI
var apiKey = "f3f7d17f109405ec564d7743e0ecdd7c";
var cityList = [];

var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");

var weatherInfoEl = document.querySelector("#weather-Info");
var wrongCityMsgEl = document.querySelector("#wrong-city-msg");
var boxEl = document.querySelector("#box-container");
var boxTitleEl = document.querySelector("#box-city");
var infoContainerEl = document.querySelector("#info-container");
var cardsContainerEl = document.querySelector("#cards-container");
var card5DaysContainerEl = document.querySelector("#card-5-Day");
var cityButtonsEl = document.querySelector("#city-buttons");

//get value from input element for city
function formSubmit(event) {
    event.preventDefault();

    var cityInput = cityInputEl.value.trim();
    if (cityInput) {
        //show results
        getGeoAPI(cityInput);

        // clear old content
        cityInputEl.value = "";
    }
}

var buttonClickHandler = function (event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getGeoAPI(city);
    }
}

//get WeatherAPI
var getWeatherAPI = function (longitude, latitude, cityName) {
    // format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely" +
        "&units=imperial&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data, cityName);
                    //If not in List, add to List 
                    if (!cityList.includes(cityName)) {
                        cityList.push(cityName);

                        //save into localStorage
                        localStorage.setItem("City history", JSON.stringify(cityList));

                        //create Button for city
                        createCityButton(cityName);
                    }
                });
            } else {
                alert('Error: Place Not Found on OpenWeatherAPI');
            }
        })
        .catch(function (error) {
            // Alert when error
            alert("Unable to connect to OpenWeatherAPI");
        });
};

//get GeoWeatherAPI to take longitude and latitude for getWeatherAPI
var getGeoAPI = function (place) {
    // format the OpenWeather Geo api url
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + place
        + "&limit=1&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request successful
            if (response.ok) {
                response.json().then(function (data) {
                    //Not a name of a city
                    if (data.length < 1) {
                        //Request to type again
                        askToInputAgain();
                    } else {
                        //set longitude and latitude
                        var longitude = data[0].lon;
                        var latitude = data[0].lat;
                        var citySearch = data[0].name;
                        getWeatherAPI(longitude, latitude, citySearch);
                    }
                });
            } else {
                alert('Error: Place Not Found on OpenWeatherGEOAPI');
            }
        })
        .catch(function (error) {
            // Alert when error
            alert("Unable to connect to OpenWeatherGEOAPI");
        });
}

//display the weather data 
var displayWeather = function (weatherData, city) {
    //show weather info
    weatherInfoEl.style.display = 'block';
    boxEl.style.display = 'block';
    cardsContainerEl.style.display = 'block';
    wrongCityMsgEl.style.display = 'none';

    //Clear old info
    infoContainerEl.innerHTML = "";
    card5DaysContainerEl.innerHTML = "";

    var fToC = FahrenheitToCelcius(weatherData.current.temp);
    var currentDate = moment().format('l');

    var iconWeather = weatherData.current.weather[0].icon;
    var iconSrc = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";

    var iconImg = document.createElement('img');
    iconImg.src = iconSrc;
    iconImg.alt = "weatherIcon";
    iconImg.classList.add("weatherImg");

    boxTitleEl.textContent = city + " (" + currentDate + ") ";
    boxTitleEl.appendChild(iconImg);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + fToC + " °C";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    var HumidityEl = document.createElement("p");
    HumidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %";

    var uvIndexEl = document.createElement("p");
    var uvIndexcolorEl = document.createElement("span");
    var uvIndex = weatherData.current.uvi;
    uvIndexcolorEl.textContent = uvIndex;

    //Compare and put in different color
    //whether the conditions are favorable, moderate, or severe
    uvIndexEl.textContent = "UV Index: ";
    if (uvIndex < 3) {
        uvIndexcolorEl.classList.add("favorable");
    }
    else if (uvIndex >= 3 && uvIndex <= 5) {
        uvIndexcolorEl.classList.add("moderate");
    }
    else {
        uvIndexcolorEl.classList.add("severe");
    }

    uvIndexEl.appendChild(uvIndexcolorEl);

    infoContainerEl.append(tempEl, windEl, HumidityEl, uvIndexEl);


    //5-Day Forecast
    for (var i = 0; i < 5; i++) {
        var currentDailyWeather = weatherData.daily[i];

        var card5 = document.createElement("div");
        card5.classList.add("card", "card-5");

        var cardDate = document.createElement("h3");
        var nextDate = moment().add((i + 1), 'days').format('l');
        cardDate.textContent = nextDate;
        cardDate.classList.add("card-title");

        var iconImg2 = document.createElement('img');
        var cardIconWeather = currentDailyWeather.weather[0].icon;
        var iconSrc2 = "http://openweathermap.org/img/wn/" + cardIconWeather + "@2x.png";
        iconImg2.src = iconSrc2;
        iconImg2.alt = "weatherIcon";
        iconImg2.classList.add("weatherImg");

        var cardTempEl = document.createElement("p");
        var cardfToC = FahrenheitToCelcius(currentDailyWeather.temp.day);
        cardTempEl.textContent = "Temp: " + cardfToC + " °C";
        cardTempEl.classList.add("card-text");
        var cardWindEl = document.createElement("p");
        cardWindEl.textContent = "Wind: " + currentDailyWeather.wind_speed + " MPH";
        cardWindEl.classList.add("card-text");
        var cardHumidityEl = document.createElement("p");
        cardHumidityEl.textContent = "Humidity: " + currentDailyWeather.humidity + " %";
        cardHumidityEl.classList.add("card-text");

        card5.append(cardDate, iconImg2, cardTempEl, cardWindEl, cardHumidityEl);

        card5DaysContainerEl.append(card5);
    }
}

//get the temp from Fahrenheit to Celcius
var FahrenheitToCelcius = function (fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}

//Show wrong city msg
var askToInputAgain = function () {
    weatherInfoEl.style.display = 'block';
    wrongCityMsgEl.style.display = 'block';
    boxEl.style.display = 'none';
    cardsContainerEl.style.display = 'none';
}

var createCityButton = function (cityName) {
    var cityBtnEl = document.createElement("button");
    cityBtnEl.classList.add("btn", "btn-secondary");
    cityBtnEl.innerHTML = cityName;
    cityBtnEl.setAttribute("data-city", cityName);
    cityButtonsEl.append(cityBtnEl);
}

cityFormEl.addEventListener("submit", formSubmit);
cityButtonsEl.addEventListener("click", buttonClickHandler);
