import React, { useState } from "react";

const PostNotices = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Annual General Meeting",
      content:
        "The Annual General Meeting will be held on March 20, 2025 at 6:00 PM in the community hall. All residents are requested to attend.",
      priority: "high",
      date: "2025-03-11",
      author: "Society Secretary",
    },
    {
      id: 2,
      title: "Water Supply Interruption",
      content:
        "Due to maintenance work, there will be no water supply on March 15 from 10:00 AM to 4:00 PM. Please store water accordingly.",
      priority: "medium",
      date: "2025-03-10",
      author: "Maintenance Manager",
    },
    {
      id: 3,
      title: "New Gym Equipment",
      content:
        "We have installed new equipment in the gym. Residents are requested to use it carefully and follow the instructions.",
      priority: "low",
      date: "2025-03-09",
      author: "Facility Manager",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    author: "Admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      id: notices.length + 1,
      ...formData,
      date: new Date().toISOString().split("T")[0],
    };
    setNotices([newNotice, ...notices]);
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      author: "Admin",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff6b6b";
      case "medium":
        return "#ffd166";
      case "low":
        return "#06d6a0";
      default:
        return "#64ffda";
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
            <i className="fas fa-bullhorn"></i>
            <span>Notices</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-users"></i>
            <span>Residents</span>
          </button>
          <button className="admin-nav-link">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="admin-dashboard">
        <h1 className="admin-heading">Community Notices</h1>
        <p className="admin-subtext">
          Post and manage important announcements for all residents in your
          society
        </p>

        <div style={{ maxWidth: "800px", margin: "0 auto", marginTop: "2rem" }}>
          <div
            style={{
              background: "var(--admin-secondary-bg)",
              padding: "2rem",
              borderRadius: "16px",
              border: "var(--admin-card-border)",
              marginBottom: "2rem",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
                color: "var(--admin-accent)",
              }}
            >
              Post New Notice
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  Notice Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(100, 255, 218, 0.2)",
                    borderRadius: "8px",
                    color: "var(--admin-text-primary)",
                    fontSize: "1rem",
                    transition: "var(--admin-transition)",
                  }}
                  placeholder="Enter notice title"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  Notice Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(100, 255, 218, 0.2)",
                    borderRadius: "8px",
                    color: "var(--admin-text-primary)",
                    fontSize: "1rem",
                    minHeight: "120px",
                    resize: "vertical",
                    transition: "var(--admin-transition)",
                  }}
                  placeholder="Enter notice details"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(100, 255, 218, 0.2)",
                      borderRadius: "8px",
                      color: "var(--admin-text-primary)",
                      fontSize: "1rem",
                      transition: "var(--admin-transition)",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Posted By
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(100, 255, 218, 0.2)",
                      borderRadius: "8px",
                      color: "var(--admin-text-primary)",
                      fontSize: "1rem",
                      transition: "var(--admin-transition)",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="admin-btn"
                style={{ marginLeft: "auto", display: "flex" }}
              >
                Post Notice <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
                color: "var(--admin-accent)",
              }}
            >
              Published Notices
            </h2>

            {notices.map((notice) => (
              <div
                key={notice.id}
                style={{
                  background: "var(--admin-secondary-bg)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                  border: "var(--admin-card-border)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: getPriorityColor(notice.priority),
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      margin: 0,
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    {notice.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      style={{
                        background: "rgba(100, 255, 218, 0.1)",
                        border: "none",
                        color: "var(--admin-accent)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "var(--admin-transition)",
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      style={{
                        background: "rgba(255, 100, 100, 0.1)",
                        border: "none",
                        color: "#ff6464",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "var(--admin-transition)",
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    margin: "0.5rem 0 1rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  {notice.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    paddingTop: "0.75rem",
                    fontSize: "0.85rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  <span>
                    <i
                      className="fas fa-user"
                      style={{ marginRight: "0.35rem" }}
                    ></i>
                    {notice.author}
                  </span>
                  <span>
                    <i
                      className="fas fa-calendar-alt"
                      style={{ marginRight: "0.35rem" }}
                    ></i>
                    {notice.date}
                  </span>
                  <span
                    style={{
                      color: getPriorityColor(notice.priority),
                      background: `rgba(${getPriorityColor(
                        notice.priority
                      ).replace(/[^\d,]/g, "")}, 0.1)`,
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                    }}
                  >
                    <i
                      className="fas fa-flag"
                      style={{ marginRight: "0.35rem" }}
                    ></i>
                    {notice.priority.charAt(0).toUpperCase() +
                      notice.priority.slice(1)}{" "}
                    Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNotices;
