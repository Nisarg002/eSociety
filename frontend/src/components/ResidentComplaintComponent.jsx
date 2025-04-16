import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResidentComplaintComponent = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Water Leakage in Bathroom",
      description:
        "There's a persistent water leak coming from the ceiling in the bathroom. It's causing damage to the walls.",
      status: "pending",
      category: "Plumbing",
      priority: "high",
      submittedBy: "John Doe",
      date: "2025-03-08",
      assignedTo: "Maintenance Team",
    },
    {
      id: 2,
      title: "Broken Window Lock",
      description:
        "The lock on the living room window is broken and won't secure properly.",
      status: "in-progress",
      category: "Security",
      priority: "medium",
      submittedBy: "Jane Smith",
      date: "2025-03-10",
      assignedTo: "Security Team",
      comments: [],
    },
    {
      id: 3,
      title: "AC Not Working",
      description:
        "The air conditioning unit in the master bedroom is not cooling properly.",
      status: "resolved",
      category: "HVAC",
      priority: "low",
      submittedBy: "Mike Johnson",
      date: "2025-03-05",
      assignedTo: "HVAC Technician",
      comments: [
        {
          author: "Maintenance Staff",
          text: "Replaced the filter and serviced the unit.",
          date: "2025-03-06",
        },
      ],
    },
  ]);

  const handleDelete = async (id) => {
    const res = await axios.delete("/complaint/" + id);
    // console.log(res.data);
    fetchData();
  };
  const fetchData = async () => {
    const id = localStorage.getItem("id");
    // console.log(id);
    const res = await axios.get("/complaint_user/" + id);
    // console.log(res.data);
    setComplaints(res.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      priority: "medium",
      location: "",
      contactNumber: "",
    },
  });

  const onSubmit = async (data) => {
    const newId =
      complaints.length > 0 ? Math.max(...complaints.map((c) => c.id)) + 1 : 1;

    const complaintToAdd = {
      // id: newId,
      ...data,
      status: "pending",
      submittedBy: localStorage.getItem("username"),
      date: new Date().toISOString().split("T")[0],
      assignedTo: "Unassigned",
      user_id: localStorage.getItem("id"),
    };
    console.log(complaintToAdd);
    const res = await axios.post("/complaint", complaintToAdd);
    setComplaints([complaintToAdd, ...complaints]);
    reset();
    setShowForm(false);
    fetchData();
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeFilter === "all") return true;
    return complaint.status === activeFilter;
  });

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Resident Complaints</h1>
        <p className="admin-subtext">
          Submit and track your maintenance requests and complaints
        </p>

        <div className="maintenance-actions">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Complaints
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
                activeFilter === "in-progress" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("in-progress")}
            >
              In Progress
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "resolved" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("resolved")}
            >
              Completed
            </button>
          </div>
          <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Submit New Complaint"}{" "}
            <i className={showForm ? "fas fa-times" : "fas fa-plus"}></i>
          </button>
        </div>

        {showForm && (
          <div className="maintenance-form-container">
            <form
              className="maintenance-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group">
                <label htmlFor="title">Complaint Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter a brief title for your complaint"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Provide detailed information about your complaint"
                  {...register("description", {
                    required: "Description is required",
                  })}
                ></textarea>
                {errors.description && (
                  <span className="error-message">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" {...register("category")}>
                    <option value="General">General</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Security">Security</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" {...register("priority")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    placeholder="e.g., Bathroom, Kitchen, Bedroom"
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                  {errors.location && (
                    <span className="error-message">
                      {errors.location.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="form-btn cancel-btn"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                >
                  Cancel <i className="fas fa-times"></i>
                </button>
                <button type="submit" className="form-btn submit-btn">
                  Submit Complaint <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredComplaints.length === 0 ? (
          <div className="no-requests">
            <i className="fas fa-clipboard-list"></i>
            <h3>No complaints found</h3>
            <p>
              You haven't submitted any complaints yet or no complaints match
              your current filter.
            </p>
          </div>
        ) : (
          <div className="maintenance-list">
            {filteredComplaints.map((complaint, index) => (
              <div className="maintenance-card" key={index + 1}>
                <div className="maintenance-card-header">
                  <div className="request-title-section">
                    <h3 className="request-title">{complaint.title}</h3>
                    <span className={`status-badge status-${complaint.status}`}>
                      {complaint.status === "pending"
                        ? "Pending"
                        : complaint.status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                  <span
                    className={`priority-badge priority-${complaint.priority}`}
                  >
                    {complaint.priority === "low"
                      ? "Low Priority"
                      : complaint.priority === "medium"
                      ? "Medium Priority"
                      : "High Priority"}
                  </span>
                </div>

                <div className="request-details">
                  <p className="request-description">{complaint.description}</p>

                  <div className="request-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Submitted on: {complaint.date}</span>
                    </div>
                    {complaint.category && (
                      <div className="meta-item">
                        <i className="fas fa-tag"></i>
                        <span>Category: {complaint.category}</span>
                      </div>
                    )}
                    {complaint.location && (
                      <div className="meta-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Location: {complaint.location}</span>
                      </div>
                    )}
                    {/* {complaint.submittedBy && (
                      <div className="meta-item">
                        <i className="fas fa-user"></i>
                        <span>Submitted by: {complaint.submittedBy}</span>
                      </div>
                    )} */}
                    {complaint.assignedTo && (
                      <div className="meta-item">
                        <i className="fas fa-user-cog"></i>
                        <span>Assigned to: {complaint.assignedTo}</span>
                      </div>
                    )}
                    {/* {complaint.contactNumber && (
                      <div className="meta-item">
                        <i className="fas fa-phone"></i>
                        <span>Contact: {complaint.contactNumber}</span>
                      </div>
                    )} */}
                  </div>
                  {/* <button
                    onClick={() => handleDelete(complaint._id)}
                    style={{
                      background: "rgba(255, 87, 87, 0.1)",
                      border: "1px solid rgba(255, 87, 87, 0.3)",
                      color: "#ff5757",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "var(--admin-transition)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button> */}
                  {/* {complaint.comments.length > 0 && (
                    <div className="comments-section">
                      <h4 className="comments-title">
                        <i className="fas fa-comments"></i> Updates
                      </h4>
                      <div className="comments-list">
                        {complaint.comments.map((comment, index) => (
                          <div className="comment" key={index}>
                            <div className="comment-header">
                              <span className="comment-author">
                                {comment.author}
                              </span>
                              <span className="comment-date">
                                {comment.date}
                              </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentComplaintComponent;
