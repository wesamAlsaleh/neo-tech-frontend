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

    // Return the categories
    return {
      status: "success",
      message: "Categories fetched successfully",
      categories: response.data.categories,
    };
  } catch (error: any) {
    // Log and return the error
    console.error("Categories fetch error:", error);

    return {
      status: "error",
      message:
        error.response?.data?.message ||
        "An error occurred while fetching categories",
      categories: [],
    };
  }
}

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
      console.error("Token not found in cookies");
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
    // Log the error
    console.error("Create category error:", error);

    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while creating the category.",
      error: error.response?.data?.errors || error.message,
    };
  }
}

// Toggle the category status
export async function toggleCategoryStatusById(categoryId: number) {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token exists
    if (!userToken) {
      console.error("Token not found in cookies");
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
    // Log the error
    console.error("Toggle category status error:", error);

    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while updating the category status.",
    };
  }
}

// Delete a category by ID
export async function deleteCategoryById(categoryId: number) {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token exists
    if (!userToken) {
      console.error("Token not found in cookies");
    }

    // API call to toggle category status
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-category/${categoryId}`,
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
      message: response.data.message || "Category deleted successfully!",
    };
  } catch (error: any) {
    // Log the error
    console.error("Delete category error:", error);

    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while deleting the category.",
    };
  }
}

// Handle the category update form submission
export async function handleUpdateCategorySubmit(
  categoryId: number,
  formData: FormData
) {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token exists
    if (!userToken) {
      console.error("Token not found in cookies");
    }

    // API call to update category
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-category/${categoryId}`,
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
      message: response.data.message || "Category updated successfully!",
    };
  } catch (error: any) {
    // Log the error
    console.error("Update category error:", error);

    // Parse error and return a user-friendly response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while updating the category.",
    };
  }
}
