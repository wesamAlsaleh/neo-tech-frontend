"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";

// import types
import { SingleProduct } from "@/types/product";

// import services
import { searchProductBySlug } from "@/services/products-services";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/PageBreadcrumb";

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  // Router instance
  const router = useRouter();

  const [product, setProduct] = useState<SingleProduct>(); // Product state

  // set the params to be used in the useEffect
  const resolvedParams = use(params);

  // Fetch the product by slug on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get the product by slug using the unwrapped params
        const slug = resolvedParams.slug;

        // Fetch the product from the server
        const serverResponse = await searchProductBySlug(slug);

        // If the server response status is false, redirect to 404 page
        if (!serverResponse.status) {
          router.push("/404");
          return;
        }

        // Set the product state
        setProduct(serverResponse.product);
      } catch (error) {
        console.log("client error");

        // Redirect to 404 page if there is an error
        router.push("/404");
      }
    };

    fetchProduct();
  }, [resolvedParams, router]);

  // If the product is not found, show the product not found message
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.push("/home")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        {/* Breadcrumb */}
        <Breadcrumb
          firstTitle={product.category_id.category_name}
          firstLink={`/categories/${product.category_id.category_slug}`}
          secondTitle={product.product_name}
          secondLink={`/products/${product.slug}`}
        />

        {/* Product Card */}
        <ProductCard product={product} />
      </Suspense>
    </>
  );
};

export default ProductPage;
