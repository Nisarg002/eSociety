import React, { useState, useEffect } from "react";
import AdminNavbar from "./common/AdminNavbar";
import axios from "axios";
import { useForm } from "react-hook-form";
import Loader from "./common/Loader";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "resident",
      status: "active",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/user");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
      // Mock data for development
      setUsers([
        {
          id: 1,
          username: "john_admin",
          email: "john.admin@example.com",
          role: "admin",
          status: "active",
        },
        {
          id: 2,
          username: "sarah_resident",
          email: "sarah.resident@example.com",
          role: "resident",
          status: "active",
          unit: "A-101",
        },
        {
          id: 3,
          username: "mike_guard",
          email: "mike.guard@example.com",
          role: "security guard",
          status: "inactive",
        },
        {
          id: 4,
          username: "lisa_resident",
          email: "lisa.resident@example.com",
          role: "resident",
          status: "pending",
          unit: "B-203",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add user form submission
  const onAddSubmit = async (data) => {
    try {
      const response = await axios.post("/user", data);
      setUsers([...users, response.data]);
      reset();
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add user: " + err.message);
      // For development without API
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        ...data,
      };
      setUsers([...users, newUser]);
      reset();
      setShowAddForm(false);
    }
  };

  // Handle edit user form submission
  const onEditSubmit = async (data) => {
    try {
      const response = await axios.put(`/user/${editingUser.id}`, data);
      setUsers(
        users.map((user) => (user.id === editingUser.id ? response.data : user))
      );
      reset();
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user: " + err.message);
      // For development without API
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);
      reset();
      setEditingUser(null);
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/user/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        setError("Failed to delete user: " + err.message);
        // For development without API
        setUsers(users.filter((user) => user.id !== id));
      }
    }
  };

  // Set up editing for a user
  const handleEdit = (user) => {
    setEditingUser(user);
    // Set form values
    setValue("username", user.username);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("status", user.status);
    if (user.role === "resident" && user.unit) {
      setValue("unit", user.unit);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
    reset();
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get initial letter for avatar
  const getInitial = (username) => {
    return username.charAt(0).toUpperCase();
  };

  // Get color based on role
  const getRoleColor = (role) => {
    const colors = {
      admin: "#FF6B6B",
      resident: "#45B7D1",
      "security guard": "#4ECDC4",
      pending: "#FFC857",
    };
    return colors[role] || "#7F8C8D";
  };

  return (
    <div className="admin-container">
      <AdminNavbar />

      <div className="admin-dashboard">
        <h1 className="admin-heading">User Management</h1>
        <p className="admin-subtext">
          Manage users, assign roles, and control access to your system.
        </p>

        {/* Search, filters and Add button */}
        <div className="user-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          <div className="filter-container">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="resident">Resident</option>
              <option value="security guard">Security Guard</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {!showAddForm && !editingUser && (
            <button className="admin-btn" onClick={() => setShowAddForm(true)}>
              <i className="fas fa-plus"></i> Add User
            </button>
          )}
        </div>

        {/* Add/Edit User Form */}
        {(showAddForm || editingUser) && (
          <div className="user-form-container">
            <h2 className="form-heading">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
            <form
              onSubmit={handleSubmit(editingUser ? onEditSubmit : onAddSubmit)}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="form-input"
                  />
                  {errors.username && (
                    <p className="form-error">{errors.username.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="form-input"
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select {...register("role")} className="form-select">
                    <option value="resident">Resident</option>
                    <option value="admin">Admin</option>
                    <option value="security guard">Security Guard</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select {...register("status")} className="form-select">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                {/* Unit field for residents */}
                {(register("role") === "resident" ||
                  (editingUser && editingUser.role === "resident")) && (
                  <div className="form-group">
                    <label>Unit Number</label>
                    <input
                      {...register("unit")}
                      placeholder="e.g. A-101"
                      className="form-input"
                    />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        {!showAddForm && !editingUser && (
          <div className="table-container">
            {isLoading ? (
              <Loader message="Loading users..." />
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    {roleFilter === "resident" || roleFilter === "all" ? (
                      <th>Unit</th>
                    ) : null}
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="user-cell">
                          <div
                            className="user-avatar"
                            style={{ backgroundColor: getRoleColor(user.role) }}
                          >
                            {getInitial(user.username)}
                          </div>
                          <span className="username">{user.username}</span>
                        </td>
                        <td>{user.email}</td>
                        <td className="center-cell">
                          <span
                            className="role-badge"
                            style={{
                              backgroundColor: `${getRoleColor(user.role)}20`,
                              color: getRoleColor(user.role),
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        {(roleFilter === "resident" ||
                          roleFilter === "all") && (
                          <td className="center-cell">
                            {user.role === "resident"
                              ? user.unit || "N/A"
                              : "N/A"}
                          </td>
                        )}
                        <td className="center-cell">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor:
                                user.status === "active"
                                  ? "rgba(100, 255, 218, 0.15)"
                                  : user.status === "pending"
                                  ? "rgba(255, 200, 87, 0.15)"
                                  : "rgba(255, 100, 100, 0.15)",
                              color:
                                user.status === "active"
                                  ? "var(--admin-accent)"
                                  : user.status === "pending"
                                  ? "#FFC857"
                                  : "#ff6464",
                            }}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="center-cell">
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEdit(user)}
                              className="edit-btn"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="delete-btn"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          roleFilter === "resident" || roleFilter === "all"
                            ? "6"
                            : "5"
                        }
                        className="no-results"
                      >
                        <div className="no-results-content">
                          <i className="fas fa-search"></i>
                          <p>No users found matching your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <p>
              <i className="fas fa-exclamation-circle"></i> {error}
            </p>
            <p className="error-note">
              Currently showing sample data. Connect to your API backend to see
              real data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
