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
