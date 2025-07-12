import { API_BASE_URL } from "../utils/constants";

// API Helper Functions
export const api = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  verifyOTP: async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getMessages: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  sendMessage: async (userId, content) => {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content }),
    });
    return response.json();
  },
};
