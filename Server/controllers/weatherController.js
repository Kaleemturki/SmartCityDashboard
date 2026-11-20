
const axios = require("axios");

const getWeather = async (req, res) => {

    try {

        // Get city from URL
        const { city } = req.query;

        // Check city
        if (!city) {
            return res.status(400).json({
                message: "City is required"
            });
        }


        // STEP 1:
        // Convert city name into latitude and longitude

        const geoResponse = await axios.get(
            "http://api.openweathermap.org/geo/1.0/direct",
            {
                params: {
                    q: city,
                    limit: 1,
                    appid: process.env.OPENWEATHER_API_KEY
                }
            }
        );


        // Check if city exists

        if (geoResponse.data.length === 0) {

            return res.status(404).json({
                message: "City not found"
            });

        }


        // Get latitude and longitude

        const latitude = geoResponse.data[0].lat;
        const longitude = geoResponse.data[0].lon;


        console.log("City:", city);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);


        // STEP 2:
        // Get weather using latitude and longitude

        const weatherResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    units: "metric",
                    appid: process.env.OPENWEATHER_API_KEY
                }
            }
        );


        // Send weather data to frontend

        res.status(200).json(weatherResponse.data);


    } catch (error) {

        console.error(
            "Weather Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Unable to fetch weather data"
        });

    }

};


module.exports = {
    getWeather
};

