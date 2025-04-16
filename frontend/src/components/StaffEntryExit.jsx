import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffEntryExit = () => {
  const [staffRecords, setStaffRecords] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      type: "Domestic Help",
      contact: "9876543210",
      apartment: "A-304",
      entryTime: "08:30 AM",
      exitTime: "",
      status: "active",
    },
    {
      id: 2,
      name: "Amit Singh",
      type: "Maintenance",
      contact: "8765432109",
      apartment: "B-201",
      entryTime: "09:15 AM",
      exitTime: "11:30 AM",
      status: "completed",
    },
    {
      id: 3,
      name: "Priya Sharma",
      type: "Delivery",
      contact: "7654321098",
      apartment: "C-102",
      entryTime: "10:45 AM",
      exitTime: "",
      status: "active",
    },
    {
      id: 4,
      name: "Sanjay Verma",
      type: "Domestic Help",
      contact: "6543210987",
      apartment: "D-405",
      entryTime: "11:00 AM",
      exitTime: "",
      status: "active",
    },
    {
      id: 5,
      name: "Vikram Joshi",
      type: "Maintenance",
      contact: "9087654321",
      apartment: "A-101",
      entryTime: "07:30 AM",
      exitTime: "09:45 AM",
      status: "completed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showNewStaffForm, setShowNewStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    type: "Domestic Help",
    contact: "",
    apartment: "",
    entryTime: "",
    exitTime: "",
    status: "active",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchData = async () => {
    try {
      const res = await axios.get("/staff/");
      // console.log(res.data);
      setStaffRecords(res.data);
    } catch (e) {
      console.error("Error fetching staff records:", e);
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

  // Update the handleMarkExit function to make an API call
  const handleMarkExit = async (id) => {
    try {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const data = {
        staffId: id,
        exitTime: formattedTime,
        status: "completed",
      };
      // console.log(data);
      // First update the record on the server
      await axios.patch("/staff/", data);
      // Then update the local state with the new data
      setStaffRecords(
        staffRecords.map((record) =>
          record.id === id
            ? { ...record, exitTime: formattedTime, status: "completed" }
            : record
        )
      );
      fetchData();
    } catch (error) {
      console.error("Error updating staff exit time:", error);
      // Optionally: Add error handling UI feedback here
    }
  };

  const handleAddNewStaff = () => {
    setShowNewStaffForm(!showNewStaffForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value,
    });
  };

  const handleSubmitNewStaff = async (e) => {
    e.preventDefault();

    // Get current time for entry
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newStaffRecord = {
      // id: staffRecords.length + 1,
      ...newStaff,
      entryTime: formattedTime,
      exitTime: "",
      status: "active",
    };
    console.log(newStaffRecord);
    const res = await axios.post("/staff/", newStaffRecord);

    setStaffRecords([...staffRecords, newStaffRecord]);
    setShowNewStaffForm(false);
    setNewStaff({
      name: "",
      type: "Domestic Help",
      contact: "",
      apartment: "",
      entryTime: "",
      exitTime: "",
      status: "active",
    });
  };

  const filteredRecords = staffRecords.filter((record) => {
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
        <h1 className="admin-heading">Staff Entry/Exit Management</h1>
        <p className="admin-subtext">
          Track domestic help, delivery personnel, and maintenance staff
          entering and exiting the premises.
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
          <button className="admin-btn" onClick={handleAddNewStaff}>
            <i className={showNewStaffForm ? "bx bx-x" : "bx bx-plus"}></i>
            <span>{showNewStaffForm ? "Cancel" : "New Entry"}</span>
          </button>
        </div>
      </div>

      {showNewStaffForm && (
        <div className="maintenance-form-container">
          <form className="maintenance-form" onSubmit={handleSubmitNewStaff}>
            <div className="form-row">
              <div className="form-group">
                <label>Staff Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStaff.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Staff Type</label>
                <select
                  name="type"
                  value={newStaff.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Domestic Help">Domestic Help</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={newStaff.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apartment/Unit</label>
                <input
                  type="text"
                  name="apartment"
                  value={newStaff.apartment}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={() => setShowNewStaffForm(false)}
              >
                <i className="bx bx-x"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" className="form-btn submit-btn">
                <i className="bx bx-check"></i>
                <span>Register Entry</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="visitor-table-container">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>Staff Details</th>
              <th>Type</th>
              <th>Apartment</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
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
                  <td>{record.exitTime || "Not Exited"}</td>
                  <td>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status === "active" ? "Inside" : "Completed"}
                    </span>
                  </td>
                  <td>
                    <div className="visitor-actions">
                      {record.status === "active" && (
                        <button
                          className="action-btn exit-btn"
                          onClick={() => handleMarkExit(record._id)}
                        >
                          <i className="bx bx-exit"></i>
                          <span>Mark Exit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="no-records">
                    <i className="bx bx-search-alt"></i>
                    <p>No staff records found matching your search criteria.</p>
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

export default StaffEntryExit;
