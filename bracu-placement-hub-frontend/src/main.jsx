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
import EditProfileMenuPage from "./pages/EditProfileMenuPage.jsx";
import EditGeneralInfoPage from "./pages/EditGeneralInfoPage.jsx";
import EditWorkExperiencePage from "./pages/EditWorkExperiencePage.jsx";
import EditEducationPage from "./pages/EditEducationPage.jsx";

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Serves as our homepage/login page
  },
  {
    path: "/create-profile",
    element: <CreateProfilePage />,
  },
  {
    path: "/profile/view/:userId", // Changed to be more specific
    element: <ViewProfilePage />,
  },
  {
    path: "/profile/edit",
    element: <EditProfileMenuPage />,
  },
  {
    path: "/profile/edit/general",
    element: <EditGeneralInfoPage />,
  },
  {
    path: "/profile/edit/work",
    element: <EditWorkExperiencePage />,
  },
  {
    path: "/profile/edit/education",
    element: <EditEducationPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
