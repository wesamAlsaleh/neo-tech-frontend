"use server";

// import Image from "next/image";

// import { getAllCategories } from "@/services/categories-services";
import { getAllCategories } from "@/services/categories-services";

export async function CategoryList() {
  // Fetch all categories
  const categoriesObj = await getAllCategories();

  // Extract the categories and message from the response
  const { message, categories } = categoriesObj;

  if (!categories || categories.length === 0) {
    return <p>{message}</p>;
  }

  return (
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
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id} className="hover:bg-gray-100 even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              {category.category_name}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {category.category_description}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={category.category_image_url!}
                alt={category.category_name}
              />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {category.is_active ? (
                <span className="text-green-600 font-medium">Active</span>
              ) : (
                <span className="text-red-600 font-medium">Inactive</span>
              )}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {new Date(category.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
