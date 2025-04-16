import React, { useEffect, useState } from "react";
import axios from "axios";

const FacilityRequestsManagement = () => {
  // Sample data - in a real application, this would come from an API
  const [facilityRequests, setFacilityRequests] = useState([
    {
      id: 1,
      facilityName: "Swimming Pool",
      residentName: "John Smith",
      unitNumber: "A-301",
      requestDate: "2025-03-10T14:30:00",
      bookingDate: "2025-03-15T10:00:00",
      duration: 2,
      attendees: 4,
      purpose: "Family swim session",
      status: "pending",
    },
    {
      id: 2,
      facilityName: "Community Hall",
      residentName: "Emily Johnson",
      unitNumber: "B-105",
      requestDate: "2025-03-11T09:15:00",
      bookingDate: "2025-03-20T18:00:00",
      duration: 4,
      attendees: 25,
      purpose: "Birthday celebration",
      status: "approved",
      notes: "Will arrange for own catering.",
    },
    {
      id: 3,
      facilityName: "Tennis Court",
      residentName: "Michael Wong",
      unitNumber: "C-212",
      requestDate: "2025-03-09T16:45:00",
      bookingDate: "2025-03-14T16:00:00",
      duration: 1.5,
      attendees: 4,
      purpose: "Friendly match",
      status: "completed",
      notes: "Need the equipment storage to be unlocked.",
    },
    {
      id: 4,
      facilityName: "Gym",
      residentName: "Sarah Davis",
      unitNumber: "D-110",
      requestDate: "2025-03-12T11:20:00",
      bookingDate: "2025-03-13T07:00:00",
      duration: 1,
      attendees: 1,
      purpose: "Personal training session",
      status: "rejected",
      notes: "Request to have exclusive use of the weights section.",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await axios.get("/booking/");
      setFacilityRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  // State for active filter
  const [activeFilter, setActiveFilter] = useState("all");

  //flag

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle request status
  const updateRequestStatus = async (id, newStatus) => {
    setFacilityRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
    // console.log(id,newStatus)

    const res = await axios.patch("/booking/", {
      bookingId: id,
      status: newStatus,
    });
    if (newStatus === "approved") {
      const res2 = await axios.get("/booking/" + id);
      // console.log(res2.data.user_id);
      const currentDate = new Date();
      const nextMonthDate = new Date();
      nextMonthDate.setMonth(currentDate.getMonth() + 1);
      const data = {
        type: "Facility Fees",
        amount: 10000,
        dueDate: nextMonthDate.toISOString().split("T")[0],
        status: "pending",
        paidDate: null,
        transactionId: null,
        month: currentDate.toLocaleString("default", { month: "long" }),
        year: currentDate.getFullYear().toString(),
        description: "Fees for facility usage",
        user_id: res2.data.user_id,
      };
      // console.log(data);
      const res3 = await axios.post("/payment/", data);
      // console.log(res3.data);
    }
    fetchData();
    // console.log(res.data);
  };

  // Filter requests based on status and search term
  const filteredRequests = facilityRequests.filter((request) => {
    const matchesFilter =
      activeFilter === "all" || request.status === activeFilter;
    const matchesSearch =
      request.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Render status badge based on status
  const renderStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      approved: "status-approved",
      rejected: "status-rejected", // Using the priority-high class for rejected
      completed: "status-completed",
    };

    return (
      <span
        className={`status-badge ${statusClasses[status] || "status-pending"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Facility Booking Requests</h1>
        <p className="admin-subtext">
          Review and manage facility booking requests from residents. Approve or
          reject requests based on facility availability and society guidelines.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="maintenance-actions visitor-controls">
        <div className="search-box">
          <i className="search-icon fa fa-search"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by resident, facility or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Requests
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "approved" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "completed" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "rejected" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Facility Requests List */}
      <div
        style={{ padding: "1.5rem 2rem", margin: "1.5rem 0" }}
        className="maintenance-list"
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <div key={index + 1} className="maintenance-card">
              <div className="maintenance-card-header">
                <div className="request-title-section">
                  <i
                    className="fas fa-calendar-check"
                    style={{ color: "var(--admin-accent)", fontSize: "1.4rem" }}
                  ></i>
                  <h3 className="request-title">
                    {request.facilityName} Booking
                  </h3>
                </div>
                {renderStatusBadge(request.status)}
              </div>

              <div className="request-details">
                <div className="request-meta">
                  <div className="meta-item">
                    <i className="fa fa-user"></i>
                    <span>{request.residentName}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa fa-home"></i>
                    <span>Unit {request.unitNumber}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar-check"></i>
                    <span>{formatDate(request.bookingDate)}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa fa-hourglass-half"></i>
                    <span>{request.duration} hour(s)</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa fa-users"></i>
                    <span>{request.attendees} attendees</span>
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
                          updateRequestStatus(request._id, "approved")
                        }
                        style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          color: "#2ed573",
                          border: "1px solid rgba(46, 213, 115, 0.3)",
                        }}
                      >
                        <i className="fa fa-check"></i>
                        <span>Approve</span>
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() =>
                          updateRequestStatus(request._id, "rejected")
                        }
                        style={{
                          background: "rgba(255, 71, 87, 0.1)",
                          color: "#ff4757",
                          border: "1px solid rgba(255, 71, 87, 0.3)",
                        }}
                      >
                        <i className="fa fa-times"></i>
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {request.status === "approved" && (
                    <button
                      className="action-btn complete-btn"
                      onClick={() =>
                        updateRequestStatus(request._id, "completed")
                      }
                    >
                      <i className="fa fa-check-circle"></i>
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {/* <button className="action-btn comment-btn">
                    <i className="fa fa-eye"></i>
                    <span>View Details</span>
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-requests">
            <i className="fa fa-calendar-o"></i>
            <p>No facility booking requests found.</p>
            <p>All facility booking requests will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityRequestsManagement;
