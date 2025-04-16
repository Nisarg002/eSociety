import React, { useState } from "react";

const EmergencyContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    category: "police",
  });

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Officer Johnson",
      position: "Police Chief",
      phone: "911",
      email: "johnson@police.gov",
      category: "police",
    },
    {
      id: 2,
      name: "Dr. Smith",
      position: "Emergency Physician",
      phone: "911",
      email: "smith@hospital.org",
      category: "medical",
    },
    {
      id: 3,
      name: "Fire Chief Wilson",
      position: "Fire Department Chief",
      phone: "911",
      email: "wilson@fire.gov",
      category: "fire",
    },
    {
      id: 4,
      name: "Sarah Thompson",
      position: "Property Manager",
      phone: "555-1234",
      email: "sarah@esociety.com",
      category: "maintenance",
    },
    {
      id: 5,
      name: "James Rodriguez",
      position: "Security Head",
      phone: "555-4321",
      email: "james@esociety.com",
      category: "security",
    },
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    const newId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({
      name: "",
      position: "",
      phone: "",
      email: "",
      category: "police",
    });
    setShowAddForm(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || contact.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "police":
        return "bx bxs-shield";
      case "medical":
        return "bx bxs-first-aid";
      case "fire":
        return "bx bxs-flame";
      case "maintenance":
        return "bx bxs-wrench";
      case "security":
        return "bx bxs-lock-alt";
      default:
        return "bx bxs-phone";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "police":
        return "#4287f5";
      case "medical":
        return "#f54242";
      case "fire":
        return "#ff9234";
      case "maintenance":
        return "#3a9188";
      case "security":
        return "#9c27b0";
      default:
        return "#64ffda";
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">Smart e-Society</div>
        <div className="admin-nav-links">
          <button className="admin-nav-link">
            <i className="bx bxs-dashboard"></i>
            <span>Dashboard</span>
          </button>
          <button className="admin-nav-link">
            <i className="bx bxs-phone-call"></i>
            <span>Emergency</span>
          </button>
          <button className="admin-nav-link">
            <i className="bx bx-log-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="admin-dashboard">
        <h1 className="admin-heading">Emergency Contacts</h1>
        <p className="admin-subtext">
          Quick access to important contacts and emergency procedures.
        </p>
      </div>

      <div className="visitor-controls">
        <div className="search-box">
          <i className="bx bx-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="police">Police</option>
              <option value="medical">Medical</option>
              <option value="fire">Fire</option>
              <option value="maintenance">Maintenance</option>
              <option value="security">Security</option>
            </select>
          </div>
          <button className="admin-btn" onClick={() => setShowAddForm(true)}>
            <i className="bx bx-plus"></i>
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="maintenance-form-container">
          <h3 className="admin-card-title">Add New Emergency Contact</h3>
          <form className="maintenance-form" onSubmit={handleAddContact}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={newContact.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={newContact.category}
                onChange={handleInputChange}
                required
              >
                <option value="police">Police</option>
                <option value="medical">Medical</option>
                <option value="fire">Fire</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                <i className="bx bx-x"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" className="form-btn submit-btn">
                <i className="bx bx-check"></i>
                <span>Save Contact</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="maintenance-list">
        {filteredContacts.length === 0 ? (
          <div className="no-requests">
            <i className="bx bx-search-alt"></i>
            <h3>No contacts found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div className="maintenance-card" key={contact.id}>
              <div className="maintenance-card-header">
                <div className="request-title-section">
                  <div
                    className="visitor-avatar"
                    style={{
                      background: getCategoryColor(contact.category),
                      color: "#fff",
                    }}
                  >
                    <i className={getCategoryIcon(contact.category)}></i>
                  </div>
                  <h3 className="request-title">{contact.name}</h3>
                </div>
                <div
                  className="status-badge"
                  style={{
                    background: `${getCategoryColor(contact.category)}20`,
                    color: getCategoryColor(contact.category),
                  }}
                >
                  {contact.category.charAt(0).toUpperCase() +
                    contact.category.slice(1)}
                </div>
              </div>
              <div className="request-details">
                <div className="request-meta">
                  <div className="meta-item">
                    <i className="bx bxs-user"></i>
                    <span>{contact.position}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bx bxs-phone"></i>
                    <span>{contact.phone}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bx bxs-envelope"></i>
                    <span>{contact.email}</span>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    className="action-btn call-btn"
                    style={{
                      background: `${getCategoryColor(contact.category)}10`,
                      color: getCategoryColor(contact.category),
                      border: `1px solid ${getCategoryColor(
                        contact.category
                      )}30`,
                    }}
                  >
                    <i className="bx bxs-phone"></i>
                    <span>Call Now</span>
                  </button>
                  <button
                    className="action-btn email-btn"
                    style={{
                      background: `rgba(100, 255, 218, 0.1)`,
                      color: `var(--admin-accent)`,
                      border: `1px solid rgba(100, 255, 218, 0.3)`,
                    }}
                  >
                    <i className="bx bxs-envelope"></i>
                    <span>Send Email</span>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    style={{
                      background: `rgba(255, 71, 87, 0.1)`,
                      color: `#ff4757`,
                      border: `1px solid rgba(255, 71, 87, 0.3)`,
                    }}
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <i className="bx bxs-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
