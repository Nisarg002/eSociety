import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import BouncingDotsLoader from "./common/Loaders-Test/BouncingDotsLoader";

const PaymentManagement = () => {
  // States
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      amount: "",
      description: "",
      dueDate: "",
      user_id: "",
    },
  });

  // Fetch data with error handling and loading state
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const adminId = localStorage.getItem("id")
      // console.log(adminId)
      const [usersResponse, paymentsResponse] = await Promise.all([
        axios.get("/user_role/" + "67c7d067addc36efb1f267d5"),
        axios.get("/payment/" + adminId),
      ]);

      setUsers(usersResponse.data);
      setPayments(paymentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission
  const onSubmit = async (data) => {
    const currentDate = new Date();

    const paymentData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      dueDate: data.dueDate,
      month: currentDate.toLocaleString("default", { month: "long" }),
      year: currentDate.getFullYear().toString(),
      user_id: data.user_id,
      status: "pending",
      transactionId: null,
      paidDate: null,
    };

    try {
      console.log("Payment Data:", paymentData);
      await axios.post("/payment/", paymentData);
      reset();
      setShowNewPaymentForm(false);
      fetchData();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  // Delete payment handler
  const handleDeletePayment = async (paymentId) => {
    try {
      await axios.delete(`/payment/${paymentId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  // Memoized filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        !searchQuery ||
        payment.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || payment.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [payments, searchQuery, typeFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfFirstPayment = (currentPage - 1) * paymentsPerPage;

  // Memoized current payments
  const currentPayments = useMemo(() => {
    return filteredPayments.slice(
      indexOfFirstPayment,
      indexOfFirstPayment + paymentsPerPage
    );
  }, [filteredPayments, indexOfFirstPayment]);

  // Format date - memoize if used frequently
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handler for search and filter changes
  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Toggle form visibility
  const toggleNewPaymentForm = () => {
    setShowNewPaymentForm((prev) => !prev);
    if (showNewPaymentForm) reset();
  };

  // Get username display
  const getUsernameDisplay = (payment) => {
    if (payment.user_id === "all") return "All Users";
    return payment.user?.username || "Unknown User";
  };

  // Pagination component
  const PaginationControls = () => {
    if (filteredPayments.length <= 0) return null;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="bx bx-chevron-left"></i>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (pageNum) =>
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          )
          .map((pageNum, index, array) => {
            // Show ellipsis when there are gaps
            const showEllipsis = index > 0 && array[index - 1] !== pageNum - 1;

            return (
              <React.Fragment key={`page-${pageNum}`}>
                {showEllipsis && <div className="pagination-ellipsis">...</div>}
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
          })}

        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Payment Management</h1>
        <p className="admin-subtext">Track and manage society payments</p>

        {!showNewPaymentForm && (
          <button
            className="form-btn submit-btn"
            onClick={toggleNewPaymentForm}
            style={{ marginTop: "1rem" }}
          >
            <i className="bx bx-plus"></i>
            <span>Add New Payment</span>
          </button>
        )}
      </div>

      {showNewPaymentForm ? (
        <div className="maintenance-form-container">
          <h2
            style={{
              color: "var(--admin-accent)",
              marginBottom: "1.5rem",
              borderBottom: "1px solid rgba(100, 255, 218, 0.2)",
              paddingBottom: "0.8rem",
            }}
          >
            Add New Payment
          </h2>
          <form className="maintenance-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label>Bill Type</label>
                <select {...register("type", { required: true })}>
                  <option value="">Select Type</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Water Bill">Water Bill</option>
                  <option value="Other">Other</option>
                </select>
                {errors.type && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  {...register("amount", {
                    required: true,
                    min: { value: 0, message: "Amount must be positive" },
                  })}
                />
                {errors.amount && (
                  <span className="error-message">
                    {errors.amount.message || "This field is required"}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  {...register("dueDate", { required: true })}
                />
                {errors.dueDate && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ width: "100%" }}>
                <label>For</label>
                <select {...register("user_id", { required: true })}>
                  <option value="">Select User</option>
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <span className="error-message">This field is required</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={toggleNewPaymentForm}
              >
                <i className="bx bx-x"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" className="form-btn submit-btn">
                <i className="bx bx-check"></i>
                <span>Add Payment</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="visitor-controls">
            <div className="search-box">
              <i className="bx bx-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search by type or description..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(e, setSearchQuery)}
              />
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Type:</label>
                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => handleFilterChange(e, setTypeFilter)}
                >
                  <option value="all">All Types</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Water Bill">Water Bill</option>
                  {/* <option value="Electricity">Electricity</option>
                  <option value="Parking">Parking</option> */}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="loader-container">
              <BouncingDotsLoader />
            </div>
          ) : (
            <>
              <div className="visitor-table-container">
                <table className="visitor-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Month/Year</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPayments.length > 0 ? (
                      currentPayments.map((payment, index) => (
                        <tr key={payment._id}>
                          <td>{indexOfFirstPayment + index + 1}</td>
                          <td>{payment.type}</td>
                          <td>{payment.description}</td>
                          <td>
                            ₹
                            {payment.amount
                              ? payment.amount.toLocaleString()
                              : 0}
                          </td>
                          <td>{formatDate(payment.dueDate)}</td>
                          <td>
                            {payment.month}/{payment.year}
                          </td>
                          <td>{getUsernameDisplay(payment)}</td>
                          <td>
                            <span
                              className={`status-badge status-${payment.status}`}
                            >
                              {payment.status
                                ? payment.status.charAt(0).toUpperCase() +
                                  payment.status.slice(1)
                                : "Pending"}
                            </span>
                          </td>
                          <td>
                            <div className="visitor-actions">
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDeletePayment(payment._id)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">
                          <div className="no-records">
                            <i className="bx bx-search-alt"></i>
                            <p>No payments found matching your criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentManagement;
