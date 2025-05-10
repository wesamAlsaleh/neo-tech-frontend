"use client";

import React from "react";

// import services
// import {} from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddFeatureForm from "@/components/AddFeatureForm";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Add New Feature"
        subtitle="Here you can add a new feature to the system. Note that only active features will be displayed to the users. And only 3 features can be activated to the system."
        highlightText="The recommended size for the icon is 96x96 pixels."
        actionButton={
          <Button
            text="Back"
            onClick={() => {
              window.history.back();
            }}
          />
        }
      />

      {/* Form */}
      <AddFeatureForm />
    </>
  );
}
