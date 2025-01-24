"use client";

import { useEffect, useState } from "react";

// import functions from the categories-services.ts file
import {
  deleteCategoryById,
  getAllCategories,
  handleUpdateCategorySubmit,
  toggleCategoryStatusById,
} from "@/services/categories-services";

// import the Category type
import { Category } from "@/types/category";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";
import EditModalComponent from "./EditModalComponent";

export default function CategoryList() {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Message state
  const [message, setMessage] = useState<string>("");

  // Delete category message state
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined); // Selected category to edit

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
    // Toggle category status by id
    const serverResponse = await toggleCategoryStatusById(categoryId);

    // If the server response is successful
    if (serverResponse.success) {
      /**
       * Update the categories state by mapping through the old categories state and
       * checking if the category id matches the category id that was toggled. If it matches,
       * update the category is_active property to the opposite of the current value.
       * If it doesn't match, return the category as is.
       *
       * In other words, we will change the category status from active to inactive (0 to 1 or 1 to 0) that they
       * were already available in the categories state after the component mounted, all without refreshing the page.
       * because we already changed the category status in the database using the toggleCategoryStatusById function.
       */
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

  // Handle category delete by id
  const handleCategoryDelete = async (categoryId: number) => {
    // Delete category by id
    const serverResponse = await deleteCategoryById(categoryId);

    // If the server response is successful
    if (serverResponse.success) {
      /**
       * Filter the categories state by removing the category with the id that was deleted.
       * This will update the categories state by removing the category that was deleted
       * without refreshing the page.
       */
      setCategories(
        (prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId) // Remove the category with the id that was deleted
      );

      setDeleteMessage(
        serverResponse.message || "Category deleted successfully."
      );
    } else {
      setDeleteMessage(serverResponse.message || "Failed to delete category.");
    }
  };

  // Open the category edit modal if the openModal state is true
  // const handleCategoryEdit = async (categoryId: number) => {
  //   // Update the category by id
  //   const serverResponse = await handleUpdateCategorySubmit(categoryId);

  //   // If the server response is successful
  //   if (serverResponse.success) {
  //     // Update the categories state by mapping through the old categories state
  //     // and checking if the category id matches the category id that was updated.
  //     // If it matches, update the category with the new category data.
  //     // If it doesn't match, return the category as is.
  //     setCategories((prevCategories) =>
  //       prevCategories.map((category) =>
  //         category.id === categoryId ? serverResponse.category : category
  //       )
  //     );

  //     setIsEditModalOpen(false);
  //   } else {
  //     setMessage(serverResponse.message || "Failed to update category.");
  //   }
  // };

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
      {/* Delete category success message */}
      {deleteMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{deleteMessage}</span>
        </div>
      )}

      {/* Categories Table */}
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
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setSelectedCategory(category);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleCategoryDelete(category.id)}
                >
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

      {/* Edit Modal */}
      <EditModalComponent
        isOpen={isEditModalOpen}
        category={selectedCategory}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
