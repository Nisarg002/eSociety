import React from "react";
import { Outlet } from "react-router-dom";
import ResidentNavbar from "../../components/common/ResidentNavbar";
const ResidentPortal = () => {
  return (
    <div className="admin-container">
      <ResidentNavbar />
      <Outlet />
    </div>
  );
};

export default ResidentPortal;
