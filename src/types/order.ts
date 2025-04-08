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
