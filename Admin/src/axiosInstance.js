import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Your API base URL
  timeout: 5000, // Request timeout in milliseconds
});
instance.interceptors.request.use(
  (config) => {
    // Add custom headers, authentication, etc.
    var token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default instance;
