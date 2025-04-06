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
