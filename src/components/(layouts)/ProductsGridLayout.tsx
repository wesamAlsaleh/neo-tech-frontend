import React from "react";

// import types
import { Product } from "@/types/product";

// import custom components
import ProductCard from "../ProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton";

interface LayoutProps {
  products: Product[]; // Replace 'any' with the actual type of your products
  gridConfig?: {
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4 | 5;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  }; // Optional grid configuration for responsive design
  cardWidth?: string; // Optional prop to control card width
  className?: string; // Optional className prop for additional styling
  isLoading?: boolean; // Optional loading state
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
    isLoading = false,
  } = props;

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
    <div className={`${baseStyle}  ${gridClasses} ${cardWidthClass}`}>
      {/* Handle Loading State */}
      {isLoading && (
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </>
      )}

      {/* Handle No Date */}
      {products.length === 0 && !isLoading && (
        <div className="col-span-full text-center text-gray-500">
          No products available
        </div>
      )}

      {/* Handle Data */}
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
