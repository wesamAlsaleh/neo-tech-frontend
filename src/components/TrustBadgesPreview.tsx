"use client";

import React, { useEffect, useState } from "react";

// import services
import { getActiveShopFeatures } from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components
import TrustBadgesSection from "./TrustBadgesSection";

export default function TrustBadgesPreview() {
  return <TrustBadgesSection />;
}
