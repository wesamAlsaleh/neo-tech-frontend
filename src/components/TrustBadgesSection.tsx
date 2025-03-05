"use client";

import React, { useEffect, useState } from "react";

// import services
import { getActiveShopFeatures } from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import TrustBadgeCard from "./TrustBadgeCard";

export default function TrustBadgesSection() {
  const [trustBadges, setTrustBadges] = useState<Feature[]>([]);

  // fetch all trust badges (3 or less badges only)
  useEffect(() => {
    const fetchTrustBadges = async () => {
      const serverResponse = await getActiveShopFeatures();

      if (serverResponse.status) setTrustBadges(serverResponse.features);
    };

    fetchTrustBadges();
  }, []);

  return (
    // Trust Badges Section Container
    <div className="container mx-auto px-4">
      {/* Badges Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1 my-8">
        {trustBadges.map((badge) => (
          <TrustBadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
