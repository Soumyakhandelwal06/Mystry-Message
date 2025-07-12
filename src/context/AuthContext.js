import React, { createContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/constants";

// Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
    const storedToken = window.localStorage?.getItem(STORAGE_KEYS.TOKEN);
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser(payload);
        setToken(storedToken);
      } catch (error) {
        window.localStorage?.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    window.localStorage?.setItem(STORAGE_KEYS.TOKEN, authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage?.removeItem(STORAGE_KEYS.TOKEN);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
