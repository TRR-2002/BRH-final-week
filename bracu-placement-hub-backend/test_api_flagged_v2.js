const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "bph_sec_pass_bracu_cse";
const API_URL = "http://localhost:1350/api/admin/flagged-content";

// 1. Generate a Fake Admin Token
const adminToken = jwt.sign(
  {
    id: "6773f6b4e9e7e72506169d12", 
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
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const data = await res.json();

    console.log("Status:", res.status);
    console.log("Success:", data.success);
    console.log("Total Flagged Items:", data.flaggedContent ? data.flaggedContent.length : "undefined");
    console.log("Debug Info:", JSON.stringify(data.debug, null, 2));
    
    if (data.flaggedContent && data.flaggedContent.length > 0) {
      console.log("First Item:", JSON.stringify(data.flaggedContent[0], null, 2));
    } else {
      console.log("Response Body (if empty):", JSON.stringify(data.flaggedContent, null, 2));
    }

  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

testApi();
