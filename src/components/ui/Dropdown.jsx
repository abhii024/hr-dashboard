"use client"

import { useState, useRef, useEffect } from "react"
import "./styles/dropdown.css"

const Dropdown = ({ trigger, children, position = "bottom-right", className = "", closeOnClick = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = () => {
    if (closeOnClick) {
      setIsOpen(false)
    }
  }

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`dropdown-menu dropdown-${position}`} onClick={handleItemClick}>
          {children}
        </div>
      )}
    </div>
  )
}

const DropdownItem = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      className={`dropdown-item ${className} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const DropdownDivider = () => {
  return <div className="dropdown-divider"></div>
}

Dropdown.Item = DropdownItem
Dropdown.Divider = DropdownDivider

export default Dropdown
