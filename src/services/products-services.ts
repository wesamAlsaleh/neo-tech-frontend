// import axios to make http requests
import axios from "axios";

// import response type
import { Products } from "@/types/product";

/**
 * @function getProducts to get all products
 */
export const getProducts = async () => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products`
    );

    if (response.status !== 200) {
      return "Error fetching products 😕";
    }

    // return the data from the response which is an array of products
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
