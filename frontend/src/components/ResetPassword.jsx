import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/AuthForm.css"; // Import the same CSS file

const ResetPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const resetForm = useForm({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = resetForm;
  const newPassword = watch("newPassword");

  const handleResetSubmit = async (data) => {
    try {
      // Reset any previous error messages
      setErrorMessage("");

      // Check if passwords match
      if (data.newPassword !== data.confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }

    //   console.log("Password:", data.newPassword, "Token:", token);

      // Replace with your actual API endpoint
      const response = await axios.post(
        "/reset-password/",
        {
          password: data.newPassword,
          token: token,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
    //   console.error("Password reset error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // Using the same image as forgot password from original component
  const resetImage =
    "https://images.unsplash.com/photo-1738526787231-68f72f95bf92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzcwfHx3aGl0ZSUyMGJ1aWxkaW5nfGVufDB8fDB8fHww";

  return (
    <div className="auth-system__container">
      <div className="auth-system__wrapper">
        {/* Image Container */}
        <div className="auth-system__image-container auth-system__hidden auth-system__md-flex">
          <img
            src={resetImage}
            alt="Reset password illustration"
            className="auth-system__image"
          />
        </div>

        {/* Form Container */}
        <div className="auth-system__slider-container">
          <div
            className="auth-system__slider"
            style={{ transform: "translateX(0)" }}
          >
            {/* Reset Password Form */}
            <div
              className="auth-system__form-container"
              style={{
                animation: "auth-system__fadeIn 0.8s forwards",
                opacity: 1,
              }}
            >
              {!isSubmitted ? (
                <>
                  <h2 className="auth-system__heading">Reset Password</h2>
                  <form onSubmit={handleSubmit(handleResetSubmit)}>
                    <div className="auth-system__input-group">
                      <label
                        htmlFor="newPassword"
                        className="auth-system__label"
                      >
                        New Password
                      </label>
                      <input
                        {...register("newPassword", {
                          required: "New password is required",
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
                        id="newPassword"
                        className={`auth-system__input ${
                          errors.newPassword ? "auth-system__input-error" : ""
                        }`}
                        placeholder="Enter new password"
                      />
                      {errors.newPassword && (
                        <p className="auth-system__error-message">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="auth-system__input-group">
                      <label
                        htmlFor="confirmPassword"
                        className="auth-system__label"
                      >
                        Confirm Password
                      </label>
                      <input
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        type="password"
                        id="confirmPassword"
                        className={`auth-system__input ${
                          errors.confirmPassword
                            ? "auth-system__input-error"
                            : ""
                        }`}
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="auth-system__error-message">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {errorMessage && (
                      <p className="auth-system__error-message">
                        {errorMessage}
                      </p>
                    )}

                    <button type="submit" className="auth-system__button">
                      Reset Password
                    </button>
                  </form>
                  <div
                    className="auth-system__toggle-link"
                    onClick={() => navigate("/form")}
                  >
                    Back to Log In
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                    padding: "9rem 0",
                  }}
                  className="auth-system__success-message"
                >
                  <h2 className="auth-system__heading">
                    Password Reset Successful
                  </h2>
                  <p>Your password has been successfully reset.</p>
                  <button
                    onClick={() => navigate("/form")}
                    className="auth-system__button"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
