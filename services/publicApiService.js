// Public API Service - Using free Indonesian APIs
// Using data.bmkg.go.id for weather and other Indonesian public APIs

const BMKG_API_BASE = 'https://data.bmkg.go.id/DataMKG/TEWS';
const PROVINCES_API = 'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json';

/**
 * Get earthquake data from BMKG
 * @returns {Promise<Array>} List of recent earthquakes
 */
export const getEarthquakeData = async () => {
  try {
    const response = await fetch(`${BMKG_API_BASE}/autogempa.json`);
    const data = await response.json();
    return {
      success: true,
      data: data.Infogempa.gempa
    };
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Get list of Indonesian provinces
 * @returns {Promise<Array>} List of provinces
 */
export const getProvinces = async () => {
  try {
    const response = await fetch(PROVINCES_API);
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get weather warning from BMKG
 * @returns {Promise<Object>} Weather warning data
 */
export const getWeatherWarning = async () => {
  try {
    // Using BMKG cuaca API
    const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/cuaca.json');
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching weather warning:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Get Indonesian holiday data (dummy for now - can integrate with real API)
 * @returns {Promise<Array>} List of holidays
 */
export const getHolidays = async () => {
  try {
    // This is a simple implementation
    // You can replace with actual API like api-harilibur.vercel.app
    const currentYear = new Date().getFullYear();
    const response = await fetch(`https://api-harilibur.vercel.app/api?year=${currentYear}`);
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get COVID-19 data for Indonesia (using public API)
 * @returns {Promise<Object>} COVID-19 statistics
 */
export const getCovidData = async () => {
  try {
    const response = await fetch('https://disease.sh/v3/covid-19/countries/indonesia');
    const data = await response.json();
    return {
      success: true,
      data: {
        country: data.country,
        cases: data.cases,
        todayCases: data.todayCases,
        deaths: data.deaths,
        todayDeaths: data.todayDeaths,
        recovered: data.recovered,
        active: data.active,
        updated: new Date(data.updated).toLocaleString('id-ID')
      }
    };
  } catch (error) {
    console.error('Error fetching COVID data:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export default {
  getEarthquakeData,
  getProvinces,
  getWeatherWarning,
  getHolidays,
  getCovidData
};
