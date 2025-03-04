"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import services
import { getShopFeatures } from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";
import TrustBadgeCard from "./TrustBadgeCard";

// import custom components

export default function TrustBadgesSection() {
  // Router instance
  const router = useRouter();

  const [trustBadges, setTrustBadges] = useState<Feature[]>([]);

  // fetch all categories
  useEffect(() => {
    const fetchTrustBadges = async () => {
      const serverResponse = await getShopFeatures();

      if (serverResponse.status) setTrustBadges(serverResponse.features);
    };

    fetchTrustBadges();
  }, []);

  return (
    <>
      {/* Badges Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 my-8">
        {trustBadges.map((badge) => (
          <TrustBadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </>
  );
}
