import { getCasesForPage } from "@/lib/cases";
import { DatabaseError } from "../database-error";
import { AppNav } from "../nav";
import { CasesBrowser } from "./components/cases-browser";

export const dynamic = "force-dynamic";

export default async function AllCasesPage() {
  const { cases, databaseError } = await getCasesForPage();
  const pending = cases.filter((item) => item.status === "pending").length;
  const completed = cases.length - pending;
  const uniqueVehicles = new Set(cases.map((item) => item.registrationNumber)).size;

  return (
    <main className="shell">
      <AppNav />

      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Case control</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">All registered cases</h1>
      </div>

      {databaseError && <DatabaseError />}

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <Stat label="Total cases" value={cases.length} />
        <Stat label="Pending" value={pending} tone="text-amber-600" />
        <Stat label="Completed" value={completed} tone="text-emerald-600" />
        <Stat label="Vehicles" value={uniqueVehicles} tone="text-blue-600" />
      </div>

      <CasesBrowser cases={cases} />
    </main>
  );
}

function Stat({ label, value, tone = "text-zinc-950" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="soft-card p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className={`mt-2 text-2xl font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}
