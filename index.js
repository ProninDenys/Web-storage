async function fetchWeather(city) {
    const apiKey = '9f729d13112c8df17c1ecb764cbc823f'; 


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data from API');
    }
    const data = await response.json();
    return data;
}

function saveWeatherToLocalStorage(data) {
    const weatherData = {
        data: data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('weather', JSON.stringify(weatherData));
}

function getWeatherFromLocalStorage() {
    const weatherData = localStorage.getItem('weather');
    if (!weatherData) return null;

    const { data, timestamp } = JSON.parse(weatherData);
    const currentTime = new Date().getTime();
    const twoHours = 2 * 60 * 60 * 1000;

    if (currentTime - timestamp > twoHours) {
        return null;
    }

    return data;
}

function getWeatherEmoji(description) {
    if (description.includes('cloud')) return '☁️';
    if (description.includes('sun')) return '☀️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('snow')) return '❄️';
    return '🌤️';
}

function translateWeatherDescription(description) {
    const translations = {
        'хмарно': 'cloudy',
        'сонячно': 'sunny',
        'дощ': 'rain',
        'сніг': 'snow',
        'уривчасті хмари': 'scattered clouds',
        'ясно': 'clear'
    
    };

    const lowerDescription = description.toLowerCase();
    return translations[lowerDescription] || description;
}

async function getWeather(city) {
    let weatherData = getWeatherFromLocalStorage();

    if (!weatherData) {
        try {
            weatherData = await fetchWeather(city);
            saveWeatherToLocalStorage(weatherData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    displayWeather(weatherData);
}

function displayWeather(data) {
    if (!data) return;

    const weatherElement = document.getElementById('weather');
    let description = data.weather[0].description;

    // Translating to English.
    description = translateWeatherDescription(description);

    const emoji = getWeatherEmoji(description);
    weatherElement.innerHTML = `
        <p><strong>City:</strong> Kyiv <span class="flag">🇺🇦</span></p>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${emoji} ${description}</p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const city = 'Kyiv';
    getWeather(city);
});
