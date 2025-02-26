export type Products = {
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
  category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type Product = {
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
  category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
