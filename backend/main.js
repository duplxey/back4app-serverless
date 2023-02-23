const axios = require("axios");

const WEATHER_API_BASE = "https://api.weatherapi.com/v1/current.json?key=354fc376a4ca42ee9f0145604222212";
const WEATHER_API_LOCATIONS = ["sunnyvale", "mountain view"];

Parse.Cloud.define("weatherLocations", async (request) => {
  return WEATHER_API_LOCATIONS;
});

Parse.Cloud.define("weatherCapture", async (request) => {
  let location = request.params.location;

  if (!location) {
    throw new Parse.Error(400, "Location not provided.");
  }

  if (!WEATHER_API_LOCATIONS.includes(location.toLowerCase())) {
    throw new Parse.Error(400, "Location not allowed.");
  }

  try {
    const response = await axios.get(WEATHER_API_BASE + "&q=" + request.params.location + "&aqi=no");
    const currentWeather = response.data.current.condition;

    const WeatherRecord = Parse.Object.extend("WeatherRecord");
    const weatherRecord = new WeatherRecord();
    weatherRecord.set("location", location);
    weatherRecord.set("weatherText", currentWeather.text);
    weatherRecord.set("weatherIcon", "https://" + currentWeather.icon.replace("//", "").replace("64x64", "128x128"));
    weatherRecord.set("weatherCode", currentWeather.code + "");
    weatherRecord.save();

    return "New WeatherRecord for " + location + " has been added.";
  } catch (error) {
    throw new Parse.Error(400, error);
  }
});

Parse.Cloud.define("weatherInfo", async (request) => {
  let location = request.params.location;

  if (!location) {
    throw new Parse.Error(400, "Location not provided.");
  }

  if (!WEATHER_API_LOCATIONS.includes(location.toLowerCase())) {
    throw new Parse.Error(400, "Location not allowed.");
  }

  const WeatherRecord = Parse.Object.extend("WeatherRecord");
  const query = new Parse.Query(WeatherRecord);
  query.equalTo("location", location);
  query.descending("createdAt");
  query.limit(5);
  const results = await query.find();

  return results;
});