"use client";

import React from "react";

// import custom components
import AddCategoryForm from "@/components/AddCategoryForm";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add New Category"
        subtitle="Here you can add a new category"
        actionButton={
          <Button text="Back" onClick={() => window.history.back()} />
        }
      />

      {/* Add Category Form */}
      <AddCategoryForm />
    </>
  );
}
