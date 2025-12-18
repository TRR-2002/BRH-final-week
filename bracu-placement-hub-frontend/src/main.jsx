import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import CSS
import "./index.css";

// Import Layout
import MainLayout from "./layouts/MainLayout.jsx";

// Import Page Components - Authentication
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Import Page Components - Student
import CreateProfilePage from "./pages/CreateProfilePage.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";

// Import Page Components - Job Discovery
import JobSearchPage from "./pages/JobSearchPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import ApplicationConfirmPage from "./pages/ApplicationConfirmPage.jsx";
import ApplicationSuccessPage from "./pages/ApplicationSuccessPage.jsx";

// Import Page Components - Recruiter
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import CreateJobPage from "./pages/CreateJobPage.jsx";
import EditJobPage from "./pages/EditJobPage.jsx";

// Import Page Components - Admin
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Import Page Components - Community Forum
import ForumPage from "./pages/ForumPage.jsx";
import CreateForumPostPage from "./pages/CreateForumPostPage.jsx";
import ForumPostDetailsPage from "./pages/ForumPostDetailsPage.jsx";

// Import Page Components - Enhanced Dashboard
import EnhancedDashboardPage from "./pages/EnhancedDashboardPage.jsx";

// Import route protection components
import StudentOnlyRoute from "./components/StudentOnlyRoute.jsx";
import RecruiterOnlyRoute from "./components/RecruiterOnlyRoute.jsx";
import AdminOnlyRoute from "./components/AdminOnlyRoute.jsx";

// Create the router configuration
const router = createBrowserRouter([
  // ============================================
  // AUTHENTICATION ROUTES (NO NAVBAR)
  // ============================================
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dev-login",
    element: <App />,
  },

  // ============================================
  // MAIN APP ROUTES (WITH NAVBAR)
  // ============================================
  {
    element: <MainLayout />,
    children: [
      // STUDENT-ONLY ROUTES (Protected from recruiters)
      {
        path: "/create-profile",
        element: (
          <StudentOnlyRoute>
            <CreateProfilePage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/profile/view/:userId",
        element: (
          <StudentOnlyRoute>
            <ViewProfilePage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <StudentOnlyRoute>
            <EditProfilePage />
          </StudentOnlyRoute>
        ),
      },

      // JOB DISCOVERY & APPLICATION ROUTES (Student-only)
      {
        path: "/jobs",
        element: (
          <StudentOnlyRoute>
            <JobSearchPage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/jobs/:jobId",
        element: (
          <StudentOnlyRoute>
            <JobDetailsPage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/jobs/:jobId/apply",
        element: (
          <StudentOnlyRoute>
            <ApplicationConfirmPage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/jobs/:jobId/application-success",
        element: (
          <StudentOnlyRoute>
            <ApplicationSuccessPage />
          </StudentOnlyRoute>
        ),
      },

      // COMMUNITY FORUM ROUTES (Student-only)
      {
        path: "/forum",
        element: (
          <StudentOnlyRoute>
            <ForumPage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/forum/create",
        element: (
          <StudentOnlyRoute>
            <CreateForumPostPage />
          </StudentOnlyRoute>
        ),
      },
      {
        path: "/forum/posts/:postId",
        element: (
          <StudentOnlyRoute>
            <ForumPostDetailsPage />
          </StudentOnlyRoute>
        ),
      },

      // ENHANCED DASHBOARD ROUTE (Student-only)
      {
        path: "/dashboard/:userId",
        element: (
          <StudentOnlyRoute>
            <EnhancedDashboardPage />
          </StudentOnlyRoute>
        ),
      },

      // RECRUITER-ONLY ROUTES (Protected from students)
      {
        path: "/recruiter/dashboard",
        element: (
          <RecruiterOnlyRoute>
            <RecruiterDashboard />
          </RecruiterOnlyRoute>
        ),
      },
      {
        path: "/recruiter/jobs/create",
        element: (
          <RecruiterOnlyRoute>
            <CreateJobPage />
          </RecruiterOnlyRoute>
        ),
      },
      {
        path: "/recruiter/jobs/edit/:jobId",
        element: (
          <RecruiterOnlyRoute>
            <EditJobPage />
          </RecruiterOnlyRoute>
        ),
      },

      // ADMIN-ONLY ROUTES (Protected from all others)
      {
        path: "/admin/dashboard",
        element: (
          <AdminOnlyRoute>
            <AdminDashboard />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
