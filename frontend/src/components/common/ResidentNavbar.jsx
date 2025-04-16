import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResidentNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();

  // Get current path from URL - now with dependency on window.location.pathname
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const path = pathSegments.pop() || "dashboard"; // Ensure it defaults to 'dashboard'
    setActivePath(path);
  }, [window.location.pathname]); // Added dependency to react to route changes

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    // Prevent scrolling when menu is open
    document.body.classList.toggle("menu-open", !isMenuOpen);
  };

  // Close menu when clicking outside
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Handle navigation clicks
  const handleNavClick = (path) => {
    const fullPath = path === "" ? "/resident" : `/resident/${path}`;
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
      // localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("username");

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

      // Optional: Show logout success message
      // alert("You have been successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Close menu if open
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  // Navigation menu items
  const menuItems = [
    { path: "", icon: "bx bxs-dashboard", label: "Dashboard" },
    {
      path: "complaints",
      icon: "bx bxs-message-error",
      label: "Complaints",
    },
    { path: "notices", icon: "bx bxs-megaphone", label: "Notices" },
    { path: "facilities", icon: "bx bxs-calendar-edit", label: "Facilities" },
    { path: "payment", icon: "bx bxs-bank", label: "Payment" },
  ];


  return (
    <>
      {/* Overlay for closing mobile menu */}
      <div
        className={`navbar-overlay ${isMenuOpen ? "show" : ""}`}
        onClick={handleOverlayClick}
      />
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <Link
            style={{ textDecoration: "none", color: "#64ffda" }}
            to="/resident"
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

export default ResidentNavbar;
