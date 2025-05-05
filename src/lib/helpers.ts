/**
 * Formats a given date string into "day/month/year hour:minute" format.
 *
 * @param date - The date string to format.
 * @returns The formatted date string in "DD/MM/YYYY HH:mm" format.
 */
export const formatDateTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures 12-hour time format
  };

  // Format the date string into "DD/MM/YYYY HH:mm" format
  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);

  // Replace slashes and remove comma
  return formattedDate.replace(/\//g, "/").replace(",", "");
};

/**
 * Converts a given price string to a formatted string in Bahraini Dinar (BHD).
 *
 * @param price - The price as a string to be converted.
 * @returns The formatted price string in BHD with three decimal places.
 */
export const convertPriceToBHD = (price: string) => {
  return `BD ${parseFloat(price).toFixed(3)}`;
};

/**
 * Converts a given percentage to a string representation with no decimal places and appends '% OFF'.
 *
 * @param percentage - The input percentage to be converted. It can be of any type.
 * @returns A string representing the percentage with '% OFF' appended, or null if the input is not a valid number.
 */
export const convertSalePercentage = (percentage: any) => {
  // Ensure that the input is a valid number before using .toFixed()
  const validPercentage = Number(percentage);
  if (isNaN(validPercentage)) {
    return null; // Return null if the input is not a valid number
  }
  return `- ${validPercentage.toFixed(0)}% OFF`; // Return the percentage as a string without decimal places
};

/**
 * @function getStatusColor - Get the status color based on the order status
 * @param status - The order
 * @returns {string} - The status color class
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 border border-yellow-400 text-yellow-700";
    // case "processing":
    // return "bg-blue-100 border border-blue-400 text-blue-700";
    case "completed":
      return "bg-green-100 border border-green-400 text-green-700";
    // case "delivered":
    // return "bg-green-100 border border-green-400 text-green-700";
    case "canceled":
      return "bg-red-100 border border-red-400 text-red-700";
    default:
      return "bg-gray-100 border border-gray-400 text-gray-700";
  }
};

/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified delay has elapsed since the last time it was invoked.
 *
 * @param fn - The function to debounce.
 * @param delay - The number of milliseconds to delay the function execution.
 * @returns A debounced version of the provided function.
 *
 * @example
 * ```typescript
 * const debouncedFunction = debounce(() => {
 *   console.log('Function executed!');
 * }, 300);
 *
 * debouncedFunction(); // Will execute after 300ms if not called again within that time.
 * ```
 */
export const debounce = (fn: Function, delay: number) => {
  // Set a timeout to delay the API call
  let timeoutId: NodeJS.Timeout;

  // Return the function that will be called after the delay
  return (...args: any[]) => {
    clearTimeout(timeoutId); // Clear the previous timeout if it exists
    timeoutId = setTimeout(() => fn(...args), delay); // Set a new timeout to call the function after the delay
  };
};
