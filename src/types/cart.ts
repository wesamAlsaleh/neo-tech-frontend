import { Product } from "./product";

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price: number;
  is_checked_out: boolean;
  created_at: string;
  updated_at: string;
};

export type cartIndexResponse = {
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
};
