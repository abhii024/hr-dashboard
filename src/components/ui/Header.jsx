import React from "react";
import { useState, useEffect } from "react";

import Api from "../../api";
const Header = ({ setCandidatesData, setModalOpen, positions, statuses }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allCandidates, setAllCandidates] = useState([]);
  useEffect(() => {
    fetchCandidates();
  }, [statusFilter, positionFilter]);

  const fetchCandidates = async () => {
    try {
      const response = await Api.get("/candidates", {
        params: {
          status: statusFilter,
          position: positionFilter,
        },
      });
      console.log("response", response.data);
      setAllCandidates(response?.data);
      setCandidatesData(response?.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      // If search is empty, show all
      setCandidatesData(allCandidates);
    } else {
      const result = allCandidates.filter((item) =>
        `${item.name} ${item.email} ${item.position}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setCandidatesData(result);
    }
  }, [searchTerm, allCandidates]);

  return (
    <div className="filters-section">
      <div className="filter-group">
        {statuses && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Position</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
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
        {setModalOpen && (
          <button
            style={{ marginBottom: "0px", width: "40%" }}
            className="btn btn-primary"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Add Candidate
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
