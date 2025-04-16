import React, { useEffect, useState } from "react";
import axios from "axios";

const SocietyNotices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;
  const [notices, setNotices] = useState([]);

  // Sample data matching your Notice model (for fallback)
  const sampleNotices = [
    {
      id: 1,
      title: "Annual General Meeting",
      content:
        "The annual general meeting will be held on March 20th at 7:00 PM in the community hall. All residents are requested to attend.",
      category: "Meeting",
      date: "2025-03-20",
      postedBy: "Society Secretary",
      timestamp: "2025-03-10T10:00:00",
      importance: "high", // Adding this for UI compatibility
    },
    {
      id: 2,
      title: "Water Supply Interruption",
      content:
        "The water supply will be interrupted on March 15th from 10:00 AM to 2:00 PM due to maintenance work. Please store water accordingly.",
      category: "Maintenance",
      date: "2025-03-15",
      postedBy: "Maintenance Team",
      timestamp: "2025-03-08T14:30:00",
      importance: "high",
    },
    {
      id: 3,
      title: "New Gardening Schedule",
      content:
        "The society garden will be maintained on Mondays, Wednesdays, and Fridays from 8:00 AM to 11:00 AM. Please avoid these areas during maintenance.",
      category: "General",
      date: "2025-03-10",
      postedBy: "Garden Committee",
      timestamp: "2025-03-05T09:15:00",
      importance: "medium",
    },
    {
      id: 4,
      title: "Holi Celebration",
      content:
        "The society will be celebrating Holi on March 25th at the community garden. All residents are invited to join the festivities.",
      category: "Event",
      date: "2025-03-25",
      postedBy: "Cultural Committee",
      timestamp: "2025-03-12T16:45:00",
      importance: "medium",
    },
    {
      id: 5,
      title: "Parking Area Renovation",
      content:
        "The parking area will be renovated from March 17th to March 19th. Please park your vehicles in the designated temporary parking area.",
      category: "Maintenance",
      date: "2025-03-17",
      postedBy: "Maintenance Team",
      timestamp: "2025-03-11T11:20:00",
      importance: "high",
    },
    {
      id: 6,
      title: "Monthly Security Fee Collection",
      content:
        "The monthly security fee will be collected on the 5th of every month. Please ensure timely payment.",
      category: "Security",
      date: "2025-04-05",
      postedBy: "Finance Committee",
      timestamp: "2025-03-25T08:30:00",
      importance: "medium",
    },
    {
      id: 7,
      title: "New Gym Equipment",
      content:
        "New gym equipment has been installed in the society gym. All residents are requested to use the equipment with care.",
      category: "General",
      date: "2025-03-08",
      postedBy: "Gym Committee",
      timestamp: "2025-03-02T15:10:00",
      importance: "low",
    },
    {
      id: 8,
      title: "Fire Safety Drill",
      content:
        "A fire safety drill will be conducted on March 22nd at 11:00 AM. All residents are requested to participate.",
      category: "Emergency",
      date: "2025-03-22",
      postedBy: "Safety Committee",
      timestamp: "2025-03-15T09:45:00",
      importance: "high",
    },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("/notice");
      // console.log(res.data);

      // Map API response to match UI requirements if needed
      const formattedNotices = res.data.map((notice, index) => ({
        id: notice.id || index + 1,
        title: notice.title || "",
        content: notice.content || "",
        category: notice.category || "General",
        date: notice.date || new Date().toISOString().split("T")[0],
        postedBy: notice.postedBy || "Admin",
        timestamp: notice.timestamp || new Date().toISOString(),
        importance: notice.importance || "medium", // Assuming importance might be part of your data
      }));

      setNotices(formattedNotices);
    } catch (error) {
      console.error("Error fetching notices:", error);
      // Fallback to sample data if API fails
      setNotices(sampleNotices);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Use the fetched notices or fallback to sample data if empty
  const displayNotices = notices.length > 0 ? notices : sampleNotices;

  const filteredNotices = displayNotices
    .filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((notice) =>
      filterType === "all" ? true : notice.category === filterType
    );

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstNotice,
    indexOfLastNotice
  );

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getImportanceClass = (importance) => {
    switch (importance) {
      case "high":
        return "status-badge priority-high";
      case "medium":
        return "status-badge priority-medium";
      case "low":
        return "status-badge priority-low";
      default:
        return "status-badge priority-medium";
    }
  };

  const getTypeClass = (category) => {
    switch (category) {
      case "Meeting":
        return "status-badge status-meeting";
      case "Maintenance":
        return "status-badge status-maintenance";
      case "Event":
        return "status-badge status-event";
      case "Security":
        return "status-badge status-security";
      case "Emergency":
        return "status-badge status-emergency";
      case "General":
        return "status-badge status-general";
      default:
        return "status-badge status-general";
    }
  };

  const navigate = (page) => {
    console.log(`Navigating to ${page}`);
    alert(`Redirecting to ${page} section...`);
  };

  const logout = () => {
    console.log("Logging out...");
    alert("Successfully logged out!");
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Society Notices</h1>
        <p className="admin-subtext">
          View and manage all society announcements and notifications.
        </p>
      </div>

      <div className="visitor-controls">
        <div className="search-box">
          <i className="bx bx-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="type-filter">Filter by Type:</label>
            <select
              id="type-filter"
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="General">General</option>
              <option value="Meeting">Meeting</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event</option>
              <option value="Security">Security</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      <div className="maintenance-list">
        {currentNotices.length > 0 ? (
          currentNotices.map((notice) => (
            <div key={notice.id} className="maintenance-card">
              <div className="maintenance-card-header">
                <div className="request-title-section">
                  <i
                    className="bx bxs-megaphone"
                    style={{ color: "var(--admin-accent)", fontSize: "1.5rem" }}
                  ></i>
                  <h3 className="request-title">{notice.title}</h3>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={getTypeClass(notice.category)}>
                    {notice.category}
                  </span>
                  {/* <span
                    className={getImportanceClass(
                      notice.importance || "medium"
                    )}
                  >
                    {notice.importance || "medium"} priority
                  </span> */}
                </div>
              </div>
              <div className="request-details">
                <p className="request-description">{notice.content}</p>
                <div className="request-meta">
                  <div className="meta-item">
                    <i className="bx bx-calendar"></i>
                    <span>
                      Date: {new Date(notice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <i className="bx bx-user"></i>
                    <span>Posted By: {notice.postedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-requests">
            <i className="bx bx-info-circle"></i>
            <h3>No notices found</h3>
            <p>There are no notices matching your search criteria.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pagination-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default SocietyNotices;
