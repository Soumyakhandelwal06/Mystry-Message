// src/components/Public/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
