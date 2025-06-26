"use client";

import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./EmployeesPage.css";
import Header from "../../components/ui/Header.jsx";

import Api from "../../api.js";
const EmployeesPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatesData, setCandidatesData] = useState([]);
  const [finalDate, setFinalDate] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    dateOfJoining: "",
  });

  const positions = ["Human Resource", "Designer", "Developer"];
  const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  // Handle form input changes

  // Open edit modal
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      dateOfJoining: employee.dateOfJoining,
    });
    setModalOpen(true);
  };

  const columns = [
    {
      key: "profile",
      header: "Profile",
      render: (value, row) => (
        <div className="profile-cell">
          <img
            src={row.avatar || "/placeholder.svg?height=40&width=40"}
            alt={row.fullName}
            className="employee-avatar"
          />
        </div>
      ),
    },
    { key: "fullName", header: "Employee Name" },
    { key: "email", header: "Email Address" },
    { key: "phone", header: "Phone Number" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "dateOfJoining", header: "Date of Joining" },
  ];

  // Table actions
  const actions = [
    {
      label: "Edit Employee",
      icon: "✏️",
      onClick: handleEditEmployee,
    },
    {
      label: "Delete Candidate",
      icon: "🗑️",
      onClick: (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
          deleteCandidate(row._id);
        }
      },
      className: "danger",
    },
  ];
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.dateOfJoining)
      newErrors.dateOfJoining = "Date of joining is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Submitting", formData);
    let id = selectedEmployee._id;
    // Submit data
    try {
      const res = await Api.put(`/candidates/${id}`, formData);
      console.log("res", res);
      alert("Candidate updated");
      fetchCandidates(); // Refresh list
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }

    // Clear form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      dateOfJoining: "",
    });

    // Close modal
    setModalOpen(false);
  };

  useEffect(() => {
    fetchCandidates(candidatesData);
  }, [candidatesData]);

  const fetchCandidates = async (candidatesData) => {
    const formatted = candidatesData.map((item, index) => ({
      _id: item._id,
      srNo: (index + 1).toString().padStart(2, "0"),
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      position: item.position,
      status: item.status.toLowerCase(),
      experience: item.experience,
      resume: item.resume,
      dateOfJoining: item.dateOfJoining,
      department: item.department,
    }));
    setFinalDate(formatted);
  };

  const deleteCandidate = async (id) => {
    try {
      await Api.delete(`/candidates/${id}`);
      alert("Candidate deleted successfully");
      // Optionally refresh data:
      fetchCandidates();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete candidate");
    }
  };

  return (
    <div className="employees-page">
      <div className="employees-content">
        <Header
          setCandidatesData={setCandidatesData}
          setModalOpen={setModalOpen}
          positions={positions}
          statuses={statuses}
        />

        <Table columns={columns} data={finalDate} actions={actions} />
      </div>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Employee Details"
        size="large"
        className="edit-employee-modal"
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              error={errors.fullName}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />
          </div>

          <div className="form-row">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              error={errors.phone}
            />
            <Input
              label="Department"
              name="department"
              placeholder="Enter department"
              value={formData.department}
              onChange={handleChange}
              required
              error={errors.department}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label required">Position</label>
              <div className="select-wrapper">
                <select
                  name="position"
                  className="form-select"
                  value={formData.position}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="HumanResource">Human Resource</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
              {errors.position && <p className="error">{errors.position}</p>}
            </div>

            <Input
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              placeholder="MM/DD/YY"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
              error={errors.dateOfJoining}
            />
          </div>

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

export default EmployeesPage;
