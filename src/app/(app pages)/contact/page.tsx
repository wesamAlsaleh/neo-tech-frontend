"use client";

import React from "react";

// import the auth context to get the data
import { useAuth } from "@/contexts/AuthContext";

export default function contactPage() {
  // get the user data
  const { user, loading } = useAuth();

  return (
    <div>{`${user?.first_name} ${user?.last_name} ${user?.phone_number}`}</div>
  );
}
