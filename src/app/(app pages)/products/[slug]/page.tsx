"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";

// import types
import { Product, SingleProduct } from "@/types/product";

// import services
import { searchProductBySlug } from "@/services/products-services";

// import icons
import { icons } from "../../../../../public/icons";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductDetailsSection from "@/components/ProductDetailsSection";
import Breadcrumb from "@/components/PageBreadcrumb";
import Button from "@/components/Button";
import EditProductModal from "@/components/EditProductModal";

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  // Router instance
  const router = useRouter();

  const [product, setProduct] = useState<SingleProduct>(); // Product state
  const [loading, setLoading] = useState(true); // Loading state

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [selectedProduct, setSelectedProduct] = useState<Product>(); // Selected product state

  // set the params to be used in the useEffect
  const resolvedParams = use(params);

  const fetchProduct = async () => {
    try {
      // Get the product by slug using the unwrapped params
      const slug = resolvedParams.slug;

      // If the slug is not found, redirect to 404 page
      if (!slug) {
        router.push("/404");
        return;
      }

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
    } finally {
      setLoading(false);
    }
  };

  // Fetch the product by slug on component mount
  useEffect(() => {
    fetchProduct();
  }, [resolvedParams, router]);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If the product is not found, show the product not found message
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          onClick={() => router.push("/home")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        {/* Breadcrumb */}
        <Breadcrumb
          firstTitle={product.category_id.category_name}
          firstLink={`/categories/${product.category_id.category_slug}`}
          secondTitle={product.product_name}
          secondLink={`/products/${product.slug}`}
          secondTitleCN="text-black font-semibold"
        />

        <Button
          text="Edit Product"
          onClick={() => {
            setSelectedProduct({
              id: product.id,
              product_name: product.product_name,
              product_description: product.product_description,
              product_price: product.product_price,
              product_rating: product.product_rating,
              product_stock: product.product_stock,
              product_barcode: product.product_barcode,
              product_view: product.product_view,
              product_sold: product.product_sold,
              slug: product.slug,
              images: product.images,
              is_active: product.is_active,
              category_id: product.category_id.id,
              onSale: product.onSale,
              discount: product.discount,
              sale_start: product.sale_start,
              sale_end: product.sale_end,
              product_price_after_discount:
                product.product_price_after_discount,
              created_at: product.created_at,
              updated_at: product.updated_at,
              deleted_at: product.deleted_at,
            }); // Set the selected product for editing
            setIsEditModalOpen(true); // Open the edit modal
          }}
          iconSrc={icons.edit100.src}
          iconSize={24}
        />
      </div>

      {/* Product Card */}
      <ProductDetailsSection product={product} />

      {/* Edit Modal */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(undefined);
          fetchProduct(); // Refresh data after edit modal closes
        }}
      />
    </>
  );
};

export default ProductPage;
