"use client"

import "./styles/button.css"

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const buttonClass = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${loading ? "btn-loading" : ""} 
    ${disabled ? "btn-disabled" : ""} 
    ${className}
  `.trim()

  return (
    <button type={type} className={buttonClass} onClick={onClick} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="btn-spinner">
          <span className="spinner"></span>
        </span>
      )}

      {icon && iconPosition === "left" && !loading && <span className="btn-icon btn-icon-left">{icon}</span>}

      <span className="btn-text">{children}</span>

      {icon && iconPosition === "right" && !loading && <span className="btn-icon btn-icon-right">{icon}</span>}
    </button>
  )
}

export default Button
