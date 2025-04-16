// NotFound404.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound404 = () => {
  const roleMap = {
    Admin: "/admin",
    Resident: "/resident",
    "Security Guard": "/security",
  };

  const role = localStorage.getItem("role");
  return (
    <div className="admin-container">
      <div
        className="admin-dashboard"
        style={{ textAlign: "center", marginTop: "5rem" }}
      >
        <i
          className="bx bxs-error-circle"
          style={{
            fontSize: "6rem",
            color: "#e74c3c",
            display: "block",
            margin: "0 auto 1.5rem",
          }}
        ></i>

        <h1 className="admin-heading">404 - Page Not Found</h1>

        <p
          className="admin-subtext"
          style={{ maxWidth: "600px", margin: "1.5rem auto" }}
        >
          The page you are looking for doesn't exist or has been moved. Please
          check the URL or navigate back to the dashboard.
        </p>

        <Link to={roleMap[role] || "/"}>
          <button className="admin-btn" style={{ margin: "2rem auto" }}>
            <span>Return to Dashboard</span>
            <i className="bx bx-home"></i>
          </button>
        </Link>

        <p
          className="admin-subtext"
          style={{ fontSize: "0.9rem", marginTop: "3rem" }}
        >
          If you believe this is an error, please contact the system
          administrator.
        </p>
      </div>
    </div>
  );
};

export default NotFound404;
