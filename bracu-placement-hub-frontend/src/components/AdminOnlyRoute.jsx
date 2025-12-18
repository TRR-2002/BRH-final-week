import React from "react";
import { Navigate } from "react-router-dom";

// ROLE PROTECTION: Component to protect admin-only routes
function AdminOnlyRoute({ children }) {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminOnlyRoute;
