const axios = require("axios");

const WEATHER_API_BASE = "https://api.weatherapi.com/v1/current.json?key=<api_key>";

Parse.Cloud.define("weatherLocations", async (request) => {
  const WeatherStation = Parse.Object.extend("WeatherStation");
  const weatherStationQuery = new Parse.Query(WeatherStation);
  const weatherStationResults = await weatherStationQuery.find();

  return weatherStationResults.map(result => result.get("location"))
});

Parse.Cloud.define("weatherInfo", async (request) => {
  let location = request.params.location;

  if (!location) {
    throw new Parse.Error(400, "Location not provided.");
  }

  const WeatherStation = Parse.Object.extend("WeatherStation");
  const weatherStationQuery = new Parse.Query(WeatherStation);
  weatherStationQuery.equalTo("location", location);
  const weatherStationResults = await weatherStationQuery.find();

  if (weatherStationResults.length === 0) {
    throw new Parse.Error(400, "Invalid location.");
  }

  const WeatherRecord = Parse.Object.extend("WeatherRecord");
  const weatherRecordQuery = new Parse.Query(WeatherRecord);
  weatherRecordQuery.equalTo("weatherStation", weatherStationResults[0]);
  weatherRecordQuery.descending("createdAt");
  weatherRecordQuery.limit(5);
  return await weatherRecordQuery.find();
});

Parse.Cloud.job("weatherCapture", async (request) =>  {
  const { params, headers, log, message } = request;
  message("weatherCapture just started...");

  const WeatherStation = Parse.Object.extend("WeatherStation");
  const weatherStationQuery = new Parse.Query(WeatherStation);
  const weatherStationResults = await weatherStationQuery.find();

  for (let i = 0; i < weatherStationResults.length; i++) {
    let weatherStation = weatherStationResults[i];

    try {
      const response = await axios.get(
        WEATHER_API_BASE + "&q=" + weatherStation.get("location") + "&aqi=no"
      );
      const currentWeather = response.data.current.condition;
      let icon = currentWeather.icon
        .replace("//", "https://")
        .replace("64x64", "128x128");

      const WeatherRecord = Parse.Object.extend("WeatherRecord");
      const weatherRecord = new WeatherRecord();
      weatherRecord.set("weatherStation", weatherStation);
      weatherRecord.set("weatherText", currentWeather.text);
      weatherRecord.set("weatherIcon", icon);
      weatherRecord.set("weatherCode", currentWeather.code);
      weatherRecord.save();
    } catch (error) {
      throw new Parse.Error(400, error);
    }
  }

  message("weatherCapture just finished!");
});