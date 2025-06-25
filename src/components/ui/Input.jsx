"use client"

import { useState } from "react"
import "./styles/input.css"

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className={`input-group ${className}`}>
      {label && <label className={`input-label ${required ? "required" : ""}`}>{label}</label>}

      <div className={`input-wrapper ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}>
        {icon && iconPosition === "left" && <span className="input-icon input-icon-left">{icon}</span>}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-field ${icon ? `has-icon-${iconPosition}` : ""}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input-icon input-icon-right password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <span className="eye-icon eye-off">👁️‍🗨️</span> : <span className="eye-icon">👁️</span>}
          </button>
        )}

        {icon && iconPosition === "right" && !isPassword && <span className="input-icon input-icon-right">{icon}</span>}
      </div>

      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

export default Input
