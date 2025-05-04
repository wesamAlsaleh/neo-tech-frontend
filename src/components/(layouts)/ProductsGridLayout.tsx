import React from "react";

// import types
import { Product } from "@/types/product";

// import custom components
import ProductCard from "../ProductCard";

interface LayoutProps {
  products: Product[]; // Replace 'any' with the actual type of your products
  gridOnLargeScreen?: number; // Optional prop to control grid layout on large screens
  gridOnMediumScreen?: number; // Optional prop to control grid layout on medium screens
  gridOnSmallScreen?: number; // Optional prop to control grid layout on small screens
  cardWidth?: string; // Optional prop to control card width
  className?: string; // Optional className prop for additional styling
}

export default function ProductsGridLayout(props: LayoutProps) {
  // Destructure props
  const {
    products,
    className,
    gridOnLargeScreen,
    gridOnMediumScreen,
    gridOnSmallScreen,
    cardWidth,
  } = props;

  // Check if products are empty and return a message if so
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        gridOnLargeScreen
          ? `lg:grid-cols-${gridOnLargeScreen}`
          : "lg:grid-cols-8"
      } ${
        gridOnMediumScreen
          ? `md:grid-cols-${gridOnLargeScreen}`
          : "md:grid-cols-4"
      } ${
        gridOnSmallScreen
          ? `sm:grid-cols-${gridOnLargeScreen}`
          : "sm:grid-cols-2"
      } gap-3 ${cardWidth ? `cardWidth` : "w-full"} ${className}`}
    >
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
