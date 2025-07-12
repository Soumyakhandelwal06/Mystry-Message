import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Header = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.email}</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
