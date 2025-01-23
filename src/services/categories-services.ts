"use server";

// Import axios for the API requests
import axios from "axios";

// Import the categories type
import type { Category, CategoryData } from "@/types/category";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

// Get all categories from the API endpoint
export async function getAllCategories() {
  try {
    // Fetch the categories
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Extract the categories from the response
    const categories: Category[] = response.data.categories;

    // Return the categories
    return {
      message: "Categories fetched successfully",
      categories,
    };
  } catch (error) {
    return {
      message: "An error occurred while fetching the categories from the API",
      categories: [],
    };
  }
}

// successfull sample response from the API for the getAllCategories function
// {
//     "message": "Categories fetched successfully",
//     "categories": [
//   {
//     "id": 38,
//     "category_name": "Laptop",
//     "category_slug": "laptop",
//     "category_description": "testing",
//     "category_image": "678d973602a96.png",
//     "is_active": 0,
//     "created_at": "2025-01-20T00:22:14.000000Z",
//     "updated_at": "2025-01-20T00:22:14.000000Z",
//     "category_image_url": "http://127.0.0.1:8000/storage/images/categories_images/678d973602a96.png"
// },

// Add a new category to the API
export async function handleCreateCategorySubmit(
  prevState: any,
  formData: FormData
) {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token exists
    if (!userToken) {
      throw new Error("Authentication required. Please log in.");
    }

    // API call to create category
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-category`,
      formData, // Send the FormData directly
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Return success message
    return {
      success: true,
      message: response.data.message || "Category created successfully!",
      error: null,
    };
  } catch (error: any) {
    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while creating the category.",
      error: error.response?.data?.errorMessage || error.message,
    };
  }
}

// Response from the server when a category is created successfully
// {
//   "message": "Machine category created successfully"
// }

// Response from the server when a category is not created successfully
// {
//   "message": "An error occurred while creating the category. Please try again later.",
//   "errorMessage": "SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'machine' for key 'categories_category_slug_unique' (Connection: mysql, SQL: insert into `categories` (`category_name`, `category_slug`, `category_description`, `category_image`, `updated_at`, `created_at`) values (Machine, machine, Machine Section with Laptop image, ?, 2025-01-22 01:37:04, 2025-01-22 01:37:04))"
// }

// Toggle the category status
export async function toggleCategoryStatusById(categoryId: number) {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token exists
    if (!userToken) {
      throw new Error("Authentication required. Please log in.");
    }

    // API call to toggle category status
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-category-status/${categoryId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Return success message
    return {
      success: true,
      message: response.data.message || "Category status updated successfully!",
    };
  } catch (error: any) {
    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while updating the category status.",
    };
  }
}

// Response from the server when a category status is updated successfully
// {
//   "message": "TESTo2 is active"
// }

// Response from the server when a category status is not updated successfully
