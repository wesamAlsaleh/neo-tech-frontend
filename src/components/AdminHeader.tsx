import React from "react";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
      {/* title container */}
      <div className="flex items-center space-x-4">
        <h2 className="text-white">TODO: Add custom actions here</h2>
      </div>

      {/* ... container */}
      <div className="flex items-center space-x-4">
        {/* Dropdown menu 1 */}
        <select className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md">
          <option>All Users</option>
        </select>

        {/* Dropdown menu 2 */}
        <select className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md">
          <option>All Servers</option>
        </select>
      </div>
    </header>
  );
}
