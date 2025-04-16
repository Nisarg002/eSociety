import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const navigate = (page) => {
    console.log(`Navigating to ${page}`);
    alert(`Redirecting to ${page} section...`);
  };

  const logout = () => {
    console.log("Logging out...");
    alert("Successfully logged out!");
  };

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    apartment: "B-304",
    joinDate: "15 Jan 2023",
    familyMembers: 3,
    vehicles: [
      { type: "Car", number: "ABC 1234" },
      { type: "Bike", number: "XYZ 5678" },
    ],
    emergencyContact: {
      name: "Jane Doe",
      relation: "Spouse",
      phone: "+1 (555) 987-6543",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">Smart e-Society</div>
        <div className="admin-nav-links">
          <button
            className="admin-nav-link"
            onClick={() => navigate("dashboard")}
          >
            <i className="bx bxs-dashboard"></i>
            <span>Dashboard</span>
          </button>
          <button
            className="admin-nav-link"
            onClick={() => navigate("facilities")}
          >
            <i className="bx bxs-building-house"></i>
            <span>Facilities</span>
          </button>
          <button
            className="admin-nav-link"
            onClick={() => navigate("complaints")}
          >
            <i className="bx bxs-message-alt-error"></i>
            <span>Complaints</span>
          </button>
          <button
            className="admin-nav-link"
            onClick={() => navigate("visitors")}
          >
            <i className="bx bxs-user-check"></i>
            <span>Visitors</span>
          </button>
          <button
            className="admin-nav-link"
            onClick={() => navigate("notices")}
          >
            <i className="bx bxs-megaphone"></i>
            <span>Notices</span>
          </button>
          <button className="admin-nav-link admin-nav-link-active">
            <i className="bx bxs-user-circle"></i>
            <span>Profile</span>
          </button>
          <button className="admin-nav-link" onClick={logout}>
            <i className="bx bx-log-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="admin-dashboard">
        <h1 className="admin-heading">My Profile</h1>
        <p className="admin-subtext">
          View and manage your personal information and preferences
        </p>
      </div>

      <div className="visitor-table-container">
        <div
          className="admin-card"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div
            className="visitor-info"
            style={{ marginBottom: "2rem", justifyContent: "center" }}
          >
            <div
              className="visitor-avatar"
              style={{ width: "80px", height: "80px", fontSize: "2rem" }}
            >
              {profileData.name.charAt(0)}
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 className="visitor-name" style={{ fontSize: "1.5rem" }}>
                {profileData.name}
              </h2>
              <p className="visitor-contact">{profileData.apartment}</p>
            </div>
          </div>

          {!isEditing ? (
            <>
              <div className="maintenance-list">
                <div className="maintenance-card">
                  <div className="maintenance-card-header">
                    <div className="request-title-section">
                      <h3 className="request-title">Personal Information</h3>
                    </div>
                    <button
                      className="action-btn view-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bx bxs-edit"></i>
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <div className="request-details">
                    <div className="request-meta">
                      <div className="meta-item">
                        <i className="bx bxs-envelope"></i>
                        <span>Email: {profileData.email}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-phone"></i>
                        <span>Phone: {profileData.phone}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-home"></i>
                        <span>Apartment: {profileData.apartment}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-calendar"></i>
                        <span>Member Since: {profileData.joinDate}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-group"></i>
                        <span>Family Members: {profileData.familyMembers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="maintenance-card">
                  <div className="maintenance-card-header">
                    <div className="request-title-section">
                      <h3 className="request-title">Vehicles</h3>
                    </div>
                  </div>
                  <div className="request-details">
                    {profileData.vehicles.map((vehicle, index) => (
                      <div
                        key={index}
                        className="comment"
                        style={{ marginBottom: "1rem" }}
                      >
                        <div className="comment-header">
                          <span className="comment-author">{vehicle.type}</span>
                        </div>
                        <p className="comment-text">
                          Registration Number: {vehicle.number}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="maintenance-card">
                  <div className="maintenance-card-header">
                    <div className="request-title-section">
                      <h3 className="request-title">Emergency Contact</h3>
                    </div>
                  </div>
                  <div className="request-details">
                    <div className="request-meta">
                      <div className="meta-item">
                        <i className="bx bxs-user"></i>
                        <span>Name: {profileData.emergencyContact.name}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-user-detail"></i>
                        <span>
                          Relation: {profileData.emergencyContact.relation}
                        </span>
                      </div>
                      <div className="meta-item">
                        <i className="bx bxs-phone"></i>
                        <span>Phone: {profileData.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="maintenance-form-container">
              <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="apartment">Apartment</label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={editFormData.apartment}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="familyMembers">Family Members</label>
                    <input
                      type="number"
                      id="familyMembers"
                      name="familyMembers"
                      value={editFormData.familyMembers}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <h3
                  style={{
                    color: "var(--admin-text-primary)",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  Emergency Contact
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="emergencyContactName">Name</label>
                    <input
                      type="text"
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={editFormData.emergencyContact?.name || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          emergencyContact: {
                            ...editFormData.emergencyContact,
                            name: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContactRelation">Relation</label>
                    <input
                      type="text"
                      id="emergencyContactRelation"
                      name="emergencyContactRelation"
                      value={editFormData.emergencyContact?.relation || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          emergencyContact: {
                            ...editFormData.emergencyContact,
                            relation: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergencyContactPhone">Phone</label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={editFormData.emergencyContact?.phone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          emergencyContact: {
                            ...editFormData.emergencyContact,
                            phone: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="form-btn cancel-btn"
                    onClick={handleCancel}
                  >
                    <i className="bx bx-x"></i>
                    <span>Cancel</span>
                  </button>
                  <button type="submit" className="form-btn submit-btn">
                    <i className="bx bx-check"></i>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
