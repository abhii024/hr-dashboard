"use client";

import { useState } from "react";
import "./Candidates.css";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const candidatesData = [
    {
      id: 1,
      srNo: "01",
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      phone: "(704) 555-0127",
      position: "Designer Intern",
      status: "new",
      experience: "0",
    },
    {
      id: 2,
      srNo: "02",
      name: "Janney Wilson",
      email: "janney.wilson@example.com",
      phone: "(252) 555-0126",
      position: "Senior Developer",
      status: "new",
      experience: "1+",
    },
    {
      id: 3,
      srNo: "03",
      name: "Guy Hawkins",
      email: "kenzi.lawson@example.com",
      phone: "(907) 555-0101",
      position: "Human Resource I...",
      status: "new",
      experience: "10+",
    },
    {
      id: 4,
      srNo: "04",
      name: "Arlene McCoy",
      email: "arlene.mccoy@example.com",
      phone: "(302) 555-0107",
      position: "Full Time Designer",
      status: "selected",
      experience: "5+",
    },
    {
      id: 5,
      srNo: "05",
      name: "Leslie Alexander",
      email: "willie.jennings@example.com",
      phone: "(207) 555-0119",
      position: "Full Time Developer",
      status: "rejected",
      experience: "0",
    },
  ];

  // Table columns
  const columns = [
    { key: "srNo", header: "Sr no." },
    { key: "name", header: "Candidates Name" },
    { key: "email", header: "Email Address" },
    { key: "phone", header: "Phone Number" },
    { key: "position", header: "Position" },
    {
      key: "status",
      header: "Status",
      render: (value) => {
        const variant =
          value === "new"
            ? "info"
            : value === "selected"
            ? "success"
            : "danger";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    { key: "experience", header: "Experience" },
  ];

  // Table actions for 3-dot menu
  const actions = [
    {
      label: "Download Resume",
      icon: "📄",
      onClick: (row) => {
        alert(`Downloading resume for ${row.name}`);
      },
    },
    {
      label: "Move to Employee",
      icon: "👤",
      onClick: (row) => {
        alert(`Moving ${row.name} to employees`);
      },
      disabled: (row) => row.status === "rejected",
    },
    {
      label: "Edit Candidate",
      icon: "✏️",
      onClick: (row) => {
        alert(`Editing ${row.name}`);
      },
    },
    {
      label: "Delete Candidate",
      icon: "🗑️",
      onClick: (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
          alert(`Deleted ${row.name}`);
        }
      },
      className: "danger",
    },
  ];

  const handleAddCandidate = (candidateData) => {
    const newCandidate = {
      id: candidates.length + 1,
      ...candidateData,
      status: "new",
    };
    setCandidates([...candidates, newCandidate]);
    setShowAddModal(false);
  };

  return (
    <div className="candidates-page">
      <div className="content-container">
        <div className="filters-section">
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="search-add-group">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add Candidate
            </button>
          </div>
        </div>
        <Table columns={columns} data={candidatesData} actions={actions} />
      </div>

      {/* {showAddModal && (
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCandidate}
        />
      )} */}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        size="medium"
      >
        <p>This is an example modal content. You can put any content here.</p>
        <Input label="Name" placeholder="Enter name" />
        <Input label="Email" type="email" placeholder="Enter email" />

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Candidates;
