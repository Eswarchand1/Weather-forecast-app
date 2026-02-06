const apiKey = '83e2e870974618548e32aa3822ebf02b'; 
const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const dropdownBtn = document.getElementById('dropdownBtn');
const recentCitiesList = document.getElementById('recentCitiesList');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const errorPopup = document.getElementById('errorPopup');
const errorMessage = document.getElementById('errorMessage');
const closeError = document.getElementById('closeError');
const unitToggle = document.getElementById('unitToggle');

// State
let isCelsius = true;
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Event Listeners
searchBtn.addEventListener('click', () => searchWeather(cityInput.value.trim()));
currentLocationBtn.addEventListener('click', getCurrentLocationWeather);
dropdownBtn.addEventListener('click', toggleDropdown);
unitToggle.addEventListener('click', toggleUnit);
closeError.addEventListener('click', () => errorPopup.classList.add('hidden'));
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBtn.click(); });

//funtions
async function searchWeather(city) {
    if (!city) {
        showError('Please enter a city name.');
        return;
    }
    try {
        const geoData = await fetch(`${geoUrl}q=${city}&limit=1&appid=${apiKey}`).then(res => res.json());
        if (!geoData.length) throw new Error('City not found.');
        const { lat, lon, name } = geoData[0];
        addToRecentCities(name);
        fetchWeather(lat, lon, name);
    } catch (error) {
        showError(error.message);
    }
}

