const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  City: {type: String},
  Country: {type: String},
  Latitude: {type: Number},
  Longitude: {type: Number},
  Epoch: {type: Number},
  Temperature: { type: Number },
  Min_Temperature: { type: Number},
  Max_Temperature: { type: Number},
  Feels: { type: String },
  Weather: { type: String },
  WindSpeed: { type: String },
  Humidity: { type: String },
  Pressure: { type: String },
  Weather: { type: String },
  Icon: { type: String },
});

// OpenWeather:

//   City: city.name
//   Country: city.country
//   Coordination_lat: city.lat
//   Coordination_lon: city.lon

//   Temperature: list.main.temp
//   Min_Temperature: list.main.temp_min
//   Max_Temperature: list.main.temp_max
//   Feels: list.main.feels_like
//   Weather: list.weather.main
//   WindSpeed: list.wind.speed
//   Humidity: list.main.humidity
//   Pressure: list.main.pressure
//   Weather: list.weather.main
//   Icon: list.weather.icon


// WeatherAPI

//   City: location.name
//   Country: location.country
//   Coordination_lat: location.lat
//   Coordination_lon: location.lon

//   Temperature: forecast.forecastday.day.maxtemp_c
//   Min_Temperature: forecast.forecastday.day.mintemp_c
//   Max_Temperature: forecast.forecastday.day.maxtemp_c
//   Feels: 
//   Weather: 
//   WindSpeed: forecast.forecastday.day.maxwind_mph
//   Humidity: forecast.forecastday.day.avghumidity
//   Pressure: 
//   Weather: forecast.forecastday.day.condition.text
//   Icon: forecast.forecastday.day.condition.icon