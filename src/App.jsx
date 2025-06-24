import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import sunny from './Asset/Sunny.json';
import rain from './Asset/Raining.json';
import cloudy from './Asset/Cloudy.json';
import thunder from './Asset/ThunderStorm.json';
import partlyrain from './Asset/PartlyRaining.json';
import humidity from './Asset/Humidity.json';
import windspeed from './Asset/windspeed.json';
import pressure from './Asset/Pressure.json';
import feels from './Asset/Temp.json';

export default function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => setCity(e.target.value);

    const getWeatherIcon = (condition) => {
        if (condition.includes('Clear')) return sunny;
        if (condition.includes('Partly') || condition.includes('Cloud'))
            return cloudy;
        if (condition.includes('Rain')) return rain;
        if (condition.includes('Thunder')) return thunder;
        if (condition.includes('Drizzle')) return partlyrain;
        return cloudy;
    };

    const fetchWeather = async () => {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
            setError('Please enter a city name.');
            return;
        }

        setLoading(true);
        setError('');
        setWeather(null);
        setForecast([]);

        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=50520c6face84d1bbbe123423252406&q=${trimmedCity}&days=3&aqi=yes&alerts=no`
            );
            const data = await res.json();

            if (res.ok || data.location) {
                setWeather(data);
                setForecast(data.forecast.forecastday);
            } else {
                setError(data.error?.message || 'City not found.');
            }
        } catch {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-b from-blue-400 to-white flex flex-col p-10">
            {/* Search Input */}
            <div className="bg-white/20 shadow-lg p-8 rounded-lg w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <h1 className="mb-4 text-4xl font-bold">Weather App</h1>
                <div className="flex justify-center">
                    <input
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className="border border-stone-950 p-2 rounded-l-lg w-full"
                    />
                    <button
                        onClick={fetchWeather}
                        className="rounded-r-lg bg-sky-400 hover:bg-blue-600 text-white p-2.5"
                    >
                        Search
                    </button>
                </div>
                {loading && <p className="mt-4">Loading...</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>

            {/* Current Weather */}
            {weather && (
                <div className="bg-white/20 shadow-lg p-4 mt-4 rounded-md w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Left Panel */}
                        <div className="p-4 bg-white/50 rounded-md flex-1">
                            <h3 className="font-semibold text-2xl mb-2">
                                {weather.location.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Lottie
                                    animationData={getWeatherIcon(weather.current.condition.text)}
                                    className="w-28 h-28"
                                />
                                <p className="text-4xl font-bold text-center">
                                    {Math.round(weather.current.temp_c)}°C
                                </p>
                            </div>
                            <p className="text-center text-sky-800 text-xl font-semibold mt-2">
                                {weather.current.condition.text}
                            </p>
                        </div>

                        {/* Right Panel */}
                        <div className="p-4 bg-white/50 rounded-md flex-1 text-xl space-y-4">
                            <div className="flex items-center gap-2">
                                <Lottie animationData={feels} className="w-8 h-8" />
                                <p>Feels Like: {weather.current.feelslike_c}°C</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lottie animationData={humidity} className="w-8 h-8" />
                                <p>Humidity: {weather.current.humidity}%</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lottie animationData={pressure} className="w-8 h-8" />
                                <p>Pressure: {weather.current.pressure_mb} hPa</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lottie animationData={windspeed} className="w-8 h-8" />
                                <p>Wind: {weather.current.wind_kph} kph</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*add checking if data not null*/}
            {weather?.current && (
                <div className="bg-white/20 shadow-lg p-4 mt-4 rounded-md w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                    <h3 className="text-xl font-bold mb-2">Air Quality</h3>
                    <p>PM2.5: {weather.current.air_quality.pm2_5.toFixed(2)}</p>
                    <p>PM10: {weather.current.air_quality.pm10.toFixed(2)}</p>
                    <p>CO: {weather.current.air_quality.co.toFixed(2)}</p>
                    <p>NO₂: {weather.current.air_quality.no2.toFixed(2)}</p>
                    <p>O₃: {weather.current.air_quality.o3.toFixed(2)}</p>
                    <p>SO₂: {weather.current.air_quality.so2.toFixed(2)}</p>
                </div>
            )}

            {/* Map */}
            {weather && (
                <div className="shadow-md w-full md:max-w-[70%] lg:max-w-[50%] mx-auto mt-6 h-[300px]">
                    <MapContainer
                        center={[weather.location.lat, weather.location.lon]}
                        zoom={10}
                        scrollWheelZoom={false}
                        className="h-[300px] w-full"
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[weather.location.lat, weather.location.lon]} />
                    </MapContainer>
                </div>
            )}

            {/* 3-Day Forecast */}
            {forecast.length > 0 && (
                <div className="bg-white/20 shadow-lg p-8 rounded-lg mt-8 w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                    <h2 className="text-xl font-bold mb-4">3-Day Forecast</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {forecast.map((day, index) => (
                            <div
                                key={index}
                                className="bg-blue-300 p-4 rounded-xl shadow-md w-36"
                            >
                                <p className="font-semibold">
                                    {new Date(day.date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                                <p className="text-lg">↑ {day.day.maxtemp_c}°C</p>
                                <p className="text-lg">↓ {day.day.mintemp_c}°C</p>
                                <p className="text-sm text-gray-700">
                                    {day.day.condition.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
