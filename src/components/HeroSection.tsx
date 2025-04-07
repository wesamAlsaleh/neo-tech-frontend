"use client";

import React, { use, useEffect, useState } from "react";

// import types
import { SliderImage } from "@/types/slider-image";

// import services
import { getSliderImages } from "@/services/slider-services";

// import custom components
import ImageSlider from "@/components/ImageSlider";
import LoadingSpinner from "./LoadingSpinner";

export default function HeroSection() {
  // State to store slider images
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);

  // State to keep track of the loading
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch slider images from the server
  const fetchSliderImages = async () => {
    const response = await getSliderImages();

    if (response.status) {
      setSliderImages(response.sliderImages);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the slider images
      await fetchSliderImages();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, []);

  // loop through the slider images and create an array of image urls
  const imageUrlsArray = sliderImages.map((image) => image.url);

  // If loading, return a loading skeleton
  if (loading) {
    return <ImageSliderSkeleton />;
  }

  return <ImageSlider imageUrls={imageUrlsArray} />;
}

// Loading skeleton component
function ImageSliderSkeleton() {
  return (
    <div className="relative w-full mx-auto animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative h-[576px] w-[1280px] mx-auto bg-gray-200 rounded-lg">
        {/* This empty div serves as the skeleton for the image */}
      </div>

      {/* Pagination Dots Skeleton */}
      <div className="flex justify-center mt-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-1 w-10 mx-1 bg-gray-300 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
