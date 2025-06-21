import React, { useState } from "react";

export default function App() {
    const [city, setCity] =  useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [forecast, setForecast] = useState([]);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeather = async () => {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
            setError("Please enter a city");
            return;
        }

        try{
            setError("");
            setWeather(null);
            setLoading(true);

            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=metric&appid=ae029cb811481ddb940e2f9d2d1255c1`
            )

            const data = await res.json();

            if (res.ok){
                setWeather(data);
                fetchForecast(trimmedCity)
            } else {
                setError(data.message);
            }
        } catch (err){
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

    return (
        <div className="w-screen h-screen bg-gradient-to-b from-blue-400 to-white flex flex-col items-center justify-center p-4">
            <div className="bg-white/20 shadow-lg p-8 rounded-lg shadow-md w-full max-w-md text-center">
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

                {weather?.main && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">{weather.name}</h2>
                        <p>Temperature: {weather.main.temp}°C</p>
                        <p>Condition: {weather.weather[0].description}</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Latitude: {weather.coord.lat}</p>
                        <p>Longitude: {weather.coord.lon}</p>
                    </div>
                )}
            </div>
            <div className="bg-white/20 shadow-lg p-8 rounded-lg shadow-md w-full max-w-md text-center">
                {forecast.map((day, index) => (
                    <div key={index}  className="bg-blue-300 p-4 rounded-xl text-center shadow-md">
                        <p className="font-semibold">
                            {new Date(day.dt_txt).toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                        <p>{Math.round(day.main.temp)} Celcius</p>
                        <p className="text-sm text-grey-600">{day.weather[0].description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
