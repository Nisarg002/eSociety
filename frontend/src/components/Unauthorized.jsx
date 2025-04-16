// Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
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
          className="bx bxs-lock-alt"
          style={{
            fontSize: "6rem",
            color: "#e67e22",
            display: "block",
            margin: "0 auto 1.5rem",
          }}
        ></i>
        <h1 className="admin-heading">Unauthorized Access</h1>
        <p
          className="admin-subtext"
          style={{ maxWidth: "600px", margin: "1.5rem auto" }}
        >
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
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
          If you need access to this section, please request appropriate
          permissions.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
