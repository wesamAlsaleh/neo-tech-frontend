"use client";

import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

// Import types
import { FlashSale } from "@/types/sale";
import { Product } from "@/types/product";

// import helper functions
import {
  convertPriceToBHD,
  convertSalePercentage,
  formatDateTime,
} from "@/lib/helpers";

// import server functions
import { getFlashSale } from "@/services/sale-services";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  // Router instance
  const router = useRouter();

  const [flashSale, setFlashSale] = useState<FlashSale>(); // Flash sale state
  const [loading, setLoading] = useState(true); // Loading state

  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // Server response state

  // set the params to be used in the useEffect
  const resolvedParams = use(params);

  // Fetch the product by slug on component mount
  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        // Get the product by slug using the unwrapped params
        const id = resolvedParams.id;

        // If the slug is not found, redirect to 404 page
        if (!id) {
          router.push("/404");
          return;
        }

        // Fetch the product from the server
        const serverResponse = await getFlashSale(id);

        // If the server response status is false, redirect to 404 page
        if (!serverResponse.status) {
          router.push("/404");
          return;
        }

        // Update the UI with the fetched product
        setServerResponse({
          status: serverResponse.status,
          message: serverResponse.message!,
        });

        // Set the sale details
        setFlashSale(serverResponse.flashSale);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [resolvedParams, router]); // Re-run the effect when the id changes or the router changes or initial mount

  // If loading display loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle
        title={flashSale?.name || "Loading Name..."}
        subtitle={flashSale?.description || "Loading Description..."}
        actionButton={
          <ActionButton text="Back" href="/admin/customize/sales" />
        }
      />

      {/* Details Card */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Details</h2>

        <div className="flex flex-col gap-1">
          {/* Name container */}
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {flashSale?.name || "Loading Name..."}
          </div>

          {/* Description container */}
          <div>
            <span className="font-semibold">Description:</span>{" "}
            {flashSale?.description || "Loading Description..."}
          </div>

          {/* Start Date container */}
          <div>
            <span className="font-semibold">Start Date:</span>{" "}
            {formatDateTime(flashSale?.start_date!) || "Loading Start Date..."}
          </div>

          {/* End Date container  */}
          <div>
            <span className="font-semibold">End Date:</span>{" "}
            {formatDateTime(flashSale?.end_date!) || "Loading End Date..."}
          </div>

          {/* products container */}
          <div>
            <span className="font-semibold">Products:</span>
            {/* Products grid */}
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4">
              {flashSale?.products.map((product: Product) => (
                // Product card container
                <div
                  key={product.id}
                  className="bg-white shadow-md rounded-md p-4"
                >
                  {/* Product Name & checkbox container */}
                  <div className="flex justify-between items-center">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold">
                      {product.product_name}
                    </h3>
                  </div>

                  {/* Product details container */}
                  <div className="space-y-1 mt-0.5">
                    {/* Discount details container */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sale Details
                      </span>
                      <span className="text-sm text-gray-600">
                        {convertSalePercentage(product.discount)}
                      </span>
                    </div>

                    {/* Price after discount container  */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Product Price
                      </span>
                      <span className="text-sm text-gray-600">
                        {convertPriceToBHD(
                          product.product_price_after_discount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
