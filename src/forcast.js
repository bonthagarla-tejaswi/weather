import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  // Modified search function using Geocoding API
  const search = (location) => {
    // First, get the coordinates using the geocoding API
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKeys.key}`
      )
      .then((geoResponse) => {
        if (geoResponse.data.length > 0) {
          const { lat, lon } = geoResponse.data[0];

          // Now, fetch weather data using coordinates
          axios
            .get(
              `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}`
            )
            .then((response) => {
              setWeather(response.data);
              setQuery(""); // Reset the input field
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
              setWeather("");
              setQuery("");
              setError({ message: "Weather Data Not Found", query: location });
            });
        } else {
          setError({ message: "Location Not Found", query: location });
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        setError({ message: "Location Not Found", query: location });
      });
  };

  useEffect(() => {
    search("Delhi"); // Default city
  }, []);

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color="white"
          size={112}
          animate={true}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city or village"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search(query)}
              alt="Search Icon"  // Added alt attribute here
            />
          </div>
        </div>
        <ul>
          {typeof weather.main != "undefined" ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"  // Added alt attribute here
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">{Math.round(weather.visibility)} mi</span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forcast;
