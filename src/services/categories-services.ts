"use server";

// Import axios for the API requests
import axios from "axios";

// Import the categories type
import type { Category } from "@/types/category";

// Get all categories from the API endpoint
export async function getAllCategories(
  AdminUserToken: string
): Promise<Category[]> {
  try {
    // Fetch the categories
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/categories`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${AdminUserToken}`,
        },
      }
    );

    // Extract the categories from the response
    const categories: Category[] = response.data.categories;

    // Return the categories
    return categories;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// successfull sample response from the API for the getAllCategories function
// {
//     "message": "Categories fetched successfully",
//     "categories": [
//         {
//             "id": 17,
//             "category_name": "Machine",
//             "category_slug": "machine",
//             "category_description": "laptop to machine",
//             "category_image": "678c64197fc25.png",
//             "is_active": 0,
//             "created_at": "2025-01-19T02:31:53.000000Z",
//             "updated_at": "2025-01-19T02:49:32.000000Z"
//         }
//     ]
// }
