import RainIcon from '../assets/SVG/rain';
import TempIcon from '../assets/SVG/temp';
import HumidityIcon from '../assets/SVG/humidity';
import WindIcon from '../assets/SVG/wind';
import { format } from '../utils';
import "../styles/IndicatorsSection.css"

function IndicatorsSection({ forecast }) {
  return (
    <> 
      <div className="row">
        <div className="rightIcon">
          <TempIcon />
        </div>
        <div className="indicator"> 
          <p className="rightText">Feels like</p>
          <p className="indicatorText">{format(forecast["currentConditions"]["feelslike"]) + " °C"}</p>
        </div>
      </div>
      <div className="row">
        <div className="rightIcon"> 
          <HumidityIcon />
        </div>
        <div className="indicator">
          <p className="rightText">Humidity</p>
          <p className="indicatorText">{format(forecast["currentConditions"]["humidity"]) + " %"}</p>
        </div>
      </div>
      <div className="row">
        <div className="rightIcon"> 
          <RainIcon />
        </div>
        <div className="indicator">
          <p className="rightText">Chance of Rain</p>
          <p className="indicatorText">{forecast["currentConditions"]["precipprob"] + " %"}</p>
        </div>
      </div>
      <div className="row">
        <div className="rightIcon"> 
          <WindIcon />
        </div>
        <div className="indicator">
          <p className="rightText">Wind Speed</p>
          <p className="indicatorText">{forecast["currentConditions"]["windspeed"] + " km/h"}</p>
        </div>
      </div>
    </>
  );
}

export default IndicatorsSection;