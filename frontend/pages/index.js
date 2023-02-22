import Image from "next/image";
import {useState} from "react";

const weatherStyles = {
  sunny: {
    color: "bg-amber-400",
    image: "/weather/sunny.png",
  },
  rainy: {
    color: "bg-sky-400",
    image: "/weather/rainy.png",
  },
  snowy: {
    color: "bg-zinc-400",
    image: "/weather/snowy.png",
  }
};

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function Home() {

  const [currentWeather, setCurrentWeather] = useState({
    weather: "sunny",
    capturedAt: 1677079560
  });
  const [weatherHistory, setWeatherHistory] = useState([
    {weather: "sunny", capturedAt: 1677079560},
    {weather: "rainy", capturedAt: 1677079560},
    {weather: "snowy", capturedAt: 1677079560},
    {weather: "sunny", capturedAt: 1677079560},
  ]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-center ">
        <h1 className="flex justify-center text-3xl text-gray-900 font-bold my-2">
          New York
        </h1>
        <div className={classNames("flex justify-center w-128 shadow-md rounded-md", weatherStyles[currentWeather.weather].color)}>
          <Image src={weatherStyles[currentWeather.weather].image} alt={weatherStyles[currentWeather.weather]} className="max-w-sm p-5" width={500} height={500}/>
        </div>
        <div className="mt-2">
          <h2 className="text-lg font-bold text-gray-600 mb-1">
            Previous:
          </h2>
          <div className="flex flex-row justify-center gap-4">
            {weatherHistory.map((record, index) => (
              <div className={classNames("w-24 h-24 shadow-md rounded-md p-5", weatherStyles[record.weather].color)} key={index}>
                <Image src={weatherStyles[record.weather].image} alt={record.weather} className="object-contain" width={128} height={128}/>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-center my-2">(Data last fetched at 22/02/2023 16.22)</p>
      </div>
    </div>
  );
}
