"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Import the handleCreateCategorySubmit function from the categories-services file in the services folder
import { handleCreateCategorySubmit } from "@/services/categories-services";

interface FormStatus {
  success: boolean;
  message: string;
  error: string;
}

export default function AddCategoryForm() {
  // State to store the category name
  const [categoryName, setCategoryName] = useState("");

  // State to store the category description
  const [categoryDescription, setCategoryDescription] = useState("");

  // State to store the category image
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<FormStatus>({
    success: false,
    message: "",
    error: "",
  });

  // State to store the form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Router instance
  const router = useRouter();

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent, resetForm = false) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // if the category name is empty, display an error message and return
    if (!categoryName) {
      setStatus({
        success: false,
        message: "Category name is required*",
        error: "client error",
      });

      setIsSubmitting(false);
      return;
    }

    formData.append("category_name", categoryName); // Add the category name
    formData.append("category_description", categoryDescription); // Add the category description
    if (categoryImage) {
      formData.append("category_image", categoryImage); // Add the image only if available
    }

    try {
      // Submit the form data using the service
      const result = await handleCreateCategorySubmit(null, formData);

      // Update UI with the response
      setStatus(result);

      // Reload the page after the category is created successfully
      if (result.success) {
        // Reset the form fields if the resetForm parameter is true
        if (resetForm) {
          resetFormFields();
        } else {
          router.push("/admin/categories"); // Redirect to the categories page
        }
      }
    } finally {
      // Set the form submission status to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  const resetFormFields = () => {
    setCategoryName("");
    setCategoryDescription("");
    setCategoryImage(null);
  };

  return (
    <div>
      {/* Display the status message */}
      {status.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            status.success
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {status.success ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{status.message}</span>
        </div>
      )}

      {/* Form container */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        {/* Name field container */}
        <div className="space-y-2">
          <label
            htmlFor="category_name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            id="category_name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
        </div>

        {/* Description field container */}
        <div className="space-y-2">
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
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
        </div>

        {/* Image field container */}
        <div className="space-y-2">
          <label
            htmlFor="category_image"
            className="block text-sm font-medium text-gray-700"
          >
            Category Image (Optional)
          </label>

          <input
            type="file"
            id="category_image"
            accept="image/*" // Accept only image files
            onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100"
          />
        </div>

        {/* Action buttons container */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Another Category
          </button>
        </div>
      </form>
    </div>
  );
}
