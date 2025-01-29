import React, { useState, ChangeEvent, useEffect } from "react";

// image upload interface for file and url
interface ImageFile {
  file: File;
  url: string;
}

// ProductImageUpload component props interface
interface ProductImageUploadProps {
  onChange: (files: FileList) => void;
  required?: boolean;
}

export default function ProductImageUpload({
  onChange,
  required = true,
}: ProductImageUploadProps) {
  // state for selected images
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);

  // state for error message
  const [error, setError] = useState<string>("");

  //   function to handle image change
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // If no files selected, return
    if (!files) return;

    // Convert FileList to array e.g. [File, File, File]
    const fileArray = Array.from(files);

    // If no files selected, return an error message
    if (fileArray.length === 0) {
      setError("Please select at least one image");
      return;
    }

    // If more than 4 files selected, return an error message
    if (fileArray.length > 4) {
      setError("You can only upload up to 4 images");
      return;
    }

    // Validate file types (only images allowed)
    const invalidFiles = fileArray.filter(
      (file) => !file.type.startsWith("image/")
    );

    // If any invalid files found, return an error message
    if (invalidFiles.length > 0) {
      setError("Please upload only image files");
      return;
    }

    // Clear any previous errors if no errors found
    setError("");

    // Create preview URLs e.g. [ { file: File, url: 'blob:http://localhost:3000/1234' }, ... ]
    const imageUrls: ImageFile[] = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Set the selected images
    setSelectedImages(imageUrls);

    // Pass the FileList to the parent component, which is the AddProductForm component
    onChange(files);
  };

  // Function to remove an image from the selected images
  const removeImage = (index: number): void => {
    // Remove the image from the selected images
    setSelectedImages((prev) => {
      // Create a new array from the previous state
      const newImages = [...prev];

      // Revoke the URL to prevent memory leaks (e.g. blob:http://localhost:3000/1234)
      URL.revokeObjectURL(newImages[index].url);

      // Remove the image from the array e.g. [1, 2, 3] => [1, 3]
      newImages.splice(index, 1);

      // Create new FileList from remaining files
      const remainingFiles = newImages.map((img) => img.file);

      // Create a new DataTransfer object
      const dt = new DataTransfer();

      // Add the remaining files to the DataTransfer object
      remainingFiles.forEach((file) => dt.items.add(file));

      // Pass the new FileList to the parent component
      onChange(dt.files);

      // Return the new images array
      return newImages;
    });
  };

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Revoke the URLs to prevent memory leaks
      selectedImages.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="product_images"
          className="block text-sm font-medium text-gray-700"
        >
          Product Images (1-4 images)*
        </label>

        <input
          type="file"
          id="product_images"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          required={required}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>
      )}

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
