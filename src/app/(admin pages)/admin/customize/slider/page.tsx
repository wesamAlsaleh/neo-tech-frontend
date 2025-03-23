import React from "react";

// Import Components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Separator from "@/components/Separator";

export default function page() {
  return (
    <>
      <PageTitle
        title="Image Slider"
        subtitle="Manage the images that appear on the homepage slider"
        actionButton={
          <ActionButton
            href="/admin/customize"
            text="Back"
            buttonTitle="Go back to Customize NeoTech Shop"
            color="white"
            textColor="black"
          />
        }
      />

      {/* Active Images Grid */}

      {/* Separator */}
      <Separator width="w-1/2" thickness="border-t-2" center />

      {/* All Images List */}
    </>
  );
}
