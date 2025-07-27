// src/utils/api.js

// Configure your backend API base URL
// For development, if using proxy in package.json, just use relative paths.
// For production, use environment variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Default to empty string for relative paths

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }
  return data;
};

// Helper to get token for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Authentication Endpoints ---

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const verifyOtp = async (otpData) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(otpData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// --- Message Endpoints ---

export const getMessagesForUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // Include authorization token
    },
  });
  return handleResponse(response);
};

export const sendMessage = async (messageData) => {
  const response = await fetch(`${API_BASE_URL}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  return handleResponse(response);
};
