"use client";

import React from "react";

export default function dashboardPage() {
  return (
    <div>
      <h1 className="text-red-500">dashboard page</h1>
      <br />
      <button
        onClick={() => (window.location.href = "/")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Go to home page
      </button>
    </div>
  );
}
