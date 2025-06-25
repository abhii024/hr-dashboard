"use client";

import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./EmployeesPage.css";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    dateOfJoining: "",
  });

  // Mock employees data
  useEffect(() => {
    const mockEmployees = [
      {
        id: 1,
        fullName: "Jane Copper",
        email: "jane.copper@example.com",
        phone: "(704) 555-0127",
        position: "Intern",
        department: "Designer",
        dateOfJoining: "10/06/13",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        fullName: "Arlene McCoy",
        email: "arlene.mccoy@example.com",
        phone: "(302) 555-0107",
        position: "Full Time",
        department: "Designer",
        dateOfJoining: "11/07/16",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        fullName: "Cody Fisher",
        email: "deanna.curtis@example.com",
        phone: "(252) 555-0126",
        position: "Senior",
        department: "Backend Development",
        dateOfJoining: "08/15/17",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        fullName: "Janney Wilson",
        email: "janney.wilson@example.com",
        phone: "(252) 555-0126",
        position: "Junior",
        department: "Backend Development",
        dateOfJoining: "12/04/17",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 5,
        fullName: "Leslie Alexander",
        email: "willie.jennings@example.com",
        phone: "(207) 555-0119",
        position: "Team Lead",
        department: "Human Resource",
        dateOfJoining: "05/30/14",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ];
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (positionFilter) {
      filtered = filtered.filter(
        (employee) => employee.position === positionFilter
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, positionFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    setEditModalOpen(true);
  };

  // Save employee changes
  const handleSaveEmployee = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              department: formData.department,
              position: formData.position,
              dateOfJoining: formData.dateOfJoining,
            }
          : emp
      );
      setEmployees(updatedEmployees);
      setEditModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Delete employee
  const handleDeleteEmployee = (employee) => {
    if (
      window.confirm(`Are you sure you want to delete ${employee.fullName}?`)
    ) {
      setEmployees(employees.filter((emp) => emp.id !== employee.id));
    }
  };

  // View employee details
  const handleViewEmployee = (employee) => {
    alert(`Viewing details for ${employee.fullName}`);
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
      label: "View Details",
      icon: "👁️",
      onClick: handleViewEmployee,
    },
    {
      label: "Edit Employee",
      icon: "✏️",
      onClick: handleEditEmployee,
    },
    {
      label: "Delete Employee",
      icon: "🗑️",
      onClick: handleDeleteEmployee,
      className: "danger",
    },
  ];

  return (
    <div className="employees-page">
      <div className="page-header"></div>

      <div className="employees-content">
       <div className="filters-section">
          <div className="filter-group">
            <select  className="filter-select">
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
          <Table columns={columns} data={filteredEmployees} actions={actions} />
        </div>
      </div>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Employee Details"
        size="large"
        className="edit-employee-modal"
      >
        <div className="modal-form">
          <div className="form-row">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required
            />
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
              required
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label required">Position</label>
              <div className="select-wrapper">
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label required">Date of Joining</label>
              <div className="date-input-wrapper">
                <input
                  type="text"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                  placeholder="MM/DD/YY"
                  className="date-input"
                  required
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveEmployee}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
