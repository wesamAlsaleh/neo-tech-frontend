import React from "react";

// import types
import { User } from "@/types/User";

// import custom components
import Table from "./Table";
import { formatDateTime } from "@/lib/helpers";

type UsersListType = {
  users: User[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function UsersList(props: UsersListType) {
  // Destructure the props to get the users data
  const { users, currentPage, setCurrentPage, totalPages } = props;

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
    />
  );
}
