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

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const weatherData = await fetch(`${baseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`).then(res => res.json());
                if (weatherData.cod !== 200) throw new Error('Location not found.');
                addToRecentCities(weatherData.name);
                fetchWeather(latitude, longitude, weatherData.name);
            } catch (error) {
                showError(error.message);
            }
        }, () => showError('Geolocation access denied.'));
    } else {
        showError('Geolocation not supported.');
    }
}

async function fetchWeather(lat, lon, cityName) {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${baseUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            fetch(`${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        ]);
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();
        if (currentData.cod !== 200 || forecastData.cod !== '200') throw new Error('Weather data unavailable.');
        displayCurrentWeather(currentData, cityName);
        displayForecast(forecastData);
        updateBackground(currentData.weather[0].main);
    } catch (error) {
        showError(error.message);
    }
}

function displayCurrentWeather(data, city) {
    document.getElementById('cityName').textContent = city;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weatherIcon').className = `wi wi-owm-${data.weather[0].id}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('windSpeed').textContent = data.wind.speed;
    document.getElementById('pressure').textContent = data.main.pressure;
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
    if (data.main.temp > 40) document.getElementById('alert').classList.remove('hidden');
    else document.getElementById('alert').classList.add('hidden');
    currentWeather.classList.remove('hidden');
    currentWeather.classList.add('fade-in');
}

function displayForecast(data) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    const dailyData = data.list.filter((_, i) => i % 8 === 0).slice(0, 5); // Every 24 hours
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toDateString();
        const card = document.createElement('div');
        card.className = 'bg-white bg-opacity-20 p-4 rounded-lg text-center fade-in';
        card.innerHTML = `
            <p class="font-bold">${date}</p>
            <i class="wi wi-owm-${day.weather[0].id} text-3xl my-2"></i>
            <p>${Math.round(day.main.temp)}°C</p>
            <p><i class="wi wi-humidity"></i> ${day.main.humidity}%</p>
            <p><i class="wi wi-strong-wind"></i> ${day.wind.speed} m/s</p>
        `;
        container.appendChild(card);
    });
    forecast.classList.remove('hidden');
}

function toggleUnit() {
    const tempEl = document.getElementById('temperature');
    let temp = parseFloat(tempEl.textContent);
    if (isCelsius) {
        temp = (temp * 9/5) + 32;
        tempEl.textContent = `${Math.round(temp)}°F`;
    } else {
        temp = (temp - 32) * 5/9;
        tempEl.textContent = `${Math.round(temp)}°C`;
    }
    isCelsius = !isCelsius;
}

function addToRecentCities(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        if (recentCities.length > 5) recentCities.pop();
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateDropdown();
    }
}

function updateDropdown() {
    if (recentCities.length > 0) {
        dropdownBtn.classList.remove('hidden');
        recentCitiesList.innerHTML = recentCities.map(city => `<li class="px-4 py-2 hover:bg-gray-600 cursor-pointer" onclick="searchWeather('${city}')">${city}</li>`).join('');
    }
}
