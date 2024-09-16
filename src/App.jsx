import { useState, useEffect } from 'react'
import { getForecast } from './api/weatherApi';
import SunIcon from './assets/SVG/sun';
import CloudyDayIcon from './assets/SVG/cloudyDay';
import './styles/App.css'

function App() {
  const [location, setLocation] = useState("Minsk");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setError(false);
        setLoading(true);
        const data = await getForecast(location);
        setForecast(data);
        setLoading(false);

        const now = new Date();
        const localTime = getLocalTime(now, data.tzoffset);
        setCurrentDate(formatDate(localTime));
        setCurrentTime(formatTime(localTime));
      } catch (error) {
        setError(true);
        setForecast(null);
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location]);

  const getLocalTime = (date, tzoffset) => {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000; // Преобразуем в UTC
    const localTime = new Date(utcTime + tzoffset * 3600000); // Добавляем смещение часового пояса
    return localTime;
  };

  const handleSearch = () => {
    if (inputValue) {
      setLocation(inputValue);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const daySuffix = (day) => {
      if (day === 1 || day === 21 || day === 31) return 'st';
      if (day === 2 || day === 22) return 'nd';
      if (day === 3 || day === 23) return 'rd';
      return 'th';
    };

    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);

    const year = date.getFullYear();
    const shortYear = year.toString().slice(-2);

    return `${formattedDate.split(" ")[0]}, ${day}${daySuffix(day)} ${date.toLocaleString('en-GB', { month: 'short' })} '${shortYear}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${suffix}`;
    return formattedTime;
  };

  const formatTemp = (temp) => {
    return Math.round(temp);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <SunIcon className="weatherIcon"/>;
      case "Partially cloudy":
        return <CloudyDayIcon className="weatherIcon"/>;
    }
  };

  return (
    <div className="app">
      {loading ? (
        <div className="loadingSpinner">Loading...</div>
      ) : error ? (
        <div className="errorMessage">Location not found</div>
      ) : (
        forecast && (
          <div className="leftBlock">
            <text className="conditionsText">{forecast["currentConditions"]["conditions"]}</text>
            <text className="cityText">{forecast["resolvedAddress"].split(',')[0]}</text>
            <text className="dateText">{currentDate}</text>
            <text className="timeText">{currentTime}</text>
            <text className="tempText">{formatTemp(forecast["currentConditions"]["temp"]) + " °C"}</text>
            <div className="weatherIcon"> 
              {getWeatherIcon(forecast["currentConditions"]["conditions"])}
            </div>
            <div className="searchBox">
              <input
                type="text"
                className="searchBoxInput"
                placeholder="Search Location..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="searchIcon" onClick={handleSearch}></div>
            </div>
          </div>
        )
      )}
      
    </div>
  );
}

export default App
