"use client";

import React, { useEffect, useState } from "react";

// import types
import { User } from "@/types/User";

// import custom components
import Table from "./Table";

// import helpers
import { formatDateTime } from "@/lib/helpers";
import { getAllUsers } from "@/services/user-services";

export default function UsersList() {
  // State to store the loading state
  const [loading, setLoading] = useState(false);

  // State to store the users data
  const [users, setUsers] = useState<User[]>([]);

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15); // Set default items per page to 15
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Call the API to fetch users
    const response = await getAllUsers(currentPage, perPage);

    // Update the UI state with the response data
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      setUsers(response.users);
      setTotalItems(response.totalUsers);
      setTotalPages(response.totalPages);
      setPerPage(response.perPage);
      setCurrentPage(response.currentPage);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, [perPage, currentPage]);

  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "id", label: "User Id", align: "left" },
    { key: "first_name", label: "First Name", align: "center" },
    { key: "last_name", label: "Last Name", align: "center" },
    { key: "email", label: "Email", align: "center" },
    { key: "role", label: "Role", align: "center" },
    { key: "phone_number", label: "Phone Number", align: "center" },
    { key: "created_at", label: "Created Date", align: "center" },
    { key: "updated_at", label: "Updated Date", align: "center" },
  ]; // Define the columns for the table

  return (
    <Table
      columns={columns}
      rows={users}
      noDataMessage="No Users Found"
      onRowClick={(row) => console.log("Row clicked:", row)}
      renderCell={(row, key) => {
        // Format the role column
        if (key === "role") {
          const baseClass = "px-3 py-1 rounded-md text-xs border capitalize"; // Define the base class for the role badge
          let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

          // Define the badge class based on the role
          if (row[key] === "admin") {
            badgeClass = "bg-orange-100 text-orange-700 border-orange-400";
          }

          return (
            <span className={`${baseClass} ${badgeClass}`}>{row[key]}</span>
          );
        }

        // Format the date and time for created_at and updated_at fields
        if (key === "created_at" || key === "updated_at") {
          return <span>{formatDateTime(row[key])}</span>;
        }

        return <span>{row[key]}</span>;
      }}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
      isLoading={loading}
    />
  );
}
