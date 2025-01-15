import { redirect } from "next/navigation";

export default function root() {
  return redirect("/home"); // redirect to the home page
}
