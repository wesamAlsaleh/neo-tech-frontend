export type Category = {
  id: number;
  category_name: string;
  category_slug: string;
  category_description: string;
  category_image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  category_image_url?: string;
};

export type CategoryData = {
  category_name: string;
  category_description: string;
  category_image: File;
};
