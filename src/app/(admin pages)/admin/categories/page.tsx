import React from "react";

// import custom components
import CategoryList from "@/components/CategoriesList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function ManageCategoriesPage() {
  return (
    <>
      <PageTitle
        title="Categories"
        subtitle="Here you can manage categories"
        actionButton={
          <ActionButton
            href="/admin/categories/create-category"
            text="Add Category"
          />
        }
      />

      {/* Categories List Container */}
      <div className="mb-12">
        {/* Categories table */}
        {/* TODO: add pagination */}
        <CategoryList />
      </div>
    </>
  );
}
