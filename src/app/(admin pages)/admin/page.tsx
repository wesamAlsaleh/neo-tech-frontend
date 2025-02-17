"use client";

import { useRouter } from "next/navigation";

export default function page() {
  // Router instance
  const router = useRouter();

  // Redirect to dashboard
  router.push("/admin/dashboard");
}
