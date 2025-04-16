import React, { useState, useEffect } from "react";
import axios from "axios";
import BouncingDotsLoader from "./common/Loaders-Test/BouncingDotsLoader";

const VisitorRecords = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const visitorsPerPage = 5;

  // Fetch visitors from API
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        // Replace with your actual API endpoint
        const res = await axios.get("/visitor/");
        // console.log(res.data);
        setVisitors(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitors:", error);
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // Format date-time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Filter visitors based on search term and status
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostFlat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || visitor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = filteredVisitors.slice(
    indexOfFirstVisitor,
    indexOfLastVisitor
  );
  const totalPages = Math.ceil(filteredVisitors.length / visitorsPerPage);

  // Handle status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "status-badge status-active";
      case "completed":
        return "status-badge status-completed";
      case "scheduled":
        return "status-badge status-scheduled";
      default:
        return "status-badge";
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Visitor Records</h1>
        <p className="admin-subtext">
          Monitor all visitor entries and exits within your society.
        </p>

        {/* Filter and Search Controls */}
        <div className="visitor-controls">
          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by visitor name, flat, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                {/* <option value="scheduled">Scheduled</option> */}
              </select>
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="visitor-table-container">
          {loading ? (
            <BouncingDotsLoader />
          ) : currentVisitors.length === 0 ? (
            <div className="no-records">
              <i className="fas fa-search"></i>
              <p>No visitor records found.</p>
            </div>
          ) : (
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Purpose</th>
                  <th>Host</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentVisitors.map((visitor, index) => (
                  <tr key={index}>
                    <td className="visitor-info">
                      <div className="visitor-avatar">
                        {visitor.visitorName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="visitor-details">
                        <div className="visitor-name">
                          {visitor.visitorName || "Unknown"}
                        </div>
                        <div className="visitor-contact">
                          {visitor.contactNumber || "No contact"}
                        </div>
                      </div>
                    </td>
                    <td>{visitor.purpose || "N/A"}</td>
                    <td>{`${visitor.hostName || "N/A"} (${
                      visitor.hostFlat || "N/A"
                    })`}</td>
                    <td>{formatDateTime(visitor.entryTime)}</td>
                    <td>{formatDateTime(visitor.exitTime)}</td>
                    <td>
                      <span className={getStatusBadgeClass(visitor.status)}>
                        {visitor.status || "unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredVisitors.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`pagination-number ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorRecords;
