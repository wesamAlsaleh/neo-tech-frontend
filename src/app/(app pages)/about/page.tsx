"use client";

import React from "react";

// import the auth context to get the user data
import { useAuth } from "@/contexts/AuthContext";

// Import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

export default function aboutPage() {
  // get the user data from the auth context
  const { user, loading } = useAuth();

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h1 className="text-3xl font-bold">User Details:</h1>
          <h2>Name: {`${user?.first_name} ${user?.last_name}`}</h2>
          <h2>Email: {user?.email}</h2>
          <h2>Phone Number: {user?.phone_number}</h2>
          <h2>role: {user?.role}</h2>
        </div>
      )}
    </div>
  );
}
