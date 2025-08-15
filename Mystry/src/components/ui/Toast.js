// src/components/ui/Toast.js
import React from "react";
import { AlertCircle } from "lucide-react";

const toastColors = {
  error: "bg-red-100 text-red-800 border-red-300",
  success: "bg-green-100 text-green-800 border-green-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export const Toast = ({ type = "info", message, onClose }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div
        className={`border px-6 py-4 rounded-lg shadow-md flex items-center gap-3 ${toastColors[type]}`}
      >
        <AlertCircle className="w-5 h-5" />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="ml-auto font-bold">
          ✕
        </button>
      </div>
    </div>
  );
};
