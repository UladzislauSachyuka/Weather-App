import { useState, useEffect, act } from 'react'
import { getForecast } from './api/weatherApi';
import { format } from './utils';
import IndicatorsSection from './components/IndicatorsSection';
import MainSection from './components/MainSection';
import Buttons from './components/Buttons';
import SunIcon from './assets/SVG/sun';
import MoonIcon from './assets/SVG/moon';
import CloudyDayIcon from './assets/SVG/cloudyDay';
import CloudyNightIcon from './assets/SVG/cloudyNight';
import CloudyIcon from './assets/SVG/cloudy';
import RainIcon from './assets/SVG/rain';
import SnowIcon from './assets/SVG/snow';
import ThunderIcon from './assets/SVG/thunder';
import './styles/App.css'

function App() {
  const [location, setLocation] = useState("Minsk");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [activeButton, setActiveButton] = useState("daily");

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

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const renderHourlyForecast = () => {
    const now = new Date();
    const localTime = getLocalTime(now, forecast.tzoffset);
    const startHour = localTime.getHours();
  
    const currentDayHours = forecast.days[0].hours.slice(startHour);
    const nextDayHours = forecast.days[1].hours;
  
    const remainingHoursNeeded = 24 - currentDayHours.length;
  
    const hourlyForecast = currentDayHours.concat(nextDayHours.slice(0, remainingHoursNeeded));
  
    const hoursArray = Array.from({ length: 24 }, (_, index) => (startHour + index) % 24);
  
    return (
      <div className="forecastContainer">
        {hourlyForecast.map((hour, index) => {
          const hourTime = hoursArray[index] + ":00";

          return (
            <div className="forecastCard" key={index}>
              <p className="forecastDay">{hourTime}</p>
              <p className="forecastTemp">{format(hour.temp)} °C</p>
              <div className="forecastIcon">
                {getWeatherIcon(hour.icon)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case "clear-day":
        return <SunIcon />
      case "clear-night":
        return <MoonIcon />
      case "cloudy":
        return <CloudyIcon />
      case "partly-cloudy-day":
        return <CloudyDayIcon />
      case "partly-cloudy-night":
        return <CloudyNightIcon />
    }
  }

  return (
    <div className="app">
      {loading ? (
        <div className="loadingSpinner">Loading...</div>
      ) : error ? (
        <div className="errorMessage">Location not found</div>
      ) : (
        forecast && (
          <div> 
            <div className="topContainer"> 
              <div className="leftBlock"> 
                <MainSection 
                  forecast={forecast} 
                  currentDate={currentDate}
                  currentTime={currentTime}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleSearch={handleSearch}
                  getWeatherIcon={getWeatherIcon} 
                />
              </div>
              <div className="rightBlock"> 
                <IndicatorsSection forecast={forecast}/>
              </div>
            </div>
            <div className="bottomContainer">
              <Buttons activeButton={activeButton} handleButtonClick={handleButtonClick}/>
              {activeButton === "daily" ? (
                <div className="forecastContainer">
                  {forecast["days"].slice(0, 10).map((day, index) => {
                    const dayOfWeek = new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'long' });
                    
                    return (
                      <div className="forecastCard" key={index}>
                        <p className="forecastDay">{dayOfWeek}</p>
                        <p className="forecastTemp">{format(day["tempmax"])} °C</p>
                        <p>{format(day["tempmin"])} °C</p>
                        <div className="forecastIcon">
                          {getWeatherIcon(day["icon"])}
                        </div>
                      </div>
                    );
                  })} 
                </div>
              ) : (
                renderHourlyForecast()
              )}
            </div>
          </div>
        )
      )}
      
    </div>
  );
}

export default App