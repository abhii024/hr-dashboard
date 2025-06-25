"use client"

import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import "./AttendancePage.css";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [formData, setFormData] = useState({
    status: "",
    task: "",
    notes: "",
  })

  // Mock attendance data
  useEffect(() => {
    const mockAttendanceData = [
      {
        id: 1,
        employeeName: "Jane Copper",
        position: "Full Time",
        department: "Designer",
        task: "Dashboard Home page Alignment",
        status: "present",
        avatar: "/placeholder.svg?height=40&width=40",
        checkIn: "09:00 AM",
        checkOut: "06:00 PM",
        date: "2024-01-15",
      },
      {
        id: 2,
        employeeName: "Arlene McCoy",
        position: "Full Time",
        department: "Designer",
        task: "Dashboard Login page design, Dashboard Home page design",
        status: "absent",
        avatar: "/placeholder.svg?height=40&width=40",
        checkIn: "--",
        checkOut: "--",
        date: "2024-01-15",
      },
      {
        id: 3,
        employeeName: "Cody Fisher",
        position: "Senior",
        department: "Backend Development",
        task: "--",
        status: "absent",
        avatar: "/placeholder.svg?height=40&width=40",
        checkIn: "--",
        checkOut: "--",
        date: "2024-01-15",
      },
      {
        id: 4,
        employeeName: "Janney Wilson",
        position: "Junior",
        department: "Backend Development",
        task: "Dashboard login page integration",
        status: "present",
        avatar: "/placeholder.svg?height=40&width=40",
        checkIn: "09:15 AM",
        checkOut: "06:15 PM",
        date: "2024-01-15",
      },
      {
        id: 5,
        employeeName: "Leslie Alexander",
        position: "Team Lead",
        department: "Human Resource",
        task: "4 scheduled interview, Sorting of resumes",
        status: "present",
        avatar: "/placeholder.svg?height=40&width=40",
        checkIn: "08:45 AM",
        checkOut: "06:30 PM",
        date: "2024-01-15",
      },
    ]
    setAttendanceData(mockAttendanceData)
    setFilteredData(mockAttendanceData)
  }, [])

  // Filter attendance data
  useEffect(() => {
    let filtered = attendanceData

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.task.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [attendanceData, searchTerm, statusFilter])

  // Handle status change
  const handleStatusChange = (record, newStatus) => {
    const updatedData = attendanceData.map((item) =>
      item.id === record.id
        ? {
            ...item,
            status: newStatus,
            checkIn: newStatus === "present" ? "09:00 AM" : "--",
            checkOut: newStatus === "present" ? "06:00 PM" : "--",
          }
        : item,
    )
    setAttendanceData(updatedData)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Open edit modal
  const handleEditRecord = (record) => {
    setSelectedRecord(record)
    setFormData({
      status: record.status,
      task: record.task,
      notes: "",
    })
    setEditModalOpen(true)
  }

  // Save attendance changes
  const handleSaveRecord = () => {
    if (selectedRecord) {
      const updatedData = attendanceData.map((item) =>
        item.id === selectedRecord.id
          ? {
              ...item,
              status: formData.status,
              task: formData.task,
              checkIn: formData.status === "present" ? "09:00 AM" : "--",
              checkOut: formData.status === "present" ? "06:00 PM" : "--",
            }
          : item,
      )
      setAttendanceData(updatedData)
      setEditModalOpen(false)
      setSelectedRecord(null)
    }
  }

  // View attendance details
  const handleViewDetails = (record) => {
    alert(`
Attendance Details for ${record.employeeName}:
Date: ${record.date}
Status: ${record.status}
Check In: ${record.checkIn}
Check Out: ${record.checkOut}
Task: ${record.task}
    `)
  }

  // Generate report
  const handleGenerateReport = (record) => {
    alert(`Generating attendance report for ${record.employeeName}`)
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
    { key: "employeeName", header: "Employee Name" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    {
      key: "task",
      header: "Task",
      render: (value) => (
        <div className="task-cell">
          <span className="task-text">{value || "--"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value, row) => (
        <div className="status-cell">
          <div className="status-dropdown">
            <Badge variant={value === "present" ? "success" : "danger"} className="status-badge">
              {value === "present" ? "Present" : "Absent"}
              <span className="dropdown-arrow">▼</span>
            </Badge>
            <div className="status-dropdown-menu">
              <button
                className={`status-option ${value === "present" ? "active" : ""}`}
                onClick={() => handleStatusChange(row, "present")}
              >
                <span className="status-indicator present"></span>
                Present
              </button>
              <button
                className={`status-option ${value === "absent" ? "active" : ""}`}
                onClick={() => handleStatusChange(row, "absent")}
              >
                <span className="status-indicator absent"></span>
                Absent
              </button>
            </div>
          </div>
        </div>
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
      label: "Edit Record",
      icon: "✏️",
      onClick: handleEditRecord,
    },
    {
      label: "Generate Report",
      icon: "📊",
      onClick: handleGenerateReport,
    },
  ]

  return (
    <div className="attendance-page">
     

      <div className="attendance-content">
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

        <div className="table-section">
          <Table columns={columns} data={filteredData} actions={actions} />
        </div>
      </div>

      {/* Edit Attendance Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Attendance Record"
        size="medium"
        className="edit-attendance-modal"
      >
        <div className="modal-form">
          <div className="form-group">
            <label className="input-label required">Status</label>
            <div className="select-wrapper">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <Input
            label="Task"
            name="task"
            value={formData.task}
            onChange={handleInputChange}
            placeholder="Enter task description"
          />

          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any notes (optional)"
          />
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveRecord}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AttendancePage
