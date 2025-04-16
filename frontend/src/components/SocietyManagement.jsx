import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import axios from "axios";

// Mock data for societies
const initialSocieties = [];

const SocietyManagement = () => {
  const [societies, setSocieties] = useState(initialSocieties);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSociety, setCurrentSociety] = useState(null);
  // const [initialSocieties, setInitialSocieties] = useState([]); // For mock data
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'

  const fetchData = async () => {
    const res = await axios.get("/society");
    const initialSocieties = res.data.map((society) => ({
      ...society,
      status: society.status ? "active" : "inactive",
      totalUnits: society.totalUnits.toString(),
    }));
    // console.log("society", initialSocieties);
    setSocieties(initialSocieties);
  };

  useEffect(() => {
    fetchData();
  }, [isDeleteModalOpen, setIsDeleteModalOpen, isModalOpen, setIsModalOpen]);

  // const { register, handleSubmit } = useForm();

  // const submitHandler = (data) => {
  //   console.log(data);
  // };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalUnits: "",
    managedSince: "",
    contactPerson: "",
    phone: "",
    email: "",
    status: "active",
  });

  // Filter societies based on search term
  const filteredSocieties = societies.filter(
    (society) =>
      society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Open modal for adding a new society
  const handleAddSociety = async () => {
    setFormMode("add");
    setFormData({
      name: "",
      location: "",
      totalUnits: "",
      managedSince: "",
      contactPerson: "",
      phone: "",
      email: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing society
  const handleEditSociety = (society) => {
    setFormMode("edit");
    setCurrentSociety(society);
    setFormData({
      name: society.name,
      location: society.location,
      totalUnits: society.totalUnits,
      managedSince: society.managedSince,
      contactPerson: society.contactPerson,
      phone: society.phone,
      email: society.email,
      status: society.status,
    });
    setIsModalOpen(true);
  };

  // Open confirmation modal for deleting a society
  const handleDeleteClick = async (society) => {
    setCurrentSociety(society);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion of society
  const confirmDelete = async () => {
    // setSocieties(
    //   societies.filter((society) => society.id !== currentSociety.id)
    // );
    // console.log(currentSociety._id);
    const res = await axios.delete(`/society/${currentSociety._id}`);
    setIsDeleteModalOpen(false);
  };

  // Save society (add new or update existing)
  const handleSaveSociety = async () => {
    if (formMode === "add") {
      const newSociety = {
        ...formData,
        id:
          societies.length > 0
            ? Math.max(...societies.map((s) => s.id)) + 1
            : 1,
      };
      setSocieties([...societies, newSociety]);
      formData.status = formData.status === "active" ? true : false;
      console.log(formData);
      const res = await axios.post("/society/", formData);
    } else {
      // Update existing society
      const updatedSocieties = societies.map((society) =>
        society._id === currentSociety._id
          ? { ...formData, id: society._id }
          : society
      );
      // console.log(currentSociety._id);
      setSocieties(updatedSocieties);
      // Send PATCH request with society_id
      formData.status = formData.status === "active" ? true : false;
      // formData.totalUnits = parseInt(formData.totalUnits);
      // console.log(formData);
      const res = await axios.patch(
        `/society/${currentSociety._id}/`,
        formData
      );
    }
    // console.log(formData);

    setIsModalOpen(false);
    // console.log(res);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-container">
      {/* Society Management Header */}
      <div className="admin-dashboard">
        <h1 className="admin-heading">Society Management</h1>
        <p className="admin-subtext">
          Add, edit and manage all residential societies in the eSociety system.
          Keep track of society details, contacts, and status.
        </p>
      </div>

      {/* Search and Add Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 2rem 1rem",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--admin-accent)",
            }}
          />
          <input
            type="text"
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem 0.8rem 2.5rem",
              border: "var(--admin-card-border)",
              borderRadius: "8px",
              background: "var(--admin-secondary-bg)",
              color: "var(--admin-text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              transition: "var(--admin-transition)",
            }}
          />
        </div>
        <button className="admin-btn" onClick={handleAddSociety}>
          <Plus size={18} />
          <span>Add Society</span>
        </button>
      </div>

      {/* Society Cards Grid */}
      <div
        className="admin-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
        }}
      >
        {filteredSocieties.length > 0 ? (
          filteredSocieties.map((society, index) => (
            <div key={society._id || index} className="admin-card">
              <div className="admin-card-icon">
                <Building2 />
              </div>
              <h3 className="admin-card-title">{society.name}</h3>
              <div className="admin-card-desc">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <MapPin
                    size={16}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>{society.location}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <User
                    size={16}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>{society.contactPerson}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Phone
                    size={16}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>{society.phone}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Mail
                    size={16}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>{society.email}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Calendar
                    size={16}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>Since: {formatDate(society.managedSince)}</span>
                </div>
                <div style={{ marginTop: "0.8rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "16px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      background:
                        society.status === "active"
                          ? "rgba(100, 255, 218, 0.15)"
                          : "rgba(255, 99, 71, 0.15)",
                      color:
                        society.status === "active"
                          ? "var(--admin-accent)"
                          : "#ff6347",
                    }}
                  >
                    {society.status.charAt(0).toUpperCase() +
                      society.status.slice(1)}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
                <button
                  onClick={() => handleEditSociety(society)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--admin-accent)",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    color: "var(--admin-accent)",
                    cursor: "pointer",
                    transition: "var(--admin-transition)",
                  }}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(society)}
                  style={{
                    background: "transparent",
                    border: "1px solid #ff6347",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    color: "#ff6347",
                    cursor: "pointer",
                    transition: "var(--admin-transition)",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "3rem",
              background: "var(--admin-secondary-bg)",
              borderRadius: "16px",
              border: "var(--admin-card-border)",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "1rem",
                color: "var(--admin-accent)",
              }}
            >
              <Building2 size={48} />
            </div>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--admin-text-primary)",
              }}
            >
              No societies found
            </h3>
            <p
              style={{
                color: "var(--admin-text-secondary)",
                marginBottom: "2rem",
              }}
            >
              No societies match your search criteria. Try adjusting your search
              or add a new society.
            </p>
            <button className="admin-btn" onClick={handleAddSociety}>
              <Plus size={18} />
              <span>Add Society</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Society Modal */}
      {isModalOpen && (
        // <form
        //   // onSubmit={handleSubmit(submitHandler)}
        //   onSubmit={() => {
        //     handleSaveSociety();
        //   }}
        // >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--admin-secondary-bg)",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "var(--admin-card-border)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h2
              style={{
                color: "var(--admin-accent)",
                marginBottom: "1.5rem",
                borderBottom: "1px solid rgba(100, 255, 218, 0.2)",
                paddingBottom: "0.8rem",
              }}
            >
              {formMode === "add" ? "Add New Society" : "Edit Society"}
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Society Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                // {...register("name")}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "var(--admin-card-border)",
                  background: "var(--admin-primary-bg)",
                  color: "var(--admin-text-primary)",
                  outline: "none",
                }}
                placeholder="Enter society name"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                // {...register("location")}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "var(--admin-card-border)",
                  background: "var(--admin-primary-bg)",
                  color: "var(--admin-text-primary)",
                  outline: "none",
                }}
                placeholder="Enter society address"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Total Units
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleInputChange}
                  // {...register("totalUnits")}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                  }}
                  placeholder="Number of units"
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Managed Since
                </label>
                <input
                  type="date"
                  name="managedSince"
                  value={formData.managedSince}
                  onChange={handleInputChange}
                  // {...register("managedSince")}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Chairman
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                // {...register("contactPerson")}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "var(--admin-card-border)",
                  background: "var(--admin-primary-bg)",
                  color: "var(--admin-text-primary)",
                  outline: "none",
                }}
                placeholder="Enter chairman name"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  // {...register("phone")}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                  }}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--admin-text-secondary)",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  // {...register("email")}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "var(--admin-card-border)",
                    background: "var(--admin-primary-bg)",
                    color: "var(--admin-text-primary)",
                    outline: "none",
                  }}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--admin-text-secondary)",
                }}
              >
                Status
              </label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    background:
                      formData.status === "active"
                        ? "rgba(100, 255, 218, 0.1)"
                        : "transparent",
                    border:
                      formData.status === "active"
                        ? "1px solid var(--admin-accent)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleInputChange}
                    // {...register("status")}
                    style={{ display: "none" }}
                  />
                  <CheckCircle
                    size={18}
                    style={{
                      marginRight: "0.5rem",
                      color: "var(--admin-accent)",
                    }}
                  />
                  <span>Active</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    background:
                      formData.status === "inactive"
                        ? "rgba(255, 99, 71, 0.1)"
                        : "transparent",
                    border:
                      formData.status === "inactive"
                        ? "1px solid #ff6347"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />
                  <XCircle
                    size={18}
                    style={{
                      marginRight: "0.5rem",
                      color: "#ff6347",
                    }}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  color: "var(--admin-text-secondary)",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "var(--admin-transition)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn"
                onClick={handleSaveSociety}
              >
                {formMode === "add" ? "Add Society" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
        // </form>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentSociety && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--admin-secondary-bg)",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              border: "var(--admin-card-border)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "1rem", color: "#ff6347" }}>
              <Trash2 size={48} />
            </div>
            <h2
              style={{
                color: "var(--admin-text-primary)",
                marginBottom: "1rem",
              }}
            >
              Delete Society
            </h2>
            <p
              style={{
                color: "var(--admin-text-secondary)",
                marginBottom: "2rem",
              }}
            >
              Are you sure you want to delete{" "}
              <strong>{currentSociety.name}</strong>? This action cannot be
              undone.
            </p>

            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "transparent",
                  color: "var(--admin-text-secondary)",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "var(--admin-transition)",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "0.8rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff6347",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "var(--admin-transition)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={confirmDelete}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyManagement;
