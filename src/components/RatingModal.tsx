import React, { useState } from "react";

// Importing the icons from the public directory
import { icons } from "../../public/icons";

// import backend services
import { putRating } from "@/services/products-services";

interface RatingModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export default function RatingModal({
  productId,
  isOpen,
  onClose,
  onSuccess,
  onError,
}: RatingModalProps) {
  // State to manage the rating value
  const [rating, setRating] = useState<number>(0);

  // State to manage the hovered rating value
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // State to manage the submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // If the modal is not open, return null
  if (!isOpen) return null;

  // Function to handle the submission of the rating
  const handleSubmit = async () => {
    // Check if the rating is valid (greater than 0)
    if (rating === 0) return;

    // Set the submission status to true
    setIsSubmitting(true);

    try {
      // Call the backend service to submit the rating
      const response = await putRating(productId, rating);

      // Update the UI based on the server response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // If the response is successful, call the onClose callback
      if (response.status) {
        onClose();
      }
    } finally {
      // Reset the submission status
      setIsSubmitting(false);
    }
  };

  return (
    // Modal Layout
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Container (Body) */}
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        {/* Header Container */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rate This Product</h2>
        </div>

        {/* 5 Start Container */}
        <div className="flex justify-center my-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="mx-1 focus:outline-none"
              aria-label={`${star} stars`}
            >
              <img src={icons.fullStar96.src} alt={`${star} stars`}></img>
            </button>
          ))}
        </div>

        {/* Rating Message For Client */}
        <div className="text-center mb-4">
          {rating > 0 && (
            <p className="text-gray-600">
              You selected {rating} star{rating !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Action Buttons Container */}
        <div className="flex justify-end gap-2">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`
          px-4 py-2 rounded-md text-white
          ${
            rating === 0
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }
        `}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
