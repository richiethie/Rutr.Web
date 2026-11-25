import { redirect } from "next/navigation";

/** Staff product entry — console opens on Jobs. */
export default function HomePage() {
  redirect("/jobs");
}
