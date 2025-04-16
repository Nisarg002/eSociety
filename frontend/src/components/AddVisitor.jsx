import React, { useState } from "react";
import { Link } from "react-router-dom";
import SecurityGuardNavbar from "./common/SecurityGuardNavbar";

const AddVisitor = () => {
  const [formData, setFormData] = useState({
    visitorName: "",
    contactNumber: "",
    purpose: "",
    expectedDuration: "1",
    hostName: "",
    hostFlat: "",
    idType: "aadhar",
    idNumber: "",
    vehicleNumber: "",
  });

  const [pass, setPass] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generatePassId = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    return `VISIT-${timestamp}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const visitorPass = {
      ...formData,
      passId: generatePassId(),
      issueTime: new Date().toLocaleString(),
      status: "active",
      expiryTime: new Date(
        new Date().getTime() +
          parseInt(formData.expectedDuration) * 60 * 60 * 1000
      ).toLocaleString(),
    };

    setPass(visitorPass);
    setShowPass(true);
  };

  const printPass = () => {
    const printContent = document.getElementById("visitor-pass");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload();
  };

  const navigate = (page) => {
    console.log(`Navigating to ${page}`);
  };

  return (
    <div className="admin-container">
      <SecurityGuardNavbar />

      <div className="admin-dashboard">
        <h1 className="admin-heading">Add New Visitor</h1>
        <p className="admin-subtext">
          Register visitors and generate entry passes with verification
        </p>
      </div>

      {!showPass ? (
        <div className="maintenance-form-container">
          <form className="maintenance-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Visitor Name</label>
                <input
                  type="text"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Visit Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="guest">Guest Visit</option>
                  <option value="delivery">Delivery</option>
                  <option value="maintenance">Maintenance Work</option>
                  <option value="interview">Interview</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expected Duration (in hours)</label>
                <select
                  name="expectedDuration"
                  value={formData.expectedDuration}
                  onChange={handleChange}
                  required
                >
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
                <label>Host Name</label>
                <input
                  type="text"
                  name="hostName"
                  value={formData.hostName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Host Flat/Unit Number</label>
                <input
                  type="text"
                  name="hostFlat"
                  value={formData.hostFlat}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ID Type</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  required
                >
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
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Number (if applicable)</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={() => navigate("visitors")}
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
      ) : (
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

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button
              className="form-btn cancel-btn"
              onClick={() => setShowPass(false)}
            >
              <i className="bx bx-edit"></i>
              <span>Edit Details</span>
            </button>
            <button
              className="form-btn comment-btn"
              onClick={() => navigate("visitors")}
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
    </div>
  );
};

export default AddVisitor;
