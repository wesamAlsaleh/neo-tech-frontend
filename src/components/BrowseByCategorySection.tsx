"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// import types
import { Category } from "@/types/category";

// import services
import { getAllCategories } from "@/services/categories-services";

// import custom components
import HomeComponentTitle from "@/components/HomeComponentTitle";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

export default function BrowseByCategorySection() {
  // Router instance
  const router = useRouter();

  // const state to store categories
  const [categories, setCategories] = useState<Category[]>([]);

  // State to store loading state
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // set loading to true
    setLoading(true);

    // fetch all categories from server
    const serverResponse = await getAllCategories();

    if (serverResponse.status) setCategories(serverResponse.categories);

    // set loading to false
    setLoading(false);
  };

  // fetch all categories
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* component info  */}
      <HomeComponentTitle title="Browse By Categories" subtitle="Categories" />

      {/* Categories Grid */}
      <div className="grid lg:grid-cols-10 md:grid-cols-5 sm:grid-cols-2 gap-4">
        {/* Loading state */}
        {loading && (
          <>
            {[...Array(10)].map((_, index) => {
              return <CategorySkeletonCard key={index} />;
            })}
          </>
        )}

        {/* No Data */}
        {!loading && categories.length === 0 && (
          <div className="col-span-10 flex items-center justify-center h-40 text-gray-500 font-medium">
            No Categories Found
          </div>
        )}

        {/* Data */}
        {!loading &&
          categories.map((category) => (
            // category card container (name + image)
            <Link
              key={category.id}
              href={`/products?categories=${category.category_slug}`}
            >
              <div
                key={category.id}
                className="border border-gray-300 w-44 h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-orange-400 transition-all"
              >
                <img
                  src={category.category_image_url!}
                  alt={category.category_slug}
                  width={50}
                  height={50}
                />
                <span className="mt-2 font-medium">
                  {category.category_name}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

// category skeleton card component
const CategorySkeletonCard = () => {
  return (
    <div className="border border-gray-200 w-44 h-40 rounded-lg flex flex-col items-center justify-center animate-pulse bg-gray-100">
      {/* Image Placeholder */}
      <div className="w-12 h-12 bg-gray-300 rounded-full mb-3" />

      {/* Text Placeholder */}
      <div className="h-4 w-24 bg-gray-300 rounded" />
    </div>
  );
};
