import React, { useState } from "react";
import AdminNavbar from "./common/AdminNavbar";

const FacilityManagement = () => {
  // Sample data for facility requests
  const [facilityRequests, setFacilityRequests] = useState([
    {
      id: 1,
      facilityName: "Community Hall",
      residentName: "John Smith",
      unitNumber: "A-204",
      requestDate: "2025-03-10T14:30:00",
      bookingDate: "2025-03-20T18:00:00",
      duration: 4,
      purpose: "Birthday Party",
      attendees: 25,
      status: "pending",
      notes: "Will need extra chairs and tables for the event.",
    },
    {
      id: 2,
      facilityName: "Swimming Pool",
      residentName: "Sarah Johnson",
      unitNumber: "B-108",
      requestDate: "2025-03-11T09:15:00",
      bookingDate: "2025-03-15T10:00:00",
      duration: 2,
      purpose: "Swimming Practice",
      attendees: 8,
      status: "approved",
      notes: "Regular weekend swimming practice for kids.",
    },
    {
      id: 3,
      facilityName: "Gym",
      residentName: "Robert Chen",
      unitNumber: "C-312",
      requestDate: "2025-03-12T11:45:00",
      bookingDate: "2025-03-14T17:00:00",
      duration: 1.5,
      purpose: "Personal Training",
      attendees: 3,
      status: "pending",
      notes: "Will bring own equipment.",
    },
    {
      id: 4,
      facilityName: "Tennis Court",
      residentName: "Emma Wilson",
      unitNumber: "D-105",
      requestDate: "2025-03-09T16:20:00",
      bookingDate: "2025-03-18T09:00:00",
      duration: 2,
      purpose: "Tennis Match",
      attendees: 4,
      status: "rejected",
      notes: "Maintenance scheduled for that day.",
    },
  ]);

  // State for filtering requests
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setFacilityRequests(
      facilityRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  // Filter requests based on status and search term
  const filteredRequests = facilityRequests.filter((request) => {
    const matchesFilter = filter === "all" || request.status === filter;
    const matchesSearch =
      request.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open request details form
  const openRequestDetails = (request) => {
    setCurrentRequest(request);
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setCurrentRequest(null);
  };

  return (
    <div className="admin-container">
        <AdminNavbar />
      {/* Header Section */}
      <div className="admin-dashboard">
        <h1 className="admin-heading">Facility Requests Management</h1>
        <p className="admin-subtext">
          Review and approve facility booking requests submitted by residents.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="maintenance-actions">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by resident name, facility or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Requests
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Facility Requests List */}
      <div className="maintenance-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <i className="fas fa-calendar-times"></i>
            <h3>No facility requests found</h3>
            <p>There are no requests matching your current filters.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="maintenance-card">
              <div className="maintenance-card-header">
                <div className="request-title-section">
                  <h3 className="request-title">
                    {request.facilityName} Booking
                  </h3>
                  <span className={`status-badge status-${request.status}`}>
                    {request.status === "pending"
                      ? "Pending Review"
                      : request.status === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </span>
                </div>
                <div className="request-title-section">
                  <span className="meta-item">
                    <i className="fas fa-user"></i>
                    {request.residentName}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-home"></i>
                    Unit {request.unitNumber}
                  </span>
                </div>
              </div>

              <div className="request-details">
                <div className="request-meta">
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Booking Date: {formatDate(request.bookingDate)}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>Duration: {request.duration} hours</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-users"></i>
                    <span>Attendees: {request.attendees}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>Request Date: {formatDate(request.requestDate)}</span>
                  </div>
                </div>

                <p className="request-description">
                  <strong>Purpose:</strong> {request.purpose}
                </p>
                {request.notes && (
                  <p className="request-description">
                    <strong>Notes:</strong> {request.notes}
                  </p>
                )}

                <div className="request-actions">
                  {request.status === "pending" && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() =>
                          handleStatusChange(request.id, "approved")
                        }
                      >
                        <i className="fas fa-check"></i>
                        <span>Approve</span>
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() =>
                          handleStatusChange(request.id, "rejected")
                        }
                      >
                        <i className="fas fa-times"></i>
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn view-btn"
                    onClick={() => openRequestDetails(request)}
                  >
                    <i className="fas fa-eye"></i>
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Details Form */}
      {showForm && currentRequest && (
        <div className="maintenance-form-container">
          <h2 className="admin-heading">Facility Request Details</h2>
          <div className="maintenance-form">
            <div className="form-row">
              <div className="form-group">
                <label>Facility</label>
                <input
                  type="text"
                  value={currentRequest.facilityName}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Resident Name</label>
                <input
                  type="text"
                  value={currentRequest.residentName}
                  readOnly
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unit Number</label>
                <input type="text" value={currentRequest.unitNumber} readOnly />
              </div>
              <div className="form-group">
                <label>Booking Date</label>
                <input
                  type="text"
                  value={formatDate(currentRequest.bookingDate)}
                  readOnly
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (hours)</label>
                <input type="text" value={currentRequest.duration} readOnly />
              </div>
              <div className="form-group">
                <label>Attendees</label>
                <input type="text" value={currentRequest.attendees} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <textarea value={currentRequest.purpose} readOnly></textarea>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={currentRequest.notes || "No additional notes"}
                readOnly
              ></textarea>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={currentRequest.status}
                onChange={(e) =>
                  handleStatusChange(currentRequest.id, e.target.value)
                }
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="form-btn cancel-btn" onClick={closeForm}>
                <i className="fas fa-times"></i>
                Close
              </button>
              <button className="form-btn submit-btn" onClick={closeForm}>
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityManagement;
