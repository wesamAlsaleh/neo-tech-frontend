"use client";

import Link from "next/link";
import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function dashboardPage() {
  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Manage your site settings and view analytics"
        actionButton={<ActionButton href="/home" text="Home" />}
      />

      <h2>Content here soon</h2>
    </div>
  );
}
