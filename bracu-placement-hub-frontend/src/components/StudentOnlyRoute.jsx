import React from "react";
import { Navigate } from "react-router-dom";

// ROLE PROTECTION: Component to protect student-only routes
function StudentOnlyRoute({ children }) {
  const userRole = localStorage.getItem("userRole");
  
  if (userRole === "recruiter") {
    // Recruiters should go to their own dashboard
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  
  if (userRole === "admin") {
    // Admins should go to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
}

export default StudentOnlyRoute;
