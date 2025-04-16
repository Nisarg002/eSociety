// AdminPanel.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/common/AdminNavbar";

const AdminPanel = () => {
  return (
    <div className="admin-container">
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default AdminPanel;
