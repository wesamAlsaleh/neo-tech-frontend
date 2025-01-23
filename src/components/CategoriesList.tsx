"use client";

import { useEffect, useState } from "react";

// import functions from the categories-services.ts file
import {
  getAllCategories,
  toggleCategoryStatusById,
} from "@/services/categories-services";

// import the Category type
import { Category } from "@/types/category";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";

export default function CategoryList() {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Message state
  const [message, setMessage] = useState<string>("Loading categories...");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories
        const categoriesObj = await getAllCategories();

        // if categories are available, set the categories state
        if (categoriesObj?.categories.length > 0) {
          setCategories(categoriesObj.categories!);
        } else {
          setMessage(categoriesObj.message || "No categories available.");
        }
      } catch (error) {
        setMessage("Failed to load categories. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category status toggle
  const handleCategoryStatusToggle = async (categoryId: number) => {
    const serverResponse = await toggleCategoryStatusById(categoryId);

    if (serverResponse.success) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, is_active: !category.is_active ? 1 : 0 }
            : category
        )
      );
    } else {
      setMessage(serverResponse.message || "Failed to toggle category status.");
    }
  };

  // Render loading spinner or message
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!categories.length) {
    return <p>{message}</p>;
  }

  return (
    // Categories Table Container
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Category Name
            </th>

            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Category Description
            </th>

            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Category Image
            </th>

            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Is Active
            </th>

            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Created At
            </th>

            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-100 even:bg-gray-50">
              {/* Category Name */}
              <td className="px-4 py-2 border border-gray-300">
                {category.category_name}
              </td>

              {/* Category description*/}
              <td className="px-4 py-2 border border-gray-300">
                {category.category_description || "No description"}
              </td>

              {/* Category image*/}
              <td className="px-4 py-2 border border-gray-300">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={category.category_image_url!}
                  alt={category.category_name}
                />
              </td>

              {/* Category Status */}
              <td className="px-4 py-2 border border-gray-300">
                {category.is_active ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>

              {/* Category Created Date */}
              <td className="px-4 py-2 border border-gray-300">
                {new Date(category.created_at).toLocaleDateString()}
              </td>

              {/* Category  */}
              <td className="px-4 py-2 border border-gray-300 flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Edit
                </button>

                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Delete
                </button>

                <button
                  className={`${
                    category.is_active
                      ? `bg-green-500 hover:bg-green-700`
                      : "bg-orange-400 hover:bg-orange-400"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => handleCategoryStatusToggle(category.id)}
                >
                  {category.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
