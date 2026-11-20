import { useState } from "react";
import axios from "axios";
import API from "../api";

function AirQuality() {

    const [city, setCity] = useState("");
    const [airQuality, setAirQuality] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const getAQIStatus = (aqi) => {

        if (aqi === 1) {
            return "Good";
        } else if (aqi === 2) {
            return "Fair";
        } else if (aqi === 3) {
            return "Moderate";
        } else if (aqi === 4) {
            return "Poor";
        } else if (aqi === 5) {
            return "Very Poor";
        }

        return "Unknown";
    };

    const getAQIClass = (aqi) => {

        if (aqi === 1) {
            return "bg-success text-white";
        } else if (aqi === 2) {
            return "bg-info text-white";
        } else if (aqi === 3) {
            return "bg-warning text-dark";
        } else if (aqi === 4) {
            return "bg-danger text-white";
        } else if (aqi === 5) {
            return "bg-dark text-white";
        }

        return "bg-secondary text-white";
    };





    const searchAirQuality = async () => {

        if (!city) {
            setError("Please enter a city name");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Send city name to our backend
            const response = await axios.get(
                `${API}/api/airquality?city=${city}`
            );

            setAirQuality(response.data);

        } catch (error) {

            console.log(error);

            if (error.response?.status === 404) {

                setError("City not found. Please enter a valid city name.");

            } else if (error.response?.status === 400) {

                setError("Please enter a city name.");

            } else {

                setError("Unable to fetch air quality data. Please try again.");

            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">

            <h1 className="text-center mb-4">
                Air Quality
            </h1>

            <div className="input-group mb-4">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchAirQuality();
                        }
                    }}
                />
                <button
                    className="btn btn-primary"
                    onClick={searchAirQuality}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {loading && (
                <div className="text-center my-4">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-2">
                        Fetching air quality data...
                    </p>

                </div>
            )}
            {error && (
                <p className="text-danger text-center">
                    {error}
                </p>
            )}

            {airQuality && (
                <div className="card p-4">

                    <div className="text-center mb-4">

                        <h3>
                            Air Quality Information
                        </h3>

                        <h5 className="mt-3">
                            📍 {airQuality.city}, {airQuality.country}
                        </h5>

                        <p className="text-muted">
                            Latitude: {airQuality.coordinates.lat} |
                            Longitude: {airQuality.coordinates.lon}
                        </p>

                    </div>

                    <div
                        className={`text-center p-4 rounded mb-4 ${getAQIClass(
                            airQuality.airQuality.list[0].main.aqi
                        )}`}
                    >

                        <h2>
                            AQI: {airQuality.airQuality.list[0].main.aqi}
                        </h2>

                        <h4 className="mt-2">
                            {
                                getAQIStatus(
                                    airQuality.airQuality.list[0].main.aqi
                                )
                            }
                        </h4>

                    </div>


                    <div className="row g-4">

                        {/* Carbon Monoxide */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Carbon Monoxide (CO)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.co}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>


                        {/* Nitrogen Dioxide */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Nitrogen Dioxide (NO₂)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.no2}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>


                        {/* Ozone */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Ozone (O₃)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.o3}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>


                        {/* Sulphur Dioxide */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Sulphur Dioxide (SO₂)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.so2}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>


                        {/* PM2.5 */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Particulate Matter (PM2.5)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.pm2_5}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>


                        {/* PM10 */}
                        <div className="col-md-4">
                            <div className="card text-center p-3 shadow-sm h-100">
                                <h5>Particulate Matter (PM10)</h5>

                                <h3>
                                    {airQuality.airQuality.list[0].components.pm10}
                                </h3>

                                <p className="text-muted mb-0">
                                    μg/m³
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AirQuality;