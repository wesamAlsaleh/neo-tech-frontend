import React from "react";

// import custom components
import CategoryList from "@/components/CategoriesList";
import AddCategoryForm from "@/components/AddCategoryForm";
import PageTitle from "@/components/PageTitle";

export default function ManageCategoriesPage() {
  return (
    <div>
      <PageTitle title="Categories" subtitle="Here you can manage categories" />

      {/* Categories List Container */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories List</h2>

        <p className="mb-4">Here you can see all categories</p>
        {/* Categories table */}
        <CategoryList />
      </div>

      {/* Create Category Form Container */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
        <p className="mb-4">Here you can add a new category</p>

        {/* Add Category Form */}
        <AddCategoryForm />
      </div>
    </div>
  );
}
