// src/hooks/useAuth.js
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/services/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const api = {
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  async verifyOTP(userId, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  async getMessages(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  async sendMessage(userId, content) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, content }),
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },
};
