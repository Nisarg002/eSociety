import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X as CloseIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  User,
  Clock,
} from "lucide-react";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    date: "",
    postedBy: "Admin",
  });

  const categories = [
    "General",
    "Meeting",
    "Maintenance",
    "Event",
    "Security",
    "Emergency",
  ];

  // Fetch all notices from API
  const fetchData = async () => {
    try {
      const res = await axios.get("/notice");
      setNotices(res.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        // Update existing notice
        formData.timestamp = new Date().toISOString();
        await axios.patch(`/notice/${editingId}`, formData);
        // Fetch updated data instead of manually updating state
        fetchData();
      } else {
        // Add new notice
        formData.timestamp = new Date().toISOString();
        await axios.post("/notice", formData);
        // Fetch updated data to get the server-generated ID
        fetchData();
      }

      // Reset form
      setFormData({
        title: "",
        content: "",
        category: "General",
        date: "",
        postedBy: "Admin",
      });
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving notice:", error);
      alert("Failed to save notice. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const noticeToEdit = notices.find((notice) => notice._id === id);
    if (noticeToEdit) {
      setFormData({
        title: noticeToEdit.title,
        content: noticeToEdit.content,
        category: noticeToEdit.category,
        date: noticeToEdit.date || "",
        postedBy: noticeToEdit.postedBy,
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await axios.delete(`/notice/${id}`);
        // Fetch updated data after deletion
        fetchData();
      } catch (error) {
        console.error("Error deleting notice:", error);
        alert("Failed to delete notice. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      category: "General",
      date: "",
      postedBy: "Admin",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Apply filtering logic
  const filteredNotices = notices.filter((notice) => {
    const matchesFilter =
      activeFilter === "all" ||
      (notice.category &&
        notice.category.toLowerCase() === activeFilter.toLowerCase());
    const matchesSearch =
      (notice.title &&
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notice.content &&
        notice.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Render status badge based on category
  const renderStatusBadge = (category) => {
    const categoryClasses = {
      General: "status-pending",
      Meeting: "status-approved",
      Maintenance: "status-pending",
      Event: "status-approved",
      Security: "status-rejected",
      Emergency: "status-rejected",
    };

    return (
      <span
        className={`status-badge ${
          categoryClasses[category] || "status-pending"
        }`}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Community Notice Board</h1>
        <p className="admin-subtext">
          Post and manage important announcements and notices for all residents
        </p>
      </div>

      {/* Filters and Search section */}
      <div className="maintenance-actions visitor-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Notices
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                activeFilter === category.toLowerCase() ? "active" : ""
              }`}
              onClick={() => setActiveFilter(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          className="admin-btn"
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              content: "",
              category: "General",
              date: "",
              postedBy: "Admin",
            });
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          Post New Notice
        </button>
      </div>

      {/* Notice list */}
      <div
        className="maintenance-list"
        style={{ padding: "1.5rem 2rem", margin: "1.5rem 0" }}
      >
        {filteredNotices.length === 0 ? (
          <div className="no-requests">
            <MessageSquare size={48} />
            <p>No notices found</p>
            <p>No notices match your current filters or search query.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div key={notice._id} className="maintenance-card">
              <div className="maintenance-card-header">
                <div className="request-title-section">
                  <MessageSquare
                    size={24}
                    style={{ color: "var(--admin-accent)" }}
                  />
                  <h3 className="request-title">{notice.title}</h3>
                </div>
                {renderStatusBadge(notice.category)}
              </div>

              <div className="request-details">
                <div className="request-meta">
                  <div className="meta-item">
                    <User size={16} />
                    <span>{notice.postedBy}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Posted: {formatTimestamp(notice.timestamp)}</span>
                  </div>
                  {notice.date && (
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>Effective: {formatDate(notice.date)}</span>
                    </div>
                  )}
                </div>

                <p className="request-description">{notice.content}</p>

                <div className="request-actions">
                  <button
                    onClick={() => handleEdit(notice._id)}
                    className="action-btn"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--admin-accent)",
                      color: "var(--admin-accent)",
                    }}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="action-btn reject-btn"
                    style={{
                      background: "rgba(255, 87, 87, 0.1)",
                      color: "#ff5757",
                      border: "1px solid rgba(255, 87, 87, 0.3)",
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Notice Modal - Styled like the second code */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--admin-secondary-bg)",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "var(--admin-card-border)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h2
              style={{
                color: "var(--admin-accent)",
                marginBottom: "1.5rem",
                borderBottom: "1px solid rgba(100, 255, 218, 0.2)",
                paddingBottom: "0.8rem",
              }}
            >
              {editingId ? "Edit Notice" : "Create New Notice"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Notice Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
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
                  }}
                >
                  Notice Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                    minHeight: "150px",
                    resize: "vertical",
                  }}
                  placeholder="Enter notice details"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "var(--admin-primary-bg)",
                      color: "var(--admin-text-primary)",
                      outline: "none",
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    Effective Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "var(--admin-primary-bg)",
                      color: "var(--admin-text-primary)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Posted By
                </label>
                <input
                  type="text"
                  name="postedBy"
                  value={formData.postedBy}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                  }}
                  placeholder="Enter your name or title"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "transparent",
                    color: "var(--admin-text-secondary)",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "var(--admin-transition)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <CloseIcon size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--admin-accent)",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "var(--admin-transition)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {editingId ? (
                    <>
                      <Edit size={18} />
                      Update Notice
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Post Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
