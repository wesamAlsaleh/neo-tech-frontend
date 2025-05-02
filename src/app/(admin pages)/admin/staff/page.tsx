"use client";

import React, { useEffect, useState } from "react";

// import backend services
import { getAdminUsers } from "@/services/user-services";

// import types
import { User } from "@/types/User";

// import components
import PageTitle from "@/components/PageTitle";
import Table from "@/components/Table";
import { formatDateTime } from "@/lib/helpers";

export default function page() {
  // State to store the product statistics data
  const [adminUsers, setAdminUsers] = useState<User[]>();

  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  /**
   * Navigation States
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(20);

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Fetch the data parallel
    const response = await getAdminUsers(currentPage, perPage);

    // Update the UI state with the fetched data
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      setAdminUsers(response.admins);

      // Update the pagination state
      setCurrentPage(response.currentPage);
      setPerPage(response.perPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalUsers);
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
  }, [currentPage, perPage]);

  // Prepare the columns for the table
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "full_name", label: "Full Name", align: "center" },
    { key: "email", label: "Email Address", align: "center" },
    { key: "phone_number", label: "Phone Number", align: "center" },
    { key: "created_at", label: "Joined At", align: "center" },
  ];

  return (
    <>
      <PageTitle
        title="NeoTech Staff"
        subtitle="The Entire Administrative Team at NeoTech"
      />

      {/* Table */}
      <Table
        columns={columns}
        rows={adminUsers || []}
        noDataMessage="No Admin Users."
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        isLoading={loading}
        renderCell={(row, key) => {
          // Format the full name cell
          if (key === "full_name") {
            return (
              <span>
                {row.first_name} {row.last_name}
              </span>
            );
          }

          // Format the date to a more readable format
          if (key === "created_at") {
            return <span>{formatDateTime(String(row.created_at))}</span>;
          }

          return <span>{row[key]}</span>;
        }}
      />
    </>
  );
}
