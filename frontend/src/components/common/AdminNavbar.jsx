import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
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
    const fullPath = path === "" ? "/admin" : `/admin/${path}`;
    if (activePath !== path) {
      navigate(fullPath);
    }
    setActivePath(path);
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Custom logout implementation
  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // You can also clear other auth-related items as needed
    sessionStorage.removeItem("authSession");

    // Optional: Clear any cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    // Redirect to login page
    navigate("/form");

    // Close menu if open
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Menu items
  const menuItems = [
    { path: "", icon: "bx bxs-dashboard", label: "Dashboard" },
    { path: "society", icon: "bx bxs-city", label: "Society" },
    { path: "payments", icon: "bx bxs-credit-card", label: "Payments" },
    { path: "users", icon: "bx bxs-group", label: "Users" },
    {
      path: "complaints",
      icon: "bx bxs-message-alt-error",
      label: "Complaints",
    },
    {
      path: "requests",
      icon: "bx bxs-calendar-edit",
      label: "Booking",
    },
    { path: "visitors", icon: "bx bxs-id-card", label: "Visitors" },
    { path: "notices", icon: "bx bxs-megaphone", label: "Notices" },
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
            to="/admin"
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

export default AdminNavbar;
