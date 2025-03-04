import React from "react";

// import services
// import {} from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Add New Category"
        subtitle="Here you can add a new category"
        actionButton={
          <ActionButton href="/admin/features" text="Cancel" color="red" />
        }
      />

      {/* Form */}
    </>
  );
}
