import React, { useState } from "react";
import AdminNavbar from "./common/AdminNavbar";

const ManageResidents = () => {
  const [residents, setResidents] = useState([
    {
      id: 1,
      name: "John Doe",
      flatNo: "A-101",
      phone: "+1 234 567 8901",
      email: "john.doe@example.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      flatNo: "B-205",
      phone: "+1 234 567 8902",
      email: "jane.smith@example.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Johnson",
      flatNo: "C-304",
      phone: "+1 234 567 8903",
      email: "michael.j@example.com",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Emily Williams",
      flatNo: "D-402",
      phone: "+1 234 567 8904",
      email: "emily.w@example.com",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    flatNo: "",
    phone: "",
    email: "",
    status: "Active",
  });

  // Filter residents based on search term
  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle add resident form submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newResident = {
      id:
        residents.length > 0 ? Math.max(...residents.map((r) => r.id)) + 1 : 1,
      ...formData,
    };
    setResidents([...residents, newResident]);
    setFormData({
      name: "",
      flatNo: "",
      phone: "",
      email: "",
      status: "Active",
    });
    setShowAddForm(false);
  };

  // Handle edit resident form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedResidents = residents.map((resident) =>
      resident.id === editingResident.id
        ? { ...resident, ...formData }
        : resident
    );
    setResidents(updatedResidents);
    setEditingResident(null);
    setFormData({
      name: "",
      flatNo: "",
      phone: "",
      email: "",
      status: "Active",
    });
  };

  // Handle resident deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      setResidents(residents.filter((resident) => resident.id !== id));
    }
  };

  // Set up editing for a resident
  const handleEdit = (resident) => {
    setEditingResident(resident);
    setFormData({
      name: resident.name,
      flatNo: resident.flatNo,
      phone: resident.phone,
      email: resident.email,
      status: resident.status,
    });
  };

  // Cancel form
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingResident(null);
    setFormData({
      name: "",
      flatNo: "",
      phone: "",
      email: "",
      status: "Active",
    });
  };

  const [societies, setSocieties] = useState([
    {
      id: 1,
      name: "Green Valley Society",
      address: "123 Green Lane, Cityville",
      totalFlats: 150,
      createdAt: "2023-04-15",
    },
    {
      id: 2,
      name: "Riverside Apartments",
      address: "456 River Road, Townsville",
      totalFlats: 200,
      createdAt: "2023-05-20",
    },
  ]);

  const [showAddSocietyForm, setShowAddSocietyForm] = useState(false);
  const [editingSociety, setEditingSociety] = useState(null);
  const [societyFormData, setSocietyFormData] = useState({
    name: "",
    address: "",
    totalFlats: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  // Handle society form input changes
  const handleSocietyInputChange = (e) => {
    const { name, value } = e.target;
    setSocietyFormData({ ...societyFormData, [name]: value });
  };

  // Handle add society form submission
  const handleAddSocietySubmit = (e) => {
    e.preventDefault();
    const newSociety = {
      id:
        societies.length > 0 ? Math.max(...societies.map((s) => s.id)) + 1 : 1,
      ...societyFormData,
    };
    setSocieties([...societies, newSociety]);
    setSocietyFormData({
      name: "",
      address: "",
      totalFlats: "",
      createdAt: new Date().toISOString().split("T")[0],
    });
    setShowAddSocietyForm(false);
  };

  // Handle edit society form submission
  const handleEditSocietySubmit = (e) => {
    e.preventDefault();
    const updatedSocieties = societies.map((society) =>
      society.id === editingSociety.id
        ? { ...society, ...societyFormData }
        : society
    );
    setSocieties(updatedSocieties);
    setEditingSociety(null);
    setSocietyFormData({
      name: "",
      address: "",
      totalFlats: "",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  // Handle society deletion
  const handleDeleteSociety = (id) => {
    if (window.confirm("Are you sure you want to delete this society?")) {
      setSocieties(societies.filter((society) => society.id !== id));
    }
  };

  // Set up editing for a society
  const handleEditSociety = (society) => {
    setEditingSociety(society);
    setSocietyFormData({
      name: society.name,
      address: society.address,
      totalFlats: society.totalFlats,
      createdAt: society.createdAt,
    });
  };

  // Cancel society form
  const handleCancelSociety = () => {
    setShowAddSocietyForm(false);
    setEditingSociety(null);
    setSocietyFormData({
      name: "",
      address: "",
      totalFlats: "",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };
  return (
    <div className="admin-container">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content */}
      <div className="admin-dashboard">
        <h1 className="admin-heading">Manage Residents</h1>
        <p className="admin-subtext">
          Add, edit, or remove resident profiles from your society database.
        </p>

        {/* Search and Add button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem",
          }}
        >
          <div style={{ position: "relative", width: "60%" }}>
            <input
              type="text"
              placeholder="Search by name, flat no, or email..."
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
          {!showAddForm && !editingResident && (
            <button className="admin-btn" onClick={() => setShowAddForm(true)}>
              <i className="fas fa-plus"></i> Add Resident
            </button>
          )}
        </div>

        {/* Add/Edit Resident Form */}
        {(showAddForm || editingResident) && (
          <div
            style={{
              maxWidth: "800px",
              margin: "1.5rem auto",
              padding: "2rem",
              background: "var(--admin-secondary-bg)",
              borderRadius: "16px",
              border: "var(--admin-card-border)",
            }}
          >
            <h2
              style={{ color: "var(--admin-accent)", marginBottom: "1.5rem" }}
            >
              {editingResident ? "Edit Resident" : "Add New Resident"}
            </h2>
            <form
              onSubmit={editingResident ? handleEditSubmit : handleAddSubmit}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "rgba(17, 34, 64, 0.6)",
                      color: "var(--admin-text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    Flat/Apartment No
                  </label>
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "rgba(17, 34, 64, 0.6)",
                      color: "var(--admin-text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "rgba(17, 34, 64, 0.6)",
                      color: "var(--admin-text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "rgba(17, 34, 64, 0.6)",
                      color: "var(--admin-text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "var(--admin-card-border)",
                      background: "rgba(17, 34, 64, 0.6)",
                      color: "var(--admin-text-primary)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--admin-accent)",
                    background: "transparent",
                    color: "var(--admin-accent)",
                    cursor: "pointer",
                    transition: "var(--admin-transition)",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  {editingResident ? "Update Resident" : "Add Resident"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Residents Table */}
        {!showAddForm && !editingResident && (
          <div
            style={{
              maxWidth: "1200px",
              margin: "1.5rem auto",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 0.5rem",
                color: "var(--admin-text-primary)",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Flat No
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Phone
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "var(--admin-card-border)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((resident) => (
                    <tr
                      key={resident.id}
                      style={{
                        background: "var(--admin-secondary-bg)",
                        borderRadius: "8px",
                        transition: "var(--admin-transition)",
                      }}
                    >
                      <td
                        style={{ padding: "1rem", borderRadius: "8px 0 0 8px" }}
                      >
                        {resident.name}
                      </td>
                      <td style={{ padding: "1rem" }}>{resident.flatNo}</td>
                      <td style={{ padding: "1rem" }}>{resident.phone}</td>
                      <td style={{ padding: "1rem" }}>{resident.email}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            backgroundColor:
                              resident.status === "Active"
                                ? "rgba(100, 255, 218, 0.15)"
                                : "rgba(255, 100, 100, 0.15)",
                            color:
                              resident.status === "Active"
                                ? "var(--admin-accent)"
                                : "#ff6464",
                          }}
                        >
                          {resident.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderRadius: "0 8px 8px 0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(resident)}
                            style={{
                              background: "rgba(100, 255, 218, 0.1)",
                              border: "none",
                              color: "var(--admin-accent)",
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "var(--admin-transition)",
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(resident.id)}
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
                        <p>No residents found matching your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResidents;
