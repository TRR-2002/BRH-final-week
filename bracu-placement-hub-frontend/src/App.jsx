import React, { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import the decoder

function App() {
  const [tempToken, setTempToken] = useState("");
  const { loginAction } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSimulateLogin = () => {
    if (!tempToken.trim()) {
      return alert("Please paste a token from Postman.");
    }

    try {
      // Decode the token to get the user's information
      const decodedUser = jwtDecode(tempToken);
      console.log("DECODED TOKEN PAYLOAD:", decodedUser); // <-- ADD THIS LINE

      // Create the data object our loginAction expects
      const loginData = {
        token: tempToken,
        user: {
          userId: decodedUser.userId, // Get the REAL userId from the token
          name: decodedUser.name || "User", // Use name from token if available
        },
      };

      loginAction(loginData);
      alert("Token set successfully! Navigating to create profile...");
      // Navigate to the correct page for the logged-in user
      navigate(`/create-profile`);
    } catch (error) {
      console.error("Invalid token:", error);
      alert(
        "The token you pasted is invalid. Please get a fresh one from Postman."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Developer Token Login</h1>
        <p className="mb-4 text-gray-600">
          For development only. Log in via Postman and paste your token below.
        </p>
        <div className="space-y-4">
          <textarea
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            placeholder="Paste your JWT token here"
            className="w-full p-2 border border-gray-300 rounded-md h-32"
          />
          <button
            onClick={handleSimulateLogin}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
          >
            Set Token & Enter App
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
