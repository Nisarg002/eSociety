import React from "react";
import MyHeading from "../../components/common/MyHeading";
import MyCard from "../../components/common/MyCard";

export const AdminDashboard = () => {
  return (
    <>
      <MyHeading
        heading={`Welcome Back, ${localStorage.getItem("username")}`}
        subtext="Effortlessly manage your smart society with real-time updates and comprehensive control."
      />

      <div className="admin-cards">
        <MyCard
          icon="bxs-city"
          title="Manage Societies"
          description="Add, update, or delete societies and manage their properties and settings."
          link="/admin/society"
          buttonText="View Societies"
        />
        <MyCard
          icon="bx-wallet"
          title="Payments Management"
          description="Add, update, or delete society payments and fees."
          link="/admin/payments"
          buttonText="Manage Maintenance"
        />

        <MyCard
          icon="bxs-group"
          title="User Management"
          description="Manage user accounts, roles, and access permissions efficiently."
          link="/admin/users"
          buttonText="View Users"
        />
        <MyCard
          icon="bxs-message-error"
          title="Handle Complaints"
          description="Review, prioritize, and resolve community issues efficiently."
          link="/admin/complaints"
          buttonText="View Complaints"
        />
        <MyCard
          icon="bxs-calendar-edit"
          title="Booking Requests"
          description="Review and approve facility booking requests submitted by residents."
          link="/admin/requests"
          buttonText="Manage Bookings"
        />
        <MyCard
          icon="bxs-id-card"
          title="Visitor Records"
          description="Monitor and manage visitor logs with real-time tracking."
          link="/admin/visitors"
          buttonText="View Visitors"
        />
        <MyCard
          icon="bxs-megaphone"
          title="Post Notices"
          description="Create and broadcast important announcements to residents."
          link="/admin/notices"
          buttonText="Manage Notices"
        />
      </div>
    </>
  );
};
