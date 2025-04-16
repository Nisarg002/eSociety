import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SecurityGuardNavbar from "../../components/common/SecurityGuardNavbar";

const SecurityGuardPanel = () => {
  return (
    <div className="admin-container">
      <SecurityGuardNavbar />
      <Outlet />
    </div>
  );
};

export default SecurityGuardPanel;
