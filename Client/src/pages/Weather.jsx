  
import { useState } from "react";
import axios from "axios";

function Weather() {

    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Get Weather
    const getWeather = async () => {

        // Check empty city
        if (!city.trim()) {

            setError("Please enter a city name");
            setWeather(null);

            return;
        }


        try {

            setLoading(true);
            setError("");
            setWeather(null);


            // Send city to backend
            const response = await axios.get(
                "http://localhost:5000/api/weather",
                {
                    params: {
                        city: city
                    }
                }
            );


            console.log("Weather Data:", response.data);


            // Store weather data
            setWeather(response.data);


        } catch (error) {

            console.error("Weather Error:", error);


            if (error.response?.status === 404) {

                setError(
                    "City not found. Please enter a valid city name."
                );

            } else {

                setError(
                    "Unable to fetch weather data. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="container py-5"
            style={{ minHeight: "80vh" }}
        >


            {/* Page Heading */}

            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    🌤️ Weather Dashboard
                </h1>

                <p className="text-muted">
                    Search weather information for any city
                </p>

            </div>



            {/* Search Card */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body p-4">

                    <div className="row g-3">


                        {/* City Input */}

                        <div className="col-md-9">

                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Enter city name..."
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {
                                        getWeather();
                                    }

                                }}
                            />

                        </div>



                        {/* Search Button */}

                        <div className="col-md-3">

                            <button
                                className="btn btn-primary btn-lg w-100"
                                onClick={getWeather}
                                disabled={loading}
                            >

                                {loading
                                    ? "Loading..."
                                    : "🔍 Search"}

                            </button>

                        </div>


                    </div>

                </div>

            </div>



            {/* Error Message */}

            {error && (

                <div className="alert alert-danger text-center">

                    {error}

                </div>

            )}



            {/* Loading */}

            {loading && (

                <div className="text-center my-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                    </div>

                    <p className="text-muted mt-3">

                        Fetching weather information...

                    </p>

                </div>

            )}



            {/* Weather Result */}

            {weather && !loading && (

                <>

                    {/* Main Weather Card */}

                    <div
                        className="card shadow border-0 mb-4"
                        style={{
                            borderRadius: "20px",
                            overflow: "hidden"
                        }}
                    >

                        <div
                            className="card-body text-center p-5"
                            style={{
                                background:
                                    "linear-gradient(135deg, #0d6efd, #4dabf7)",
                                color: "white"
                            }}
                        >


                            {/* Real Weather Icon */}

                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                                alt={weather.weather[0].description}
                                style={{
                                    width: "120px",
                                    height: "120px"
                                }}
                            />


                            {/* City */}

                            <h2 className="fw-bold">

                                📍 {weather.name}

                                {weather.sys?.country &&
                                    `, ${weather.sys.country}`}

                            </h2>


                            {/* Weather Description */}

                            <p className="text-capitalize mb-4">

                                {weather.weather[0].description}

                            </p>


                            {/* Temperature */}

                            <div className="display-1 fw-bold">

                                {Math.round(weather.main.temp)}°C

                            </div>


                            {/* Feels Like */}

                            <p className="mb-0">

                                Feels like{" "}

                                <strong>

                                    {Math.round(
                                        weather.main.feels_like
                                    )}°C

                                </strong>

                            </p>

                        </div>

                    </div>



                    {/* Weather Information Cards */}

                    <div className="row g-4">


                        {/* Humidity */}

                        <div className="col-md-4">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body text-center p-4">

                                    <div
                                        style={{
                                            fontSize: "40px"
                                        }}
                                    >
                                        💧
                                    </div>

                                    <h6 className="text-muted mt-2">
                                        Humidity
                                    </h6>

                                    <h3 className="fw-bold">

                                        {weather.main.humidity}%

                                    </h3>

                                </div>

                            </div>

                        </div>



                        {/* Wind Speed */}

                        <div className="col-md-4">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body text-center p-4">

                                    <div
                                        style={{
                                            fontSize: "40px"
                                        }}
                                    >
                                        💨
                                    </div>

                                    <h6 className="text-muted mt-2">
                                        Wind Speed
                                    </h6>

                                    <h3 className="fw-bold">

                                        {weather.wind.speed} m/s

                                    </h3>

                                </div>

                            </div>

                        </div>



                        {/* Condition */}

                        <div className="col-md-4">

                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-body text-center p-4">

                                    <div
                                        style={{
                                            fontSize: "40px"
                                        }}
                                    >
                                        🌡️
                                    </div>

                                    <h6 className="text-muted mt-2">
                                        Condition
                                    </h6>

                                    <h3 className="fw-bold text-capitalize">

                                        {weather.weather[0].main}

                                    </h3>

                                </div>

                            </div>

                        </div>


                    </div>



                    {/* Additional Details */}

                    <div className="card shadow-sm border-0 mt-4">

                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-4">

                                📊 Weather Details

                            </h5>


                            <div className="row text-center">


                                {/* Minimum Temperature */}

                                <div className="col-md-3 mb-3">

                                    <p className="text-muted mb-1">

                                        Minimum Temperature

                                    </p>

                                    <h5>

                                        {Math.round(
                                            weather.main.temp_min
                                        )}°C

                                    </h5>

                                </div>



                                {/* Maximum Temperature */}

                                <div className="col-md-3 mb-3">

                                    <p className="text-muted mb-1">

                                        Maximum Temperature

                                    </p>

                                    <h5>

                                        {Math.round(
                                            weather.main.temp_max
                                        )}°C

                                    </h5>

                                </div>



                                {/* Pressure */}

                                <div className="col-md-3 mb-3">

                                    <p className="text-muted mb-1">

                                        Pressure

                                    </p>

                                    <h5>

                                        {weather.main.pressure} hPa

                                    </h5>

                                </div>



                                {/* Visibility */}

                                <div className="col-md-3 mb-3">

                                    <p className="text-muted mb-1">

                                        Visibility

                                    </p>

                                    <h5>

                                        {weather.visibility
                                            ? `${weather.visibility / 1000} km`
                                            : "N/A"}

                                    </h5>

                                </div>


                            </div>

                        </div>

                    </div>

                </>

            )}



            {/* Initial Message */}

            {!weather && !loading && !error && (

                <div className="text-center mt-5">

                    <div
                        style={{
                            fontSize: "60px"
                        }}
                    >
                        🌤️
                    </div>

                    <h5 className="mt-3">

                        Search for a city

                    </h5>

                    <p className="text-muted">

                        Enter a city name above to check
                        its current weather.

                    </p>

                </div>

            )}

        </div>

    );

}

export default Weather;

