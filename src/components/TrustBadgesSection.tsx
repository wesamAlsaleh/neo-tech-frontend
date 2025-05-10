"use client";

import React, { useEffect, useState } from "react";

// import services
import { getActiveShopFeatures } from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import TrustBadgeCard from "./TrustBadgeCard";
import LoadingSpinner from "./LoadingSpinner";

export default function TrustBadgesSection() {
  // State to hold trust badges
  const [trustBadges, setTrustBadges] = useState<Feature[]>([]);

  // State to hold loading state
  const [loading, setLoading] = useState(true);

  // Function to fetch trust badges from the server
  const fetchTrustBadges = async () => {
    // Set loading to true while fetching data
    setLoading(true);

    // Fetch trust badges from the server
    const serverResponse = await getActiveShopFeatures();

    // Check if the response is successful and has features
    if (serverResponse.status) setTrustBadges(serverResponse.features);
    else setTrustBadges([]); // Set trust badges to empty array if no features found

    // Set loading to false after fetching data
    setLoading(false);
  };

  // fetch all trust badges (3 or less badges only)
  useEffect(() => {
    const fetchData = async () => {
      await fetchTrustBadges();
    };

    fetchData();
  }, []);

  // If loading, return a loading spinner or skeleton (optional)
  if (loading) {
    return <LoadingSpinner />; // You can replace this with a skeleton or loading component
  }

  return (
    // Trust Badges Section Container
    <div className="container mx-auto px-4">
      {/* Badges Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1 my-8">
        {/* If empty return nothing  */}
        {trustBadges.length === 0 && null}

        {/* Map through trust badges */}
        {trustBadges.map((badge) => (
          <TrustBadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
