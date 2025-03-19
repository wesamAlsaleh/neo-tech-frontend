"use client";

import React, { Suspense, useEffect, useState } from "react";

// import types
import { Category } from "@/types/category";

// import services
import { getAllCategories } from "@/services/categories-services";

// import custom components

export default function HeroSection() {
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
      {/* categories */}
      <Suspense fallback={<div>Loading...</div>}>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.category_name}</li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
