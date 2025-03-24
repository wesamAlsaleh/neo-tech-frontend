export type FlashSale = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  products: []; // Array of IDs as strings
  created_at: string;
  updated_at: string;
};
