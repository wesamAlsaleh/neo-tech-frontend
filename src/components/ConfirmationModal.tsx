import { JSX, useEffect } from "react";

/**
 * A modal component that displays a confirmation dialog with customizable title, subtitle, and optional strong text.
 * The modal can be closed by clicking outside, pressing the ESC key, or clicking the cancel button.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {() => void} props.onClose - Function to call when the modal is closed.
 * @param {() => void} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {string} props.title - The title text of the modal.
 * @param {string} props.subTitle - The subtitle text of the modal.
 * @param {string} [props.strongText] - Optional strong text to emphasize in the subtitle.
 *
 * @returns {JSX.Element | null} The rendered modal component or null if not open.
 */
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subTitle,
  strongText,
  buttonName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subTitle: string;
  strongText?: string;
  buttonName: string;
}): JSX.Element | null {
  // Close modal on ESC key press
  useEffect(() => {
    // Handle key down event to close the modal when ESC key is pressed
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close the modal if the ESC key is pressed
      if (event.key === "Escape") onClose();
    };

    // If the modal is open, add the event listener
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close the modal if it's not open
  if (!isOpen) return null;

  return (
    // Modal Container
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close when clicking outside
    >
      {/* Modal Content */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Modal Title */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Modal Description */}
        <p className="mt-2 text-gray-600">
          {subTitle} {strongText && <strong>{strongText}</strong>}
        </p>

        {/* Buttons Container */}
        <div className="mt-4 flex justify-end gap-2">
          {/* Cancel Button */}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          {/* Action Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
}
