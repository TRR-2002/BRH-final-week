// import axios from "axios";

// // Create a new instance of axios
// const api = axios.create({
//   baseURL: "http://localhost:1350/api", // Your backend API's base URL
// });

// // This is the magic part. We are adding an "interceptor"
// // that will run before every single request is sent.
// api.interceptors.request.use(
//   (config) => {
//     // First, we get the token. In a real app, you'd get this from context or localStorage.
//     // For now, let's assume we have a way to get it.
//     // We'll replace this part when we connect it to the AuthContext.
//     const token =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzExMDY4MWU0YTY2ZTJkNzZiN2I2MiIsInVzZXJJZCI6InR1c2hpdC5yb3kiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc2NDkzNDQxNywiZXhwIjoxNzY1MDIwODE3fQ.xTxpQrYjhfX-uJxn8WEK4iTSstt0YE_J7AOpgqidJPk"; // Temporary placeholder

//     if (token) {
//       // If the token exists, add the Authorization header to the request
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

// Create a new instance of axios
const api = axios.create({
  baseURL: "http://localhost:1350/api",
});

// This function will allow us to set the token from anywhere in our app
export const setAuthToken = (token) => {
  if (token) {
    // Apply the authorization token to every request if logged in
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Delete the auth header if not logged in
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
