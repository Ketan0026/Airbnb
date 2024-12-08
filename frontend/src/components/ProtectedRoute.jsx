import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useContext(UserContext);
  return user === true ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
