"use client";

import React, { use, useActionState, useEffect } from "react";

// Import the handleCreateCategorySubmit function from the categories-services file in the services folder
import { handleCreateCategorySubmit } from "@/services/categories-services";

export default function AddCategoryForm() {
  // useActionState hook to handle the form submission
  const [state, createCategoryAction] = useActionState(
    handleCreateCategorySubmit,
    null
  );

  return (
    <form
      className="max-w-md  bg-white p-6 rounded-lg shadow-md"
      action={createCategoryAction}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Add New Category
      </h2>

      {/* Category Name */}
      <div className="mb-4">
        <label
          htmlFor="category_name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name
        </label>

        <input
          type="text"
          id="category_name"
          name="category_name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter category name"
          required
        />
      </div>

      {/* Category Description */}
      <div className="mb-4">
        <label
          htmlFor="category_description"
          className="block text-sm font-medium text-gray-700"
        >
          Category Description
        </label>

        <textarea
          id="category_description"
          name="category_description"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter category description"
        ></textarea>
      </div>

      {/* Category Image */}
      <div className="mb-4">
        <label
          htmlFor="category_image"
          className="block text-sm font-medium text-gray-700"
        >
          Category Image
        </label>

        <input
          type="file"
          id="category_image"
          name="category_image"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          accept="image/*" // accept only images
          multiple={false} // only accept one image
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Add Category
      </button>

      {/* Display success or error message */}
      {state?.success ? (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {state?.message}
        </div>
      ) : (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {state?.error}
        </div>
      )}
    </form>
  );
}
