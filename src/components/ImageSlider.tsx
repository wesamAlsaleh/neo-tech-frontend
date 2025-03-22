import React, { useState, useEffect } from "react";
import Image from "next/image";

// [
// 'http://127.0.0.1:8000/storage/images/slider_images/New_slider_updated_successfully.jpg',
//  'http://127.0.0.1:8000/storage/images/slider_images/New_slider.jpg',
//  'http://127.0.0.1:8000/storage/images/slider_images/featured.jpg'
// ]

// Interface for ImageSlider props
interface Props {
  imageUrls: string[];
}

export default function ImageSlider(props: Props) {
  // Loop through the imageUrls array and create an array of image data
  const images = props.imageUrls.map((url) => ({
    src: url,
  }));

  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // State to determine if the image is being hovered over
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Function to show the previous slide
  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Function to show the next slide
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // useEffect hook to handle automatic slide transition
  useEffect(() => {
    // If not hovered, show the next slide every 3 seconds
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      // Cleanup the interval on component unmount
      return () => {
        clearInterval(interval);
      };
    }
  }, [isHovered]);

  // Handle mouse over event to pause the automatic slide transition
  const handleMouseOver = (): void => {
    setIsHovered(true);
  };

  // Handle mouse leave event to resume the automatic slide transition
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  // If there are no images, display a message
  if (images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    // Image slider container
    <div className="relative w-full mx-auto mt-4">
      {/* Image Container */}
      <div
        className="relative h-[460px] mx-12 group hover:-translate-y-2"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={images[currentIndex].src}
          alt={`Slider Image ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-xl transition-all duration-500 ease-in-out cursor-pointer"
        />
      </div>

      {/* Previous button */}
      <button
        className="absolute left-0 top-1/2 transform h-[459px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
        onClick={prevSlide}
      >
        l
      </button>

      {/* Next button */}
      <button
        className="absolute right-0 top-1/2 transform h-[459px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
        onClick={nextSlide}
      >
        r
      </button>

      {/* Image slider pagination */}
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${
              index === currentIndex
                ? "bg-orange-500 rounded-xl"
                : "bg-gray-300 rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
}
