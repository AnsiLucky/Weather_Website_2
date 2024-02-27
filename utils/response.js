const { OPEN_WEATHER_API, WEATHER_API, CITY_API, CITY_API_DEV_ME } = require('../config/api');

async function getAllInfo(city, lang) {
  if (!city) {
    return { error: 'The city parameter is required' };
  }

  try {
    const [current, forecast3Hours, forecast14Days, cityInfo] = await Promise.all([
      getCurrentWeather(city, lang),
      getThreeHours(city, lang),
      // getExtendedForecast(city, lang), 
      getFiftyDaytVisualCrossing(city, lang),
      getCityInfoDevMe(city, lang),
      // getCityInfo(city, lang),
    ]);

    return {
      current,
      forecast3Hours,
      forecast14Days,
      cityInfo,
      timestamp: Date.now(),
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function getFiftyDaytVisualCrossing(city, lang) {
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=8UYU2P2TNFAKFXZHKUJFC78DR&lang=${lang}`;
  const data = await dataByLink(apiUrl);
  
  return data.days.map(day => 
    getVisualCrossingApiDict(day, data)
  );
}


// Routes
async function getCurrentWeather(city, lang) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_API}&units=metric&lang=${lang}`;
  const data = await dataByLink(apiUrl);

  return getOpenWeatherApiDict(data.list[0], data.city);
}

async function  getThreeHours(city, lang) {
  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${city}&days=1&aqi=no&alerts=no&lang=${lang}`;
  const data = await dataByLink(apiUrl);
  const now = Date.now();
  
  return data.forecast.forecastday[0].hour
    .filter(hour => hour.time_epoch * 1000 > now)
    .slice(0, 3) 
    .map(hour => getWeatherApiDict(hour));
}

async function  getExtendedForecast(city, lang) {
  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${city}&aqi=no&days=14&lang=${lang}`;
  const data = await dataByLink(apiUrl);
  
  return data.forecast.forecastday.map(day => 
    getWeatherApiDict(day.day, day.date_epoch)
  );
}

async function getCityInfo(city, lang) {
  const apiUrl = `https://api.api-ninjas.com/v1/city?name=${city}`;
  const data = await dataByLink(apiUrl, {headers: {"X-Api-Key": CITY_API}});

  return getCityInfoDict(data[0]);
}

function getCityInfoDict(data) {
  if (data == undefined) return {name: null, latitude: null, longitude: null, country: null,population: null,is_capital: null  };
  const { name, latitude, longitude, country, population, is_capital } = data;
  return { name, latitude, longitude, country, population, is_capital };
}

async function getCityInfoDevMe(city, lang) {
  const apiUrl = `https://dev.me/api/module-app/v1-get-city-details?name=${city}`;
  const data = await dataByLink(apiUrl, {headers: {"X-Api-Key": CITY_API_DEV_ME}});
  console.log(data);
  return getCityInfoDictDevMe(data);
}

function getCityInfoDictDevMe(data) {
  if (data == undefined) return {name: null, latitude: null, longitude: null, countryName: null  };
  const { name, latitude, longitude, countryName } = data;
  return { name, latitude, longitude, countryName };
}

function getVisualCrossingApiDict(data, cityData) {
  const result = {
    Epoch: data.datetimeEpoch,
    Temperature: data.temp,
    Min_Temperature: data.tempmin,
    Max_Temperature: data.tempmax,
    Feels: data.feelslike,
    Weather: data.description || data.conditions,
    WindSpeed: data.windspeed,
    Humidity: data.humidity,
    Pressure: data.pressure,
  };
  if (cityData !== undefined) {
    result.City = cityData.address;
    result.Country = cityData.resolvedAddress;
    result.Latitude = cityData.latitude;
    result.Longitude = cityData.longitude;
  }

  return result;
}

function getWeatherApiDict(data, epoch) {
  const { time_epoch, temp_c, avgtemp_c, mintemp_c, maxtemp_c, maxwind_mph, wind_mph, avghumidity, humidity, condition } = data;
  data = {
    Epoch: epoch || time_epoch,
    Temperature: avgtemp_c || temp_c,
    WindSpeed: maxwind_mph || wind_mph,
    Humidity: avghumidity || humidity,
    Weather: condition.text,
    Icon: `https:${condition.icon}`,
  };
  if (mintemp_c != undefined) data.Min_Temperature = mintemp_c;
  if (maxtemp_c != undefined) data.Max_Temperature = maxtemp_c;

  return data
}

function getOpenWeatherApiDict(data, cityData) {
  const { dt, main, weather, wind } = data;
  const result = {
    Epoch: dt,
    Temperature: main.temp,
    Min_Temperature: main.temp_min,
    Max_Temperature: main.temp_max,
    Feels: main.feels_like,
    Weather: weather[0].description,
    WindSpeed: wind.speed,
    Humidity: main.humidity,
    Pressure: main.pressure,
    Icon: `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
  };
  if (cityData !== undefined) {
    result.City = cityData.name;
    result.Country = cityData.country;
    result.Latitude = cityData.coord.lat;
    result.Longitude = cityData.coord.lon;
  }

  return result;
}

async function dataByLink(link, option) {
  let data;
  await fetch(link, option)
  .then((response) => response.json())
  .then((responseData) => {
    data = responseData;
  })
  .catch((error) => console.log(error));

  return data;
}

module.exports = { getAllInfo, getFiftyDaytVisualCrossing }
