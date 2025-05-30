// This is used for the product type
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

// This is used for the product fetching with all details
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
