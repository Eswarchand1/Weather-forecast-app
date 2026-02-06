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
