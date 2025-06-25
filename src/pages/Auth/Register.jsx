"use client";
import api from "../../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newErrors = validateForm();

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     setLoading(false);
  //     alert("Registration successful! Please login.");
  //     navigate("/login");
  //   }, 1000);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    try {
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setLoading(true);

      const res = await api.post("/register", formData);
      console.log(res.data);

      // localStorage.setItem("token", res.data.token);
      alert(res.data.message);
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error(err?.response?.data?.message || "Something went wrong");
      alert("Error: " + err?.response?.data?.message );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div>
        <div className="auth-left">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>LOGO</span>
          </div>

          <div className="dashboard-preview">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2031-Ksj0nuxb7KRoJLglP56xp8EskPrn63.png"
              alt="Dashboard Preview"
              className="preview-image"
            />
          </div>

          <div className="auth-content">
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </h2>
            <p>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot "></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form">
            <h1>Welcome to Dashboard</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full name*</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "error" : ""}
                  placeholder="Full name"
                  required
                />
                {errors.fullName && (
                  <div className="error-message">{errors.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Email Address"
                  required
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "error" : ""}
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
