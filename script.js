let currentUnit = 'F';
let latestWeatherInfo = null;
const addressInputElement = document.querySelector('#address');
const searchButton = document.querySelector('#address + button');
const toggleButton = document.querySelector('#toggle-unit');

searchButton.addEventListener('click', handleSubmit);
toggleButton.addEventListener('click', () => {
    if (currentUnit === 'C') {
        currentUnit = 'F';
        toggleButton.textContent = 'Show °C';
    } else {
        currentUnit = 'C';
        toggleButton.textContent = 'Show °F';
    }

    if (latestWeatherInfo) {
        displayWeather(latestWeatherInfo);
    }
});

async function getData(userInput) {
    const apiKey = 'DA4D64MZZKL3TSMLV2NC24VY8';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userInput}?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {mode: 'cors'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log(json);
        return json;

    } catch (error) {
        console.error(error.message);
        throw error;
    } 
}

function extractWeather(data) {
    const {
        resolvedAddress: address,
        currentConditions: {temp, humidity, conditions}
    } = data;

    return {address, temp, humidity, conditions};
}

async function handleSubmit(event) {
    event.preventDefault();
    const userInput = addressInputElement.value.trim();
    if (userInput === '') {
        console.error("Please enter a city name");
        return;
    }
    addressInputElement.value = '';

    try {
        const data = await getData(userInput);
        const weatherInfo = extractWeather(data);
        displayWeather(weatherInfo);
    } catch (err) {
        console.error("Failed to load weather: ", err.message);
    }
}

function displayWeather(weatherInfo) {
    const displayDiv = document.querySelector('#display');
    displayDiv.textContent = '';

    latestWeatherInfo = weatherInfo;

    let tempDisplay;
    if (currentUnit === 'F') {
        tempDisplay = `${weatherInfo.temp}°F`;
    } else {
        tempC = (weatherInfo.temp - 32) * 5 / 9;
        tempDisplay = `${tempC.toFixed(1)}°C`;
    }

    const title = document.createElement('h2');
    title.textContent = `Weather in ${weatherInfo.address}`;

    const tempPara = document.createElement('p');
    tempPara.textContent = `Temperature: ${tempDisplay}`;

    const humidityPara = document.createElement('p');
    humidityPara.textContent = `Humidity: ${weatherInfo.humidity}`;

    const conditionsPara = document.createElement('p');
    conditionsPara.textContent = `Conditions: ${weatherInfo.conditions}`;

    displayDiv.appendChild(title);
    displayDiv.appendChild(tempPara);
    displayDiv.appendChild(humidityPara);
    displayDiv.appendChild(conditionsPara);
}