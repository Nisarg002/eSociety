import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SecurityGuardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();

  // Get current path
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const path = pathSegments.pop() || "dashboard";
    setActivePath(path);
  }, [window.location.pathname]); // Added dependency to react to route changes

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    document.body.classList.toggle("menu-open", !isMenuOpen);
  };

  // Close menu when clicking outside
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Handle navigation
  const handleNavClick = (path) => {
    const fullPath = path.startsWith("/") ? path : `/security/${path}`;
    if (activePath !== path) {
      navigate(fullPath);
    }
    setActivePath(path);
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Custom logout logic
  const handleLogout = async () => {
    try {
      // Clear authentication data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("id");
      localStorage.removeItem("role");

      // You can also make an API call to invalidate the session on the server if needed
      // const response = await fetch("/api/auth/logout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("token")}`
      //   }
      // });

      // Clear any other user-related data from state or context if applicable

      // Redirect to login
      navigate("/form");
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Close menu if open
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Menu items
  const menuItems = [
    { path: "", icon: "bx bxs-dashboard", label: "Dashboard" },
    { path: "visitors", icon: "bx bxs-group", label: "Visitors" },
    { path: "staff", icon: "bx bxs-id-card", label: "Staff" },
  ];

  return (
    <>
      {/* Overlay for mobile menu */}
      <div
        className={`navbar-overlay ${isMenuOpen ? "show" : ""}`}
        onClick={handleOverlayClick}
      />

      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <Link
            style={{ textDecoration: "none", color: "#64ffda" }}
            to="/security"
          >
            Smart e-Society
          </Link>
        </div>

        {/* Hamburger menu button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={`bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}></i>
        </button>

        {/* Menu links */}
        <div className={`admin-nav-links ${isMenuOpen ? "show" : ""}`}>
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              className={`admin-nav-link ${
                activePath === item.path ? "active" : ""
              }`}
              onClick={() => handleNavClick(item.path)}
              style={{ "--item-index": index }}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Logout button */}
          <button
            className="admin-nav-link"
            onClick={handleLogout}
            style={{ "--item-index": menuItems.length }}
          >
            <i className="bx bx-log-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SecurityGuardNavbar;
