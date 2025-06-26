"use client";

import { useState, useEffect, useCallback } from "react";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import "./LeavesPage.css";
import Api from "../../api";
const LeavesPage = () => {
  const [leavesData, setLeavesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [addLeaveModalOpen, setAddLeaveModalOpen] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [employees, setEmployees] = useState([]);
  // const employees = [
  //   { _id: "emp1", name: "Jane Cooper" },
  //   { _id: "emp2", name: "Janney Wilson" },
  //   { _id: "emp3", name: "Jacob Lee" },
  //   { _id: "emp4", name: "Jasmine Stone" },
  // ];

  const [formData, setFormData] = useState({
    employeeName: "",
    designation: "",
    leaveDate: "",
    reason: "",
    documents: null,
    _id: null,
  });

  useEffect(() => {
    fetchCandidates();
    fetchLeaves();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await Api.get("/candidates");
      console.log("response", response.data);

      setEmployees(response?.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await Api.get("/leaves", {
        params: { status: statusFilter || "" }, // empty means all
      });
      // setLeaveData(res.data);
      const formatted = res.data.map((item, index) => {
        const leaveDate = new Date(item.leaveDate);

        // Format date to DD/MM/YY
        const formatDate = (date) => {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear()).slice(-2);
          return `${day}/${month}/${year}`;
        };

        const dateFormatted = formatDate(leaveDate);
        const isoDate = leaveDate.toISOString().split("T")[0]; // YYYY-MM-DD

        return {
          id: item._id,
          employeeName: item.employee?.fullName || "N/A",
          designation: item.designation,
          date: dateFormatted,
          reason: item.reason,
          status: item.status.toLowerCase(),
          documents: item.documents,
          avatar: "/placeholder.svg?height=40&width=40",
          startDate: isoDate,
          endDate: isoDate,
        };
      });

      setLeavesData(formatted);
      setFilteredData(formatted);
    } catch (err) {
      console.error("Error fetching leave data:", err);
    }
  }, [statusFilter]);
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
    ];
    setLeavesData(mockLeavesData);
    setFilteredData(mockLeavesData);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setEmployeeSearchTerm(term);
    if (term.trim() === "") {
      setShowDropdown(false);
      setFilteredEmployees([]);
    } else {
      const results = employees.filter((emp) =>
        emp.fullName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmployees(results);
      setShowDropdown(true);
    }
  };

  const clearSearch = () => {
    setEmployeeSearchTerm("");
    setShowDropdown(false);
    setFilteredEmployees([]);
    setFormData((prev) => ({
      ...prev,
      _id: "",
      employeeName: "",
    }));
  };

  const handleSelect = (emp) => {
    setEmployeeSearchTerm(emp.fullName);
    setShowDropdown(false);
    setFormData((prev) => ({
      ...prev,
      _id: emp._id,
      employeeName: emp.fullName,
    }));
    console.log("Selected employee _id:", emp._id);
  };

  // Filter leaves data
  useEffect(() => {
    let filtered = leavesData;

    if (searchTerm) {
      filtered = filtered.filter(
        (leave) =>
          leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((leave) => leave.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [leavesData, searchTerm, statusFilter]);

  // Filter employees for search

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Select employee from dropdown
  const handleEmployeeSelect = (employee) => {
    console.log("employee", employee);
    setSelectedEmployee(employee);
    setEmployeeSearchTerm(employee.name);
    setFormData((prev) => ({
      ...prev,
      employeeName: employee.name,
      // designation: employee.designation,
    }));
    setShowEmployeeDropdown(false);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      documents: e.target.files[0],
    }));
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  // Save new leave
  const handleSaveLeave = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.employeeName?.trim())
      newErrors.employeeName = "Employee name is required";
    if (!formData.designation?.trim())
      newErrors.designation = "Designation is required";
    if (!formData.leaveDate) newErrors.leaveDate = "Leave date is required";
    if (!formData.documents) newErrors.documents = "Document is required";
    if (!formData.reason?.trim()) newErrors.reason = "Reason is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const leaveFormData = new FormData();
      leaveFormData.append("designation", formData.designation);
      leaveFormData.append("leaveDate", formData.leaveDate);
      leaveFormData.append("reason", formData.reason);
      leaveFormData.append("documents", formData.documents);
      leaveFormData.append("_id", formData._id); // Employee _id

      const res = await Api.post("/leaves", leaveFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Leave submitted successfully");
      setAddLeaveModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error submitting leave:", err);
      alert("Failed to submit leave");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeName: "",
      designation: "",
      leaveDate: "",
      reason: "",
      documents: null,
    });
    setEmployeeSearchTerm("");
    setSelectedEmployee(null);
    setShowEmployeeDropdown(false);
  };

  // Handle status change
  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const res = await Api.put(`/leaves/${leaveId}/status`, {
        status: newStatus,
      });
      console.log("Status updated:", res.data);
      // Optional: Refresh the data
      // fetchLeaves(); // callback to refresh data

      const updatedData = leavesData.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      );
      setLeavesData(updatedData);
    } catch (err) {
      console.error("Error updating leave status:", err);
      alert("Failed to update status");
    }
  };

  // Download document
  const handleDownloadDocument = (leave) => {
    alert(`Downloading document: ${leave.documents}`);
    const link = document.createElement("a");
    link.href = `http://localhost:8000/uploads/resumes/${leave.documents}`;
    link.download = leave.documents; // trigger download with original filename
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View leave details

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Check if date has leave
  const hasLeave = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return leavesData.some(
      (leave) => leave.startDate === dateStr && leave.status === "approved"
    );
  };

  // Get approved leaves for current month
  const getApprovedLeaves = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return leavesData.filter((leave) => {
      const leaveDate = new Date(leave.startDate);
      return (
        leaveDate.getMonth() === currentMonth &&
        leaveDate.getFullYear() === currentYear &&
        leave.status === "approved"
      );
    });
  };

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
              variant={
                value === "approved"
                  ? "success"
                  : value === "pending"
                  ? "warning"
                  : "danger"
              }
              className="status-badge"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
              <span className="dropdown-arrow">▼</span>
            </Badge>
            <div className="status-dropdown-menu">
              <button
                className={`status-option ${
                  value === "approved" ? "active" : ""
                }`}
                onClick={() => handleStatusChange(row.id, "approved")}
              >
                <span className="status-indicator approved"></span>
                Approved
              </button>
              <button
                className={`status-option ${
                  value === "pending" ? "active" : ""
                }`}
                onClick={() => handleStatusChange(row.id, "pending")}
              >
                <span className="status-indicator pending"></span>
                Pending
              </button>
              <button
                className={`status-option ${
                  value === "rejected" ? "active" : ""
                }`}
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
        <button
          className="download-btn"
          onClick={() => handleDownloadDocument(row)}
        >
          📄
        </button>
      ),
    },
  ];

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
  ];

  return (
    <div className="leaves-page">
      <div className="leaves-content">
        <div className="filters-section">
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="search-add-group">
            <div className="search-input-wrapper" style={{ width: "58%" }}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            {/* {setModalOpen && ( */}
            <button
              style={{ marginBottom: "0px", width: "40%" }}
              className="btn btn-primary"
              onClick={() => {
                setAddLeaveModalOpen(true);
              }}
            >
              Add Leave
            </button>
            {/* )} */}
          </div>
        </div>

        <div className="main-content">
          <div className="applied-leaves-section">
            {/* <div className="section-header">
              <h2>Applied Leaves</h2>
            </div> */}
            <Table columns={columns} data={filteredData} />
          </div>

          <div className="leave-calendar-section">
            <div className="section-header">
              <h2>Leave Calendar</h2>
            </div>
            <div className="calendar-container">
              <div className="calendar-header">
                <button
                  className="nav-btn"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                >
                  ‹
                </button>
                <span className="month-year">
                  {monthNames[currentDate.getMonth()]},{" "}
                  {currentDate.getFullYear()}
                </span>
                <button
                  className="nav-btn"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        1
                      )
                    )
                  }
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
                      className={`day ${
                        date.getMonth() !== currentDate.getMonth()
                          ? "other-month"
                          : ""
                      } ${hasLeave(date) ? "has-leave" : ""}`}
                    >
                      {date.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="approved-leaves">
                <h3 className="approved-leaves-title">Approved Leaves</h3>
                <div className="approved-leaves-list">
                  {getApprovedLeaves().map((leave) => (
                    <div key={leave.id} className="approved-leave-item">
                      <img
                        src={leave.avatar}
                        alt={leave.employeeName}
                        className="leave-avatar"
                      />
                      <div className="leave-info">
                        <div className="leave-name">{leave.employeeName}</div>
                        <div className="leave-designation">
                          {leave.designation}
                        </div>
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
          setAddLeaveModalOpen(false);
          resetForm();
        }}
        title="Add New Leave"
        size="large"
        className="add-leave-modal"
      >
        <form className="modal-form" onSubmit={handleSaveLeave}>
          <div className="form-row">
            {/* Employee Search */}
            <div className="employee-search-group">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search Employee Name"
                    value={employeeSearchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  {employeeSearchTerm && (
                    <button className="clear-button" onClick={clearSearch}>
                      ×
                    </button>
                  )}
                </div>

                {showDropdown && filteredEmployees.length > 0 && (
                  <ul className="search-dropdown">
                    {filteredEmployees.map((emp, index) => (
                      <li
                        key={emp._id}
                        className="dropdown-item"
                        title={emp.fullName}
                        onClick={() => handleSelect(emp)}
                      >
                        {emp.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Designation Input */}
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Designation"
              required
              error={errors.designation}
            />
          </div>

          <div className="form-row">
            {/* Leave Date */}
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
              </div>
              {errors.leaveDate && <p className="error">{errors.leaveDate}</p>}
            </div>

            {/* Resume Upload */}
            <div className="custom-file-upload">
              <label htmlFor="resume" className="upload-label">
                Resume<span className="required-star">*</span>
              </label>
              <div className="upload-box">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleFileUpload}
                  className="upload-input"
                  accept=".pdf,.doc,.docx"
                />
                <span className="file-name">
                  {formData.documents
                    ? formData.documents.name
                    : "Choose a file..."}
                </span>
                <span className="upload-icon">📤</span>
              </div>
              {errors.resume && <p className="error">{errors.resume}</p>}
            </div>
          </div>

          {/* Reason Input */}
          <Input
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason for leave"
            required
            error={errors.reason}
          />

          <Modal.Footer>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default LeavesPage;
