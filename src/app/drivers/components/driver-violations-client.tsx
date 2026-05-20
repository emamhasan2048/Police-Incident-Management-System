"use client";

import { FormEvent, useState } from "react";

type DriverRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  license: string;
};

type ViolationRecord = {
  _id: string;
  violationMessage: string;
  date: string;
  violationCode: string;
};

export function DriverViolationsClient() {
  const [lastName, setLastName] = useState("");
  const [driver, setDriver] = useState<DriverRecord | null>(null);
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchViolations(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSearched(true);

    const response = await fetch(`/api/drivers/violations?lastName=${encodeURIComponent(lastName)}`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Violation lookup failed.");
      setDriver(null);
      setViolations([]);
      return;
    }

    setDriver(data.driver);
    setViolations(data.violations ?? []);
  }

  return (
    <div className="grid gap-6">
      <form className="card grid gap-4 p-5" onSubmit={searchViolations}>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Driver Violations</p>
          <h1 className="text-2xl font-extrabold">Lookup violations by driver last name</h1>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="field" onChange={(event) => setLastName(event.target.value)} placeholder="e.g. Hasan" required value={lastName} />
          <button className="nav-button justify-center" type="submit">
            Search
          </button>
        </div>
      </form>

      {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">{error}</div>}

      {searched && !driver && !error && (
        <div className="card p-5 text-sm font-bold text-[var(--muted)]">No driver found for that last name.</div>
      )}

      {driver && (
        <div className="card overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-base font-extrabold">
              Violations for {driver.firstName} {driver.lastName}
            </h2>
          </div>
          {violations.length === 0 ? (
            <div className="p-5 text-sm font-bold text-[var(--muted)]">No violations are registered for this driver.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[var(--panel)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  <tr>
                    <th className="px-5 py-3">Violation Message</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Violation Code</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((violation) => (
                    <tr className="border-t border-[#333331]" key={violation._id}>
                      <td className="px-5 py-4 font-bold">{violation.violationMessage}</td>
                      <td className="px-5 py-4 font-bold text-[var(--muted)]">{new Date(violation.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-red-900/70 px-3 py-1 text-xs font-extrabold text-red-200">{violation.violationCode}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
