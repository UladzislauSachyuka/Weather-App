export const getForecast = async ( city ) => {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=7ZPGW99A4CLSNTPHQTF7XYGEA&contentType=json`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};