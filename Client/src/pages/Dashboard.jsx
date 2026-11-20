
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="container py-5">

      <h2 className="mb-4 text-primary">
        Smart City Dashboard
      </h2>

      <div className="row g-4">

        {/* Weather Card */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow h-100"
            onClick={() => navigate("/weather")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body text-center">
              <h1>🌦</h1>
              <h5>Weather</h5>
              <p>25°C, Clear Sky</p>
            </div>
          </div>
        </div>

        {/* Air Quality Card */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow h-100"
            onClick={() => navigate("/airquality")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body text-center">
              <h1>🌍</h1>
              <h5>Air Quality</h5>
              <p>AQI : 45 (Good)</p>
            </div>
          </div>
        </div>

        {/* News Card */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow h-100"
            onClick={() => navigate("/news")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body text-center">
              <h1>📰</h1>
              <h5>News</h5>
              <p>Latest Smart City Updates</p>
            </div>
          </div>
        </div>

        {/* Maps Card */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow h-100"
            onClick={() => navigate("/maps")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body text-center">
              <h1>📍</h1>
              <h5>Maps</h5>
              <p>Explore City Locations</p>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-5">

        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h4>Statistics</h4>
              <ul>
                <li>120+ Cities Connected</li>
                <li>100K+ Active Users</li>
                <li>99.9% System Uptime</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h4>Recent Updates</h4>
              <ul>
                <li>Weather updated 5 minutes ago</li>
                <li>Air Quality refreshed</li>
                <li>News synced successfully</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
