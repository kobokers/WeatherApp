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
                    <h1 className="text-xl font-bold">Current Weather</h1>
                </div>
                {weather?.main && (
                <div className="flex flex-col sm:flex-row item-center gap-4">

                    <div className="p-4 bg-white/50 rounded-md flex-1">
                    <h2 className="font-semibold text-2xl mb-2">{weather.name}</h2>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                        alt={weather.weather[0].description}
                        className="w-32 h-32"
                    />
                    <p className="text-4xl font-bold text-center">
                        {Math.round(weather.main.temp)}°C
                    </p>
                    </div>

                    <p className="text-sky-800 text-xl font-semibold text-center">
                        {weather.weather[0].description}
                    </p>
                    </div>

                    <div className="p-4 bg-white/50 rounded-md flex-1">
                    <br></br>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <br></br>
                    <p>Latitude: {weather.coord.lat}</p>
                    <br></br>
                    <p>Longitude: {weather.coord.lon}</p>
                    </div>
                </div>
                )}
            </div>
            <div className="bg-white/20 shadow-lg p-8 rounded-lg shadow-md text-center mt-8 w-full max-w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto">
                <div className="flex flex-row gap-x-4 flex-wrap justify-center">
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
        </div>
    );
}
