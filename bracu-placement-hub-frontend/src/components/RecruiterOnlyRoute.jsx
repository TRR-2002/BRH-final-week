import React from "react";
import { Navigate } from "react-router-dom";

// ROLE PROTECTION: Component to protect recruiter-only routes
function RecruiterOnlyRoute({ children }) {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RecruiterOnlyRoute;
