import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6">This page doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium"
      >
        Go home
      </button>
    </div>
  );
}
