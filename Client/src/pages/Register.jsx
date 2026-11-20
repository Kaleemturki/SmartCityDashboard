import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    // Check password
    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match");

      return;
    }

    try {

      const response = await axios.post(
        `${API}/api/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        }
      );

      setMessage(response.data.message);

      // Clear form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
      });

      // Go to login page after registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      if (error.response) {

        setError(error.response.data.message);

      } else {

        setError("Unable to connect to server");

      }

    }

  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-7 col-lg-6">

          <div className="card shadow-lg border-0">

            <div className="card-body p-4">

              <h2 className="text-center text-primary mb-4">
                Create Account
              </h2>

              {/* Success Message */}

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {/* Error Message */}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Full Name */}

                <div className="mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                {/* Mobile */}

                <div className="mb-3">

                  <label className="form-label">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />

                </div>

                {/* Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                </div>

                {/* Confirm Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                </div>

                {/* Register Button */}

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Register
                </button>

              </form>

              <div className="text-center mt-3">

                <p>
                  Already have an account?

                  <Link
                    to="/login"
                    className="ms-2"
                  >
                    Login
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;