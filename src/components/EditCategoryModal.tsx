"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Importing types
import { Category } from "@/types/category";

// import the handleUpdateCategorySubmit function from the categories-services file in the services folder
import { handleUpdateCategorySubmit } from "@/services/categories-services";

interface CategoryEditModalProps {
  isOpen: boolean; // modal open state
  onClose: () => void; // set isOpen to false then close the modal
  category?: Category; // category to edit
}

export default function EditCategoryModal({
  isOpen, // modal open state
  onClose, // set isOpen to false then close the modal
  category, // category to edit
}: CategoryEditModalProps) {
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

  // Set the category name and description when the category prop changes
  useEffect(() => {
    setCategoryName(category?.category_name || "");
    setCategoryDescription(category?.category_description || "");
  }, [category]);

  // Return null if the modal is not open
  if (!isOpen) return null;

  // Handle the form submission when the user clicks the update button
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    // Prepare form data
    const formData = new FormData();

    formData.append("category_name", categoryName); // Add the category name
    formData.append("category_description", categoryDescription); // Add the category description
    if (categoryImage) {
      formData.append("category_image", categoryImage); // Add the image only if available
    }

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
  };
  return (
    // Modal container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        {/* Header container */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Edit Category</h2>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Edit form */}
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
              onChange={(change) => setCategoryName(change.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* Description field container */}
          <div>
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
              Category Image
            </label>

            <input
              type="file"
              id="category_image"
              accept="image/*"
              onChange={(uploadedImage) =>
                setCategoryImage(uploadedImage.target.files?.[0] || null)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />

            {/* Preview the existing category image or newly uploaded image */}
            {(category?.category_image_url || categoryImage) && (
              <img
                src={
                  categoryImage
                    ? URL.createObjectURL(categoryImage)
                    : category?.category_image_url!
                }
                alt="Category Image"
                width={100}
                height={100}
                className="mt-2 rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Category
          </button>

          {/* Display the status message */}
          {status.message && (
            <p
              className={`text-sm ${
                status.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
