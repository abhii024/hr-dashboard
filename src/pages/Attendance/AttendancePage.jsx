"use client";

import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import "./AttendancePage.css";
import Api from "../../api";
import Header from "../../components/ui/Header.jsx";
const AttendancePage = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const [finalDate, setFinalDate] = useState([]);
  const positions = ["Human Resource", "Designer", "Developer"];
  const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];

  useEffect(() => {
    fetchCandidates(candidatesData);
  }, [candidatesData]);

  const fetchCandidates = async (candidatesData) => {
    const formatted = candidatesData.map((item, index) => ({
      _id: item._id,
      srNo: (index + 1).toString().padStart(2, "0"),
      employeeName: item.fullName,
      email: item.email,
      phone: item.phone,
      position: item.position,
      status: item.attendanceStatus.toLowerCase(),
      experience: item.experience,
      department: item.department,
    }));
    setFinalDate(formatted);
  };

  // Handle status change
  const handleStatusChange = async (record, newStatus) => {
    let id = record._id;
    try {
      await Api.put(`/candidates/${id}/attendance`, {
        attendanceStatus: newStatus,
      });
      const updatedData = finalDate.map((item) =>
        item._id === id ? { ...item, status: newStatus.toLowerCase() } : item
      );

      setFinalDate(updatedData);
      alert("Attendance updated");
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
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
            <Badge
              variant={value === "present" ? "success" : "danger"}
              className="status-badge"
            >
              {value === "present" ? "Present" : "Absent"}
              <span className="dropdown-arrow">▼</span>
            </Badge>
            <div className="status-dropdown-menu">
              <button
                className={`status-option ${
                  value === "present" ? "active" : ""
                }`}
                onClick={() => handleStatusChange(row, "present")}
              >
                <span className="status-indicator present"></span>
                Present
              </button>
              <button
                className={`status-option ${
                  value === "absent" ? "active" : ""
                }`}
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
  ];

  return (
    <div className="attendance-page">
      <div className="attendance-content">
        <Header
          setCandidatesData={setCandidatesData}
          positions={positions}
          statuses={statuses}
        />

        <Table columns={columns} data={finalDate} />
      </div>
    </div>
  );
};

export default AttendancePage;
