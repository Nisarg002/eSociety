import React from "react";
import { useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/form");
  };

  return (
    <div className="admin-container">
      <div
        className="admin-dashboard"
        style={{ textAlign: "center", marginTop: "5rem" }}
      >
        <i
          className="bx bxs-user-x"
          style={{
            fontSize: "6rem",
            color: "#3498db",
            display: "block",
            margin: "0 auto 1.5rem",
          }}
        ></i>
        <h1 className="admin-heading">Not Logged In</h1>
        <p
          className="admin-subtext"
          style={{ maxWidth: "600px", margin: "1.5rem auto" }}
        >
          You are not currently logged in. Please log in to access this page and
          its features.
        </p>
        <button
          className="admin-btn"
          style={{ margin: "2rem auto" }}
          onClick={handleRedirect}
        >
          <span>Go to Login</span>
          <i className="bx bx-log-in"></i>
        </button>
        <p
          className="admin-subtext"
          style={{ fontSize: "0.9rem", marginTop: "3rem" }}
        >
          If you don't have an account yet, you can register on the login page.
        </p>
      </div>
    </div>
  );
};

export default NotLoggedIn;
