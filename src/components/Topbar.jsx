"use client"

import { useLocation } from "react-router-dom"
import "./styles/topbar.css"

const Topbar = ({ user, onMobileMenuToggle }) => {
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/candidates":
        return "Candidates"
      case "/employees":
        return "Employees"
      case "/attendance":
        return "Attendance"
      case "/leaves":
        return "Leaves"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMobileMenuToggle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-actions">
          {/* Mail Icon */}
          <button className="topbar-action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Notification Icon */}
          <button className="topbar-action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <img src="/placeholder.svg?height=32&width=32" alt="User" className="user-avatar" />
            <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
