"use client";

import Link from "next/link";
import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";

export default function dashboardPage() {
  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Manage your site settings and view analytics"
        actionButton={<ActionButton />}
      />

      <h2>Content here soon</h2>
    </div>
  );
}

// Action Button component
const ActionButton: React.FC = () => {
  return (
    <Link href={"/home"}>
      <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition duration-300">
        Home
      </button>
    </Link>
  );
};
