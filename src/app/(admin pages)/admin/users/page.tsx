import React from "react";

// import components
import UsersList from "@/components/UsersList";
import PageTitle from "@/components/PageTitle";

export default function page() {
  return (
    <>
      <PageTitle title="Users" subtitle="Manage all users in the system" />

      {/* Users Table */}
      <UsersList />
    </>
  );
}
