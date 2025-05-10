// import types
import { Order } from "./order";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string | null;
  role: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  orders?: Order[]; // array of objects
  address?: UserAddress; // array of objects
};

export type UserAddress = {
  id: number;
  user_id: number;
  home_number: string;
  street_number: string;
  block_number: string;
  city: string;
  created_at: string;
  updated_at: string;
};
