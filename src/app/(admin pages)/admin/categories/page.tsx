import React, { Suspense } from "react";

// import custom components
import { CategoryList } from "@/components/CategoriesList";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddCategoryForm from "@/components/AddCategoryForm";

export default async function manageCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page description */}
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <p className="mb-8">Here you can manage categories</p>

      {/* Categories List Container */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories List</h2>

        <p className="mb-4">Here you can see all categories</p>
        {/* Suspense to display a fallback until its children have finished loading  */}
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryList />
        </Suspense>
      </div>

      {/* Create Category Form Container */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <p className="mb-4">Here you can add a new category</p>
        <AddCategoryForm />
      </div>
    </div>
  );
}
