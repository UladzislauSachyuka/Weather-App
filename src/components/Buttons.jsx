import "../styles/Buttons.css"

function Buttons({ activeButton, handleButtonClick }) {
  return (
    <div className="buttonsContainer"> 
      <button 
        className={`button ${activeButton === "daily" ? "active" : ""}`}
        onClick={() => handleButtonClick("daily")}
      >
        Daily
      </button>
      <button 
        className={`button ${activeButton === "hourly" ? "active" : ""}`} 
        onClick={() => handleButtonClick("hourly")}
      >
        Hourly
      </button>
    </div>
  );
}

export default Buttons;