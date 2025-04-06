export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string | null;
  role: string;
  phone_number: string;
  cart_items: Array<any>; // Replace with the actual type of cart items if available
  wishlist: Array<any>; // Replace with the actual type of wishlist items if available
  created_at: string;
  updated_at: string;
};

// Response from the server when a user is retrieved successfully
// {
//   "message": "User retrieved successfully",
//   "userData": {
//       "id": 1,
//       "first_name": "dev",
//       "last_name": "Wesam",
//       "email": "dev@d.com",
//       "email_verified_at": null,
//       "role": "admin",
//       "phone_number": "12345678",
//       "created_at": "2025-03-08T22:47:32.000000Z",
//       "updated_at": "2025-03-08T22:47:32.000000Z",
//       "cart_items": [],
//       "wishlist": [],
//   },
//   "userCartItemsCount": 1,
//   "userWishlistCount": 4
// }
