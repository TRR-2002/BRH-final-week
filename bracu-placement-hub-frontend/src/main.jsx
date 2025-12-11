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
// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Your developer login page
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
    // This is the updated route
    path: "/profile/edit",
    element: <EditProfilePage />, // Points to our new all-in-one edit page
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
