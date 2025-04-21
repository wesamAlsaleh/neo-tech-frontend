import React from "react";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      {/* Left section Container */}
      <div className="flex items-center space-x-4">
        {/* Search Bar Container */}
        <div className="relative">
          {/* Text Field */}
          <input
            type="text"
            placeholder="Search by name or ID"
            className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />

          {/* TODO: Search Icon in SVG */}
          <span className="absolute left-3 top-2.5 text-gray-400">
            {/* Search icon would go here */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Right section Container */}
      <div className="flex items-center space-x-4">
        {/* Dropdown menu 1 */}{" "}
        <div className="relative">
          {/* Dropdown Button */}
          <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            <option>All Users</option>
            <option>Active Users</option>
            <option>Admins</option>
          </select>

          {/* TODO:Down Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {/* Dropdown menu 2 */}
        <div className="relative">
          <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            <option>All Servers</option>
            <option>Production</option>
            <option>Development</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
          {/* TODO: Notification bell icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Notification indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
