import React, { useEffect, useState } from "react";
import axios from "axios";

const BookFacilities = () => {
  // Form states
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [attendees, setAttendees] = useState("");

  // UI states
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState("facilities"); // "facilities" or "mybookings"
  const [filter, setFilter] = useState("all");

  // Data states
  const [bookings, setBookings] = useState([
    {
      id: 1,
      facilityName: "Clubhouse",
      residentName: "John Smith",
      unitNumber: "A-101",
      requestDate: "2025-03-10",
      bookingDate: "2025-03-15T18:00",
      duration: 2, // hours
      attendees: 15,
      purpose: "Birthday Party",
      status: "approved",
    },
    {
      id: 2,
      facilityName: "Swimming Pool",
      residentName: "Sarah Johnson",
      unitNumber: "B-205",
      requestDate: "2025-03-10",
      bookingDate: "2025-03-14T09:00",
      duration: 2,
      attendees: 4,
      purpose: "Swimming Practice",
      status: "pending",
    },
    {
      id: 3,
      facilityName: "Gym",
      residentName: "Michael Brown",
      unitNumber: "C-302",
      requestDate: "2025-03-11",
      bookingDate: "2025-03-16T07:00",
      duration: 1,
      attendees: 2,
      purpose: "Personal Training",
      status: "approved",
    },
    {
      id: 4,
      facilityName: "Tennis Court",
      residentName: "Emily Davis",
      unitNumber: "D-404",
      requestDate: "2025-03-12",
      bookingDate: "2025-03-17T16:00",
      duration: 2,
      attendees: 4,
      purpose: "Tennis Match",
      status: "declined",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // console.log(localStorage.getItem("id"));
      const res = await axios.get(
        "/booking_user/" + localStorage.getItem("id")
      );
      // console.log(res.data);
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([res.data]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const facilities = [
    { id: 1, name: "Clubhouse", icon: "bxs-building-house" },
    { id: 2, name: "Swimming Pool", icon: "bx bx-swim" },
    { id: 3, name: "Gym", icon: "bx bx-dumbbell" },
    { id: 4, name: "Tennis Court", icon: "bxs-tennis-ball" },
    { id: 5, name: "Party Hall", icon: "bxs-party" },
    { id: 6, name: "Yoga Studio", icon: "bxs-spa" },
  ];

  const timeSlots = [
    "07:00-09:00",
    "09:00-11:00",
    "11:00-13:00",
    "13:00-15:00",
    "15:00-17:00",
    "17:00-19:00",
    "19:00-21:00",
  ];

  const formatTimeSlot = (bookingDate, duration) => {
    const startTime = new Date(bookingDate);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const formatTime = (date) => {
      return date.toTimeString().substring(0, 5);
    };

    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  const parseTimeSlot = (timeSlot) => {
    const [startTime, endTime] = timeSlot.split("-");
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    return endHour - startHour; // Duration in hours
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [startTime] = selectedTimeSlot.split("-");
    const bookingDateTime = `${selectedDate}T${startTime}`;
    const duration = parseTimeSlot(selectedTimeSlot);

    const newBooking = {
      facilityName: selectedFacility,
      residentName: localStorage.getItem("username"), // This would be fetched from user context in a real app
      unitNumber: "A-101", // This would be fetched from user context
      requestDate: new Date().toISOString().split("T")[0],
      bookingDate: bookingDateTime,
      duration: duration,
      attendees: parseInt(attendees),
      purpose: bookingPurpose,
      status: "pending",
      user_id: localStorage.getItem("id"),
    };

    try {
      console.log(newBooking);
      const res = await axios.post("/booking", newBooking);
      setBookings([...bookings, { ...newBooking, id: bookings.length + 1 }]);
      resetForm();
      setActiveTab("mybookings"); // Switch to my bookings tab after submission
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const resetForm = () => {
    setSelectedFacility("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setBookingPurpose("");
    setAttendees("");
    setShowBookingForm(false);
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const res = await axios.delete(`/booking/${id}`);
        fetchData();
        // const updatedBookings = bookings.map((booking) =>
        //   booking.id === id ? { ...booking, status: "cancelled" } : booking
        // );
        setBookings(updatedBookings);
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const handleEditBooking = (booking) => {
    // Populate form with existing data
    setSelectedFacility(booking.facilityName);
    setSelectedDate(booking.bookingDate.split("T")[0]);
    setSelectedTimeSlot(formatTimeSlot(booking.bookingDate, booking.duration));
    setBookingPurpose(booking.purpose);
    setAttendees(booking.attendees.toString());
    setShowBookingForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <h1 className="admin-heading">Book Facilities</h1>
        <p className="admin-subtext">
          Reserve and book community facilities like clubhouse, gym, and more.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
        className="maintenance-actions"
      >
        <div className="tab-buttons">
          <button
            className={`admin-btn ${
              activeTab === "facilities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("facilities")}
          >
            <i className="bx bx-building"></i>
            <span>Facilities</span>
          </button>
          <button
            className={`admin-btn ${
              activeTab === "mybookings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("mybookings")}
          >
            <i className="bx bx-list-ul"></i>
            <span>My Bookings</span>
          </button>
        </div>

        {activeTab === "mybookings" && (
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filter === "approved" ? "active" : ""}`}
              onClick={() => setFilter("approved")}
            >
              Approved
            </button>
            <button
              className={`filter-btn ${filter === "declined" ? "active" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        )}

        {activeTab === "facilities" && (
          <button
            className="admin-btn"
            onClick={() => setShowBookingForm(!showBookingForm)}
          >
            <i className={showBookingForm ? "bx bx-x" : "bx bx-plus"}></i>
            <span>{showBookingForm ? "Cancel" : "New Booking"}</span>
          </button>
        )}
      </div>

      {showBookingForm && (
        <div className="maintenance-form-container">
          <form className="maintenance-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="facility">Select Facility</label>
                <select
                  id="facility"
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  required
                >
                  <option value="">Choose a facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.name}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timeSlot">Select Time Slot</label>
                <select
                  id="timeSlot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  required
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="attendees">Number of Attendees</label>
                <input
                  type="number"
                  id="attendees"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="purpose">Purpose of Booking</label>
              <textarea
                id="purpose"
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                placeholder="Describe the purpose of your booking"
                required
              ></textarea>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="form-btn cancel-btn"
                onClick={resetForm}
              >
                <i className="bx bx-x"></i>
                Cancel
              </button>
              <button type="submit" className="form-btn submit-btn">
                <i className="bx bx-check"></i>
                Submit Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "facilities" && !showBookingForm && (
        <div className="admin-cards">
          {facilities.map((facility) => (
            <div className="admin-card" key={facility.id}>
              <i className={`bx ${facility.icon} admin-card-icon`}></i>
              <h3 className="admin-card-title">{facility.name}</h3>
              <p className="admin-card-desc">
                Book the {facility.name.toLowerCase()} for your exclusive use.
              </p>
              <button
                className="admin-btn"
                onClick={() => {
                  setSelectedFacility(facility.name);
                  setShowBookingForm(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span>Book Now</span>
                <i className="bx bx-calendar-plus"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "mybookings" && (
        <div className="maintenance-list">
          {filteredBookings.length === 0 ? (
            <div className="no-requests">
              <i className="bx bx-calendar-x"></i>
              <h3>No bookings found</h3>
              <p>There are no bookings matching your current filter.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div className="maintenance-card" key={booking._id}>
                <div className="maintenance-card-header">
                  <div className="request-title-section">
                    <i
                      className={`bx ${
                        facilities.find((f) => f.name === booking.facilityName)
                          ?.icon || "bxs-building"
                      }`}
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--admin-accent)",
                      }}
                    ></i>
                    <h3 className="request-title">{booking.facilityName}</h3>
                  </div>
                  <div className={`status-badge status-${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>
                </div>
                <div className="request-details">
                  <div className="request-meta">
                    <div className="meta-item">
                      <i className="bx bx-calendar"></i>
                      <span>Date: {booking.bookingDate?.split("T")[0]}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bx bx-time"></i>
                      <span>
                        Time:{" "}
                        {formatTimeSlot(booking.bookingDate, booking.duration)}
                      </span>
                    </div>
                    <div className="meta-item">
                      <i className="bx bx-user"></i>
                      <span>Booked by: {booking.residentName}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bx bx-building"></i>
                      <span>Unit: {booking.unitNumber}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bx bx-group"></i>
                      <span>Attendees: {booking.attendees}</span>
                    </div>
                  </div>
                  <p className="request-description">
                    <strong>Purpose:</strong> {booking.purpose}
                  </p>

                  {booking.status === "pending" ? (
                    <div className="request-actions">
                      {booking.status === "pending" && (
                        <button
                          className="action-btn progress-btn"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <i className="bx bx-edit"></i>
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        className="action-btn assign-btn"
                        onClick={() => handleCancel(booking._id)}
                      >
                        <i className="bx bx-trash"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookFacilities;
