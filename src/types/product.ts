export type Products = {
  id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  product_rating: number;
  slug: string;
  images: string[];
  is_active: boolean;
  in_stock: boolean;
  category_id: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  product_name: string;
  product_description: string;
  product_price: string;
  product_rating: number;
  slug: string;
  images: string[];
  is_active: boolean;
  in_stock: boolean;
  category_id: number;
  created_at: string;
  updated_at: string;
};

// {
//     "id": 4,
//     "product_name": "Product 1",
//     "product_description": "s",
//     "product_price": "1.20",
//     "product_rating": 1,
//     "slug": "product-1",
//     "images": [
//         "http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg"
//     ],
//     "is_active": false,
//     "in_stock": false,
//     "category_id": 1,
//     "created_at": "2025-01-27T17:53:59.000000Z",
//     "updated_at": "2025-01-27T17:53:59.000000Z"
// },

// OR

// [
//     {
//         "id": 8,
//         "product_name": "Iphone 10",
//         "product_description": "Operating System: IOS",
//         "product_price": "430.20",
//         "product_rating": 4,
//         "slug": "iphone-10",
//         "images": [
//             "http://127.0.0.1:8000/storage/images/products_images/6798c7331ed16.jpg"
//         ],
//         "is_active": false,
//         "in_stock": false,
//         "category_id": 2,
//         "created_at": "2025-01-28T12:01:55.000000Z",
//         "updated_at": "2025-01-28T12:01:55.000000Z"
//     }
// ]
