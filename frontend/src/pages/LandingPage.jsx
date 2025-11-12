import React, { useEffect, useState, useRef } from "react";
import "../assets_2/css/style.css";
import "../assets_2/css/bootstrap.min.css";
import "../assets_2/css/fontawesome-all.min.css";
import "../assets_2/js/popper.min.js";
import "../assets_2/js/bootstrap.min.js";
import "../assets_2/js/bootstrap.bundle.min.js";
import "https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/js/all.min.js";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo-transparent-svg.svg";

export const LandingPage = () => {
  // State to track the active navigation link
  const [activeSection, setActiveSection] = useState("header");
  const [isSignup, setIsSignup] = useState(true);
  const [navbarExpanded, setNavbarExpanded] = useState(false);

  // Refs for each section to track visibility
  const sectionRefs = {
    header: useRef(null),
    features: useRef(null),
    howitworks: useRef(null),
  };

  useEffect(() => {
    // Function to handle scroll effects
    const handleScroll = () => {
      // Navbar scroll effect
      const navbar = document.querySelector(".ezy__nav4_XGh9pNMa");
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      // Reveal elements on scroll
      const revealElements = document.querySelectorAll(".reveal-on-scroll");
      revealElements.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });

      // Find which section is most visible in the viewport
      let mostVisibleSection = "";
      let maxVisibility = 0;

      Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const height = window.innerHeight;

          // Calculate how much of the section is visible
          const visibleHeight =
            Math.min(rect.bottom, height) - Math.max(rect.top, 0);
          const visibility =
            visibleHeight > 0 ? visibleHeight / ref.current.offsetHeight : 0;

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = sectionId;
          }
        }
      });

      // Update active section
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check for elements
    handleScroll();
    // Change signup form every 3 seconds
    const interval = setInterval(() => {
      setIsSignup((prev) => !prev);
    }, 3000); // Change every 3 seconds

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Function to handle nav link clicks
  const handleNavLinkClick = (sectionId, e) => {
    e.preventDefault();
    setActiveSection(sectionId);
    setNavbarExpanded(false); // Close mobile menu when clicking a link

    // Scroll to the section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle navbar expansion
  const toggleNavbar = () => {
    setNavbarExpanded(!navbarExpanded);
  };

  return (
    <>
      <div className="ezy__nav4_XGh9pNMa">
        <nav
          style={{ backgroundColor: "rgb(11, 23, 39)" }}
          className="navbar navbar-expand-lg py-3"
        >
          <div className="container">
            <a
              className="navbar-brand logo-link"
              href="#header"
              onClick={(e) => handleNavLinkClick("header", e)}
            >
              <img className="logo" src={logo} alt="logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNavbar}
              aria-controls="ezy_nav4-navbar-text"
              aria-expanded={navbarExpanded}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <i className="fas fa-bars" style={{ color: "white" }}></i>
              </span>
            </button>
            <div
              className={`collapse navbar-collapse ${
                navbarExpanded ? "show" : ""
              }`}
              id="ezy_nav4-navbar-text"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 mt-4 mt-lg-0">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeSection === "header" ? "active" : ""
                    }`}
                    href="#header"
                    onClick={(e) => handleNavLinkClick("header", e)}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeSection === "features" ? "active" : ""
                    }`}
                    href="#features"
                    onClick={(e) => handleNavLinkClick("features", e)}
                  >
                    Why us?
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeSection === "howitworks" ? "active" : ""
                    }`}
                    href="#howitworks"
                    onClick={(e) => handleNavLinkClick("howitworks", e)}
                  >
                    How It Works
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav flex-row mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                    to="/form"
                  >
                    <button
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        padding: "10px 20px",
                      }}
                      className="signup btn btn-outline-light px-3"
                    >
                      {isSignup ? "Signup" : "Log in"}
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Rest of your component remains the same... */}
      <section
        id="header"
        className="ezy__header27_cr0zRW3d"
        ref={sectionRefs.header}
      >
        <div className="container heading_wrapper">
          <div className="row align-items-center justify-content-center text-center text-md-start">
            <div className="col-md-7">
              <h5 className="ezy__header27_cr0zRW3d-title mb-3">
                DIGITALIZE YOUR SOCIETY
              </h5>
              <h1 className="ezy__header27_cr0zRW3d-heading mb-4">
                SMART LIVING, SEAMLESS EXPERIENCE
              </h1>
              <p className="opacity-75">
                Simplify operations, enhance security, and improve community
                engagement—all in one platform.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start mt-4">
                <div className="me-3">
                  <button
                    style={{ backgroundColor: "#64FFDA" }}
                    className="btn btn-primary ezy__header27_cr0zRW3d-btn"
                  >
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to="/form"
                    >
                      Join Now
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <img
                src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                className="img-landing img-fluid mt-5 mt-md-0"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="ezy__featured20_FVLSF0iO"
        ref={sectionRefs.features}
      >
        <div className="container">
          <div className="row mb-5 text-center justify-content-center">
            <div className="col-lg-7">
              <h2 className="ezy__featured20_FVLSF0iO-heading mb-4">
                Smart e-Society Features
              </h2>
              <p className="ezy__featured20_FVLSF0iO-sub-heading mb-4">
                A complete digital solution to streamline society governance,
                enhance security, and improve community living.
              </p>
            </div>
          </div>
          <div className="row pt-md-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="ezy__featured20_FVLSF0iO-shape">
                <div
                  className="ezy__featured20_FVLSF0iO-bg-holder h-100"
                  style={{
                    backgroundImage:
                      "url(https://cdn.easyfrontend.com/pictures/sign-in-up/sign3.jpg)",
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ms-lg-4 ms-xl-5">
                <div className="d-flex ezy__featured20_FVLSF0iO-item position-relative p-3 p-md-4 p-xl-5 mb-3 mb-lg-4">
                  <div
                    style={{ color: "#64FFDA" }}
                    className="ezy__featured20_FVLSF0iO-icon mb-4 me-4 me-xl-5"
                  >
                    <i className="fas fa-users" />
                  </div>
                  <div>
                    <h4 className="ezy__featured20_FVLSF0iO-title fs-4 mb-3">
                      Resident Management
                    </h4>
                    <p className="ezy__featured20_FVLSF0iO-content mb-0">
                      Maintain an organized database of residents with digital
                      profiles, contact details, and role-based access.
                    </p>
                  </div>
                </div>
                <div className="d-flex ezy__featured20_FVLSF0iO-item position-relative p-3 p-md-4 p-xl-5 mb-3 mb-lg-4">
                  <div
                    style={{ color: "#64FFDA" }}
                    className="ezy__featured20_FVLSF0iO-icon mb-4 me-4 me-xl-5"
                  >
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div>
                    <h4 className="ezy__featured20_FVLSF0iO-title fs-4 mb-3">
                      Visitor & Security Control
                    </h4>
                    <p className="ezy__featured20_FVLSF0iO-content mb-0">
                      Monitor guest entries, track visitor logs, and ensure
                      controlled access to your society premises.
                    </p>
                  </div>
                </div>
                <div className="d-flex ezy__featured20_FVLSF0iO-item position-relative p-3 p-md-4 p-xl-5">
                  <div
                    style={{ color: "#64FFDA" }}
                    className="ezy__featured20_FVLSF0iO-icon mb-4 me-4 me-xl-5"
                  >
                    <i className="fas fa-bullhorn" />
                  </div>
                  <div>
                    <h4 className="ezy__featured20_FVLSF0iO-title fs-4 mb-3">
                      Announcements & Notices
                    </h4>
                    <p className="ezy__featured20_FVLSF0iO-content mb-0">
                      Broadcast important updates, circulars, and emergency
                      alerts directly to all residents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="howitworks"
        className="ezy__howitworks4_vNc66GTv"
        ref={sectionRefs.howitworks}
      >
        <div className="ezy__howitworks4_vNc66GTv-content-wrapper">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 text-center">
                <h1 className="ezy__howitworks4_vNc66GTv-heading mb-4">
                  How Smart e-Society Works
                </h1>
                <p className="ezy__howitworks4_vNc66GTv-sub-heading">
                  A simple and efficient system to digitize society operations,
                  improve communication, and enhance security.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {/* cards */}
          <div className="row mt-5">
            {/* Step 1 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 mb-3">
                <div className="card-body text-center">
                  <div className="ezy__howitworks4_vNc66GTv-number d-flex justify-content-center align-items-center mb-4">
                    <span>1</span>
                  </div>
                  <h5 className="mb-3">Register & Onboard</h5>
                  <p className="mb-0">
                    Residents and admins create accounts, verify details, and
                    get access to the Smart e-Society portal.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 mb-3">
                <div className="card-body text-center">
                  <div className="ezy__howitworks4_vNc66GTv-number d-flex justify-content-center align-items-center mb-4">
                    <span>2</span>
                  </div>
                  <h5 className="mb-3">Manage & Monitor</h5>
                  <p className="mb-0">
                    Admins handle visitor logs, security approvals, maintenance,
                    and announcements in one dashboard.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 mb-3">
                <div className="card-body text-center">
                  <div className="ezy__howitworks4_vNc66GTv-number d-flex justify-content-center align-items-center mb-4">
                    <span>3</span>
                  </div>
                  <h5 className="mb-3">Automate Payments</h5>
                  <p className="mb-0">
                    Residents receive digital invoices and make seamless online
                    payments for maintenance and utilities.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 4 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 mb-3">
                <div className="card-body text-center">
                  <div className="ezy__howitworks4_vNc66GTv-number d-flex justify-content-center align-items-center mb-4">
                    <span>4</span>
                  </div>
                  <h5 className="mb-3">Stay Connected</h5>
                  <p className="mb-0">
                    Get instant updates, emergency alerts, and event
                    notifications to stay informed and engaged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className="ezy__faq7_StEqfv9X">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-5">
              <h2 className="ezy__faq7_StEqfv9X-heading mb-4">
                Frequently Asked Questions
              </h2>
              <p className="ezy__faq7_StEqfv9X-sub-heading mb-0">
                Find answers to common questions about the Smart e-Society
                platform, its features, and how it simplifies society
                management.
              </p>
              {/* <button
                style={{ backgroundColor: "#64FFDA", color: "black" }}
                className="btn btn-outline-primary ezy__faq7_StEqfv9X-btn mt-4 mt-lg-5"
              >
                View All FAQ's
              </button> */}
            </div>
            <div className="col-md-6 mt-4 mt-md-0">
              {/* FAQ Item 1 */}
              <div className="ezy__faq7_StEqfv9X-item">
                <h5 className="p-3 p-lg-4 mb-0 w-100 text-start d-flex justify-content-between align-items-center ezy__faq7_StEqfv9X-btn-collapse">
                  <span>What is Smart e-Society?</span>
                </h5>
                <div className="ezy__faq7_StEqfv9X-content px-3 px-lg-4 pb-lg-4">
                  <p className="opacity-50 mb-0">
                    Smart e-Society is a digital platform that helps residential
                    societies manage security, payments, visitor logs, and
                    communication efficiently.
                  </p>
                </div>
              </div>
              {/* FAQ Item 2 */}
              <div className="ezy__faq7_StEqfv9X-item">
                <h5 className="p-3 p-lg-4 mb-0 w-100 text-start d-flex justify-content-between align-items-center ezy__faq7_StEqfv9X-btn-collapse">
                  <span>Who can use Smart e-Society?</span>
                </h5>
                <div className="ezy__faq7_StEqfv9X-content px-3 px-lg-4 pb-lg-4">
                  <p className="opacity-50 mb-0">
                    The platform is designed for society residents, committee
                    members, security personnel, and management teams to
                    streamline operations.
                  </p>
                </div>
              </div>
              {/* FAQ Item 3 */}
              <div className="ezy__faq7_StEqfv9X-item">
                <h5 className="p-3 p-lg-4 mb-0 w-100 text-start d-flex justify-content-between align-items-center ezy__faq7_StEqfv9X-btn-collapse">
                  <span>How does Smart e-Society enhance security?</span>
                </h5>
                <div className="ezy__faq7_StEqfv9X-content px-3 px-lg-4 pb-lg-4">
                  <p className="opacity-50 mb-0">
                    It provides visitor management, digital gate passes,
                    real-time security alerts, and an automated log system to
                    ensure resident safety.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="ezy__cta7_mkZTwIsy">
        <div className="container">
          <div className="ezy__cta7_mkZTwIsy-form-card py-md-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-7">
                <div className="py-5 px-4 px-sm-5">
                  <h2 className="ezy__cta7_mkZTwIsy-heading mb-4">
                    Join Smart e-Society for Seamless Society Management
                  </h2>
                  <div className="row justify-content-center">
                    <div className="col-sm-8">
                      <p className="ezy__cta7_mkZTwIsy-sub-heading mb-5">
                        Simplify security, communication, and maintenance with
                        our digital society management platform.
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      style={{ backgroundColor: "#64FFDA", color: "black" }}
                      className="btn btn-outline-light ezy__cta7_mkZTwIsy-btn me-2"
                    >
                      Learn More
                    </button>
                    <button
                      style={{ backgroundColor: "#64FFDA", color: "black" }}
                      className="btn btn-light ezy__cta7_mkZTwIsy-btn"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <footer className="footer_landing footer text-white py-4">
        <div className="container text-center">
          <h5 className="mb-3">Smart e-Society</h5>
          {/* <ul className="nav justify-content-center mb-3">
            <li className="nav-item">
              <Link className="nav-link text-white" to="#">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="#">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="#">
                Contact
              </Link>
            </li>
          </ul> */}
          <p className="mb-2">© 2025 Smart e-Society. All rights reserved.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="#" className="text-white">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link to="#" className="text-white">
              <i className="fab fa-twitter" />
            </Link>
            <Link to="#" className="text-white">
              <i className="fab fa-linkedin-in" />
            </Link>
          </div>
        </div>
      </footer>
      {/* <footer
        style={{
          backgroundColor: "#1a202c",
          color: "white",
          padding: "48px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "32px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Smart e-Society
              </h3>
              <p style={{ color: "#a0aec0", marginBottom: "16px" }}>
                Transforming communities through digital innovation and smart
                solutions.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <a
                  href="#"
                  style={{ color: "white", transition: "color 0.3s" }}
                >
                  <i
                    className="fab fa-facebook-f"
                    style={{ fontSize: "20px" }}
                  ></i>
                </a>
                <a
                  href="#"
                  style={{ color: "white", transition: "color 0.3s" }}
                >
                  <i
                    className="fab fa-twitter"
                    style={{ fontSize: "20px" }}
                  ></i>
                </a>
                <a
                  href="#"
                  style={{ color: "white", transition: "color 0.3s" }}
                >
                  <i
                    className="fab fa-linkedin-in"
                    style={{ fontSize: "20px" }}
                  ></i>
                </a>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Quick Links
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#a0aec0",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    Home
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#a0aec0",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    About Us
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#a0aec0",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    Services
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#a0aec0",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    Blog
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#a0aec0",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Contact Us
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ marginRight: "8px", color: "#a0aec0" }}
                  ></i>
                  <span style={{ color: "#a0aec0" }}>
                    123 Innovation Street, Tech City
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-phone"
                    style={{ marginRight: "8px", color: "#a0aec0" }}
                  ></i>
                  <span style={{ color: "#a0aec0" }}>(123) 456-7890</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-envelope"
                    style={{ marginRight: "8px", color: "#a0aec0" }}
                  ></i>
                  <span style={{ color: "#a0aec0" }}>
                    info@smartesociety.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #2d3748",
              marginTop: "32px",
              paddingTop: "32px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#a0aec0" }}>
              © 2025 Smart e-Society. All rights reserved.
            </p>
            <div style={{ marginTop: "16px" }}>
              <a
                href="#"
                style={{
                  color: "#a0aec0",
                  margin: "0 8px",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  color: "#a0aec0",
                  margin: "0 8px",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                Terms of Service
              </a>
              <a
                href="#"
                style={{
                  color: "#a0aec0",
                  margin: "0 8px",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </>
  );
};
