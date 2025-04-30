"use client";

import React from "react";

// import custom components
import TrustBadgeList from "@/components/TrustBadgeList";
import TrustBadgesPreview from "@/components/TrustBadgesPreview";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function page() {
  // Router Instance
  const router = useRouter();

  return (
    <div>
      {/* Page Title */}
      <PageTitle
        title="Trust Badges"
        subtitle="Manage all NeoTech Trust Badges"
        highlightText="Only 3 trust badges can be displayed on the shop"
        actionButton={
          <Button
            text="Add Badge"
            onClick={() => {
              router.push("/admin/customize/features/create-feature");
            }}
          />
        }
      />

      {/* Activated Badges Preview */}
      <TrustBadgesPreview />

      {/* Feature list table */}
      <TrustBadgeList />
    </div>
  );
}
