import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../assets/css/AuthForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import BouncingDotsLoader from "../components/common/Loaders-Test/BouncingDotsLoader";

const AuthForm = () => {
  // State to track current form and image
  const [currentForm, setCurrentForm] = useState("signup");
  const [imageOpacity, setImageOpacity] = useState(1);
  const [imageScale, setImageScale] = useState(1);
  const [formAnimation, setFormAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [loadingMessage, setLoadingMessage] = useState(""); // Add loading message
  const navigate = useNavigate();

  // Initialize React Hook Form for each form type
  const signupForm = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotForm = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // Get the active form based on current state
  const getActiveForm = () => {
    switch (currentForm) {
      case "signup":
        return signupForm;
      case "login":
        return loginForm;
      case "forgot":
        return forgotForm;
      default:
        return signupForm;
    }
  };

  // Define form images - using placeholders as in the original
  const formImages = {
    signup:
      "https://images.unsplash.com/photo-1587663298189-6e05e9017fd5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdoaXRlJTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
    login:
      "https://plus.unsplash.com/premium_photo-1680281936372-109b61c70b4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHdoaXRlJTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
    forgot:
      "https://img.freepik.com/free-photo/vertical-shot-white-building-clear-sky_181624-4575.jpg?ga=GA1.1.467182155.1743602977&semt=ais_hybrid&w=740",
  };

  // Function to toggle between forms with enhanced animation
  const toggleForm = (form) => {
    // First fade out the image
    setImageOpacity(0);
    setImageScale(0.92);

    // Reset form animation to trigger it again
    setFormAnimation(false);

    // Short delay before changing the form
    setTimeout(() => {
      setCurrentForm(form);

      // Then fade in the new image with a smoother transition
      setTimeout(() => {
        setImageOpacity(1);
        setImageScale(1);
        setFormAnimation(true);
      }, 100);
    }, 400);
  };

  // Form submission handlers
  const handleSignupSubmit = signupForm.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Creating your account...");

      data.role_id = "67d196ffe95a2decede3e8db";
      const res = await axios.post("user/signup/", data);

      if (res.status === 201) {
        toast.success("Account created successfully! Please log in.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        });
        toggleForm("login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        }
      );
    } finally {
      setIsLoading(false);
    }
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Logging you in...");

      const res = await axios.post("/user/login/", data);

      if (res.status === 200) {
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("role", res.data.user.role.name);
        localStorage.setItem("username", res.data.user.name);
      }

      if (localStorage.getItem("role") === "Admin") {
        navigate("/admin");
      } else if (localStorage.getItem("role") === "Resident") {
        navigate("/resident");
      } else if (localStorage.getItem("role") === "Security Guard") {
        navigate("/security");
      } else if (localStorage.getItem("role") === "Pending") {
        toast.info("Your request is pending for approval.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        }
      );
      setIsLoading(false);
    }
  });

  const handleForgotSubmit = forgotForm.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Sending password reset link...");

      const res = await axios.post(`/forgot-password/?email=${data.email}`);

      if (res.status === 200) {
        toast.info("Password reset link has been sent to your email.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          transition: Slide,
        }
      );
    } finally {
      setIsLoading(false);
    }
  });

  // Trigger initial animation on component mount
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("role") !== "pending"
    ) {
      navigate("/logged-in");
    }

    setFormAnimation(true);
  }, []);

  // Get transform value based on current form
  const getSliderTransform = () => {
    switch (currentForm) {
      case "signup":
        return "translateX(0)";
      case "login":
        return "translateX(-33.33%)";
      case "forgot":
        return "translateX(-66.66%)";
      default:
        return "translateX(0)";
    }
  };

  return (
    <div className="auth-system__container">
      {/* Full-screen loader with blur - similar to ManageUsers component */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(5px)", // Blur effect
            zIndex: 1000, // Ensure it's on top of everything
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "2rem",
              borderRadius: "12px",
              background: "var(--admin-secondary-bg, white)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <BouncingDotsLoader />
            <p
              style={{
                marginTop: "1rem",
                color: "var(--admin-text-primary, #333)",
                fontWeight: "500",
              }}
            >
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      <div className="auth-system__wrapper">
        {/* Image Container */}
        <div className="auth-system__image-container auth-system__hidden auth-system__md-flex">
          <img
            src={formImages[currentForm]}
            alt={`${currentForm} illustration`}
            className="auth-system__image"
            style={{
              opacity: imageOpacity,
              transform: `scale(${imageScale}) rotate(${
                imageScale < 1 ? "-2deg" : "0deg"
              })`,
            }}
          />
        </div>

        {/* Form Container */}
        <div className="auth-system__slider-container">
          <div
            className="auth-system__slider"
            style={{
              transform: getSliderTransform(),
            }}
          >
            {/* Sign Up Form */}
            <div
              className="auth-system__form-container"
              style={{
                animation:
                  formAnimation && currentForm === "signup"
                    ? "auth-system__fadeIn 0.8s forwards"
                    : "none",
                opacity: formAnimation && currentForm === "signup" ? 1 : 0,
              }}
            >
              <h2 className="auth-system__heading">Create Your Account</h2>
              <form onSubmit={handleSignupSubmit}>
                <div className="auth-system__input-group">
                  <label htmlFor="name" className="auth-system__label">
                    Name
                  </label>
                  <input
                    {...signupForm.register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    id="name"
                    className={`auth-system__input ${
                      signupForm.formState.errors.name
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                  {signupForm.formState.errors.name && (
                    <p className="auth-system__error-message">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="auth-system__input-group">
                  <label htmlFor="email" className="auth-system__label">
                    Email
                  </label>
                  <input
                    {...signupForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    className={`auth-system__input ${
                      signupForm.formState.errors.email
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Enter your email address"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="auth-system__error-message">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="auth-system__input-group">
                  <label htmlFor="password" className="auth-system__label">
                    Password
                  </label>
                  <input
                    {...signupForm.register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                      },
                    })}
                    type="password"
                    id="password"
                    className={`auth-system__input ${
                      signupForm.formState.errors.password
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Create a strong password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="auth-system__error-message">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <button type="submit" className="auth-system__button">
                  Sign Up
                </button>
              </form>
              <div
                className="auth-system__toggle-link"
                onClick={() => toggleForm("login")}
              >
                Already have an account? Log In
              </div>
            </div>

            {/* Login Form */}
            <div
              className="auth-system__form-container"
              style={{
                animation:
                  formAnimation && currentForm === "login"
                    ? "auth-system__fadeIn 0.8s forwards"
                    : "none",
                opacity: formAnimation && currentForm === "login" ? 1 : 0,
              }}
            >
              <h2 className="auth-system__heading">Welcome Back</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="auth-system__input-group">
                  <label htmlFor="login-email" className="auth-system__label">
                    Email
                  </label>
                  <input
                    {...loginForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="login-email"
                    className={`auth-system__input ${
                      loginForm.formState.errors.email
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Enter your email address"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="auth-system__error-message">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="auth-system__input-group">
                  <label
                    htmlFor="login-password"
                    className="auth-system__label"
                  >
                    Password
                  </label>
                  <input
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                    type="password"
                    id="login-password"
                    className={`auth-system__input ${
                      loginForm.formState.errors.password
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="auth-system__error-message">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <button type="submit" className="auth-system__button">
                  Log In
                </button>
              </form>
              <div
                className="auth-system__forgot-link"
                onClick={() => toggleForm("forgot")}
              >
                Forgot Password?
              </div>
              <br />
              <div
                className="auth-system__toggle-link"
                onClick={() => toggleForm("signup")}
              >
                Don't have an account? Sign Up
              </div>
            </div>

            {/* Forgot Password Form */}
            <div
              className="auth-system__form-container"
              style={{
                animation:
                  formAnimation && currentForm === "forgot"
                    ? "auth-system__fadeIn 0.8s forwards"
                    : "none",
                opacity: formAnimation && currentForm === "forgot" ? 1 : 0,
              }}
            >
              <h2 className="auth-system__heading">Reset Your Password</h2>
              <form onSubmit={handleForgotSubmit}>
                <div className="auth-system__input-group">
                  <label htmlFor="reset-email" className="auth-system__label">
                    Email
                  </label>
                  <input
                    {...forgotForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="reset-email"
                    className={`auth-system__input ${
                      forgotForm.formState.errors.email
                        ? "auth-system__input-error"
                        : ""
                    }`}
                    placeholder="Enter your registered email"
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="auth-system__error-message">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <button type="submit" className="auth-system__button">
                  Send Reset Link
                </button>
              </form>
              <div
                className="auth-system__toggle-link"
                onClick={() => toggleForm("login")}
              >
                Back to Log In
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
    </div>
  );
};

export default AuthForm;
