"use client"

import { useState, useEffect } from "react"
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import "./LeavesPage.css"

const LeavesPage = () => {
  const [leavesData, setLeavesData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [addLeaveModalOpen, setAddLeaveModalOpen] = useState(false)
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [formData, setFormData] = useState({
    employeeName: "",
    designation: "",
    leaveDate: "",
    reason: "",
    documents: null,
  })

  // Mock employees data for search
  const employees = [
    { id: 1, name: "Jane Cooper", designation: "Designer", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Janney Wilson", designation: "Backend Developer", avatar: "/placeholder.svg?height=32&width=32" },
    {
      id: 3,
      name: "Cody Fisher",
      designation: "Senior Backend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    { id: 4, name: "Arlene McCoy", designation: "Full Time Designer", avatar: "/placeholder.svg?height=32&width=32" },
    {
      id: 5,
      name: "Leslie Alexander",
      designation: "Team Lead Human Resource",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Mock leaves data
  useEffect(() => {
    const mockLeavesData = [
      {
        id: 1,
        employeeName: "Cody Fisher",
        designation: "Senior Backend Developer",
        date: "8/09/24",
        reason: "Visiting House",
        status: "approved",
        documents: "medical-certificate.pdf",
        avatar: "/placeholder.svg?height=40&width=40",
        startDate: "2024-09-08",
        endDate: "2024-09-08",
        days: 1,
      },
      {
        id: 2,
        employeeName: "Jane Cooper",
        designation: "Designer",
        date: "15/09/24",
        reason: "Family Emergency",
        status: "pending",
        documents: "emergency-letter.pdf",
        avatar: "/placeholder.svg?height=40&width=40",
        startDate: "2024-09-15",
        endDate: "2024-09-17",
        days: 3,
      },
      {
        id: 3,
        employeeName: "Arlene McCoy",
        designation: "Full Time Designer",
        date: "20/09/24",
        reason: "Medical Appointment",
        status: "rejected",
        documents: "appointment-slip.pdf",
        avatar: "/placeholder.svg?height=40&width=40",
        startDate: "2024-09-20",
        endDate: "2024-09-20",
        days: 1,
      },
    ]
    setLeavesData(mockLeavesData)
    setFilteredData(mockLeavesData)
  }, [])

  // Filter leaves data
  useEffect(() => {
    let filtered = leavesData

    if (searchTerm) {
      filtered = filtered.filter(
        (leave) =>
          leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.reason.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((leave) => leave.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [leavesData, searchTerm, statusFilter])

  // Filter employees for search
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle employee search
  const handleEmployeeSearch = (e) => {
    const value = e.target.value
    setEmployeeSearchTerm(value)
    setShowEmployeeDropdown(value.length > 0)
    setFormData((prev) => ({
      ...prev,
      employeeName: value,
    }))
  }

  // Select employee from dropdown
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
    setEmployeeSearchTerm(employee.name)
    setFormData((prev) => ({
      ...prev,
      employeeName: employee.name,
      designation: employee.designation,
    }))
    setShowEmployeeDropdown(false)
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({
      ...prev,
      documents: file,
    }))
  }

  // Save new leave
  const handleSaveLeave = () => {
    if (formData.employeeName && formData.leaveDate && formData.reason) {
      const newLeave = {
        id: leavesData.length + 1,
        employeeName: formData.employeeName,
        designation: formData.designation,
        date: formData.leaveDate,
        reason: formData.reason,
        status: "pending",
        documents: formData.documents?.name || "",
        avatar: selectedEmployee?.avatar || "/placeholder.svg?height=40&width=40",
        startDate: formData.leaveDate,
        endDate: formData.leaveDate,
        days: 1,
      }
      setLeavesData([...leavesData, newLeave])
      setAddLeaveModalOpen(false)
      resetForm()
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeName: "",
      designation: "",
      leaveDate: "",
      reason: "",
      documents: null,
    })
    setEmployeeSearchTerm("")
    setSelectedEmployee(null)
    setShowEmployeeDropdown(false)
  }

  // Handle status change
  const handleStatusChange = (leaveId, newStatus) => {
    const updatedData = leavesData.map((leave) => (leave.id === leaveId ? { ...leave, status: newStatus } : leave))
    setLeavesData(updatedData)
  }

  // Download document
  const handleDownloadDocument = (leave) => {
    alert(`Downloading document: ${leave.documents}`)
  }

  // View leave details
  const handleViewDetails = (leave) => {
    alert(`
Leave Details:
Employee: ${leave.employeeName}
Date: ${leave.date}
Reason: ${leave.reason}
Status: ${leave.status}
Documents: ${leave.documents}
    `)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Check if date has leave
  const hasLeave = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return leavesData.some((leave) => leave.startDate === dateStr && leave.status === "approved")
  }

  // Get approved leaves for current month
  const getApprovedLeaves = () => {
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    return leavesData.filter((leave) => {
      const leaveDate = new Date(leave.startDate)
      return (
        leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear && leave.status === "approved"
      )
    })
  }

  // Table columns
  const columns = [
    {
      key: "profile",
      header: "Profile",
      render: (value, row) => (
        <div className="profile-cell">
          <img
            src={row.avatar || "/placeholder.svg?height=40&width=40"}
            alt={row.employeeName}
            className="employee-avatar"
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (value, row) => (
        <div className="name-cell">
          <div className="employee-name">{row.employeeName}</div>
          <div className="employee-designation">{row.designation}</div>
        </div>
      ),
    },
    { key: "date", header: "Date" },
    { key: "reason", header: "Reason" },
    {
      key: "status",
      header: "Status",
      render: (value, row) => (
        <div className="status-cell">
          <div className="status-dropdown">
            <Badge
              variant={value === "approved" ? "success" : value === "pending" ? "warning" : "danger"}
              className="status-badge"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
              <span className="dropdown-arrow">▼</span>
            </Badge>
            <div className="status-dropdown-menu">
              <button
                className={`status-option ${value === "approved" ? "active" : ""}`}
                onClick={() => handleStatusChange(row.id, "approved")}
              >
                <span className="status-indicator approved"></span>
                Approved
              </button>
              <button
                className={`status-option ${value === "pending" ? "active" : ""}`}
                onClick={() => handleStatusChange(row.id, "pending")}
              >
                <span className="status-indicator pending"></span>
                Pending
              </button>
              <button
                className={`status-option ${value === "rejected" ? "active" : ""}`}
                onClick={() => handleStatusChange(row.id, "rejected")}
              >
                <span className="status-indicator rejected"></span>
                Rejected
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "docs",
      header: "Docs",
      render: (value, row) => (
        <button className="download-btn" onClick={() => handleDownloadDocument(row)}>
          📄
        </button>
      ),
    },
  ]

  // Table actions
  const actions = [
    {
      label: "View Details",
      icon: "👁️",
      onClick: handleViewDetails,
    },
    {
      label: "Approve",
      icon: "✅",
      onClick: (row) => handleStatusChange(row.id, "approved"),
      disabled: (row) => row.status === "approved",
    },
    {
      label: "Reject",
      icon: "❌",
      onClick: (row) => handleStatusChange(row.id, "rejected"),
      className: "danger",
    },
  ]

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="leaves-page">
      <div className="leaves-content">
       <div className="filters-section">
          <div className="filter-group">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="">Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="search-group">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="applied-leaves-section">
            {/* <div className="section-header">
              <h2>Applied Leaves</h2>
            </div> */}
            <div className="table-section">
              <Table columns={columns} data={filteredData} actions={actions} />
            </div>
          </div>

          <div className="leave-calendar-section">
            <div className="section-header">
              <h2>Leave Calendar</h2>
            </div>
            <div className="calendar-container">
              <div className="calendar-header">
                <button
                  className="nav-btn"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                >
                  ‹
                </button>
                <span className="month-year">
                  {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </span>
                <button
                  className="nav-btn"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                >
                  ›
                </button>
              </div>

              <div className="calendar-grid">
                <div className="weekdays">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={index} className="weekday">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="days">
                  {generateCalendarDays().map((date, index) => (
                    <div
                      key={index}
                      className={`day ${date.getMonth() !== currentDate.getMonth() ? "other-month" : ""} ${
                        hasLeave(date) ? "has-leave" : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="approved-leaves">
                <h3>Approved Leaves</h3>
                <div className="approved-leaves-list">
                  {getApprovedLeaves().map((leave) => (
                    <div key={leave.id} className="approved-leave-item">
                      <img src={leave.avatar || "/placeholder.svg"} alt={leave.employeeName} className="leave-avatar" />
                      <div className="leave-info">
                        <div className="leave-name">{leave.employeeName}</div>
                        <div className="leave-designation">{leave.designation}</div>
                      </div>
                      <div className="leave-date">{leave.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      <Modal
        isOpen={addLeaveModalOpen}
        onClose={() => {
          setAddLeaveModalOpen(false)
          resetForm()
        }}
        title="Add New Leave"
        size="large"
        className="add-leave-modal"
      >
        <div className="modal-form">
          <div className="form-row">
            <div className="employee-search-group">
              <div className="search-input-container">
                <span className="search-icon-modal">🔍</span>
                <input
                  type="text"
                  placeholder="Search Employee Name"
                  value={employeeSearchTerm}
                  onChange={handleEmployeeSearch}
                  className="employee-search-input"
                />
                {employeeSearchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => {
                      setEmployeeSearchTerm("")
                      setShowEmployeeDropdown(false)
                      setFormData((prev) => ({ ...prev, employeeName: "", designation: "" }))
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {showEmployeeDropdown && filteredEmployees.length > 0 && (
                <div className="employee-dropdown">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="employee-option" onClick={() => handleEmployeeSelect(employee)}>
                      <img
                        src={employee.avatar || "/placeholder.svg"}
                        alt={employee.name}
                        className="employee-option-avatar"
                      />
                      <div className="employee-option-info">
                        <div className="employee-option-name">{employee.name}</div>
                        <div className="employee-option-designation">{employee.designation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Designation"
              required
              disabled
            />
          </div>

          <div className="form-row">
            <div className="date-input-group">
              <label className="input-label required">Leave Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  name="leaveDate"
                  value={formData.leaveDate}
                  onChange={handleInputChange}
                  className="date-input"
                  required
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>

            <div className="file-upload-group">
              <label className="input-label">Documents</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="documents"
                  onChange={handleFileUpload}
                  className="file-input"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <label htmlFor="documents" className="file-upload-label">
                  <span className="upload-icon">📎</span>
                  {formData.documents ? formData.documents.name : "Choose file"}
                </label>
              </div>
            </div>
          </div>

          <Input
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason for leave"
            required
          />
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddLeaveModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveLeave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default LeavesPage
