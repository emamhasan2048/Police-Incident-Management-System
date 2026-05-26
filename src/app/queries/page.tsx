import Link from "next/link";
import { getCases, getCasesForPage } from "@/lib/cases";
import { badgeTone } from "@/lib/violations";
import { DatabaseError } from "../database-error";
import { AppNav } from "../nav";
import { QueryForms } from "./components/query-forms";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function QueriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { cases, databaseError } = await getCasesForPage();

  const registration = getParam(params, "registration").trim().toUpperCase();
  const model = getParam(params, "model").trim().toLowerCase();
  const color = getParam(params, "color").trim().toLowerCase();
  const license = getParam(params, "license").trim().toUpperCase();
  const showOffenders = getParam(params, "show") === "offenders";
  const showStats = getParam(params, "show") === "stats";

  const byRegistration = registration
    ? cases.filter((item) => item.registrationNumber.toUpperCase() === registration)
    : [];
  const byModelColor =
    model || color
      ? cases.filter(
          (item) =>
            (!model || item.vehicleModel.toLowerCase().includes(model)) &&
            (!color || item.color.toLowerCase().includes(color)),
        )
      : [];
  const byLicense = license ? cases.filter((item) => item.licenseNumber.toUpperCase() === license) : [];

  const offenders = Array.from(new Map(cases.map((item) => [item.licenseNumber, item])).values()).sort((a, b) =>
    a.driverName.localeCompare(b.driverName),
  );

  const stats = Array.from(
    cases
      .reduce((map, item) => {
        const key = `${item.vehicleModel}-${item.manufactureYear}`;
        const current = map.get(key) ?? { model: item.vehicleModel, year: item.manufactureYear, count: 0 };
        current.count += 1;
        map.set(key, current);
        return map;
      }, new Map<string, { model: string; year: number; count: number }>())
      .values(),
  ).sort((a, b) => b.count - a.count || a.model.localeCompare(b.model));

  return (
    <main className="shell">
      <AppNav />
      <h1 className="mb-6 text-2xl font-extrabold">Queries</h1>

      {databaseError && <DatabaseError />}

      <QueryForms
        color={getParam(params, "color")}
        license={license}
        model={getParam(params, "model")}
        registration={registration}
        showOffenders={showOffenders}
        showStats={showStats}
        licenseResults={license ? <ViolationResults cases={byLicense} /> : null}
        modelColorResults={model || color ? <OwnerResults cases={byModelColor} /> : null}
        offenderResults={<OffenderResults cases={offenders} />}
        registrationResults={registration ? <OwnerResults cases={byRegistration} /> : null}
        statsResults={<StatsResults stats={stats} />}
      />
    </main>
  );
}

function OwnerResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  const owners = Array.from(new Map(cases.map((item) => [item.registrationNumber, item])).values());

  if (owners.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {owners.map((item) => (
        <Link className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4 text-sm font-bold" href={`/cases/${item.registrationNumber}`} key={item.id}>
          <div className="text-base font-extrabold">{item.driverName}</div>
          <div className="mt-1 text-blue-600">{item.registrationNumber}</div>
          <div className="mt-2 text-[var(--muted)]">
            {item.vehicleModel} / {item.color} / {item.manufactureYear}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ViolationResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  if (cases.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#3d3d3a]">
      {cases.map((item) => (
        <Link className="grid gap-2 border-b border-zinc-100 p-4 text-sm font-bold last:border-b-0 md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr]" href={`/cases/${item.registrationNumber}`} key={item.id}>
          <span>{item.driverName}</span>
          <span className="text-blue-600">{item.registrationNumber}</span>
          <span>{item.violationDate}</span>
          <span>
            <span className={`rounded-full px-3 py-1 text-xs ${badgeTone(item.violationCode)}`}>{item.violationCode}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function OffenderResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  if (cases.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {cases.map((item) => (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-4 text-sm font-bold" key={item.licenseNumber}>
          <div className="text-base font-extrabold">{item.driverName}</div>
          <div className="mt-1 text-[var(--muted)]">{item.licenseNumber}</div>
        </div>
      ))}
    </div>
  );
}

function StatsResults({ stats }: { stats: { model: string; year: number; count: number }[] }) {
  if (stats.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#3d3d3a]">
      {stats.map((item) => (
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-zinc-100 p-4 text-sm font-bold last:border-b-0" key={`${item.model}-${item.year}`}>
          <span>{item.model}</span>
          <span className="text-[var(--muted)]">{item.year}</span>
          <span className="text-blue-600">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyResult() {
  return <div className="mt-4 rounded-2xl border border-zinc-200 bg-white shadow-sm p-4 text-sm font-bold text-[var(--muted)]">No matching data found.</div>;
}
