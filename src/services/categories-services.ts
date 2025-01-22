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
    // Get the cookies
    const cookieStore = await cookies();

    // Get the user cookie from the cookies
    const userToken = cookieStore.get("userToken")?.value;

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append the form data to the formDataToSend object
    formDataToSend.append(
      "category_name",
      formData.get("category_name") as string
    ); // Get the category name from the form data
    formDataToSend.append(
      "category_description",
      formData.get("category_description") as string
    ); // Get the category description from the form data

    // Check if the category image is available in the form data
    if (formData.get("category_image")) {
      formDataToSend.append(
        "category_image",
        formData.get("category_image") as Blob
      ); // Get the category image from the form data
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-category`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Return the response data
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      // TODO: change the error message to a more user-friendly message for the user
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while registering using handleRegisterSubmit",
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
