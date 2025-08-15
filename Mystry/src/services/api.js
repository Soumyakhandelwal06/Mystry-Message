// src/services/api.js (Enhanced version)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // async makeRequest(endpoint, options = {}) {
  //   const url = `${this.baseURL}${endpoint}`;
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       ...options.headers,
  //     },
  //     ...options,
  //   };

  //   try {
  //     const response = await fetch(url, config);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Request failed");
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     return {
  //       success: false,
  //       message: error.message || "Network error occurred",
  //     };
  //   }
  // }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🔍 [API CALL] ${config.method || "GET"} ${url}`);
      console.log("📤 Headers:", config.headers);
      if (config.body) {
        console.log("📦 Body:", config.body);
      }

      const response = await fetch(url, config);
      const data = await response.json();

      console.log("✅ Response Data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("❌ API Error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  }

  // Auth methods
  async signup(userData) {
    return this.makeRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async verifyOTP(email, otp) {
    return this.makeRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }), // ✅ correct
    });
  }

  async login(credentials) {
    return this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken) {
    return this.makeRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(token) {
    return this.makeRequest("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Message methods
  // async getMessages(userId, token) {
  //   return this.makeRequest(`/messages/${userId}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }
  async getMessages(token) {
    return this.makeRequest(`/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async sendMessage(uniqueId, content) {
    return this.makeRequest(`/messages/send/${uniqueId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId, token) {
    return this.makeRequest(`/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markMessageAsRead(messageId, token) {
    return this.makeRequest(`/messages/${messageId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // User methods
  async getUserProfile(uniqueId) {
    return this.makeRequest(`/users/${uniqueId}`);
  }

  async updateUserProfile(userId, userData, token) {
    return this.makeRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getProfile(token) {
    return this.makeRequest(`/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async changePassword(userId, passwords, token) {
    return this.makeRequest(`/users/${userId}/change-password`, {
      method: "POST",
      body: JSON.stringify(passwords),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteAccount(userId, token) {
    return this.makeRequest(`/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Analytics methods
  async getMessageStats(token) {
    return this.makeRequest(`/messages/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Settings methods
  async getUserSettings(userId, token) {
    return this.makeRequest(`/settings/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUserSettings(userId, settings, token) {
    return this.makeRequest(`/settings/${userId}`, {
      method: "PUT",
      body: JSON.stringify(settings),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async updateAcceptingMessages(status, token) {
    return this.makeRequest(`/users/accepting-messages`, {
      method: "PUT",
      body: JSON.stringify({ accepting: status }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Allow a message
}

export const api = new ApiService();
