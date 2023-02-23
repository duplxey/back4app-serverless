import Image from "next/image";
import {useEffect, useState} from "react";
import Parse from "parse/dist/parse.min.js";

const weatherRecordToState = (record) => {
  return {
    weatherText: record.get("weatherText"),
    weatherIcon: record.get("weatherIcon"),
    weatherCode: record.get("weatherCode"),
    createdAt: record.get("createdAt"),
  };
};

const titleCase = (text) => {
  let splitText = text.toLowerCase().split(" ");
  for (let i = 0; i < splitText.length; i++) {
    splitText[i] = splitText[i].charAt(0).toUpperCase() + splitText[i].substring(1);
  }
  return splitText.join(" ");
};

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function Home() {

  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(0);
  const [currentWeather, setCurrentWeather] = useState({});
  const [weatherHistory, setWeatherHistory] = useState([]);

  useEffect(() => {

    const fetchWeatherLocations = async () => {
      const weatherLocations = await Parse.Cloud.run("weatherLocations");
      setLocations(weatherLocations);
    };

    const fetchWeatherInfo = async () => {
      const weatherInfo = await Parse.Cloud.run("weatherInfo", {"location": locations[location]});

      if (weatherInfo.length === 0) {
        console.error("Data hasn't been collected yet.");
        return;
      }

      setCurrentWeather(weatherRecordToState(weatherInfo[0]));
      let otherWeatherRecords = [];
      for (let i = 1; i < weatherInfo.length; i++) {
        otherWeatherRecords.push(weatherRecordToState(weatherInfo[i]));
      }
      setWeatherHistory(otherWeatherRecords);
    };

    fetchWeatherLocations().then(() => {
      fetchWeatherInfo().catch(console.error);
    }).catch(console.error);

  }, [location]);

  return (
    <>
      {currentWeather && (
        <div className="flex items-center justify-center">
          <div className="flex flex-col justify-center max-w-md">
            <div className="mt-4 mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-green-400 hover:text-green-500 mb-2 duration-200">
                <a href="https://github.com/duplxey/back4app-serverless">back4app-serverless</a>
              </h1>
              <div className="text-gray-600">
                Simple weather station app used to demonstrate how to use Back4app Cloud Code functions.
              </div>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {locations.map((record, index) => (
                <div
                  key={index}
                  className={classNames(
                    "font-semibold px-3 py-2 rounded-md cursor-pointer duration-200",
                    location === index ? "bg-green-400 hover:bg-green-500 text-white" : "bg-slate-100 hover:bg-slate-200"
                  )}
                  onClick={() => setLocation(index)}
                >
                  {titleCase(record)}
                </div>
              ))}
            </div>
            <div className="flex justify-center max-w-128 bg-slate-100 shadow-md rounded-md">
              <Image
                src={currentWeather.weatherIcon}
                alt={currentWeather.weatherText}
                className="max-w-sm p-5"
                width={500} height={500}
              />
            </div>
            {weatherHistory.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-600 mb-1">
                  Previous measurements:
                </h2>
                <div className="flex flex-col gap-4">
                  {weatherHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex justify-between bg-slate-100 shadow-md rounded-md p-2 items-center"
                    >
                      <Image
                        src={record.weatherIcon}
                        alt={record.weatherText}
                        className="object-contain w-16 h-16"
                        width={128} height={128}
                      />
                      <div className="text-md font-semibold text-gray-600">{record.createdAt.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
