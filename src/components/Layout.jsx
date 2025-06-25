"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import "./styles/layout.css"

const Layout = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  useEffect(() => {
    const handleCloseSidebarEvent = () => {
      setSidebarOpen(false)
    }

    window.addEventListener("closeSidebar", handleCloseSidebarEvent)

    return () => {
      window.removeEventListener("closeSidebar", handleCloseSidebarEvent)
    }
  }, [])

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Sidebar onLogout={onLogout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Topbar */}
        <Topbar user={user} onMobileMenuToggle={handleMobileMenuToggle} />

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="mobile-overlay" onClick={handleCloseSidebar}></div>}
    </div>
  )
}

export default Layout
