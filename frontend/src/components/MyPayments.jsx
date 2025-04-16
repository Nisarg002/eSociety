import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Razorpay from "./Razorpay"; // Import the Razorpay component

const MyPayments = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5; // Set to 5 items per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const mockPayments = [
      {
        id: 1,
        type: "Maintenance",
        amount: 2500,
        dueDate: "2025-03-15",
        status: "pending",
        month: "March",
        year: "2025",
        description: "Monthly society maintenance charges",
      },
      {
        id: 2,
        type: "Water Bill",
        amount: 850,
        dueDate: "2025-03-10",
        status: "paid",
        paidDate: "2025-03-08",
        transactionId: "TXN78945612",
        month: "March",
        year: "2025",
        description: "Water consumption charges",
      },
      {
        id: 3,
        type: "Maintenance",
        amount: 2500,
        dueDate: "2025-02-15",
        status: "paid",
        paidDate: "2025-02-14",
        transactionId: "TXN45612378",
        month: "February",
        year: "2025",
        description: "Monthly society maintenance charges",
      },
      {
        id: 4,
        type: "Electricity",
        amount: 1250,
        dueDate: "2025-03-20",
        status: "pending",
        month: "March",
        year: "2025",
        description: "Common area electricity charges",
      },
      {
        id: 5,
        type: "Parking",
        amount: 500,
        dueDate: "2025-03-31",
        status: "pending",
        month: "March",
        year: "2025",
        description: "Additional parking space charges",
      },
      {
        id: 6,
        type: "Maintenance",
        amount: 2500,
        dueDate: "2025-01-15",
        status: "paid",
        paidDate: "2025-01-12",
        transactionId: "TXN12345678",
        month: "January",
        year: "2025",
        description: "Monthly society maintenance charges",
      },
      {
        id: 7,
        type: "Water Bill",
        amount: 780,
        dueDate: "2025-02-10",
        status: "expired",
        month: "February",
        year: "2025",
        description: "Water consumption charges with late fee",
      },
    ];

    try {
      const res = await axios.get(
        "/payment_user/" + localStorage.getItem("id")
      );
      // console.log(res.data);
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments(mockPayments); // Fallback to mock data
    }

    setIsLoading(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || payment.status === activeTab;

    const matchesMonth = filterMonth === "all" || payment.month === filterMonth;

    const matchesYear = filterYear === "all" || payment.year === filterYear;

    return matchesSearch && matchesTab && matchesMonth && matchesYear;
  });

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getTotalPending = () => {
    return payments
      .filter((payment) => payment.status === "pending")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalPaid = () => {
    return payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalExpired = () => {
    return payments
      .filter((payment) => payment.status === "expired")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const handlePayNow = (payment) => {
    // Calculate fine for expired payments (10% increase)
    let paymentWithFine = { ...payment };

    if (payment.status === "expired") {
      // Add 10% fine for expired payments
      const originalAmount = payment.amount;
      const fineAmount = originalAmount * 0.1; // 10% of original amount
      paymentWithFine.amount = originalAmount + fineAmount;
      paymentWithFine.description =
        payment.description + " (includes 10% late fee)";
    }

    setSelectedPayment(paymentWithFine);
    setShowPayModal(true);
  };

  const handlePaymentSuccess = async (response) => {
    if (!selectedPayment) return;

    try {
      // Create an updated payment object
      const updatedPayment = {
        ...selectedPayment,
        status: "paid",
        paidDate: new Date().toISOString().split("T")[0],
        transactionId: response.razorpay_payment_id,
      };

      // Update the payment in the database
      const res = await axios.patch(
        "/update_payment/" + selectedPayment._id,
        updatedPayment
      );

      // Only update this specific payment in the state
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === selectedPayment._id ||
          payment.id === selectedPayment.id
            ? updatedPayment
            : payment
        )
      );

      setShowPayModal(false);
      alert("Payment processed successfully!");
      fetchData();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    alert("Payment failed. Please try again.");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Modal popup styles
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: showPayModal ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">My Payments</h1>
        <p className="admin-subtext">
          View and manage your maintenance payments and transaction history
        </p>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <i className="bx bxs-wallet admin-card-icon"></i>
          <h3 className="admin-card-title">Pending Amount</h3>
          <p className="admin-card-desc">Total amount due for current period</p>
          <div className="admin-btn">
            <span>₹{getTotalPending().toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-card">
          <i className="bx bxs-check-circle admin-card-icon"></i>
          <h3 className="admin-card-title">Paid Amount</h3>
          <p className="admin-card-desc">Total amount paid in current year</p>
          <div className="admin-btn">
            <span>₹{getTotalPaid().toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-card">
          <i className="bx bxs-time-five admin-card-icon"></i>
          <h3 className="admin-card-title">Expired Amount</h3>
          <p className="admin-card-desc">Total expired payments</p>
          <div className="admin-btn">
            <span>₹{getTotalExpired().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="visitor-controls">
        <div className="search-box">
          <i className="bx bx-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Month:</label>
            <select
              className="filter-select"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="all">All Months</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Year:</label>
            <select
              className="filter-select"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="filter-buttons"
        style={{ marginLeft: "2rem", marginBottom: "1rem" }}
      >
        <button
          className={`filter-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${activeTab === "paid" ? "active" : ""}`}
          onClick={() => setActiveTab("paid")}
        >
          Paid
        </button>
        <button
          className={`filter-btn ${activeTab === "expired" ? "active" : ""}`}
          onClick={() => setActiveTab("expired")}
        >
          Expired
        </button>
      </div>

      <div className="visitor-table-container">
        {isLoading ? (
          <div className="loading-spinner">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Loading payment data...</p>
          </div>
        ) : currentPayments.length > 0 ? (
          <table className="visitor-table">
            <thead>
              <tr>
                <th>Payment Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr key={payment._id || payment.id}>
                  <td>
                    <div className="visitor-info">
                      <div className="visitor-avatar">
                        {payment.type.charAt(0)}
                      </div>
                      <div>
                        <div className="visitor-name">{payment.type}</div>
                        <div className="visitor-contact">
                          {payment.month} {payment.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{payment.description}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{formatDate(payment.dueDate)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        payment.status === "paid"
                          ? "status-completed"
                          : payment.status === "expired"
                          ? "status-expired"
                          : "status-scheduled"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    {payment.status === "pending" ? (
                      <button
                        className="action-btn check-in-btn"
                        onClick={() => handlePayNow(payment)}
                      >
                        <i className="bx bxs-credit-card"></i>
                        <span>Pay Now</span>
                      </button>
                    ) : payment.status === "expired" ? (
                      <button
                        className="action-btn check-in-btn"
                        onClick={() => handlePayNow(payment)}
                      >
                        <i className="bx bxs-credit-card"></i>
                        <span>Pay with Fine</span>
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-records">
            <i className="bx bx-search-alt"></i>
            <p>No payments found matching your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredPayments.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <i className="bx bx-chevron-left"></i>
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
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Modal Popup with Razorpay Integration */}
      <div style={modalStyle}>
        <div className="maintenance-form-container">
          <h2 className="admin-card-title">Make Payment</h2>
          {selectedPayment && (
            <div className="maintenance-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Payment Type</label>
                  <input type="text" value={selectedPayment.type} readOnly />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    value={`₹${selectedPayment.amount.toLocaleString()}`}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={selectedPayment.description}
                  readOnly
                />
              </div>
              {selectedPayment.status === "expired" && (
                <div className="form-group">
                  <div
                    className="fine-notice"
                    style={{ color: "#e74c3c", marginBottom: "10px" }}
                  >
                    <i className="bx bx-info-circle"></i> A 10% late fee has
                    been applied to this payment.
                  </div>
                </div>
              )}
              <div className="form-actions">
                <button
                  className="form-btn cancel-btn"
                  onClick={() => setShowPayModal(false)}
                >
                  <i className="bx bx-x"></i>
                  <span>Cancel</span>
                </button>
                <Razorpay
                  amount={selectedPayment.amount}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  paymentDetails={selectedPayment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPayments;
