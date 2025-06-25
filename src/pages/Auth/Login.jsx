"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"
import api from "../../api";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    // Simulate API call
   const res = await api.post("/login", formData);
         console.log(res.data);
   
         localStorage.setItem("token", res.data.token);
         alert(res.data.message);
         setTimeout(() => {
           setLoading(false);
           navigate("/candidates")
         }, 1000);
  }

  return (
    <div className="auth-container">
      {/* <div className="top-logo">
        <div className="logo-icon"></div>
        <span>LOGO</span>
      </div> */}

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
            <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</h2>
            <p>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form">
            <h1>Welcome to Dashboard</h1>

            <form onSubmit={handleSubmit}>
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
                {errors.email && <div className="error-message">{errors.email}</div>}
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
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="auth-switch">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
