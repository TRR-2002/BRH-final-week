const fetch = require('node-fetch');

async function testRecruiterReviews() {
    const baseUrl = 'http://localhost:1350/api';
    // Note: In a real test environment, we'd use a test token. 
    // This is a structural validation script.
    
    console.log("--- Testing Recruiter Reviews API ---");
    
    try {
        // 1. Check if the endpoint exists (Structural check)
        // We expect a 401/403 if no token, which confirms the route is protected but registered
        const response = await fetch(`${baseUrl}/recruiter/reviews`);
        console.log(`Endpoint Status (unauthorized): ${response.status}`);
        
        if (response.status === 401 || response.status === 403) {
            console.log("✅ Route is registered and protected.");
        } else {
            console.log("❌ Unexpected status code.");
        }
        
    } catch (error) {
        console.error("error testing reviews api:", error);
    }
}

testRecruiterReviews();
