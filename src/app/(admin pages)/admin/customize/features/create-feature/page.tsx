import React from "react";

// import services
// import {} from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddFeatureForm from "@/components/AddFeatureForm";

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Add New Feature"
        subtitle="Here you can add a new feature to the system. Note that only active features will be displayed to the users. And only 3 features can be activated to the system."
        actionButton={
          <ActionButton href="/admin/features" text="Cancel" color="red" />
        }
      />

      {/* Form */}
      <AddFeatureForm />
    </>
  );
}
