import { AppNav } from "@/app/nav";
import { DriverDetailsClient } from "../components/driver-details-client";

export const dynamic = "force-dynamic";

export default function DriverDetailsPage() {
  return (
    <main className="shell">
      <AppNav />
      <DriverDetailsClient />
    </main>
  );
}
