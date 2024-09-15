import { useState, useEffect } from 'react'
import { getForecast } from './api/weatherApi';
import './styles/App.css'

function App() {
  const [location, setLocation] = useState("Minsk");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setError(false);
        setLoading(true);
        const data = await getForecast(location);
        setForecast(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setForecast(null);
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location]);

  return (
    <div className="app">
      {loading ? (
        <div className="loadingSpinner">Loading...</div>
      ) : error ? (
        <div className="errorMessage">Location not found</div>
      ) : (
        forecast && (
          <div className="leftBlock">
            <text className="conditionsText">{forecast["days"][0]["conditions"]}</text>
            <div className="searchBox">
              <input
                type='text'
                className='searchBoxInput'
                placeholder='Search Location...'
              />
              <div className='searchIcon'></div>
            </div>
          </div>
        )
      )}
      
    </div>
  );
}

export default App
