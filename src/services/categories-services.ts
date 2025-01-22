"use server";

// Import axios for the API requests
import axios from "axios";

// Import the categories type
import type { Category } from "@/types/category";

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
