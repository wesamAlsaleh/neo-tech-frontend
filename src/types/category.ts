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

// {
//   "id": 38,
//   "category_name": "Laptop",
//   "category_slug": "laptop",
//   "category_description": "testing",
//   "category_image": "678d973602a96.png",
//   "is_active": 0,
//   "created_at": "2025-01-20T00:22:14.000000Z",
//   "updated_at": "2025-01-20T00:22:14.000000Z",
//   "category_image_url": "http://127.0.0.1:8000/storage/images/categories_images/678d973602a96.png"
// },

export type CategoryData = {
  category_name: string;
  category_description: string;
  category_image: File;
};
