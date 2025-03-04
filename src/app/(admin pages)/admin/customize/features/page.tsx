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
        title="Trust Badges"
        subtitle="Manage all NeoTech Trust Badges"
        highlightText="Only 3 trust badges can be displayed on the shop"
        actionButton={
          <ActionButton
            href="/admin/customize/features/create-feature"
            text="Add Badge"
            buttonTitle="Add a new Trust Badges"
          /> // Add new badge button
        }
        actionButton2={
          <ActionButton
            href="/admin/customize"
            text="Back"
            buttonTitle="Go back to Customize NeoTech Shop"
            color="white"
            textColor="black"
          /> // Go back button
        }
      />

      {/* Feature list table */}
      <ShopFeaturesList />
    </div>
  );
}
