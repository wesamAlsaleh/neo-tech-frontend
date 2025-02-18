export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) {
  // close the modal if it's not open
  if (!isOpen) return null;

  return (
    // Modal Container
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Name */}
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>

        {/* Product Name container*/}
        <p className="mt-2 text-gray-600">
          Are you sure you want to delete <strong>{name}</strong>?
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

          {/* Delete Button */}
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
