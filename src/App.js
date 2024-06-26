import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

const App = () => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [cityDetails, setCityDetails] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "1635890035cbba097fd5c26c8ea672a1";

  const handleFetchWeather = async () => {
    try {
      const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      setCityDetails(response.data.city);
      setWeatherData(processWeatherData(response.data.list));
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch weather data. Please check the latitude and longitude values."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchWeather();
  };

  const processWeatherData = (data) => {
    const days = {};
    data.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString("en-GB");
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(item);
    });
    return Object.entries(days).slice(0, 5);
  };

  return (
    <div className="container">
      <h1>Weather Data Fetcher</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Latitude:
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            required
          />
        </label>
        <button type="submit">Fetch Weather</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {cityDetails && (
        <div className="city-details">
          <h2>
            City: {cityDetails.name}, Country: {cityDetails.country}
          </h2>
          <p>
            Latitude: {cityDetails.coord.lat}, Longitude:{" "}
            {cityDetails.coord.lon}
          </p>
        </div>
      )}

      {weatherData.length > 0 &&
        weatherData.map(([date, items], index) => (
          <div key={index} className="day-weather">
            <h3>Weather for {date}</h3>
            <div className="weather-tables">
              {items.slice(0, 4).map((item, subIndex) => (
                <table key={subIndex} className="weather-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Temperature (°C)</th>
                      <th>Feels Like (°C)</th>
                      <th>Humidity (%)</th>
                      <th>Pressure (hPa)</th>
                      <th>Weather</th>
                      <th>Wind Speed (m/s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{item.dt_txt}</td>
                      <td>{(item.main.temp - 273.15).toFixed(2)}</td>
                      <td>{(item.main.feels_like - 273.15).toFixed(2)}</td>
                      <td>{item.main.humidity}</td>
                      <td>{item.main.pressure}</td>
                      <td>{item.weather[0].description}</td>
                      <td>{item.wind.speed}</td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default App;
