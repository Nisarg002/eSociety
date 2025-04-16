import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const VisitorManagement = () => {
  // States
  const [showNewVisitorForm, setShowNewVisitorForm] = useState(false);
  const [pass, setPass] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visitors, setVisitors] = useState([]);
  const [users, setUsers] = useState([]); // User data from API
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [visitorsPerPage] = useState(5);

  // Convert API format to application format
  const convertApiFormat = (apiData) => {
    return apiData.map((visitor) => ({
      id: visitor._id,
      name: visitor.visitorName,
      contact: visitor.contactNumber,
      purpose: visitor.purpose,
      flatNo: visitor.hostFlat,
      hostName: visitor.hostName,
      timestamp: new Date(visitor.entryTime),
      status: visitor.status,
      idType: visitor.idType,
      idNumber: visitor.idNumber,
      vehicleNumber: visitor.vehicleNumber,
      exitTime: visitor.exitTime,
      expectedDuration: visitor.expectedDuration,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/visitor/");
      const formattedData = convertApiFormat(res.data);
      setVisitors(formattedData);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
    try {
      const userRes = await axios.get("/user_role/" + "67c7d067addc36efb1f267d5");
      setUsers(userRes.data);
      // console.log(userRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      visitorName: "",
      contactNumber: "",
      purpose: "",
      expectedDuration: "1",
      hostName: "",
      hostFlat: "",
      idType: "aadhar",
      idNumber: "",
      vehicleNumber: "",
      selectedHost: "", // New field for host selection
    },
  });

  // Watch for changes in the selectedHost field
  const selectedHostId = watch("selectedHost");

  // Update hostName and hostFlat when selectedHost changes
  useEffect(() => {
    if (selectedHostId && users.length > 0) {
      const host = users.find((user) => user._id === selectedHostId);
      if (host) {
        setValue("hostName", host.name || "");
        setValue("hostFlat", host.flatNo || "");
      }
    }
  }, [selectedHostId, users, setValue]);

  // Functions
  const generatePassId = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    return `VISIT-${timestamp}`;
  };

  const onSubmit = async (data) => {
    const currentTime = new Date();
    const expiryTime = new Date(
      currentTime.getTime() + parseInt(data.expectedDuration) * 60 * 60 * 1000
    );

    const visitorData = {
      visitorName: data.visitorName,
      contactNumber: data.contactNumber,
      purpose: data.purpose,
      expectedDuration: parseInt(data.expectedDuration),
      hostName: data.hostName,
      hostFlat: data.hostFlat,
      idType: data.idType,
      idNumber: data.idNumber,
      vehicleNumber: data.vehicleNumber,
      status: "active",
      entryTime: currentTime.toISOString(),
      exitTime: "",
    };

    try {
      // This would be your actual API call
      const res = await axios.post("/visitor/", visitorData);
      //const newVisitor = response.data;

      // For display purposes without actual API call
      const visitorPass = {
        ...data,
        passId: generatePassId(),
        issueTime: currentTime.toLocaleString(),
        status: "active",
        expiryTime: expiryTime.toLocaleString(),
      };

      setPass(visitorPass);
      setShowPass(true);
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const data = {
        visitorId: id,
        status: newStatus,
        exitTime: newStatus === "completed" ? new Date().toISOString() : "",
      };
      // console.log(data);
      // This would be your actual API call
      const res = await axios.patch(
        `/visitor_status/?visitorId=${data.visitorId}&status=${data.status}&exitTime=${data.exitTime}`
      );
      // console.log(res.data);
      fetchData();
      // For now, just update the local state
      setVisitors(
        visitors.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: newStatus,
                exitTime:
                  newStatus === "completed"
                    ? new Date().toISOString()
                    : visitor.exitTime,
              }
            : visitor
        )
      );
    } catch (error) {
      console.error("Error updating visitor status:", error);
    }
  };

  const printPass = () => {
    const printContent = document.getElementById("visitor-pass");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const toggleNewVisitorForm = () => {
    setShowNewVisitorForm(!showNewVisitorForm);
    reset();
    setShowPass(false);
  };

  // Filter visitors based on search query and status filter
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.flatNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = filteredVisitors.slice(
    indexOfFirstVisitor,
    indexOfLastVisitor
  );
  const totalPages = Math.ceil(filteredVisitors.length / visitorsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle manual input for hostName and hostFlat
  const handleManualHostInput = () => {
    setValue("selectedHost", "");
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Visitor Management</h1>
        <p className="admin-subtext">Register visitors and manage entry/exit</p>

        {!showNewVisitorForm && !showPass && (
          <button
            className="form-btn submit-btn"
            onClick={toggleNewVisitorForm}
            style={{ marginTop: "1rem" }}
          >
            <i className="bx bx-plus"></i>
            <span>Add New Visitor</span>
          </button>
        )}
      </div>

      {showNewVisitorForm && !showPass && (
        <div className="maintenance-form-container">
          <h2
            style={{
              color: "var(--admin-accent)",
              marginBottom: "1.5rem",
              borderBottom: "1px solid rgba(100, 255, 218, 0.2)",
              paddingBottom: "0.8rem",
            }}
          >
            Add New Visitor
          </h2>
          <form className="maintenance-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label>Visitor Name</label>
                <input
                  type="text"
                  {...register("visitorName", { required: true })}
                />
                {errors.visitorName && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  {...register("contactNumber", { required: true })}
                />
                {errors.contactNumber && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Visit Purpose</label>
                <select {...register("purpose", { required: true })}>
                  <option value="">Select Purpose</option>
                  <option value="guest">Guest Visit</option>
                  <option value="delivery">Delivery</option>
                  <option value="maintenance">Maintenance Work</option>
                  <option value="cab">Cab Driver</option>
                  <option value="other">Other</option>
                </select>
                {errors.purpose && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
              <div className="form-group">
                <label>Expected Duration (in hours)</label>
                <select {...register("expectedDuration", { required: true })}>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Select Host (Resident)</label>
                <select
                  {...register("selectedHost")}
                  onChange={(e) => {
                    // This will trigger the useEffect that updates hostName and hostFlat
                    setValue("selectedHost", e.target.value);
                  }}
                >
                  <option value="">Select a resident...</option>
                  {users &&
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} - Flat: {user.flatNo}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Host Name</label>
                <input
                  type="text"
                  {...register("hostName", { required: true })}
                  onChange={handleManualHostInput}
                />
                {errors.hostName && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
              <div className="form-group">
                <label>Host Flat/Unit Number</label>
                <input
                  type="text"
                  {...register("hostFlat", { required: true })}
                  onChange={handleManualHostInput}
                />
                {errors.hostFlat && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ID Type</label>
                <select {...register("idType", { required: true })}>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="driving">Driving License</option>
                  <option value="voter">Voter ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  {...register("idNumber", { required: true })}
                />
                {errors.idNumber && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Number (if applicable)</label>
                <input type="text" {...register("vehicleNumber")} />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={toggleNewVisitorForm}
              >
                <i className="bx bx-x"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" className="form-btn submit-btn">
                <i className="bx bx-check"></i>
                <span>Generate Entry Pass</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {showPass && (
        <div className="maintenance-form-container">
          <div id="visitor-pass">
            <div
              style={{
                padding: "20px",
                background: "rgba(11, 23, 39, 0.9)",
                borderRadius: "12px",
                border: "1px solid rgba(100, 255, 218, 0.3)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#64ffda", margin: "0 0 5px 0" }}>
                  VISITOR ENTRY PASS
                </h2>
                <div style={{ color: "white", fontSize: "14px" }}>
                  Smart e-Society
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Pass ID:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.passId}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Status:
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgba(0, 200, 83, 0.15)",
                      color: "#00c853",
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    ACTIVE
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Visitor Name:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.visitorName}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Contact:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.contactNumber}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Purpose:
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "white",
                      textTransform: "capitalize",
                    }}
                  >
                    {pass.purpose}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    ID Type & Number:
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "white",
                      textTransform: "capitalize",
                    }}
                  >
                    {pass.idType} - {pass.idNumber}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Host & Unit:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.hostName} (#{pass.hostFlat})
                  </div>
                </div>
                {pass.vehicleNumber && (
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      Vehicle Number:
                    </div>
                    <div style={{ fontSize: "14px", color: "white" }}>
                      {pass.vehicleNumber}
                    </div>
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Issue Time:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.issueTime}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Expiry Time:
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {pass.expiryTime}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  borderTop: "1px dashed rgba(255, 255, 255, 0.2)",
                  paddingTop: "15px",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                This pass must be presented at the security gate when exiting
                the premises.
              </div>
            </div>
          </div>

          <div
            className="form-actions"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              className="form-btn comment-btn"
              onClick={() => {
                setShowPass(false);
                setShowNewVisitorForm(false);
                fetchData(); // Refresh the visitor list
              }}
            >
              <i className="bx bx-list-ul"></i>
              <span>View All Visitors</span>
            </button>
            <button className="form-btn submit-btn" onClick={printPass}>
              <i className="bx bx-printer"></i>
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      )}

      {!showNewVisitorForm && !showPass && (
        <>
          <div className="visitor-controls">
            <div className="search-box">
              <i className="bx bx-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, flat or host..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Status:</label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  <option value="all">All Visitors</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="visitor-table-container">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Purpose</th>
                  <th>Flat No.</th>
                  <th>Host</th>
                  <th>Entry Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVisitors.length > 0 ? (
                  currentVisitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>
                        <div className="visitor-info">
                          <div className="visitor-avatar">
                            {visitor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="visitor-name">{visitor.name}</div>
                            <div className="visitor-contact">
                              {visitor.contact}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{visitor.purpose}</td>
                      <td>{visitor.flatNo}</td>
                      <td>{visitor.hostName}</td>
                      <td>{formatTime(visitor.timestamp)}</td>
                      <td>
                        <span
                          className={`status-badge status-${visitor.status}`}
                        >
                          {visitor.status}
                        </span>
                      </td>
                      <td>
                        <div className="visitor-actions">
                          {visitor.status === "active" && (
                            <button
                              className="action-btn exit-btn"
                              onClick={() =>
                                handleStatusChange(visitor.id, "completed")
                              }
                            >
                              <i className="bx bx-exit"></i>
                              <span>Mark Exit</span>
                            </button>
                          )}
                          {visitor.status === "scheduled" && (
                            <button
                              className="action-btn check-in-btn"
                              onClick={() =>
                                handleStatusChange(visitor.id, "active")
                              }
                            >
                              <i className="bx bx-log-in"></i>
                              <span>Check In</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="no-records">
                        <i className="bx bx-search-alt"></i>
                        <p>No visitors found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredVisitors.length > 0 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <i className="bx bx-chevron-left"></i>
              </button>

              {/* Display page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (pageNum) =>
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                )
                .map((pageNum, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== pageNum - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${pageNum}`}>
                        <div className="pagination-ellipsis">...</div>
                        <div
                          className={`pagination-number ${
                            currentPage === pageNum ? "active" : ""
                          }`}
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </div>
                      </React.Fragment>
                    );
                  }
                  return (
                    <div
                      key={pageNum}
                      className={`pagination-number ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </div>
                  );
                })}

              <button
                className="pagination-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VisitorManagement;
