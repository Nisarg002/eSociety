import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminStaff = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      type: "Domestic Help",
      contact: "9876543210",
      apartment: "A-304",
      entryTime: "08:30 AM",
      status: "active",
    },
    {
      id: 2,
      name: "Amit Singh",
      type: "Maintenance",
      contact: "8765432109",
      apartment: "B-201",
      entryTime: "09:15 AM",
      status: "completed",
    },
    {
      id: 3,
      name: "Priya Sharma",
      type: "Delivery",
      contact: "7654321098",
      apartment: "C-102",
      entryTime: "10:45 AM",
      status: "active",
    },
    {
      id: 4,
      name: "Sanjay Verma",
      type: "Domestic Help",
      contact: "6543210987",
      apartment: "D-405",
      entryTime: "11:00 AM",
      status: "active",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      type: "Maintenance",
      contact: "9087654321",
      apartment: "A-101",
      entryTime: "07:30 AM",
      status: "completed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/records");
      setRecords(res.data);
    } catch (e) {
      console.error("Error fetching records:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/records/${id}`);
      setRecords(records.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.apartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Admin Data Management</h1>
        <p className="admin-subtext">
          View and manage staff records in the system
        </p>
      </div>

      <div className="visitor-controls">
        <div className="search-box">
          <i className="bx bx-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or apartment..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Filter by Type:</label>
            <select
              className="filter-select"
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">All Types</option>
              <option value="Domestic Help">Domestic Help</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      <div className="visitor-table-container">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>Staff Details</th>
              <th>Type</th>
              <th>Apartment</th>
              <th>Entry Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index + 1}>
                  <td>
                    <div className="visitor-info">
                      <div className="visitor-avatar">
                        {record.name.charAt(0)}
                      </div>
                      <div>
                        <div className="visitor-name">{record.name}</div>
                        <div className="visitor-contact">{record.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td>{record.type}</td>
                  <td>{record.apartment}</td>
                  <td>{record.entryTime}</td>
                  <td>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status === "active" ? "Active" : "Completed"}
                    </span>
                  </td>
                  <td>
                    <div className="visitor-actions">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(record.id)}
                      >
                        <i className="bx bx-trash"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="no-records">
                    <i className="bx bx-search-alt"></i>
                    <p>No records found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          <i className="bx bx-chevron-left"></i>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            className={`pagination-number ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminStaff;
