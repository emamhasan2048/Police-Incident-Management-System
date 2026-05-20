import { AppNav } from "@/app/nav";
import { DriverViolationsClient } from "../components/driver-violations-client";

export const dynamic = "force-dynamic";

export default function DriverViolationsPage() {
  return (
    <main className="shell">
      <AppNav />
      <DriverViolationsClient />
    </main>
  );
}
