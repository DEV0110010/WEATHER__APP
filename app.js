const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static('public'));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Home route with form to enter city name
app.get('/weather', (req, res) => {
    res.render('index', { weather: null, error: null });
});

// Handle form submission
app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        const weather = response.data;

        const weatherData = {
            city: weather.name,
            temprature: weather.main.temp,
            description: weather.weather[0].description,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
        };
        res.render('index', { weather: weatherData, error: null });
    
    } catch (error){
        res.render('error',{error: 'City not found or API request failed. Please try again'});
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);    
});