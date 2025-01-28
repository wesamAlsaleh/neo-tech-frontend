import { redirect } from "next/navigation";
import React from "react";

export default function page() {
  //   Redirect to dashboard
  return redirect("/admin/dashboard");
}
