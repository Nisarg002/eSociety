import React from "react";
import { Link } from "react-router-dom";

const AlreadyLoggedIn = () => {
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
          className="bx bxs-user-check"
          style={{
            fontSize: "6rem",
            color: "#27ae60",
            display: "block",
            margin: "0 auto 1.5rem",
          }}
        ></i>
        <h1 className="admin-heading">Already Logged In</h1>
        <p
          className="admin-subtext"
          style={{ maxWidth: "600px", margin: "1.5rem auto" }}
        >
          You are already logged in to the system. No need to authenticate
          again.
        </p>
        <Link to={roleMap[role] || "/"}>
          <button className="admin-btn" style={{ margin: "2rem auto" }}>
            <span>Go to Dashboard</span>
            <i className="bx bx-home"></i>
          </button>
        </Link>
        <p
          className="admin-subtext"
          style={{ fontSize: "0.9rem", marginTop: "3rem" }}
        >
          If you want to switch accounts, please log out first before trying to
          log in again.
        </p>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
