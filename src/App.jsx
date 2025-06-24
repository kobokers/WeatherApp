import React, { useState } from "react";
import Lottie from "lottie-react";

import sunny from "./Asset/Sunny.json";
import rain  from "./Asset/Raining.json"
import cloudy from "./Asset/Cloudy.json"
import thunder from "./Asset/ThunderStorm.json";
import partlyrain from "./Asset/PartlyRaining.json";
import humidity from "./Asset/Humidity.json";
import windspeed from "./Asset/windspeed.json";
import pressure from "./Asset/Pressure.json";
import feels from "./Asset/Temp.json";
import { Map } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
 
export default function App() {
    const [city, setCity] =  useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [forecast, setForecast] = useState([]);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    function getWeatherCondition(condition) {
    const lower = condition.toLowerCase();
    if (lower.includes("thunder")) return thunder;
    if (lower.includes("rain")) return rain;
    if (lower.includes("cloud")) return cloudy;
    if (lower.includes("clear") || lower.includes("sunny")) return sunny;
    return partlyrain;
    }

    const fetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
        setError("Please enter a city");
        return;
    }

    try {
        setError("");
        setWeather(null);
        setForecast([]);
        setLoading(true);

        const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=50520c6face84d1bbbe123423252406&q=${trimmedCity}&days=7&aqi=no&alerts=no`
        );
        const data = await res.json();

        if (res.ok || data.location) {
        setWeather(data); // contains current + location
        setForecast(data.forecast.forecastday); // daily array
        } else {
        setError(data.error?.message || "City not found.");
        }
    } catch (err) {
        setError("Something went wrong.");
    } finally {
        setLoading(false);
    }
    };


    const fetchForecast = async (city) =>{
        try{
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=962b76954dd6927f90622b295ebddcbd`
            );
            const data = await res.json();

            if (res.ok){
                const dailyForecast = data.list
                    .filter(item => item.dt_txt.includes("12:00:00"))
                    .slice(0, 5);
                setForecast(dailyForecast);
            }else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to fetch forecast");
        }
    }

//bug data fetch forecast didnt clear after =citynotfound

    return (
        <div className="w-screen h-screen bg-gradient-to-b from-blue-400 to-white flex flex-col p-10">
            <div className="bg-white/20 shadow-lg p-8 rounded-lg shadow-md w-full max-w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <h1 className="mb-4 text-4xl font-bold">Weather App</h1>

                <div className="flex justify-center">
                    <input
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={handleInputChange}
                        className="border border-stone-950 pr-10 p-2 rounded-l-lg w-full"
                    />

                    <button 
                        onClick={fetchWeather}
                        className="rounded-r-lg bg-sky-400 hover:bg-blue-600 focus:outline-none text-white p-2.5"
                    >
                        Search
                    </button>
                </div>

                {loading && <p className="mt-4">Loading...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
            <div className="bg-white/20 shadow-lg p-4 mt-4 rounded-md w-full max-w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <div className="mb-4">
                    <h1 className="text-3xl font-semibold">Current Weather</h1>
                </div>
                {weather?.current && (
                <div className="flex flex-col sm:flex-row item-center gap-4">

                    <div className="p-4 bg-white/50 rounded-md flex-1">
                    <h2 className="font-semibold text-2xl mb-2">{weather.location.name}</h2>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Lottie
                    animationData={getWeatherCondition(weather.current.condition.text)}
                    className="w-32 h-32"
                    />

                    <p className="text-4xl font-bold text-center">
                        {Math.round(weather.current.temp_c)}°C
                    </p>
                    </div>

                    <p className="text-sky-800 text-xl font-semibold text-center">
                        {weather.current.condition.text}
                    </p>
                    </div>

                    <div className="p-5 bg-white/50 rounded-md flex-1">
                        <div className="flex text-xl">
                            <Lottie  animationData={feels} className="w-10 h-10 pr-1"/>
                            <p className="pt-1.5">Feels Like {weather.current.feelslike_c} °C</p>
                        </div>
                        <div className="flex mt-4 text-xl">
                            <Lottie animationData={humidity} className="w-10 h-10 pr-1"/>
                            <p className="pt-1.5">Humidity: {weather.current.humidity}%</p>
                        </div>
                        <div className="flex mt-4 text-xl">
                            <Lottie animationData={pressure} className="w-10 h-10 pr-1"/> 
                            <p className="pt-1.5">Pressure: {weather.current.pressure_mb} hPa</p>
                        </div>
                        <div className="flex mt-4 text-xl">
                            <Lottie animationData={windspeed} className="w-10 h-10 pr-1"/>
                            <p className="pt-1.5">Windspeed: {weather.current.wind_kph} kph</p>
                        </div>
                    </div>
                </div>
                )}
            </div>
            {weather &&(
                <div className="shadow-md w-full md:max-w-[70%] lg:max-w-[50%] mx-auto mt-6 h-[300px]">
                <MapContainer
                    center={[weather.location.lat, weather.location.lon]}
                    zoom={10}
                    scrollWheelZoom={false}
                    className="h-[300px] w-full z-10">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[weather.location.lat, weather.location.lon]}></Marker>
                </MapContainer>
                </div>
            )}

            <div className="bg-white/20 shadow-lg p-8 rounded-lg shadow-md text-center mt-4 w-full max-w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <div className="flex flex-row gap-x-4 flex-wrap justify-center">
                    {forecast.map((day, index) => (
                    <div key={index} className="bg-blue-300 p-4 rounded-xl text-center shadow-md">
                        <p className="font-semibold">
                        {new Date(day.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })}
                        </p>
                        <p>{Math.round(day.day.avgtemp_c)}°C</p>
                        <p className="text-sm text-grey-600">{day.day.condition.text}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
