import React, { useState } from "react";

export default function App() {
    const [city, setCity] =  useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

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

            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=metric&appid=ae029cb811481ddb940e2f9d2d1255c1`
            )

            const data = await res.json();

            if (res.ok){
                setWeather(data);
            } else {
                setError(data.message);
            }
        } catch (err){
            setError("Something went wrong.");
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "50px auto", fontFamily: "Arial"}}>
            <h1>Weather App</h1>

            <input
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={handleInputChange}
                style={{ padding: "10px", width: "70%"}}
            />

            <button 
                onClick={fetchWeather}
                style={{ padding: "10px 15px", marginLeft: 10}}
                >
                Search
            </button>

            {error && <p style={{color: "red"}}>{error}</p>}

            {weather?.main && (
                <div style={{marginTop: 20}}>
                    <h2>{weather.name}</h2>
                    <p>Tempreture: {weather.main.temp} Celcius</p>
                    <p>Condition weather: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}</p>
                </div>
            )}
        </div>
    );
}
