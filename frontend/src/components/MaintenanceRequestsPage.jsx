import React, { useState, useEffect } from "react";

const MaintenanceRequestsPage = () => {
  // State for maintenance requests
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State for new request form
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    location: "",
    priority: "medium",
    attachments: null,
  });

  // Sample data - would be fetched from API in real implementation
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        title: "Leaking Kitchen Sink",
        description:
          "The kitchen sink has been leaking for 2 days. Water is collecting under the sink.",
        location: "Flat 302, Building A",
        priority: "high",
        status: "pending",
        dateSubmitted: "2025-03-09T10:30:00",
        assignedTo: "John Maintenance",
        updates: [
          {
            date: "2025-03-09T14:20:00",
            content: "Ticket received and assigned to maintenance team",
          },
        ],
      },
      {
        id: 2,
        title: "Hallway Light Flickering",
        description:
          "The light in the main hallway is flickering and might need replacement.",
        location: "Building B, 2nd Floor",
        priority: "medium",
        status: "in-progress",
        dateSubmitted: "2025-03-07T09:15:00",
        assignedTo: "Electrical Team",
        updates: [
          {
            date: "2025-03-07T11:45:00",
            content: "Ticket received and assigned to electrical team",
          },
          {
            date: "2025-03-08T13:20:00",
            content: "Team scheduled to check on March 11",
          },
        ],
      },
      {
        id: 3,
        title: "Gym Equipment Maintenance",
        description:
          "The treadmill in the community gym makes a loud noise when used.",
        location: "Community Gym",
        priority: "low",
        status: "completed",
        dateSubmitted: "2025-03-05T16:40:00",
        assignedTo: "Fitness Equipment Specialists",
        updates: [
          {
            date: "2025-03-05T17:30:00",
            content: "Ticket received and assigned to fitness equipment team",
          },
          {
            date: "2025-03-06T10:15:00",
            content: "Team inspected the equipment",
          },
          {
            date: "2025-03-06T14:30:00",
            content: "Replaced worn belt and lubricated moving parts",
          },
        ],
      },
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  // Filter requests based on status
  useEffect(() => {
    const filterRequests = () => {
      if (filterStatus === "all") {
        setFilteredRequests(requests);
      } else {
        setFilteredRequests(
          requests.filter((req) => req.status === filterStatus)
        );
      }
    };

    filterRequests();
  }, [filterStatus, requests]);


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setNewRequest((prev) => ({
      ...prev,
      attachments: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new request object with generated ID and initial status
    const newRequestObj = {
      id: requests.length + 1,
      ...newRequest,
      status: "pending",
      dateSubmitted: new Date().toISOString(),
      assignedTo: null,
      updates: [
        {
          date: new Date().toISOString(),
          content: "Maintenance request submitted",
        },
      ],
    };

    // Update state with new request
    setRequests([newRequestObj, ...requests]);

    // Reset form and close it
    setNewRequest({
      title: "",
      description: "",
      location: "",
      priority: "medium",
      attachments: null,
    });
    setIsFormOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge-pending";
      case "in-progress":
        return "status-badge-progress";
      case "completed":
        return "status-badge-completed";
      default:
        return "";
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-badge-high";
      case "medium":
        return "priority-badge-medium";
      case "low":
        return "priority-badge-low";
      default:
        return "";
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-navbar">
        <div className="admin-navbar-brand">eSociety Management</div>
        <div className="admin-nav-links">
          <button className="admin-nav-link">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-tools"></i>
            <span>Maintenance</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-calendar-alt"></i>
            <span>Bookings</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-user-circle"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>

      <div className="admin-dashboard">
        <h1 className="admin-heading">Maintenance Requests</h1>
        <p className="admin-subtext">
          View, submit, and track maintenance requests for your society.
        </p>

        {/* Action buttons and filter */}
        <div className="maintenance-actions">
          <button className="admin-btn" onClick={() => setIsFormOpen(true)}>
            <i className="fas fa-plus"></i> New Request
          </button>

          <div className="maintenance-filter">
            <label>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="maintenance-filter-select"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* New request form - conditionally rendered */}
        {isFormOpen && (
          <div className="maintenance-form-container">
            <div className="maintenance-form-header">
              <h2>Submit New Maintenance Request</h2>
              <button
                className="maintenance-form-close"
                onClick={() => setIsFormOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="maintenance-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newRequest.title}
                  onChange={handleInputChange}
                  placeholder="Brief title of the issue"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newRequest.location}
                  onChange={handleInputChange}
                  placeholder="Where is the issue located?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={newRequest.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="attachments">Attachments (Optional)</label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <small>Upload photos or documents related to the issue</small>
                {newRequest.attachments && (
                  <p>Selected file: {newRequest.attachments.name}</p>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="admin-btn btn-cancel"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  <i className="fas fa-paper-plane"></i> Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Maintenance requests list */}
        <div className="maintenance-requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <i className="fas fa-clipboard-check"></i>
              <p>No maintenance requests found with the selected filter.</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="maintenance-request-card">
                <div className="request-header">
                  <h3>{request.title}</h3>
                  <div className="request-badges">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        request.status
                      )}`}
                    >
                      {request.status === "in-progress"
                        ? "In Progress"
                        : request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                    </span>
                    <span
                      className={`priority-badge ${getPriorityBadgeClass(
                        request.priority
                      )}`}
                    >
                      {request.priority.charAt(0).toUpperCase() +
                        request.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="request-details">
                  <p className="request-description">{request.description}</p>
                  <div className="request-meta">
                    <div className="meta-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{request.location}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>
                        Submitted: {formatDate(request.dateSubmitted)}
                      </span>
                    </div>
                    {request.assignedTo && (
                      <div className="meta-item">
                        <i className="fas fa-user-cog"></i>
                        <span>Assigned to: {request.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="request-updates">
                  <h4>
                    <i className="fas fa-history"></i> Updates
                  </h4>
                  <ul className="updates-timeline">
                    {request.updates.map((update, index) => (
                      <li key={index} className="update-item">
                        <div className="update-time">
                          {formatDate(update.date)}
                        </div>
                        <div className="update-content">{update.content}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {request.status !== "completed" && (
                  <div className="request-actions">
                    <button className="admin-btn btn-sm">
                      <i className="fas fa-comment-alt"></i> Add Update
                    </button>
                    {request.status === "pending" && (
                      <button className="admin-btn btn-sm btn-cancel">
                        <i className="fas fa-times-circle"></i> Cancel Request
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestsPage;
