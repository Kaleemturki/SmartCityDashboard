/*const axios=require("axios")

const getAirQuality=async (req,res)=>{
    try{
        const {lat, lon}=req.query;

        if(!lat || !lon){
            return res.status(400).json({
                message:"Latitude nad Longitude Are Required"
            });
        }

        const response=await axios.get("https://api.openweathermap.org/data/2.5/air_pollution",
        {
            params:{
                lat: lat,
                lon: lon,
                appid: process.env.OPENWEATHER_API_KEY
            }

        }
    );
    res.json(response.data);

    }
    catch (error){
        console.log(error.response?.data || error.message);

        res.status(500).json({
            message:"failed to fetch Air Quality Data"
        });
    }
};
module.exports={getAirQuality};

*/


const axios = require("axios");

const getAirQuality = async (req, res) => {
    try {

        const { city } = req.query;

        // Check city
        if (!city) {
            return res.status(400).json({
                message: "City is required"
            });
        }

        // Step 1: Get latitude and longitude from city
        const locationResponse = await axios.get(
            "https://api.openweathermap.org/geo/1.0/direct",
            {
                params: {
                    q: city,
                    limit: 1,
                    appid: process.env.OPENWEATHER_API_KEY
                }
            }
        );

        // Check whether city exists
        if (locationResponse.data.length === 0) {
            return res.status(404).json({
                message: "City not found"
            });
        }

        // Get coordinates
        const { lat, lon, name, country } = locationResponse.data[0];

        // Step 2: Get air quality using coordinates
        const airQualityResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/air_pollution",
            {
                params: {
                    lat,
                    lon,
                    appid: process.env.OPENWEATHER_API_KEY
                }
            }
        );

        // Send both location and air quality
        res.json({
            city: name,
            country: country,
            coordinates: {
                lat,
                lon
            },
            airQuality: airQualityResponse.data
        });

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch Air Quality Data"
        });
    }
};

module.exports = { getAirQuality };
