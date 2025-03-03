"use client";

import React, { Suspense, useEffect, useState } from "react";

// import types
import { Category } from "@/types/category";

// import services
import { getAllCategories } from "@/services/categories-services";

// import custom components
import HomeComponentTitle from "@/components/HomeComponentTitle";
import { useRouter } from "next/navigation";

export default function BrowseByCategorySection() {
  // Router instance
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  // fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const serverResponse = await getAllCategories();

      if (serverResponse.status) setCategories(serverResponse.categories);
    };

    fetchCategories();
  }, []);
  return (
    <div className="mb-4">
      {/* component info  */}
      <HomeComponentTitle title="Browse By Categories" subtitle="Categories" />

      {/* Categories Grid */}
      <div className="flex flex-wrap justify-start gap-4">
        {categories.map((category) => (
          // category card container (name + image)
          <div
            key={category.id}
            className="border border-gray-300 w-44 h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-orange-400 transition-all"
          >
            <img
              src={category.category_image_url!}
              alt={category.category_slug}
              width={50}
              height={50}
              onClick={() =>
                router.push(`/categories/${category.category_slug}`)
              }
            />
            <span className="mt-2 font-medium">{category.category_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
