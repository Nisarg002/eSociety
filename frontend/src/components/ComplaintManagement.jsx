import React, { useEffect, useState } from "react";
import axios from "axios";
import BouncingDotsLoader from "./common/Loaders-Test/BouncingDotsLoader";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "Maintenance",
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/complaint/");
      setComplaints(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter complaints by status and search term
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get current complaints for pagination
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update the status on the server
      const res = await axios.patch(
        `/complaint_status/?complaintId=${id}&status=${newStatus}`
      );
      fetchData();

      // After successful API call, update the local state
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: newStatus } : complaint
        )
      );

      // Update the selectedComplaint state if it's currently selected
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAssign = async (id, staff) => {
    try {
      // Update the assignedTo on the server
      const res = await axios.patch(
        `/complaint_assignedTo/?complaintId=${id}&assignedTo=${staff}`
      );
      fetchData();

      // After successful API call, update the local state
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, assignedTo: staff } : complaint
        )
      );

      // Update the selectedComplaint state if it's currently selected
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          assignedTo: staff,
        });
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedComplaint) return;

    try {
      // We don't need to do anything here since the changes are
      // already saved individually when they are made
      setSelectedComplaint(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "in-progress":
        return "status-progress";
      case "resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Complaint Management</h1>
        <p className="admin-subtext">
          Track, manage, and resolve resident complaints efficiently
        </p>

        <div className="complaint-controls">
          <div className="complaint-search">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="complaint-search-input"
            />
          </div>
          <div className="complaint-filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="complaint-filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        {loading ? (
          <BouncingDotsLoader />
        ) : (
          <>
            <div className="complaint-table-container">
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Submitted By</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentComplaints.map((complaint, index) => (
                    <tr key={indexOfFirstComplaint + index + 1}>
                      <td>{indexOfFirstComplaint + index + 1}</td>
                      <td>{complaint.title}</td>
                      <td>{complaint.submittedBy}</td>
                      <td>{complaint.date}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span
                          className={`priority-badge priority-${complaint.priority}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td>{complaint.assignedTo}</td>
                      <td>
                        <div className="complaint-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({
                length: Math.ceil(
                  filteredComplaints.length / complaintsPerPage
                ),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`pagination-btn ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredComplaints.length / complaintsPerPage)
                }
                className="pagination-btn"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="complaint-modal">
            <div className="modal-header">
              <h2>Complaint Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedComplaint(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{selectedComplaint.title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <p className="detail-value description">
                  {selectedComplaint.description}
                </p>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submitted By:</span>
                <span className="detail-value">
                  {selectedComplaint.submittedBy}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{selectedComplaint.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">
                  {selectedComplaint.category}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Priority:</span>
                <span
                  className={`priority-badge priority-${selectedComplaint.priority}`}
                >
                  {selectedComplaint.priority}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <select
                  className="status-select"
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    handleStatusChange(selectedComplaint._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="detail-row">
                <span className="detail-label">Assigned To:</span>
                <select
                  className="assign-select"
                  value={selectedComplaint.assignedTo}
                  onChange={(e) =>
                    handleAssign(selectedComplaint._id, e.target.value)
                  }
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Cleaning Staff">Cleaning Staff</option>
                  <option value="Security Team">Security Team</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn" onClick={handleSaveChanges}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS styles */}
      <style jsx>
        {`
          /* Complaint management specific styles */
          .complaint-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 2rem auto;
            max-width: 1200px;
            gap: 1rem;
          }

          .complaint-search {
            flex: 1;
          }

          .complaint-search-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: var(--admin-card-border);
            background: var(--admin-secondary-bg);
            color: var(--admin-text-primary);
            font-size: 0.95rem;
          }

          .complaint-filters {
            min-width: 150px;
          }

          .complaint-filter-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: var(--admin-card-border);
            background: var(--admin-secondary-bg);
            color: var(--admin-text-primary);
            font-size: 0.95rem;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364ffda%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem top 50%;
            background-size: 0.65rem auto;
          }

          .complaint-table-container {
            margin: 0 auto;
            max-width: 1200px;
            overflow-x: auto;
            background: var(--admin-secondary-bg);
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            border: var(--admin-card-border);
          }

          .complaint-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.9rem;
          }

          .complaint-table th {
            padding: 1.2rem 1rem;
            background: rgba(100, 255, 218, 0.08);
            color: var(--admin-accent);
            font-weight: 600;
            border-bottom: 1px solid rgba(100, 255, 218, 0.2);
          }

          .complaint-table td {
            padding: 1rem;
            border-bottom: 1px solid rgba(100, 255, 218, 0.1);
            color: var(--admin-text-secondary);
          }

          .complaint-table tbody tr:hover {
            background: rgba(100, 255, 218, 0.03);
          }

          /* Pagination styles */
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.5rem;
            gap: 0.5rem;
            border-top: 1px solid rgba(100, 255, 218, 0.1);
          }

          .pagination-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 36px;
            height: 36px;
            padding: 0 0.5rem;
            border-radius: 8px;
            background: var(--admin-secondary-bg);
            border: 1px solid rgba(100, 255, 218, 0.2);
            color: var(--admin-text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .pagination-btn:hover {
            background: rgba(100, 255, 218, 0.1);
            color: var(--admin-accent);
          }

          .pagination-btn.active {
            background: rgba(100, 255, 218, 0.2);
            color: var(--admin-accent);
            border-color: var(--admin-accent);
          }

          .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--admin-secondary-bg);
            color: var(--admin-text-tertiary);
          }

          .priority-badge,
          .status-badge {
            display: inline-block;
            padding: 0.3rem 0.6rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: capitalize;
          }

          .priority-high {
            background: rgba(220, 53, 69, 0.2);
            color: #ff6b6b;
          }

          .priority-medium {
            background: rgba(255, 193, 7, 0.2);
            color: #ffd166;
          }

          .priority-low {
            background: rgba(40, 167, 69, 0.2);
            color: #90ee90;
          }

          .status-pending {
            background: rgba(255, 193, 7, 0.2);
            color: #ffd166;
          }

          .status-progress {
            background: rgba(13, 110, 253, 0.2);
            color: #00c3ff;
          }

          .status-resolved {
            background: rgba(40, 167, 69, 0.2);
            color: #90ee90;
          }

          .complaint-actions {
            display: flex;
            gap: 0.5rem;
          }

          .action-btn {
            background: transparent;
            border: none;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: var(--admin-transition);
          }

          .view-btn {
            color: var(--admin-accent);
            background: rgba(100, 255, 218, 0.1);
          }

          .edit-btn {
            color: #00c3ff;
            background: rgba(0, 195, 255, 0.1);
          }

          .view-btn:hover {
            background: rgba(100, 255, 218, 0.2);
          }

          .edit-btn:hover {
            background: rgba(0, 195, 255, 0.2);
          }

          /* Modal styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
            backdrop-filter: blur(5px);
          }

          .complaint-modal {
            background: var(--admin-secondary-bg);
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
            border: var(--admin-card-border);
            animation: modal-in 0.3s ease-out;
          }

          .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(100, 255, 218, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .modal-header h2 {
            margin: 0;
            font-size: 1.4rem;
            background: linear-gradient(
              45deg,
              var(--admin-accent),
              var(--admin-accent-secondary)
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .close-btn {
            background: transparent;
            border: none;
            color: var(--admin-text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            transition: var(--admin-transition);
          }

          .close-btn:hover {
            color: var(--admin-accent);
          }

          .modal-body {
            padding: 1.5rem;
            max-height: 60vh;
            overflow-y: auto;
          }

          .detail-row {
            margin-bottom: 1.2rem;
          }

          .detail-label {
            display: block;
            margin-bottom: 0.4rem;
            color: var(--admin-accent);
            font-size: 0.9rem;
            font-weight: 500;
          }

          .detail-value {
            color: var(--admin-text-primary);
            font-size: 1rem;
          }

          .detail-value.description {
            background: rgba(100, 255, 218, 0.05);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(100, 255, 218, 0.1);
            line-height: 1.6;
          }

          .status-select,
          .assign-select,
          .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: var(--admin-card-border);
            background: var(--admin-secondary-bg);
            color: var(--admin-text-primary);
            font-size: 0.95rem;
            margin-top: 0.5rem;
          }

          .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid rgba(100, 255, 218, 0.2);
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--admin-accent);
            font-size: 0.9rem;
            font-weight: 500;
          }

          .cancel-btn {
            background: rgba(100, 255, 218, 0.1);
            color: var(--admin-accent);
          }

          .cancel-btn:hover {
            background: rgba(100, 255, 218, 0.2);
          }

          @keyframes modal-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .complaint-controls {
              flex-direction: column;
              align-items: stretch;
            }

            .complaint-table th:nth-child(4),
            .complaint-table th:nth-child(5),
            .complaint-table td:nth-child(4),
            .complaint-table td:nth-child(5) {
              display: none;
            }

            .pagination {
              flex-wrap: wrap;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ComplaintManagement;
