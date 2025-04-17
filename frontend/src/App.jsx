import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Form } from "./pages/Form";
import "boxicons/css/boxicons.min.css";
import AdminPanel from "./pages/Admin/AdminPanel";
import ResidentPortal from "./pages/Resident/ResidentPortal";
import ComplaintManagement from "./components/ComplaintManagement";
import VisitorRecords from "./components/VisitorRecords ";
import NoticeBoard from "./components/NoticeBoard";
import SocietyManagement from "./components/SocietyManagement";
import SocietyNotices from "./components/SocietyNotices";
import BookFacilities from "./components/BookFacilities";
import MyPayments from "./components/MyPayments";
import SecurityGuardPanel from "./pages/Security Guard/SecurityGuardPanel";
import StaffEntryExit from "./components/StaffEntryExit";
import FacilityRequestsManagement from "./components/FacilityRequestsManagement";
import ResidentComplaintComponent from "./components/ResidentComplaintComponent";
import axios from "axios";
import ManageUsers from "./components/ManageUsers";
import VisitorManagement from "./components/VisitorManagement";
import PrivateRoutes from "./hooks/PrivateRoutes";
import ResidentProfileUpdate from "./components/ResidentProfileUpdate";
import NotFound404 from "./components/NotFound404";
import Unauthorized from "./components/Unauthorized";
import AlreadyLoggedIn from "./components/AlreadyLoggedIn";
import PaymentManagement from "./components/PaymentManagement";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { ResidentDashboard } from "./pages/Resident/ResidentDashboard";
import { SecurityDashboard } from "./pages/Security Guard/SecurityDashboard";
import "./assets/css/AdminStyles.css"
import "bootstrap/dist/js/bootstrap.bundle.min";
import AuthForm from "./pages/AuthForm";
import ResetPassword from "./components/ResetPassword";
import AdminStaff from "./components/AdminStaff";
function App() {
  axios.defaults.baseURL = "http://127.0.0.1:8000";
  return (
    <>
      <Routes>
        {/* <Route path="/test" element={<   />}></Route> */}
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/form" element={<AuthForm />}></Route>
        <Route path="resetpassword/:token" element={<ResetPassword />}></Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoutes allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminPanel />}>
            <Route path="" element={<AdminDashboard />}></Route>
            <Route path="payments" element={<PaymentManagement />}></Route>
            <Route path="users" element={<ManageUsers />}></Route>
            <Route path="complaints" element={<ComplaintManagement />}></Route>
            <Route
              path="requests"
              element={<FacilityRequestsManagement />}
            ></Route>
            <Route path="visitors" element={<VisitorRecords />}></Route>
            <Route path="notices" element={<NoticeBoard />}></Route>
            <Route path="society" element={<SocietyManagement />}></Route>
            <Route path="staff" element={<AdminStaff />}></Route>
            {/* <Route path="maintenance" element={<MaintenanceRequests />}></Route> */}
            {/* <Route path="residents" element={<ManageResidents />}></Route> */}
          </Route>
        </Route>

        {/* Resident Routes */}
        <Route element={<PrivateRoutes allowedRoles={["resident", "Admin"]} />}>
          <Route path="/resident" element={<ResidentPortal />}>
            <Route path="" element={<ResidentDashboard />}></Route>
            <Route
              path="profile-update"
              element={<ResidentProfileUpdate />}
            ></Route>
            <Route
              path="complaints"
              element={<ResidentComplaintComponent />}
            ></Route>
            <Route path="notices" element={<SocietyNotices />}></Route>
            <Route path="facilities" element={<BookFacilities />}></Route>
            <Route path="payment" element={<MyPayments />}></Route>
          </Route>
        </Route>

        {/* Security Guard Routes */}
        <Route
          element={<PrivateRoutes allowedRoles={["Security Guard", "Admin"]} />}
        >
          <Route path="/security" element={<SecurityGuardPanel />}>
            <Route path="" element={<SecurityDashboard />}></Route>
            <Route path="visitors" element={<VisitorManagement />}></Route>
            <Route path="staff" element={<StaffEntryExit />}></Route>
            {/* <Route path="emergency" element={<EmergencyContacts />}></Route> */}
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound404 />}></Route>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        {/* Logged-in Route */}
        <Route path="/logged-in" element={<AlreadyLoggedIn />}></Route>
      </Routes>
    </>
  );
}

export default App;
