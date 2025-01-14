"use client";

import React from "react";

// import the auth context to get the data
import { useAuth } from "@/context/AuthContext";

export default function page() {
  // get the user data
  const { user, loading } = useAuth();

  return <div>{user?.email}</div>;
}
