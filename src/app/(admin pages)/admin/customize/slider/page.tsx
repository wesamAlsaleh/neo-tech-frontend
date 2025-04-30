"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Import Components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Separator from "@/components/Separator";
import SliderImagesList from "@/components/SliderImagesList";
import Button from "@/components/Button";

export default function page() {
  // Router Instance
  const router = useRouter();

  return (
    <>
      <PageTitle
        title="Image Slider"
        subtitle="Manage the images that appear on the homepage slider"
        actionButton={
          <Button
            text="Add Slider Image"
            onClick={() => {
              router.push("/admin/customize/slider/create-slider-image");
              window.scrollTo({ top: 0, behavior: "smooth" }); // 'smooth' or 'auto'
            }}
          />
        }
      />

      {/* All Images List */}
      <SliderImagesList />
    </>
  );
}
