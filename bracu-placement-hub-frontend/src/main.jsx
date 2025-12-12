import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import CSS
import "./index.css";

// Import Page Components
import App from "./App.jsx";
import CreateProfilePage from "./pages/CreateProfilePage.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
// NEW: Job-related pages
import JobSearchPage from "./pages/JobSearchPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import ApplicationConfirmPage from "./pages/ApplicationConfirmPage.jsx";
import ApplicationSuccessPage from "./pages/ApplicationSuccessPage.jsx";

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Developer login page
  },
  {
    path: "/create-profile",
    element: <CreateProfilePage />,
  },
  {
    path: "/profile/view/:userId",
    element: <ViewProfilePage />,
  },
  {
    path: "/profile/edit",
    element: <EditProfilePage />,
  },
  // NEW: Job Discovery & Application Routes
  {
    path: "/jobs",
    element: <JobSearchPage />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetailsPage />,
  },
  {
    path: "/jobs/:jobId/apply",
    element: <ApplicationConfirmPage />,
  },
  {
    path: "/jobs/:jobId/application-success",
    element: <ApplicationSuccessPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
