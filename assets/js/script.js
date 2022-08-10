var apiKey = "f3f7d17f109405ec564d7743e0ecdd7c";
// var latitude;
// var longitude;

var getWeatherAPI = function (longitude, latitude) {

    console.log(longitude);
    console.log(latitude);

    // format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?" +
        "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,daily"+
        "&units=imperial&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.current.temp);
                    var fToC = FahrenheitToCelcius(data.current.temp);
                    console.log(fToC);
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

var FahrenheitToCelcius = function(fahrenheit){
    return ((fahrenheit - 32) * 5 /9).toFixed(2); 
}
getGeoAPI("Ottawa");
// getWeatherAPI();
