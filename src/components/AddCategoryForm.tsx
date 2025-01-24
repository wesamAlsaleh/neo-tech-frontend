"use client";

import React, { useState } from "react";

// Import the handleCreateCategorySubmit function from the categories-services file in the services folder
import { handleCreateCategorySubmit } from "@/services/categories-services";

export default function AddCategoryForm() {
  // State to store the category name
  const [categoryName, setCategoryName] = useState("");

  // State to store the category description
  const [categoryDescription, setCategoryDescription] = useState("");

  // State to store the category image
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState({
    success: false,
    message: "",
    error: "",
  });

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();

    formData.append("category_name", categoryName); // Add the category name
    formData.append("category_description", categoryDescription); // Add the category description

    if (categoryImage) {
      formData.append("category_image", categoryImage); // Add the image only if available
    }

    // Submit the form data using the service
    const result = await handleCreateCategorySubmit(null, formData);

    // Update UI with the response
    setStatus(result);

    // Reload the page after second if the category is created successfully
    if (result.success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field container */}
        <div>
          <label
            htmlFor="category_name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>

          <input
            type="text"
            id="category_name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        {/* Description field container */}
        <div>
          <label
            htmlFor="category_description"
            className="block text-sm font-medium text-gray-700"
          >
            Category Description (Optional)
          </label>

          <textarea
            id="category_description"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={4}
          />
        </div>

        {/* Image field container */}
        <div>
          <label
            htmlFor="category_image"
            className="block text-sm font-medium text-gray-700"
          >
            Category Image (Optional)
          </label>

          <input
            type="file"
            id="category_image"
            accept="image/*"
            onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* submit button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Category
        </button>

        {/* Display the status message */}
        {status.message && (
          <p
            className={`mt-4 text-sm ${
              status.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
            {status.error && status.error}
          </p>
        )}
      </form>
    </div>
  );
}
