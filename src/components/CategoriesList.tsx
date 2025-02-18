"use client";

import { Suspense, useEffect, useState } from "react";

// import functions from the categories-services.ts file
import {
  deleteCategoryById,
  getAllCategories,
  toggleCategoryStatusById,
} from "@/services/categories-services";

// import the Category type
import { Category } from "@/types/category";

// import custom component
import LoadingSpinner from "./LoadingSpinner";
import EditCategoryModal from "@/components/EditCategoryModal";
import DeleteModal from "@/components/DeleteModal";

// import the icons from the public/icons folder
import { icons } from "../../public/icons";

export default function CategoryList() {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // No categories message state
  const [noCategoriesMessage, setNoCategoriesMessage] =
    useState<boolean>(false);

  // Delete category message state
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Form submission response status
  const [isSuccessfulResponse, setIsSuccessfulResponse] =
    useState<boolean>(false);

  // Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected category to delete
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<
    Category | undefined
  >(undefined);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined); // Selected category to edit

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories
        const result = await getAllCategories();

        if (result.status) {
          // if categories are available, set the categories state. Otherwise, set the fetching message state with the message
          if (result?.categories.length > 0) {
            setCategories(result.categories!);
          } else {
            setCategories([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category status toggle
  const handleCategoryStatusToggle = async (categoryId: number) => {
    // Toggle category status by id
    const result = await toggleCategoryStatusById(categoryId);

    // If the server response is successful
    if (result.success) {
      // refresh the page to update the categories state
      window.location.reload();
    }
  };

  // Handle category delete by id
  const handleCategoryDelete = async (categoryId: number) => {
    // Delete category by id
    const result = await deleteCategoryById(categoryId);

    // If the server response is successful
    if (result.success) {
      setIsSuccessfulResponse(true);

      // refresh the page to refetch the categories when component mounts
      window.location.reload();

      setDeleteMessage(result.message || "Category deleted successfully.");
    } else {
      setIsSuccessfulResponse(false);
      setDeleteMessage(result.message || "Failed to delete category.");
    }
  };

  return (
    // Categories Table Container
    <div className="overflow-x-auto">
      {/* Delete product message */}
      {deleteMessage && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            isSuccessfulResponse
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {isSuccessfulResponse ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{deleteMessage}</span>
        </div>
      )}

      {/* Categories Table */}
      <Suspense fallback={<LoadingSpinner />}>
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
            {/* No categories message */}
            {categories.length === 0 && (
              <tr>
                <td className="text-center py-4" colSpan={6}>
                  No categories available
                </td>
              </tr>
            )}

            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
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
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setSelectedCategory(category);
                    }}
                  >
                    <img
                      src={icons.edit50.src}
                      alt="Edit"
                      width={35}
                      height={35}
                    />
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      // Open the delete modal
                      setIsDeleteModalOpen(true);

                      // Set the selected category to delete
                      setSelectedCategoryToDelete(category);
                    }}
                  >
                    <img
                      src={icons.delete50.src}
                      alt="Delete"
                      width={35}
                      height={35}
                    />
                  </button>

                  <button
                    className={`${
                      category.is_active
                        ? "bg-orange-400 hover:bg-orange-400"
                        : `bg-green-500 hover:bg-green-700`
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    onClick={() => handleCategoryStatusToggle(category.id)}
                  >
                    {category.is_active ? (
                      <img
                        src={icons.removeBasket50.src}
                        alt="Add to Basket"
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img
                        src={icons.addBasket50.src}
                        alt="Add to Basket"
                        width={35}
                        height={35}
                      />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Suspense>

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleCategoryDelete(selectedCategoryToDelete!.id)}
        name={selectedCategoryToDelete?.category_name || ""}
      />
    </div>
  );
}
