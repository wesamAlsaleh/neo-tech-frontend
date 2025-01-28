"use client";

import React, { useState } from "react";

// Import the useRouter hook from the next/navigation module
import { useRouter } from "next/navigation";

// Import the useAuth hook from the AuthContext
import { useAuth } from "@/contexts/AuthContext";

// import custom components
import LoadingSpinner from "./LoadingSpinner";

// Import the handleLogout function from the auth-services
import { handleLogout } from "@/services/auth-services";

export default function DropDownMenu() {
  // Get the user data
  const { user, loading } = useAuth();

  // Get the router object
  const router = useRouter();

  // State to manage dropdown visibility (open/close)
  const [isOpen, setIsOpen] = useState(false);

  // State to manage the selected item
  const [selectedItem, setSelectedItem] = useState("Select an option");

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle the selection of a menu item
  const handleSelect = (item: string) => {
    // Update the selected item
    setSelectedItem(item);

    // Close the dropdown after selection
    setIsOpen(false);

    // Navigate to the corresponding route
    switch (item) {
      case "Profile":
        router.push("/#"); // TODO: change the route
        break;
      case "My Orders":
        router.push("#"); // TODO: change the route
        break;
      case "Manage Categories":
        router.push("/admin/categories"); // Navigate to the categories page
        break;
      case "Manage Products":
        router.push("/admin/products"); // TODO: change the route
        break;
      case "Manage Orders":
        router.push("#"); // TODO: change the route
        break;
      case "Logout":
        handleLogout(); // Logout the user
        break;
      default:
        break;
    }
  };

  // Menu items based on the user role
  const menuItems =
    user?.role === "admin"
      ? [
          "Profile",
          "My Orders",
          "Manage Categories",
          "Manage Products",
          "Manage Orders",
          "Manage Users",
          "Logout",
        ]
      : ["Profile", "My Orders", "Logout"];

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while the user data is being fetched
  }

  return (
    <div className="relative inline-block">
      {/* Dropdown button */}
      <button
        onClick={toggleDropdown} // Toggles the dropdown visibility (open/close)
        className="py-2 px-4 bg-primary text-white rounded cursor-pointer w-32"
      >
        {/* Display the selected item or the placeholder text */}
        {selectedItem} ▼
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="absolute top-full left-0 p-0 m-0 bg-white border border-gray-300 shadow-md rounded w-32 z-10">
          {menuItems.map((item, index) => (
            <li
              key={index} // Unique key for each menu item
              onClick={() => handleSelect(item)} // Handle item selection
              className={`py-2 px-4 cursor-pointer ${
                index !== menuItems.length - 1 ? "border-b border-gray-300" : ""
              } ${item === "Logout" && "text-[#ff0505]"}`} // Add border between items except for the last one (the line under each item except the last one)
              onMouseEnter={
                (event) =>
                  ((event.target as HTMLElement).style.background = "#F1F1F1") // Highlight on hover
              }
              onMouseLeave={
                (event) =>
                  ((event.target as HTMLElement).style.background = "#FFF") // Reset background on mouse leave
              }
            >
              {/* Display the item text */}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
