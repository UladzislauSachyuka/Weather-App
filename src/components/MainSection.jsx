import { format } from "../utils";
import "../styles/MainSection.css"

function MainSection({ forecast, currentDate, currentTime, inputValue, setInputValue, handleSearch, getWeatherIcon }) {
  return (
    <>
      <p className="conditionsText">{forecast["currentConditions"]["conditions"]}</p>
      <p className="cityText">{forecast["resolvedAddress"].split(',')[0]}</p>
      <p className="dateText">{currentDate}</p>
      <p className="timeText">{currentTime}</p>
      <p className="tempText">{format(forecast["currentConditions"]["temp"]) + " °C"}</p>
      <div className="weatherIcon"> 
        {getWeatherIcon(forecast["currentConditions"]["icon"])}
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
    </>
  );
}

export default MainSection;