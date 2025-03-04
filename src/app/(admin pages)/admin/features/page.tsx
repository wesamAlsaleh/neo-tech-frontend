import React from "react";

// import custom components
import ShopFeaturesList from "@/components/ShopFeaturesList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function page() {
  return (
    <div>
      {/* Page Title */}
      <PageTitle
        title="Shop Features"
        subtitle="Manage all shop features here"
        actionButton={
          <ActionButton
            href="/admin/features/create-feature"
            text="Add Feature"
            buttonTitle="Add a new feature"
          />
        }
      />

      {/* Feature list table */}
      <ShopFeaturesList />
    </div>
  );
}
