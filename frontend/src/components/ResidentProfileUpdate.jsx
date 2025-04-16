import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResidentProfileUpdate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [societies, setSocieties] = useState([]);
  const [user, setUser] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      flatNo: "",
      phone: "",
      role_id: "",
      status: true,
      society_id: "",
    },
  });

  // Fetch societies data
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axios.get("/society/");
        if (response.status === 200) {
          setSocieties(response.data);
        }
      } catch (error) {
        console.error("Error fetching societies:", error);
      }
    };

    fetchSocieties();
  }, []);

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id") || "";
        if (userId) {
          const response = await axios.get(`/user_id/${userId}`);

          //   console.log("User data fetched:", response.data);

          if (response.status === 200) {
            // Pre-fill the form with existing data
            const userData = response.data;
            setUser(response.data);
            // console.log("userdata......",userData)
            // Set form values for each field
            setValue("username", userData.username || "");
            setValue("email", userData.email || "");
            setValue("name", userData.name || "");
            setValue("flatNo", userData.flatNo || "");
            setValue("phone", userData.phone || "");
            setValue("role_id", userData.role_id || "");
            setValue("society_id", userData.society_id || "");
            setValue(
              "status",
              userData.status === undefined ? true : userData.status
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const userId = localStorage.getItem("id") || "";
      // Using FastAPI endpoint format
      data.password = user.password;
      console.log("id", userId);
      console.log("data", data);
      const response = await axios.patch(`/update_user/${userId}`, data);

      if (response.status === 200) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate("/resident");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Update Your Profile</h1>
        <p className="admin-subtext">
          Please complete your profile information to continue using all society
          services
        </p>

        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}

        <div className="maintenance-form-container">
          <form className="maintenance-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <span className="error-message">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  {...register("name", { required: "Full name is required" })}
                />
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              {/* <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password (leave blank to keep current)"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="error-message">
                    {errors.password.message}
                  </span>
                )}
              </div> */}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="flatNo">Flat Number</label>
                <input
                  type="text"
                  id="flatNo"
                  placeholder="Enter your flat number"
                  {...register("flatNo", {
                    required: "Flat number is required",
                  })}
                />
                {errors.flatNo && (
                  <span className="error-message">{errors.flatNo.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+-\s()]*$/,
                      message: "Invalid phone number format",
                    },
                  })}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* <div className="form-group">
                <label htmlFor="role_id">Role</label>
                <select
                  id="role_id"
                  {...register("role_id", { required: "Role is required" })}
                >
                  <option value="select">Select a role</option>
                  <option value="resident">Resident</option>
                  <option value="admin">Admin</option>
                  <option value="security">Security</option>
                </select>
                {errors.role_id && (
                  <span className="error-message">
                    {errors.role_id.message}
                  </span>
                )}
              </div> */}

              <div className="form-group">
                <label htmlFor="society_id">Society</label>
                <select
                  id="society_id"
                  {...register("society_id", {
                    required: "Society is required",
                  })}
                >
                  <option value="">Select a society</option>
                  {societies.map((society) => (
                    <option key={society._id} value={society._id}>
                      {society.name} ({society.location})
                    </option>
                  ))}
                </select>
                {errors.society_id && (
                  <span className="error-message">
                    {errors.society_id.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={() => navigate("/resident")}
                disabled={isSubmitting}
              >
                Cancel <i className="fas fa-times"></i>
              </button>
              <button
                type="submit"
                className="form-btn submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Updating... <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    Update Profile <i className="fas fa-save"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfileUpdate;
