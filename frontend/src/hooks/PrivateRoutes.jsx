import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import NotLoggedIn from "../components/NotLoggedIn";

const useAuth = () => {
  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    if (id && role) {
      setAuth({ isLoggedIn: true, role });
    }
    setIsLoading(false);
  }, []);

  return { auth, isLoading };
};

const PrivateRoutes = ({ allowedRoles }) => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoggedIn) {
    return <NotLoggedIn />;
  }

  // Case-insensitive role check
  const userHasRequiredRole = allowedRoles.some(
    (role) => role.toLowerCase() === auth.role.toLowerCase()
  );

  if (!userHasRequiredRole) {
    // You might want to create this unauthorized page or redirect elsewhere
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
