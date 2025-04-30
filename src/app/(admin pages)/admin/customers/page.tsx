"use client";

import React, { useEffect, useState } from "react";

// import types
import { User } from "@/types/User";

// import backend services
import { getAllUsers } from "@/services/user-services";
import PageTitle from "@/components/PageTitle";
import UsersList from "@/components/UsersList";
import PaginationControl from "@/components/PaginationControl";

// import components

export default function page() {
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

  return (
    <>
      <PageTitle title="Users" subtitle="Manage all users in the system" />

      {/* Users Table */}
      <UsersList
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
