"use client";

import React, { useEffect, useState } from "react";

// Import custom components
import NavBar from "@/components/NavBar";

// Services import
import { getProducts } from "@/services/products-services";
import { getAllCategories } from "@/services/categories-services";

// import types
import { Products } from "@/types/product";
import { Categories } from "@/types/category";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

export default function homePage() {
  // data state
  const [categories, setCategories] = useState<Categories[]>([]);
  const [products, setProducts] = useState<Products[]>([]);

  // loading state
  const [loading, setLoading] = useState<boolean>(true);

  // UI messages states
  const [categoryMessage, setCategoryMessage] = useState<string>("");
  const [productMessage, setProductMessage] = useState<string>("");

  // TODO: Add loading page

  return (
    <>
      <div>
        <h1>hello world</h1>
      </div>
    </>
  );
}
