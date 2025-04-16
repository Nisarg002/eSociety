import React from "react";
import MyHeading from "../../components/common/MyHeading";
import MyCard from "../../components/common/MyCard";

export const SecurityDashboard = () => {
  return (
    <>
      <MyHeading
        heading="Security Guard Portal"
        subtext="Manage entry & exit of visitors, staff, and deliveries with real-time
          tracking."
      />

      <div className="admin-cards">
        <MyCard
          icon="bxs-group"
          title="Visitor Management"
          description="Monitor and manage visitor check-ins and check-outs efficiently."
          link="/security/visitors"
          buttonText="Manage Visitors"
        />

        <MyCard
          icon="bxs-id-card"
          title="Staff Entry/Exit"
          description="Track domestic help, delivery personnel, and maintenance staff."
          link="/security/staff"
          buttonText="Manage Staff"
        />

        <div className="admin-card emergency-card">
          <i className="bx bxs-bell-ring admin-card-icon"></i>
          <h3 className="admin-card-title">Emergency Alarm</h3>
          <p className="admin-card-desc">
            Instantly alert security and residents in case of emergencies.
          </p>
          <button
            className="admin-btn"
            onClick={() => alert("🚨 Emergency Alarm Triggered!")}
          >
            <span>Trigger Alarm</span>
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </>
  );
};
