import Link from "next/link";
import { DatabaseError } from "@/app/database-error";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/page-shell";
import { getCasesForPage } from "@/lib/cases";
import { badgeTone, violationOptions } from "@/lib/violations";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { cases, databaseError } = await getCasesForPage();
  const completed = cases.filter((item) => item.status === "completed").length;
  const pending = cases.length - completed;
  const uniqueDrivers = new Set(cases.map((item) => item.licenseNumber)).size;
  const uniqueVehicles = new Set(cases.map((item) => item.registrationNumber)).size;
  const topViolations = violationOptions
    .map((item) => ({ ...item, count: cases.filter((trafficCase) => trafficCase.violationCode === item.code).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <PageShell>
      <PageHeading eyebrow="Reports" title="Case Activity Report" />
      {databaseError && <DatabaseError />}

      <section className="mb-5 grid gap-3 md:grid-cols-4">
        <ReportMetric label="Total cases" value={cases.length} />
        <ReportMetric label="Pending" tone="text-amber-600" value={pending} />
        <ReportMetric label="Drivers" tone="text-blue-600" value={uniqueDrivers} />
        <ReportMetric label="Vehicles" tone="text-emerald-600" value={uniqueVehicles} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-5">
          <h2 className="mb-4 text-base font-extrabold">Top violation codes</h2>
          <div className="grid gap-3">
            {topViolations.length === 0 ? (
              <EmptyReport />
            ) : (
              topViolations.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4" key={item.code}>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${badgeTone(item.code)}`}>{item.code}</span>
                  <span className="text-sm font-extrabold text-zinc-600">{item.count} case(s)</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-base font-extrabold">Recent report entries</h2>
          </div>
          {cases.slice(0, 6).map((item) => (
            <Link className="grid gap-2 border-b border-zinc-100 px-5 py-4 text-sm font-bold last:border-b-0 sm:grid-cols-[1fr_auto_auto]" href={`/cases/${item.registrationNumber}`} key={item.id}>
              <span>{item.driverName}</span>
              <span className="text-blue-600">{item.registrationNumber}</span>
              <span className={item.status === "completed" ? "text-emerald-600" : "text-amber-600"}>{item.status}</span>
            </Link>
          ))}
          {cases.length === 0 && <EmptyReport />}
        </div>
      </section>
    </PageShell>
  );
}

function ReportMetric({ label, tone = "text-zinc-950", value }: { label: string; tone?: string; value: number }) {
  return (
    <div className="soft-card p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className={`mt-2 text-2xl font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}

function EmptyReport() {
  return <div className="p-5 text-sm font-bold text-[var(--muted)]">No report data is available yet.</div>;
}
