import { AppNav } from "@/app/nav";
import { DriverListClient } from "../components/driver-list-client";

export const dynamic = "force-dynamic";

export default function DriverListPage() {
  return (
    <main className="shell">
      <AppNav />

      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Drivers</p>
        <h1 className="text-2xl font-extrabold">Driver List</h1>
      </div>

      <DriverListClient />
    </main>
  );
}
