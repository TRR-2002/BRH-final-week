const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "bph_sec_pass_bracu_cse";
const API_URL = "http://localhost:1350/api/admin/flagged-content";

// 1. Generate a Fake Admin Token
const adminToken = jwt.sign(
  {
    id: "6773f6b4e9e7e72506169d12", // Just a random proper ObjectId format
    role: "admin",
    email: "debug-admin@bracu.ac.bd"
  },
  JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("Token generated.");

// 2. Call the API
async function testApi() {
  try {
    console.log(`Fetching from: ${API_URL}`);
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log("Status:", res.status);
    console.log("Success:", res.data.success);
    console.log("Total Flagged Items:", res.data.flaggedContent.length);
    console.log("Debug Info:", JSON.stringify(res.data.debug, null, 2));
    
    if (res.data.flaggedContent.length > 0) {
      console.log("First Item:", JSON.stringify(res.data.flaggedContent[0], null, 2));
    } else {
      console.log("Response Body (if empty):", JSON.stringify(res.data.flaggedContent, null, 2));
    }

  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
    } else {
      console.error("Network/Request Error:", error.message);
    }
  }
}

testApi();
