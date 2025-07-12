import React, { useState, useEffect } from "react";
import { ROUTES } from "./constants";

// Simple Router Implementation
export const Router = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [params, setParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
      parseParams();
    };

    const parseParams = () => {
      const path = window.location.pathname;
      const sendMatch = path.match(/^\/send\/(.+)$/);
      if (sendMatch) {
        setParams({ userId: sendMatch[1] });
      } else {
        setParams({});
      }
    };

    parseParams();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentRoute(path);

    // Parse params for the new path
    const sendMatch = path.match(/^\/send\/(.+)$/);
    if (sendMatch) {
      setParams({ userId: sendMatch[1] });
    } else {
      setParams({});
    }
  };

  return React.cloneElement(children, {
    currentRoute,
    params,
    navigate,
  });
};

export const Navigate = ({ to }) => {
  useEffect(() => {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [to]);
  return null;
};
