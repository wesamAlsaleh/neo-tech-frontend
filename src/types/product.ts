export type Product = {
  id: number;
  product_name: string;
  product_description: string | null;
  product_price: string;
  product_rating: number;
  product_stock: number;
  product_barcode: string;
  product_view: number;
  product_sold: number;
  slug: string;
  images: string[];
  is_active: boolean;
  category_id: number;
  onSale: boolean;
  discount: number;
  sale_start: string | null;
  sale_end: string | null;
  product_price_after_discount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SingleProduct = {
  id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  product_rating: number;
  product_stock: number;
  product_barcode: string;
  product_view: number;
  product_sold: number;
  slug: string;
  images: string[];
  is_active: boolean;
  category_id: {
    id: number;
    category_name: string;
    category_slug: string;
    category_description: string | null;
    category_image: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  onSale: boolean;
  discount: number;
  sale_start: string | null;
  sale_end: string | null;
  product_price_after_discount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// function to convert the product price to a number in BHD format with 3 decimal places and a currency symbol
export const convertPriceToBHD = (price: string) => {
  return `BD ${parseFloat(price).toFixed(3)}`;
};

// Function to convert the sale percentage to a number (e.g., 20.00 to 20%)
export const convertSalePercentage = (percentage: any) => {
  // Ensure that the input is a valid number before using .toFixed()
  const validPercentage = Number(percentage);
  if (isNaN(validPercentage)) {
    return null; // Return null if the input is not a valid number
  }
  return `${validPercentage.toFixed(0)}%`; // Return the percentage as a string without decimal places
};
