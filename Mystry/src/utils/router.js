// src/utils/router.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "../components/layout/Layout";
import { Login } from "../components/Auth/Login";
import { Signup } from "../components/Auth/Signup";
import { VerifyOTP } from "../components/Auth/VerifyOtp";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { SendMessage } from "../components/messaging/SendMessage";

export const Router = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const renderComponent = () => {
    if (currentPath.startsWith("/send/")) {
      const userId = currentPath.split("/send/")[1];
      return <SendMessage userId={userId} navigate={navigate} />;
    }

    if (currentPath.startsWith("/verify-otp")) {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");
      return <VerifyOTP userId={userId} navigate={navigate} />;
    }

    if (isAuthenticated) {
      switch (currentPath) {
        case "/":
        case "/dashboard":
          return <Dashboard navigate={navigate} />;
        default:
          return <Dashboard navigate={navigate} />;
      }
    } else {
      switch (currentPath) {
        case "/signup":
          return <Signup navigate={navigate} />;
        case "/login":
        case "/":
        default:
          return <Login navigate={navigate} />;
      }
    }
  };

  return renderComponent();
};
