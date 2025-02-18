"use client";

import React, { useState, useEffect } from "react";

// Importing types
import { Category } from "@/types/category";

// import the handleUpdateCategorySubmit function from the categories-services file in the services folder
import { handleUpdateCategorySubmit } from "@/services/categories-services";

interface CategoryEditModalProps {
  isOpen: boolean; // modal open state
  onClose: () => void; // set isOpen to false then close the modal
  category?: Category; // category to edit
}

interface FormStatus {
  success: boolean;
  message: string;
  error: string;
}

export default function EditCategoryModal({
  isOpen, // modal open state
  onClose, // set isOpen to false then close the modal
  category, // category to edit
}: CategoryEditModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<FormStatus>({
    success: false,
    message: "",
    error: "",
  });

  // State to store the form submission status to disable the submit button while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the category data when the modal is opened
  useEffect(() => {
    setCategoryName(category?.category_name || "");
    setCategoryDescription(category?.category_description || "");
  }, [category]);

  // Close the modal if it's not open
  if (!isOpen) return null;

  // Handle the form submission when the user clicks the update button
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    setIsSubmitting(true); // Set the form submission status to true

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("category_name", categoryName); // Add the category name
    formData.append("category_description", categoryDescription); // Add the category description
    if (categoryImage) {
      formData.append("category_image", categoryImage); // Add the image only if available
    }

    try {
      // Submit the form data using the service
      const result = await handleUpdateCategorySubmit(category?.id!, formData);

      // Update UI with the response
      setStatus({
        success: result.success, // set success to the result success
        message: result.message, // set message to the result message
        error: result.message, // set error to the result message
      });

      // Reload the page after second if the category is created successfully
      if (result.success) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setIsSubmitting(false); // Set the form submission status to false
    }
  };
  return (
    // Modal container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* ... container */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        {/* Header container */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Edit Category</h2>
        </div>

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

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field container */}
          <div className="space-y-2">
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
              onChange={(event) => setCategoryName(event.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>

          {/* Description field container */}
          <div className="space-y-2">
            <label
              htmlFor="category_description"
              className="block text-sm font-medium text-gray-700"
            >
              Category Description
            </label>

            <textarea
              id="category_description"
              value={categoryDescription}
              onChange={(event) => setCategoryDescription(event.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Image field container */}
          <div className="space-y-2">
            <label
              htmlFor="category_image"
              className="block text-sm font-medium text-gray-700"
            >
              Category Image
            </label>

            <input
              type="file"
              id="category_image"
              accept="image/*"
              onChange={(uploadedImage) =>
                setCategoryImage(uploadedImage.target.files?.[0] || null)
              }
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />

            {/* Preview the existing category image or the newly uploaded image */}
            {(category?.category_image_url || categoryImage) && (
              <img
                src={
                  categoryImage
                    ? URL.createObjectURL(categoryImage)
                    : category?.category_image_url!
                }
                alt="Category Image"
                className="mt-2 rounded w-24 h-24 object-cover"
              />
            )}
          </div>

          {/* button containers */}
          <div className="flex justify-end gap-2">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>

            {/* submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
