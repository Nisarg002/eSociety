import React, { useState } from "react";

const SubmitComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
    contactEmail: "",
    contactPhone: "",
    attachments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "medium",
          location: "",
          contactEmail: "",
          contactPhone: "",
          attachments: [],
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="admin-container">
      <div className="maintenance-form-container">
        <h2 className="admin-heading">Submit Complaint</h2>
        <p className="admin-subtext">
          Please fill out the form below to submit your complaint. We will
          review it and get back to you as soon as possible.
        </p>

        {submitSuccess ? (
          <div
            className="success-message"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--admin-accent)",
            }}
          >
            <i
              className="fas fa-check-circle"
              style={{ fontSize: "3rem", marginBottom: "1rem" }}
            ></i>
            <h3>Complaint Submitted Successfully!</h3>
            <p>
              Your complaint has been recorded. We will review it and respond
              shortly.
            </p>
          </div>
        ) : (
          <form className="maintenance-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Complaint Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter a brief title for your complaint"
                value={formData.title}
                onChange={handleChange}
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
                  <option value="">Select a category</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="noise">Noise</option>
                  <option value="security">Security</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="parking">Parking</option>
                  <option value="amenities">Amenities</option>
                  <option value="other">Other</option>
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter the location of the issue"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about your complaint"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="Your email address"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="Your phone number"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments (optional)</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                multiple
                onChange={handleAttachmentChange}
                style={{
                  padding: "0.8rem",
                  background: "rgba(11, 23, 39, 0.6)",
                  border: "1px solid rgba(100, 255, 218, 0.2)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
              <small
                style={{
                  color: "var(--admin-text-secondary)",
                  marginTop: "0.5rem",
                }}
              >
                Upload images or documents related to your complaint (max 5MB
                each)
              </small>
            </div>

            <div className="form-actions">
              <button type="button" className="form-btn cancel-btn">
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                type="submit"
                className="form-btn submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>{" "}
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Complaint
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

export default SubmitComplaintForm;
