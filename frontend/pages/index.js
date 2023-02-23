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
  const [activeLocation, setActiveLocation] = useState(0);
  const [currentWeather, setCurrentWeather] = useState({});
  const [weatherHistory, setWeatherHistory] = useState([]);

  const fetchWeatherLocations = async () => {
    return await Parse.Cloud.run("weatherLocations");
  };

  const fetchWeatherInfo = async (location) => {
    return await Parse.Cloud.run("weatherInfo", {"location": location});
  };

  useEffect(() => {
    fetchWeatherLocations().then((locations) => {
      setLocations(locations);
      fetchWeatherInfo(locations[activeLocation]).then((records) => {
        setCurrentWeather(weatherRecordToState(records[0]));
        let weatherRecords = [];
        for (let i = 1; i < records.length; i++) {
          weatherRecords.push(weatherRecordToState(records[i]));
        }
        setWeatherHistory(weatherRecords);
      }).catch(console.error);
    }).catch(console.error);
  }, [activeLocation]);

  return (
    <>
      {locations.length && currentWeather && (
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
                    activeLocation === index ? "bg-green-400 hover:bg-green-500 text-white" : "bg-slate-100 hover:bg-slate-200"
                  )}
                  onClick={() => setActiveLocation(index)}
                >
                  {titleCase(record)}
                </div>
              ))}
            </div>
            <div className="flex justify-center max-w-128 bg-slate-100 shadow-md rounded-md">
              <img
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
                      <img
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
