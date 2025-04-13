import { Product } from "./product";
import { User } from "./User";

export type Order = {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type OrderDetails = {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  user: User; // User object
  order_items: [
    {
      id: number;
      order_id: number;
      product_id: number;
      quantity: number;
      price: number;
      created_at: string;
      updated_at: string;
      product: Product;
    }
  ]; // Array of order items
};
