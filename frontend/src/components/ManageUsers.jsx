import React, { useEffect, useState } from "react";
import axios from "axios";
import BouncingDotsLoader from "./common/Loaders-Test/BouncingDotsLoader";
import { Slide, toast, ToastContainer } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(false); // New state for status change loading
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  // Pagination states - fixed to 5 users per page
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Fixed to 5 users per page
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/user");

      // Transform the API response to match our component's expected format
      const transformedUsers = res.data.map((user) => ({
        id: user._id,
        username: user.username || "",
        name: user.name || user.username || "",
        email: user.email || "",
        status: user.status ? "Active" : "Inactive",
        role: user.role?.name || "Pending",
        flatNo: user.flatNo || "Unknown",
        phone: user.phone || "Unknown",
        society: user.society?.name || "Unknown",
        societyId: user.society_id || "Unknown",
        roleId: user.role_id || "",
      }));

      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and filters - with null checks
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.role?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.society?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Update total pages when filtered users change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
    // Reset to first page when filters change
    if (currentPage > Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredUsers, currentPage]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/user/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user. Please try again.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      }
    }
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      transition: Slide,
    });
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Show the full-screen loader with blur
      setStatusChanging(true);

      // Map role names to IDs (you'll need to replace these with your actual role IDs)
      const roleIds = {
        Admin: "67c7d05eaddc36efb1f267d4",
        Resident: "67c7d067addc36efb1f267d5",
        "Security Guard": "67c7d072addc36efb1f267d6",
        Pending: "67d196ffe95a2decede3e8db",
      };

      // Send update request to the API with just the role change
      await axios.patch("/user/role/", {
        user_id: userId,
        role_id: roleIds[newRole],
      });

      // Update the local state with the updated role
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );

      setUsers(updatedUsers);
      showSuccessToast("User role updated successfully");
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error("Failed to update user role. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    } finally {
      // Hide the full-screen loader
      setStatusChanging(false);
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Get background color based on role
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "#7C3AED"; // Purple
      case "Resident":
        return "#2563EB"; // Blue
      case "Security Guard":
        return "#059669"; // Green
      case "Pending":
        return "#F59E0B"; // Orange/Amber
      default:
        return "#9CA3AF"; // Gray
    }
  };

  return (
    <div className="admin-container">
      {/* Full-screen loader with blur */}
      {statusChanging && (
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
              background: "var(--admin-secondary-bg)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <BouncingDotsLoader />
            <p
              style={{
                marginTop: "1rem",
                color: "var(--admin-text-primary)",
                fontWeight: "500",
              }}
            >
              Updating user status...
            </p>
          </div>
        </div>
      )}

      <div className="admin-dashboard">
        <h1 className="admin-heading">Manage Users</h1>
        <p className="admin-subtext">
          Assign roles or remove user accounts from your system.
        </p>

        {/* Search and Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ position: "relative", width: "60%" }}>
            <input
              type="text"
              placeholder="Search by username, name, email, role, or society..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.5rem",
                borderRadius: "8px",
                border: "var(--admin-card-border)",
                background: "var(--admin-secondary-bg)",
                color: "var(--admin-text-primary)",
                fontSize: "0.95rem",
              }}
            />
            <i
              className="fas fa-search"
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--admin-text-secondary)",
              }}
            ></i>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "var(--admin-card-border)",
                background: "var(--admin-secondary-bg)",
                color: "var(--admin-text-primary)",
                fontSize: "0.95rem",
              }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "var(--admin-card-border)",
                background: "var(--admin-secondary-bg)",
                color: "var(--admin-text-primary)",
                fontSize: "0.95rem",
              }}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Resident">Resident</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem",
            }}
          >
            <BouncingDotsLoader />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              maxWidth: "800px",
              margin: "1.5rem auto",
              padding: "1.5rem",
              background: "rgba(255, 100, 100, 0.1)",
              borderRadius: "8px",
              color: "#ff6464",
              textAlign: "center",
            }}
          >
            <i
              className="fas fa-exclamation-circle"
              style={{ marginRight: "0.5rem" }}
            ></i>
            {error}
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div
            style={{
              maxWidth: "1200px",
              margin: "1.5rem auto",
              overflowX: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              background: "var(--admin-secondary-bg)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "var(--admin-text-primary)",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(0, 0, 0, 0.03)" }}>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    Society
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      style={{
                        transition: "var(--admin-transition)",
                        background:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(0, 0, 0, 0.01)",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: getRoleColor(user.role),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                          }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: "500" }}>{user.name}</div>
                          {user.flatNo && (
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--admin-text-secondary)",
                              }}
                            >
                              Flat: {user.flatNo}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <div>{user.email}</div>
                        {user.phone && (
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--admin-text-secondary)",
                            }}
                          >
                            Phone: {user.phone}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        {user.society}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          style={{
                            padding: "0.5rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            background: `${getRoleColor(user.role)}20`,
                            color: getRoleColor(user.role),
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Resident">Resident</option>
                          <option value="Security Guard">Security Guard</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            backgroundColor:
                              user.status === "Active"
                                ? "rgba(100, 255, 218, 0.15)"
                                : "rgba(255, 100, 100, 0.15)",
                            color:
                              user.status === "Active"
                                ? "var(--admin-accent)"
                                : "#ff6464",
                            fontWeight: "500",
                          }}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <button
                            onClick={() => handleDelete(user.id)}
                            style={{
                              background: "rgba(255, 100, 100, 0.1)",
                              border: "none",
                              color: "#ff6464",
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "var(--admin-transition)",
                            }}
                            title="Delete user"
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
                      colSpan="6"
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          opacity: 0.7,
                        }}
                      >
                        <i
                          className="fas fa-search"
                          style={{
                            fontSize: "2rem",
                            marginBottom: "1rem",
                            color: "var(--admin-accent)",
                          }}
                        ></i>
                        <p>No users found matching your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Updated Pagination Controls to match VisitorRecords */}
            {!loading && filteredUsers.length > 0 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`pagination-number ${
                      currentPage === number ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}
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

export default ManageUsers;
