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
//       "updated_at": "2025-03-08T22:47:32.000000Z"
//   },
//   "userCartItemsCount": 2,
//   "userWishlistCount": 1,
//   "userAddress": {
//       "id": 1,
//       "user_id": 1,
//       "home_number": "456",
//       "street_number": "1709",
//       "block_number": "316",
//       "city": "Sitra",
//       "created_at": "2025-04-07T15:57:03.000000Z",
//       "updated_at": "2025-04-07T15:57:03.000000Z"
//   }
// }
