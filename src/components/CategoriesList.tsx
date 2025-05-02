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
import TableStatusColumn from "./TableStatusColumn";

// import the icons from the public/icons folder
import { icons } from "../../public/icons";
import Table from "./Table";
import { formatDateTime } from "@/lib/helpers";
import Image from "next/image";

export default function CategoryList() {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Server response state
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  /**
   * Modal states
   */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit Modal states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  ); // Selected category to edit

  const fetchData = async () => {
    try {
      // Fetch all categories
      const result = await getAllCategories();

      // Update the UI with the fetched data
      setServerResponse({
        status: result.status,
        message: !result.status && result.message,
      });

      if (result.status) {
        setCategories(result.categories);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
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

    // Update the UI with the response
    setServerResponse({
      status: result.success,
      message: result.message,
    });

    if (result.success) {
      // Close the delete modal after successful delete
      setIsDeleteModalOpen(false);

      // refresh the page to refetch the categories when component mounts
      window.location.reload();
    }
  };

  // Prepare the table columns
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "category_name", label: "Category Name", align: "center" },
    {
      key: "category_description",
      label: "Category Description",
      align: "center",
    },
    { key: "category_image", label: "Category Image", align: "left" },
    { key: "is_active", label: "Is Active", align: "center" },
    { key: "created_at", label: "Created At", align: "center" },
    { key: "actions", label: "Actions", align: "center" },
  ];

  return (
    // Categories Table Container
    <>
      {/* Server Response message */}
      {serverResponse.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponse.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {serverResponse.status ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      {/* Categories Table */}
      <Table
        columns={columns}
        rows={categories}
        noDataMessage="No categories available."
        onRowClick={(row) => console.log("Row clicked:", row)}
        renderCell={(row, key) => {
          // Render Category Image
          if (key === "category_image") {
            if (row.category_image_url) {
              return (
                <Image
                  src={row.category_image_url || ""}
                  alt={row.category_name}
                  className="w-16 h-16"
                  width={80}
                  height={80}
                />
              );
            } else {
              return "No Image";
            }
          }

          // Render Category Status Badge
          if (key === "is_active") {
            // Get the image status
            const isActive = row.is_active ? true : false;

            const statusText = isActive ? "Active" : "Inactive";

            // Badge
            const baseClass =
              "px-3 py-1 rounded-md text-base border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (isActive) {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            } else {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>{statusText}</span>
            );
          }

          // Render Category Created At
          if (key === "created_at") {
            return <span>{formatDateTime(row.created_at)}</span>;
          }

          // Render Category Actions
          if (key === "actions") {
            return (
              <div className="flex items-center justify-center gap-2">
                <button
                  className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setSelectedCategory(row);
                  }}
                >
                  <img
                    src={icons.edit50.src}
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </button>

                {/* <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setIsDeleteModalOpen(true); // Open the delete modal
                    setSelectedCategory(row); // Set the selected category to delete
                  }}
                >
                  <img
                    src={icons.delete50.src}
                    alt="Delete"
                    width={35}
                    height={35}
                  />
                </button> */}

                <button
                  className={`${
                    row.is_active
                      ? "bg-orange-400 hover:bg-orange-400"
                      : `bg-green-500 hover:bg-green-700`
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => handleCategoryStatusToggle(row.id)}
                >
                  {row.is_active ? (
                    <img
                      src={icons.removeBasket50.src}
                      alt="Add to Basket"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <img
                      src={icons.addBasket50.src}
                      alt="Add to Basket"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              </div>
            );
          }

          // Render the cell based on the key without formatting
          return <span>{row[key]}</span>;
        }}
        isLoading={loading}
      />

      {/* Edit Modal */}
      {selectedCategory && isEditModalOpen && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          category={selectedCategory!}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Modal */}
      {selectedCategory && isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleCategoryDelete(selectedCategory.id)}
          name={selectedCategory?.category_name}
        />
      )}
    </>
  );
}
