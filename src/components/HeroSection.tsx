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

  // Fetch slider images from the server
  useEffect(() => {
    try {
      // Fetch the user
      const fetchSliderImages = async () => {
        const response = await getSliderImages();

        if (response.status) {
          setSliderImages(response.sliderImages);
        }
      };

      fetchSliderImages();
    } finally {
      setLoading(false);
    }
  }, []);

  // loop through the slider images and create an array of image urls
  const imageUrlsArray = sliderImages.map((image) => image.url);

  // If loading, return a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return <ImageSlider imageUrls={imageUrlsArray} />;
}
