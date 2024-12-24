document.addEventListener('DOMContentLoaded', () => {
    const timeE1 = document.getElementById('time');
    const dateE1 = document.getElementById('date');
    const currentweatheritemsE1 = document.getElementById('current-weather-items');
    const currentTempE1 = document.getElementById('currten-temp');
    const forecastE1 = document.getElementById('forcast');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const placeholder = document.getElementById('placename');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const apiKey = "afae0183414fc45a15f20d6fce7f3f8f";


    setInterval(() => {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDay();
        const date = now.getDate();
        const hour = now.getHours();
        const hr12 = hour > 12 ? hour % 12 : hour || 12;
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';

        timeE1.innerHTML = `${hr12}:${minutes} <span id="am-pm">${ampm}</span>`;
        dateE1.innerHTML = `${days[day]}, ${date} ${months[month]}`;
    }, 1000);

    // Search functionality
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            let cityName = searchBar.value.trim();

            if (cityName) {
                console.log(cityName);
                fetchWeatherByCityName(cityName);
                fetchCityImage(cityName)
            } else {
                console.log("No city name entered, using default location");
                fetchCurrentWeather();
            }
        });
    } else {
        console.error('Search bar element not found');
    }


    function fetchCurrentWeather() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;


                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => displayCurrentWeather(data));


                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => displayForecastWeather(data));
            },
            (error) => {
                console.error("Error fetching geolocation:", error);
            }
        );
    }
    //-------------------------------bg image------------------------

    function fetchCityImage(cityName) {
        fetch(`https://pixabay.com/api/?key=47404234-e3e0538d3df038422339c36a3&q=${cityName}&image_type=photo&orientation=horizontal`)
            .then(response => {
                if (!response.ok) {
                    alert("no response");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                const imageurl = data.hits[0].largeImageURL;
                document.body.style.backgroundImage = `url(${imageurl})`;
            })

    }

    // Function to fetch weather by city name
    function fetchWeatherByCityName(cityName) {

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(response => response.json())
                        .then(data => displayCurrentWeather(data)

                        );

                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(response => response.json())
                        .then(data => displayForecastWeather(data));
                } else {
                    console.error("City not found.");
                }
            })
            .catch(error => console.error("Error fetching geolocation data:", error));
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        const { temp, temp_max, feels_like } = data.main;
        const icon = data.weather[0]?.icon ; 
        const { humidity, pressure } = data.main;
        const { speed } = data.wind;
        const { sunrise, sunset } = data.sys;
        console.log(data);
        const { name } = data;
        triggerWeatherAnimation(data.weather[0].id);

        placeholder.innerHTML = `<div class="timezone" id="timezone" >
                ${name}
                
            </div>
            <div class="description">
            ${data.weather[0].description}
            </div>`

        currentweatheritemsE1.innerHTML =
            `<div class="info">
                <div class="humidity">humidity</div>
                <div>${humidity}%</div>
            </div>
            <div class="info">
                <div class="wind-speed">wind speed</div>
                <div>${speed} m/s</div>                   
            </div>
            <div class="info">
                <div class="pressure">pressure</div>
                <div>${pressure} hPa</div>                    
            </div>
            <div class="info">
                <div class="sunrise">sunrise</div>
                <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>                   
            </div>
            <div class="info">
                <div class="sunset">sunset</div>
                <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
            </div>`;

        currentTempE1.innerHTML = `
            <div class="others">
                <div class="day">${window.moment().format('dddd')}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
                <div class="temp">Temp: ${kelvinToCelsius(temp)}&#176;C</div>
                <div class="temp">Max Temp: ${kelvinToCelsius(temp_max)}&#176;C</div>
                <div class="temp">Feels Like: ${kelvinToCelsius(feels_like)}&#176;C</div>
            </div>
        `;
    }

   
    function triggerWeatherAnimation(weatherId) {
        
        document.querySelectorAll('.animation-container > .animation > div').forEach(function (element) {
            element.style.opacity = '0'; // Hide all animations by default
        });

        
        if (weatherId >= 200 && weatherId <= 232) {
           
            document.querySelector('.clouds').style.opacity = '1';
        } else if (weatherId >= 300 && weatherId <= 321) {
           
            document.querySelector('.rain').style.opacity = '1';
        } else if (weatherId >= 500 && weatherId <= 531) {
           
            document.querySelector('.rain').style.opacity = '1';
        } else if (weatherId >= 600 && weatherId <= 622) {
           
            document.querySelector('.snowfall-container').style.opacity = '1';
        } else if (weatherId >= 701 && weatherId <= 781) {
          
            document.querySelector('.fog').style.opacity = '1';
        } else if (weatherId === 800) {
          
            document.querySelector('.clear-sky').style.opacity = '1';
        } else if (weatherId === 801 || weatherId === 802) {
           
            document.querySelector('.cloudy-sky').style.opacity = '1';
        } else if (weatherId === 803 || weatherId === 804) {
           
            document.querySelector('.cloudy-sky').style.opacity = '1';
        } else {
           
            document.querySelector('.animation').style.opacity = '0';
        }
    }


    // Function to display forecast weather
    function displayForecastWeather(data) {
        const forecastByDay = {};

        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]; 
            if (!forecastByDay[date]) {
                forecastByDay[date] = [];
            }
            forecastByDay[date].push(item);
        });

        const today = window.moment().format('YYYY-MM-DD');
        const upcomingForecasts = Object.keys(forecastByDay)
            .filter(date => date !== today)
            .map(date => {
                const dayData = forecastByDay[date];
                const temps = dayData.map(item => item.main.temp);
                const maxTemps = dayData.map(item => item.main.temp_max);
                const feelsLikeTemps = dayData.map(item => item.main.feels_like);
                const icon = dayData[4]?.weather[0]?.icon || "01d";

                return {
                    date,
                    temp: average(temps),
                    maxTemp: Math.max(...maxTemps),
                    feelsLike: average(feelsLikeTemps),
                    icon,
                };
            });

        forecastE1.innerHTML = upcomingForecasts
            .slice(0, 5)
            .map(forecast => `
                <div class="forcast-item">
                    <div class="day">${window.moment(forecast.date).format('dddd')}</div>
                    <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="weather icon">
                    <div class="temp">Temp: ${kelvinToCelsius(forecast.temp)}&#176;C</div>
                    <div class="temp">Max Temp: ${kelvinToCelsius(forecast.maxTemp)}&#176;C</div>
                    <div class="temp">Feels Like: ${kelvinToCelsius(forecast.feelsLike)}&#176;C</div>
                </div>
            `).join('');
    }

   
    function kelvinToCelsius(temp) {
        return (temp - 273.15).toFixed(1);  
    }

    function average(arr) {
        return (arr.reduce((sum, val) => sum + val, 0) / arr.length).toFixed(1);  
    }
    function thunderstrome() {
        let cloud = document.querySelector('.clouds');
        let e = document.createElement('div');
        let left = Math.floor(Math.random() * 320);
        let width = Math.random() * 1.5;
        let height = Math.random() * 20;


        e.classList.add('drop');
        cloud.appendChild(e);
        e.style.left = left + 'px';
        e.style.width = 0.5 + width + 'px';
        e.style.height = 0.5 + height + 'px';

        setTimeout(function () {
            cloud.removeChild(e)
        }, 2000)

    }

    setInterval(function () {
        thunderstrome()
    }, 3)



    function rain() {
        let cloud = document.querySelector('.rain');
        let e = document.createElement('div');
        let left = Math.floor(Math.random() * 320);
        let width = Math.random() * 1.5;
        let height = Math.random() * 20;


        e.classList.add('drop');
        cloud.appendChild(e);
        e.style.left = left + 'px';
        e.style.width = 0.5 + width + 'px';
        e.style.height = 0.5 + height + 'px';

        setTimeout(function () {
            cloud.removeChild(e)
        }, 2000)

    }

    setInterval(function () {
        rain()
    }, 3)
});
