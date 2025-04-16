import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import log from "../assets/img/log.svg";
import register from "../assets/img/register.svg";
import "../assets/css/styles.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const Form = () => {
  const [isSignUpMode, setSignUpMode] = useState(true);
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("id")) {
      navigate("/logged-in");
    }
  }, []);

  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm();

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm();

  const SubmitHandlerSignIn = async (data) => {
    // data.role_id = "67bebff1b1ba38c812295709";
    // console.log("Sign In Data:", data);
    const res = await axios.post("/user/login/", data);
    // console.log(res.data.user);
    if (res.status === 200) {
      localStorage.setItem("id", res.data.user._id);
      localStorage.setItem("role", res.data.user.role.name);
      localStorage.setItem("username", res.data.user.username);
    }
    if (localStorage.getItem("role") === "Admin") {
      navigate("/admin");
    } else if (localStorage.getItem("role") === "Resident") {
      navigate("/resident");
    } else if (localStorage.getItem("role") === "Security Guard") {
      navigate("/security");
    } else if (localStorage.getItem("role") === "Pending") {
      alert("Your request is pending for approval.");
    }
  };

  const SubmitHandlerSignUp = async (data) => {
    // data.role_id = "67bebff1b1ba38c812295709";
    // console.log(role)
    data.role_id = "67d196ffe95a2decede3e8db";
    // console.log("Sign Up Data:", data);
    const res = await axios.post("http://127.0.0.1:8000/user/signup/", data);
    if (res.status === 201) {
      // alert("User created successfully!");
      setSignUpMode(false);
    }
    // console.log(res.data);
  };
  const validationSchema1 = {
    usernameValidator: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Invalid username",
      },
    },
    emailValidator: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        message: "Invalid email format",
      },
    },
    passwordValidator: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      maxLength: {
        value: 20,
        message: "Password must be at most 20 characters",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        message: "Enter Valid Password",
      },
    },
  };

  const validationSchema2 = {
    usernameValidator: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
    },
    emailValidator: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        message: "Invalid email format",
      },
    },
    passwordValidator: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Invalid password format",
      },
      maxLength: {
        value: 20,
        message: "Invalid password format",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        message: "invalid password format",
      },
    },
  };

  return (
    <div
      className={`container-form form ${isSignUpMode ? "sign-up-mode" : ""}`}
    >
      <div className="forms-container">
        <div className="signin-signup">
          <form
            className="sign-in-form"
            onSubmit={handleSignInSubmit(SubmitHandlerSignIn)}
          >
            <h2 className="title">Sign In</h2>
            <div style={{ padding: "18px 15px" }} className="input-field">
              <i className="fas fa-user" />
              <input
                type="text"
                placeholder="Email"
                {...registerSignIn("email", validationSchema1.emailValidator)}
              />
              <span className="error-message">
                {signInErrors.email?.message}
              </span>
            </div>
            <div style={{ padding: "18px 15px" }} className="input-field">
              <i className="fas fa-lock" />
              <input
                type="password"
                placeholder="password"
                {...registerSignIn(
                  "password",
                  validationSchema1.passwordValidator
                )}
              />
              <span className="error-message">
                {signInErrors.password?.message}
              </span>
            </div>
            <input type="submit" defaultValue="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </form>
          <form
            className="sign-up-form"
            onSubmit={handleSignUpSubmit(SubmitHandlerSignUp)}
          >
            <h2 className="title">Sign Up</h2>
            <div style={{ padding: "18px 15px" }} className="input-field">
              <i className="fas fa-user" />
              <input
                type="text"
                placeholder="Username"
                {...registerSignUp(
                  "username",
                  validationSchema2.usernameValidator
                )}
              />
              <span className="error-message">
                {signUpErrors.username?.message}
              </span>
            </div>
            <div style={{ padding: "18px 15px" }} className="input-field">
              <i className="fas fa-envelope" />
              <input
                type="text"
                placeholder="Email"
                {...registerSignUp("email", validationSchema2.emailValidator)}
              />
              <span className="error-message">
                {signUpErrors.email?.message}
              </span>
            </div>
            <div style={{ padding: "18px 15px" }} className="input-field">
              <i className="fas fa-lock" />
              <input
                type="password"
                placeholder="Password"
                {...registerSignUp(
                  "password",
                  validationSchema2.passwordValidator
                )}
              />
              <span className="error-message">
                {signUpErrors.password?.message}
              </span>
            </div>
            {/* <div>
              <Select>
                <option value="67bebff1b1ba38c812295709">Resident</option>
                <option value="67bebff1b1ba38c812295709">Admin</option>
                <option value="67bebff1b1ba38c812295709">Security guard</option>
              </Select>
            </div> */}
            {/* <FormControl
            style={{ width: "150px"}}
            >
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={(event) => {
                  setRole(event.target.value);
                }}
                // {...registerSignUp("role_id")}
              >
                <MenuItem value="67c7d05eaddc36efb1f267d4">Admin</MenuItem>
                <MenuItem value="67c7d067addc36efb1f267d5">Resident</MenuItem>
                <MenuItem value="67c7d072addc36efb1f267d6">
                  Security Guard
                </MenuItem>
              </Select>
            </FormControl> */}
            <input type="submit" defaultValue="Sign Up" className="btn solid" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google" />
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              minus natus est.
            </p>
            <button
              className="form-btn-1 btn transparent"
              onClick={() => setSignUpMode(true)}
            >
              Sign Up
            </button>
          </div>
          {/* <img src={log} className="image" alt="" /> */}
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              minus natus est.
            </p>
            <button
              className="form-btn-1 btn transparent"
              onClick={() => setSignUpMode(false)}
            >
              Sign In
            </button>
          </div>
          {/* <img src={register} className="image" alt="" /> */}
        </div>
      </div>
    </div>
  );
};
