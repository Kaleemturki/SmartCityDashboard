import smartCity from "../assets/smart-city.jpg";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Smart City Dashboard
          </h1>

          <p className="lead mt-3">
            Monitor Weather, Air Quality, News and Maps
            in one place.
          </p>

          <button className="btn btn-light btn-lg me-3">
            Get Started
          </button>

          <button className="btn btn-outline-light btn-lg">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container my-5">

        <div className="row text-center">

          <div className="col-md-3">
            <div className="card shadow">
              <div className="card-body">
                <h3>🌦</h3>
                <h5>Weather</h5>
                <p>Live weather updates.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow">
              <div className="card-body">
                <h3>📰</h3>
                <h5>News</h5>
                <p>Latest city news.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow">
              <div className="card-body">
                <h3>🌍</h3>
                <h5>Air Quality</h5>
                <p>Real-time AQI monitoring.</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow">
              <div className="card-body">
                <h3>🗺</h3>
                <h5>Live Map</h5>
                <p>Explore your city.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="bg-light py-5">
        <div className="container">

          <div className="row text-center">

            <div className="col-md-3">
              <h2>120+</h2>
              <p>Cities</p>
            </div>

            <div className="col-md-3">
              <h2>24/7</h2>
              <p>Monitoring</p>
            </div>

            <div className="col-md-3">
              <h2>100K+</h2>
              <p>Users</p>
            </div>

            <div className="col-md-3">
              <h2>99.9%</h2>
              <p>Accuracy</p>
            </div>

          </div>

        </div>
      </section>
      {/* About Section */}
<section className="container py-5">
  <div className="row align-items-center">

    <div className="col-lg-6">
      <h2 className="fw-bold">About Smart City Dashboard</h2>

      <p className="mt-3">
        Smart City Dashboard is a centralized platform that provides
        real-time information about weather, air quality, city news,
        maps, and other essential services. It helps citizens stay
        informed and supports smarter decision-making.
      </p>

      <button className="btn btn-primary" onClick={()=>navigate("/dashboard")}>
        Explore Dashboard
      </button>
    </div>

    <div className="col-lg-6 text-center">
      <img
  src={smartCity}
  alt="Smart City"
  className="img-fluid rounded shadow"
/>
    </div>

  </div>
</section>

    </>
  );
}

export default Home;