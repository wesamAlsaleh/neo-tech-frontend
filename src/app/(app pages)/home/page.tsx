"use server";

import React from "react";

// import cookies from "next/cookies";
import { cookies } from "next/headers";

// Import custom components
import NavBar from "@/components/NavBar";

// Import the Categories function
import { getAllCategories } from "@/services/categories-services";

export default async function homePage() {
  // Get the user token from the cookies
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userToken")?.value;

  // Get all categories from the API
  const FetchCategories = await getAllCategories(userToken!);

  // Get the categories from the response
  const categories = FetchCategories.categories;

  return (
    <>
      {/* Navigation Bar */}
      <NavBar />

      {/* Main content */}
      <div>
        <h1 className="text-4xl font-bold text-center mt-10">
          All categories on neoTech
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center mt-10">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md gap-4 flex flex-col items-center mx-4 my-4"
            >
              <img
                src={category.category_image_url}
                alt={category.category_name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold mt-2">
                {category.category_name} Category
              </h2>
              <p className="text-gray-500 mt-2">
                {category.category_description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center mt-4 text-gray-500">
          The best tech shop in the world
        </p>
      </div>
    </>
  );
}
