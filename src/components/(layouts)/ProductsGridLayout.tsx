import React from "react";

// import types
import { Product } from "@/types/product";

// import custom components
import ProductCard from "../ProductCard";

interface LayoutProps {
  products: Product[]; // Replace 'any' with the actual type of your products
  gridConfig?: {
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4 | 5;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  }; // Optional grid configuration for responsive design
  cardWidth?: string; // Optional prop to control card width
  className?: string; // Optional className prop for additional styling
}

export default function ProductsGridLayout(props: LayoutProps) {
  // Destructure props
  const {
    products,
    className,
    gridConfig = {
      sm: 2,
      md: 4,
      lg: 8,
    }, // Default grid configuration
    cardWidth,
  } = props;

  // Check if products are empty and return a message if so
  if (products.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">No products available</div>
    );
  }

  // Base Style for the grid layout
  const baseStyle = `grid gap-3`;

  // Generate appropriate grid classes based on props
  const gridClasses = `
    ${`lg:grid-cols-${gridConfig.lg}`}
    ${`md:grid-cols-${gridConfig.md}`}
    ${`sm:grid-cols-${gridConfig.sm}`}
  `;

  // If cardWidth is provided, add it to the grid classes
  const cardWidthClass = cardWidth ? `w-${cardWidth}` : "w-full";

  return (
    <div
      className={`${baseStyle} ${className} ${gridClasses} ${cardWidthClass}`}
    >
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
