import React from "react";

// import custom components
import AddCategoryForm from "@/components/AddCategoryForm";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add New Category"
        subtitle="Here you can add a new category"
        actionButton={
          <ActionButton href="/admin/categories" text="Cancel" color="red" />
        }
      />

      {/* Add Category Form */}
      <AddCategoryForm />
    </>
  );
}
