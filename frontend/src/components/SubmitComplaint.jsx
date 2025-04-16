import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResidentNavbar from "./common/ResidentNavbar";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
    attachments: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create a new complaint object
    const newComplaint = {
      id: Date.now().toString(),
      ...formData,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Get existing complaints from localStorage
    const existingComplaints = JSON.parse(
      localStorage.getItem("userComplaints") || "[]"
    );

    // Add new complaint to the array
    const updatedComplaints = [newComplaint, ...existingComplaints];

    // Save back to localStorage
    localStorage.setItem("userComplaints", JSON.stringify(updatedComplaints));

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        location: "",
        attachments: null,
      });

      // Redirect to complaints page after 2 seconds
      setTimeout(() => {
        navigate("/resident/complaints");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="admin-container">
      <ResidentNavbar />

      <div className="admin-dashboard">
        <h1 className="admin-heading">Submit a Complaint</h1>
        <p className="admin-subtext">
          Submit your complaint to the management for prompt resolution.
        </p>
      </div>

      <div className="maintenance-form-container">
        {isSubmitted ? (
          <div className="success-message">
            <i
              className="bx bx-check-circle"
              style={{
                fontSize: "3rem",
                color: "var(--admin-accent)",
                marginBottom: "1rem",
              }}
            ></i>
            <h3>Complaint Submitted Successfully!</h3>
            <p>
              Your complaint has been registered and will be addressed soon.
            </p>
            <Link to="/resident/my-complaint">
              <button className="admin-btn" style={{ marginTop: "1rem" }}>
                <span>View My Complaints</span>
                <i className="bx bx-chevron-right"></i>
              </button>
            </Link>
          </div>
        ) : (
          <form className="maintenance-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Complaint Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a brief title for your complaint"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Noise">Noise</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Parking">Parking</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is the issue located?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your complaint"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments (optional)</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleChange}
                accept="image/*,.pdf,.doc,.docx"
              />
              <small
                style={{
                  color: "var(--admin-text-secondary)",
                  marginTop: "0.5rem",
                }}
              >
                Upload photos or documents related to your complaint (max 5MB)
              </small>
            </div>

            <div className="form-actions">
              <Link to="/resident/dashboard">
                <button type="button" className="form-btn cancel-btn">
                  <i className="bx bx-x"></i>
                  <span>Cancel</span>
                </button>
              </Link>
              <button
                type="submit"
                className="form-btn submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin"></i>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-send"></i>
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitComplaint;
