
import { useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


// ==========================================
// Move Map When Position Changes
// ==========================================

function ChangeMapView({ position }) {

    const map = useMap();

    map.setView(position, 13);

    return null;
}


// ==========================================
// Main Maps Component
// ==========================================

function Maps() {

    // ==========================================
    // Default Location - Dehradun
    // ==========================================

    const [position, setPosition] = useState([
        30.3165,
        78.0322
    ]);


    // ==========================================
    // City Search
    // ==========================================

    const [city, setCity] = useState("");


    // ==========================================
    // Location Name
    // ==========================================

    const [locationName, setLocationName] =
        useState("Dehradun, Uttarakhand");


    // ==========================================
    // Loading
    // ==========================================

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // Error
    // ==========================================

    const [error, setError] =
        useState("");


    // ==========================================
    // Nearby Places
    // ==========================================

    const [places, setPlaces] =
        useState([]);


    // ==========================================
    // Place Filter
    // all / hospital / restaurant
    // ==========================================

    const [placeFilter, setPlaceFilter] =
        useState("all");


    // ==========================================
    // STEP 7
    // Selected Route
    // ==========================================

    const [route, setRoute] =
        useState(null);


    // ==========================================
    // STEP 7
    // Route Loading
    // ==========================================

    const [routeLoading, setRouteLoading] =
        useState(false);


    // ==========================================
    // STEP 6
    // Calculate Straight-Line Distance
    // ==========================================

    const calculateDistance = (
        lat1,
        lon1,
        lat2,
        lon2
    ) => {

        // Earth radius in KM

        const R = 6371;


        // Latitude difference

        const dLat =
            (lat2 - lat1) *
            Math.PI /
            180;


        // Longitude difference

        const dLon =
            (lon2 - lon1) *
            Math.PI /
            180;


        // Convert latitude

        const latitude1 =
            lat1 *
            Math.PI /
            180;


        const latitude2 =
            lat2 *
            Math.PI /
            180;


        // Haversine formula

        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +

            Math.cos(latitude1) *
            Math.cos(latitude2) *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return R * c;

    };


    // ==========================================
    // Search City
    // ==========================================

    const searchCity = async () => {

        if (!city.trim()) {

            setError(
                "Please enter a city name"
            );

            return;
        }


        try {

            setLoading(true);

            setError("");

            // Clear previous route

            setRoute(null);


            // Nominatim search

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&featureType=city&q=${encodeURIComponent(city)}`
            );


            const data =
                await response.json();


            console.log(
                "Search Results:",
                data
            );


            if (data.length === 0) {

                setError(
                    "City not found. Please try another city."
                );

                return;
            }


            const selectedCity =
                data[0];


            const latitude =
                parseFloat(
                    selectedCity.lat
                );


            const longitude =
                parseFloat(
                    selectedCity.lon
                );


            // Update position

            setPosition([
                latitude,
                longitude
            ]);


            // Update location

            setLocationName(
                selectedCity.display_name
            );


            // Clear old places

            setPlaces([]);


        } catch (error) {

            console.error(
                "Location Search Error:",
                error
            );


            setError(
                "Unable to search location."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Get My Current Location
    // ==========================================

    const getMyLocation = () => {

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        setLoading(true);

        setError("");


        navigator.geolocation.getCurrentPosition(

            // Success

            (location) => {

                const latitude =
                    location.coords.latitude;


                const longitude =
                    location.coords.longitude;


                console.log(
                    "My Latitude:",
                    latitude
                );


                console.log(
                    "My Longitude:",
                    longitude
                );


                setPosition([
                    latitude,
                    longitude
                ]);


                setLocationName(
                    "My Current Location"
                );


                // Clear old places and route

                setPlaces([]);

                setRoute(null);


                setLoading(false);

            },


            // Error

            (error) => {

                console.error(
                    "Geolocation Error:",
                    error
                );


                if (error.code === 1) {

                    setError(
                        "Location permission was denied. Please allow location access."
                    );

                } else if (error.code === 2) {

                    setError(
                        "Unable to determine your location."
                    );

                } else if (error.code === 3) {

                    setError(
                        "Location request timed out. Please try again."
                    );

                } else {

                    setError(
                        "Unable to get your location."
                    );

                }


                setLoading(false);

            }

        );

    };


    // ==========================================
    // STEP 5
    // Get Nearby Hospitals + Restaurants
    // ==========================================

    const getNearbyPlaces = async () => {

        try {

            setLoading(true);

            setError("");

            // Clear old route

            setRoute(null);


            const latitude =
                position[0];


            const longitude =
                position[1];


            // 5 KM

            const radius = 5000;


            // Overpass Query

            const query = `

                [out:json][timeout:25];

                (

                    nwr["amenity"="hospital"]
                    (around:${radius},${latitude},${longitude});

                    nwr["amenity"="restaurant"]
                    (around:${radius},${latitude},${longitude});

                );

                out center;

            `;


            console.log(
                "Overpass Query:",
                query
            );


            const response = await fetch(
                "https://overpass-api.de/api/interpreter",
                {
                    method: "POST",
                    body: query
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Overpass API request failed"
                );

            }


            const data =
                await response.json();


            console.log(
                "Nearby Places:",
                data
            );


            setPlaces(
                data.elements || []
            );


            if (
                !data.elements ||
                data.elements.length === 0
            ) {

                setError(
                    "No hospitals or restaurants found within 5 km."
                );

            }


        } catch (error) {

            console.error(
                "Nearby Places Error:",
                error
            );


            setError(
                "Unable to find nearby places. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 7
    // Get Road Route
    // ==========================================

    const getRoute = async (place) => {

        try {

            setRouteLoading(true);

            setError("");


            // ==================================
            // Get Destination Coordinates
            // ==================================

            const destinationLat =
                place.lat ??
                place.center?.lat;


            const destinationLon =
                place.lon ??
                place.center?.lon;


            if (
                destinationLat === undefined ||
                destinationLon === undefined
            ) {

                setError(
                    "Destination coordinates are not available."
                );

                return;
            }


            // ==================================
            // Start Coordinates
            // ==================================

            const startLat =
                position[0];


            const startLon =
                position[1];


            // ==================================
            // OSRM Coordinates
            //
            // IMPORTANT:
            // OSRM uses longitude,latitude
            // ==================================

            const coordinates =
                `${startLon},${startLat};${destinationLon},${destinationLat}`;


            // ==================================
            // OSRM Route API
            // ==================================

            const url =
                `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;


            console.log(
                "Route URL:",
                url
            );


            // ==================================
            // Request Route
            // ==================================

            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Route request failed"
                );

            }


            const data =
                await response.json();


            console.log(
                "Route Data:",
                data
            );


            // ==================================
            // Check Route
            // ==================================

            if (
                data.code !== "Ok" ||
                !data.routes ||
                data.routes.length === 0
            ) {

                setError(
                    "No road route could be found for this location."
                );

                return;
            }


            // ==================================
            // Get First Route
            // ==================================

            const selectedRoute =
                data.routes[0];


            // ==================================
            // GeoJSON Coordinates
            //
            // OSRM gives:
            // [longitude, latitude]
            //
            // Leaflet needs:
            // [latitude, longitude]
            // ==================================

            const routeCoordinates =
                selectedRoute.geometry.coordinates.map(
                    ([longitude, latitude]) => [
                        latitude,
                        longitude
                    ]
                );


            // ==================================
            // Route Information
            // ==================================

            const distanceKm =
                selectedRoute.distance /
                1000;


            const durationMinutes =
                selectedRoute.duration /
                60;


            // ==================================
            // Save Route
            // ==================================

            setRoute({

                coordinates:
                    routeCoordinates,

                distance:
                    distanceKm,

                duration:
                    durationMinutes,

                place:
                    place

            });


        } catch (error) {

            console.error(
                "Route Error:",
                error
            );


            setError(
                "Unable to calculate route. Please try again."
            );


        } finally {

            setRouteLoading(false);

        }

    };


    // ==========================================
    // Clear Route
    // ==========================================

    const clearRoute = () => {

        setRoute(null);

    };


    // ==========================================
    // Filter Places
    // ==========================================

    const filteredPlaces =
        places.filter((place) => {

            const type =
                place.tags?.amenity;


            if (
                placeFilter === "hospital"
            ) {

                return type === "hospital";

            }


            if (
                placeFilter === "restaurant"
            ) {

                return type === "restaurant";

            }


            return (
                type === "hospital" ||
                type === "restaurant"
            );

        });


    // ==========================================
    // Hospital Count
    // ==========================================

    const hospitalCount =
        places.filter(
            (place) =>
                place.tags?.amenity ===
                "hospital"
        ).length;


    // ==========================================
    // Restaurant Count
    // ==========================================

    const restaurantCount =
        places.filter(
            (place) =>
                place.tags?.amenity ===
                "restaurant"
        ).length;


    // ==========================================
    // Add Distance To Places
    // ==========================================

    const placesWithDistance =
        filteredPlaces
            .map((place) => {

                const lat =
                    place.lat ??
                    place.center?.lat;


                const lon =
                    place.lon ??
                    place.center?.lon;


                if (
                    lat === undefined ||
                    lon === undefined
                ) {

                    return null;

                }


                const distance =
                    calculateDistance(
                        position[0],
                        position[1],
                        parseFloat(lat),
                        parseFloat(lon)
                    );


                return {

                    ...place,

                    latitude:
                        parseFloat(lat),

                    longitude:
                        parseFloat(lon),

                    distance:
                        distance

                };

            })
            .filter(Boolean);


    // ==========================================
    // Nearest Hospital
    // ==========================================

    const nearestHospital =
        places
            .filter(
                (place) =>
                    place.tags?.amenity ===
                    "hospital"
            )
            .map((place) => {

                const lat =
                    place.lat ??
                    place.center?.lat;


                const lon =
                    place.lon ??
                    place.center?.lon;


                if (
                    lat === undefined ||
                    lon === undefined
                ) {

                    return null;

                }


                return {

                    ...place,

                    distance:
                        calculateDistance(
                            position[0],
                            position[1],
                            parseFloat(lat),
                            parseFloat(lon)
                        )

                };

            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    a.distance -
                    b.distance
            )[0];


    // ==========================================
    // Nearest Restaurant
    // ==========================================

    const nearestRestaurant =
        places
            .filter(
                (place) =>
                    place.tags?.amenity ===
                    "restaurant"
            )
            .map((place) => {

                const lat =
                    place.lat ??
                    place.center?.lat;


                const lon =
                    place.lon ??
                    place.center?.lon;


                if (
                    lat === undefined ||
                    lon === undefined
                ) {

                    return null;

                }


                return {

                    ...place,

                    distance:
                        calculateDistance(
                            position[0],
                            position[1],
                            parseFloat(lat),
                            parseFloat(lon)
                        )

                };

            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    a.distance -
                    b.distance
            )[0];


    // ==========================================
    // Format Duration
    // ==========================================

    const formatDuration = (minutes) => {

        if (minutes < 1) {

            return "Less than 1 min";

        }


        const hours =
            Math.floor(
                minutes / 60
            );


        const remainingMinutes =
            Math.round(
                minutes % 60
            );


        if (hours > 0) {

            return `${hours} hr ${remainingMinutes} min`;

        }


        return `${remainingMinutes} min`;

    };


    // ==========================================
    // RETURN UI
    // ==========================================

    return (

        <div
            className="container py-5"
            style={{
                minHeight: "80vh"
            }}
        >


            {/* ================================== */}
            {/* PAGE HEADER */}
            {/* ================================== */}

            <div className="text-center mb-5">

                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                        width: "70px",
                        height: "70px",
                        background: "#e7f1ff",
                        color: "#0d6efd",
                        fontSize: "32px"
                    }}
                >

                    🗺️

                </div>


                <h1 className="fw-bold mb-2">

                    Smart City Maps

                </h1>


                <p className="text-muted mb-0">

                    Search cities, explore locations and
                    find nearby places

                </p>

            </div>



            {/* ================================== */}
            {/* SEARCH CARD */}
            {/* ================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "18px"
                }}
            >

                <div className="card-body p-4">


                    <div className="mb-3">

                        <h5 className="fw-bold mb-1">

                            🔎 Find a Location

                        </h5>


                        <small className="text-muted">

                            Search for a city or use your
                            current location

                        </small>

                    </div>


                    <div className="row g-3">


                        {/* City Search */}

                        <div className="col-lg-7">

                            <div
                                className="input-group input-group-lg"
                            >

                                <span
                                    className="input-group-text bg-white"
                                >

                                    🔍

                                </span>


                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for a city..."
                                    value={city}
                                    onChange={(e) =>
                                        setCity(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {

                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {

                                            searchCity();

                                        }

                                    }}
                                />


                                <button
                                    className="btn btn-primary px-4"
                                    onClick={searchCity}
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Searching..."
                                        : "Search"}

                                </button>

                            </div>

                        </div>



                        {/* My Location */}

                        <div className="col-lg-5">

                            <button
                                className="btn btn-outline-success btn-lg w-100"
                                onClick={
                                    getMyLocation
                                }
                                disabled={loading}
                                style={{
                                    minHeight:
                                        "50px"
                                }}
                            >

                                📍 Use My Location

                            </button>

                        </div>


                    </div>

                </div>

            </div>



            {/* ================================== */}
            {/* LOADING */}
            {/* ================================== */}

            {(loading ||
                routeLoading) && (

                <div
                    className="text-center mb-4"
                >

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                    </div>


                    <p className="text-muted mt-2">

                        {routeLoading
                            ? "Calculating road route..."
                            : "Finding information..."}

                    </p>

                </div>

            )}



            {/* ================================== */}
            {/* ERROR */}
            {/* ================================== */}

            {error && (

                <div
                    className="alert alert-danger border-0 shadow-sm"
                    style={{
                        borderRadius: "12px"
                    }}
                >

                    ⚠️{" "}

                    {error}

                </div>

            )}



            {/* ================================== */}
            {/* LOCATION CARD */}
            {/* ================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "15px"
                }}
            >

                <div
                    className="card-body py-3 px-4"
                >

                    <div
                        className="d-flex align-items-center"
                    >

                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "45px",
                                height: "45px",
                                background:
                                    "#e8f5e9",
                                fontSize:
                                    "21px"
                            }}
                        >

                            📍

                        </div>


                        <div>

                            <small
                                className="text-muted d-block"
                            >

                                Selected Location

                            </small>


                            <strong>

                                {locationName}

                            </strong>

                        </div>

                    </div>

                </div>

            </div>



            {/* ================================== */}
            {/* NEARBY PLACES CARD */}
            {/* ================================== */}

            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "18px"
                }}
            >

                <div className="card-body p-4">


                    <div
                        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3"
                    >

                        <div>

                            <h5 className="fw-bold mb-1">

                                📍 Nearby Places

                            </h5>


                            <small className="text-muted">

                                Find hospitals and restaurants
                                within 5 km

                            </small>

                        </div>


                        <button
                            className="btn btn-primary"
                            onClick={
                                getNearbyPlaces
                            }
                            disabled={
                                loading ||
                                routeLoading
                            }
                        >

                            {loading
                                ? "Finding..."
                                : "🔎 Find Nearby Places"}

                        </button>

                    </div>



                    {/* Filters */}

                    {places.length > 0 && (

                        <div className="d-flex flex-wrap gap-2">


                            <button
                                className={
                                    placeFilter ===
                                    "all"
                                        ? "btn btn-dark"
                                        : "btn btn-outline-dark"
                                }
                                onClick={() =>
                                    setPlaceFilter(
                                        "all"
                                    )
                                }
                            >

                                All ({places.length})

                            </button>


                            <button
                                className={
                                    placeFilter ===
                                    "hospital"
                                        ? "btn btn-danger"
                                        : "btn btn-outline-danger"
                                }
                                onClick={() =>
                                    setPlaceFilter(
                                        "hospital"
                                    )
                                }
                            >

                                🏥 Hospitals (
                                {hospitalCount}
                                )

                            </button>


                            <button
                                className={
                                    placeFilter ===
                                    "restaurant"
                                        ? "btn btn-warning"
                                        : "btn btn-outline-warning"
                                }
                                onClick={() =>
                                    setPlaceFilter(
                                        "restaurant"
                                    )
                                }
                            >

                                🍽️ Restaurants (
                                {restaurantCount}
                                )

                            </button>

                        </div>

                    )}

                </div>

            </div>



            {/* ================================== */}
            {/* ROUTE INFORMATION */}
            {/* ================================== */}

            {route && (

                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{
                        borderRadius: "18px",
                        borderLeft:
                            "5px solid #0d6efd"
                    }}
                >

                    <div className="card-body p-4">


                        <div
                            className="d-flex justify-content-between align-items-start flex-wrap gap-3"
                        >

                            <div>

                                <small
                                    className="text-muted"
                                >

                                    🚗 Current Route

                                </small>


                                <h5
                                    className="fw-bold mt-1 mb-2"
                                >

                                    {route.place.tags?.name ||
                                        "Selected Destination"}

                                </h5>

                            </div>


                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={
                                    clearRoute
                                }
                            >

                                ✕ Clear Route

                            </button>

                        </div>



                        <div className="row g-3 mt-1">


                            {/* Road Distance */}

                            <div className="col-md-6">

                                <div
                                    className="bg-light rounded p-3"
                                >

                                    <small
                                        className="text-muted"
                                    >

                                        🛣️ Road Distance

                                    </small>


                                    <h4 className="fw-bold mb-0">

                                        {route.distance <
                                        1
                                            ? `${Math.round(
                                                route.distance *
                                                    1000
                                            )} m`
                                            : `${route.distance.toFixed(
                                                2
                                            )} km`}

                                    </h4>

                                </div>

                            </div>



                            {/* Travel Time */}

                            <div className="col-md-6">

                                <div
                                    className="bg-light rounded p-3"
                                >

                                    <small
                                        className="text-muted"
                                    >

                                        ⏱️ Estimated Time

                                    </small>


                                    <h4 className="fw-bold mb-0">

                                        {formatDuration(
                                            route.duration
                                        )}

                                    </h4>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}



            {/* ================================== */}
            {/* MAP */}
            {/* ================================== */}

            <div
                className="card border-0 shadow"
                style={{
                    borderRadius: "18px",
                    overflow: "hidden"
                }}
            >


                {/* Map Header */}

                <div
                    className="px-4 py-3 d-flex justify-content-between align-items-center"
                    style={{
                        background: "#ffffff",
                        borderBottom:
                            "1px solid #eee"
                    }}
                >

                    <h5 className="fw-bold mb-0">

                        🗺️ Map Explorer

                    </h5>


                    <span
                        className="badge bg-success-subtle text-success px-3 py-2"
                    >

                        ● Live Map

                    </span>

                </div>



                {/* Map */}

                <div
                    style={{
                        height: "520px",
                        width: "100%"
                    }}
                >

                    <MapContainer
                        center={position}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    >


                        {/* OpenStreetMap */}

                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />


                        {/* Move map */}

                        <ChangeMapView
                            position={position}
                        />



                        {/* ================================= */}
                        {/* MAIN LOCATION MARKER */}
                        {/* ================================= */}

                        <Marker
                            position={position}
                        >

                            <Popup>

                                <div
                                    style={{
                                        minWidth:
                                            "190px"
                                    }}
                                >

                                    <strong>

                                        📍 Location

                                    </strong>


                                    <hr className="my-2" />


                                    <div>

                                        {locationName}

                                    </div>


                                    <small
                                        className="text-muted"
                                    >

                                        Latitude:{" "}

                                        {position[0].toFixed(
                                            4
                                        )}

                                        <br />

                                        Longitude:{" "}

                                        {position[1].toFixed(
                                            4
                                        )}

                                    </small>

                                </div>

                            </Popup>

                        </Marker>



                        {/* ================================= */}
                        {/* NEARBY PLACE MARKERS */}
                        {/* ================================= */}

                        {placesWithDistance.map(
                            (place) => {


                                const placeType =
                                    place.tags?.amenity;


                                const placeName =
                                    place.tags?.name ||
                                    "Unnamed Place";


                                return (

                                    <Marker
                                        key={`${place.type}-${place.id}`}
                                        position={[
                                            place.latitude,
                                            place.longitude
                                        ]}
                                    >

                                        <Popup>

                                            <div
                                                style={{
                                                    minWidth:
                                                        "220px"
                                                }}
                                            >

                                                <strong>

                                                    {placeType ===
                                                    "hospital"
                                                        ? "🏥 Hospital"
                                                        : "🍽️ Restaurant"}

                                                </strong>


                                                <hr
                                                    className="my-2"
                                                />


                                                <h6
                                                    className="fw-bold"
                                                >

                                                    {
                                                        placeName
                                                    }

                                                </h6>


                                                {/* Straight-line distance */}

                                                <div className="mb-2">

                                                    📍{" "}

                                                    <strong>

                                                        {place.distance <
                                                        1
                                                            ? `${Math.round(
                                                                place.distance *
                                                                    1000
                                                            )} m`
                                                            : `${place.distance.toFixed(
                                                                2
                                                            )} km`}

                                                    </strong>{" "}

                                                    away

                                                </div>


                                                {/* Address */}

                                                {place.tags
                                                    ?.["addr:street"] && (

                                                    <small
                                                        className="text-muted d-block mb-2"
                                                    >

                                                        🛣️{" "}

                                                        {
                                                            place
                                                                .tags[
                                                                "addr:street"
                                                            ]
                                                        }

                                                    </small>

                                                )}


                                                {/* Phone */}

                                                {place.tags
                                                    ?.phone && (

                                                    <div className="mb-2">

                                                        📞{" "}

                                                        {
                                                            place
                                                                .tags
                                                                .phone
                                                        }

                                                    </div>

                                                )}


                                                {/* Get Route */}

                                                <button
                                                    className="btn btn-primary btn-sm w-100"
                                                    onClick={() =>
                                                        getRoute(
                                                            place
                                                        )
                                                    }
                                                    disabled={
                                                        routeLoading
                                                    }
                                                >

                                                    🚗 Get Route

                                                </button>

                                            </div>

                                        </Popup>

                                    </Marker>

                                );

                            }
                        )}



                        {/* ================================= */}
                        {/* STEP 7 ROUTE LINE */}
                        {/* ================================= */}

                        {route && (

                            <Polyline
                                positions={
                                    route.coordinates
                                }
                                pathOptions={{
                                    color:
                                        "#0d6efd",
                                    weight: 6,
                                    opacity: 0.8
                                }}
                            />

                        )}

                    </MapContainer>

                </div>

            </div>



            {/* ================================== */}
            {/* PLACE SUMMARY */}
            {/* ================================== */}

            {places.length > 0 && (

                <div className="row g-3 mt-3">


                    {/* Total */}

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius:
                                    "15px"
                            }}
                        >

                            <div
                                className="card-body text-center"
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "32px"
                                    }}
                                >

                                    📍

                                </div>


                                <small
                                    className="text-muted"
                                >

                                    Total Places

                                </small>


                                <h3 className="fw-bold">

                                    {places.length}

                                </h3>

                            </div>

                        </div>

                    </div>



                    {/* Hospitals */}

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius:
                                    "15px"
                            }}
                        >

                            <div
                                className="card-body text-center"
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "32px"
                                    }}
                                >

                                    🏥

                                </div>


                                <small
                                    className="text-muted"
                                >

                                    Hospitals

                                </small>


                                <h3 className="fw-bold">

                                    {hospitalCount}

                                </h3>

                            </div>

                        </div>

                    </div>



                    {/* Restaurants */}

                    <div className="col-md-4">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius:
                                    "15px"
                            }}
                        >

                            <div
                                className="card-body text-center"
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "32px"
                                    }}
                                >

                                    🍽️

                                </div>


                                <small
                                    className="text-muted"
                                >

                                    Restaurants

                                </small>


                                <h3 className="fw-bold">

                                    {restaurantCount}

                                </h3>

                            </div>

                        </div>

                    </div>


                </div>

            )}



            {/* ================================== */}
            {/* NEAREST PLACES */}
            {/* ================================== */}

            {places.length > 0 && (

                <div className="row g-3 mt-1">


                    {/* Nearest Hospital */}

                    <div className="col-md-6">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius:
                                    "15px"
                            }}
                        >

                            <div className="card-body">

                                <small
                                    className="text-muted"
                                >

                                    🏥 Nearest Hospital

                                </small>


                                {nearestHospital ? (

                                    <>

                                        <h5
                                            className="fw-bold mt-2"
                                        >

                                            {
                                                nearestHospital
                                                    .tags
                                                    ?.name ||
                                                "Unnamed Hospital"
                                            }

                                        </h5>


                                        <span
                                            className="badge bg-danger-subtle text-danger"
                                        >

                                            {nearestHospital.distance <
                                            1
                                                ? `${Math.round(
                                                    nearestHospital.distance *
                                                        1000
                                                )} m away`
                                                : `${nearestHospital.distance.toFixed(
                                                    2
                                                )} km away`}

                                        </span>

                                    </>

                                ) : (

                                    <p className="text-muted mt-2">

                                        No hospital found.

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>



                    {/* Nearest Restaurant */}

                    <div className="col-md-6">

                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius:
                                    "15px"
                            }}
                        >

                            <div className="card-body">

                                <small
                                    className="text-muted"
                                >

                                    🍽️ Nearest Restaurant

                                </small>


                                {nearestRestaurant ? (

                                    <>

                                        <h5
                                            className="fw-bold mt-2"
                                        >

                                            {
                                                nearestRestaurant
                                                    .tags
                                                    ?.name ||
                                                "Unnamed Restaurant"
                                            }

                                        </h5>


                                        <span
                                            className="badge bg-warning-subtle text-warning-emphasis"
                                        >

                                            {nearestRestaurant.distance <
                                            1
                                                ? `${Math.round(
                                                    nearestRestaurant.distance *
                                                        1000
                                                )} m away`
                                                : `${nearestRestaurant.distance.toFixed(
                                                    2
                                                )} km away`}

                                        </span>

                                    </>

                                ) : (

                                    <p className="text-muted mt-2">

                                        No restaurant found.

                                    </p>

                                )}

                            </div>

                        </div>

                    </div>


                </div>

            )}

        </div>

    );

}


export default Maps;

