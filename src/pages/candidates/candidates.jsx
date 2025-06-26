"use client";

import { useState, useEffect } from "react";
import "./Candidates.css";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Api from "../../api.js";
import Header from "../../components/ui/Header.jsx";
const Candidates = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [candidatesData, setCandidatesData] = useState([]);
  const [finalDate, setFinalDate] = useState([]);
  const positions = ["Human Resource", "Designer", "Developer"];
  const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
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
        if (!row.resume) {
          alert("No resume available for this candidate.");
          return;
        }

        const link = document.createElement("a");
        link.href = `http://localhost:8000/uploads/resumes/${row.resume}`;
        link.download = row.resume; // trigger download with original filename
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      label: "Delete Candidate",
      icon: "🗑️",
      onClick: (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
          alert(`Deleted ${row.name}`);
          // Optionally: call DELETE API here
        }
      },
      className: "danger",
    },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null, // file object
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.resume) newErrors.resume = "Resume file is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Here you can use FormData to send file via API
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("position", formData.position);
    data.append("experience", formData.experience);
    data.append("resume", formData.resume);

    try {
      const res = Api.post("/candidates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: null,
        message: res.data.message || "Candidate created!",
      });

      setModalOpen(false);
    } catch (err) {
      console.log(err.response?.data?.message || "Upload failed");
    }
  };

  useEffect(() => {
    const formatted = candidatesData.map((item, index) => ({
      _id: item._id,
      srNo: (index + 1).toString().padStart(2, "0"),
      name: item.fullName,
      email: item.email,
      phone: item.phone,
      position: item.position,
      status: item.status.toLowerCase(),
      experience: item.experience,
      resume: item.resume,
    }));
    setFinalDate(formatted);
  }, [candidatesData]);

  return (
    <div className="candidates-page">
      <div className="content-container">
        <Header
          setCandidatesData={setCandidatesData}
          setModalOpen={setModalOpen}
          positions={positions}
          statuses= {statuses}
        />
        <Table columns={columns} data={finalDate} actions={actions} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Candidate"
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
                  <option value="Human Resource">Human Resource</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
              {errors.position && <p className="error">{errors.position}</p>}
            </div>
          </div>

          <div className="form-row">
            <Input
              label="Experience"
              name="experience"
              placeholder="Enter experience (e.g. 2 years)"
              value={formData.experience}
              onChange={handleChange}
              required
              error={errors.experience}
            />
            <div className="custom-file-upload">
              <label htmlFor="resume" className="upload-label">
                Resume<span className="required-star">*</span>
              </label>

              <div className="upload-box">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleChange}
                  className="upload-input"
                  accept=".pdf,.doc,.docx"
                />
                <span className="file-name">
                  {formData.resume ? formData.resume.name : "Choose a file..."}
                </span>
                <span className="upload-icon">📤</span> {/* or use SVG */}
              </div>

              {errors.resume && <p className="error">{errors.resume}</p>}
            </div>
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

export default Candidates;
