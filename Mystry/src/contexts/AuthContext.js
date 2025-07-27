// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // To store decoded user info from JWT
  const [loading, setLoading] = useState(true); // To manage initial auth check

  // Function to check token validity and set auth state
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({
            id: decodedToken.id,
            email: decodedToken.email,
            uniqueId: decodedToken.uniqueId,
            uniqueLink: decodedToken.uniqueLink,
          }); // Store relevant user info
        } else {
          // Token expired
          localStorage.removeItem("jwtToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false); // Authentication check is complete
  }, []);

  useEffect(() => {
    checkAuth();
    // You might want to re-check on focus or periodically for long-lived apps
  }, [checkAuth]);

  const login = (token, navigate) => {
    localStorage.setItem("jwtToken", token);

    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        // setUser({
        //   userId: decodedToken.id, // or decodedToken.userId depending on backend
        //   email: decodedToken.email,
        // });
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          uniqueId: decodedToken.uniqueId,
          uniqueLink: decodedToken.uniqueLink,
        });
        console.log("User logged in:", decodedToken);
        // ✅ Navigate after setting auth state
        navigate("/dashboard");
      } else {
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Invalid token during login:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUser(null);
    // Optionally, navigate to login page here if not handled by App.js
  };

  const contextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
// Ensure to export AuthContext for use in components
export default AuthContext;
