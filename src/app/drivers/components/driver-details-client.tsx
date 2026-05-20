"use client";

import { FormEvent, useState } from "react";

type DriverRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  license: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: number;
};

type VehicleRecord = {
  _id: string;
  registrationNumber: string;
  model: string;
  color: string;
  manufactureYear: number;
};

export function DriverDetailsClient() {
  const [query, setQuery] = useState("");
  const [driver, setDriver] = useState<DriverRecord | null>(null);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSearched(true);

    const response = await fetch(`/api/drivers/details?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Driver lookup failed.");
      setDriver(null);
      setVehicles([]);
      return;
    }

    setDriver(data.driver);
    setVehicles(data.vehicles ?? []);
  }

  return (
    <div className="grid gap-6">
      <form className="card grid gap-4 p-5" onSubmit={searchDriver}>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Driver Details</p>
          <h1 className="text-2xl font-extrabold">Search by last name or license number</h1>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="field" onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Hasan or LIC-1029" required value={query} />
          <button className="nav-button justify-center" type="submit">
            Search
          </button>
        </div>
      </form>

      {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">{error}</div>}

      {searched && !driver && !error && (
        <div className="card p-5 text-sm font-bold text-[var(--muted)]">No driver found for that last name or license number.</div>
      )}

      {driver && (
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="card p-5">
            <h2 className="mb-4 text-base font-extrabold">Driver profile</h2>
            <div className="grid gap-3 text-sm font-bold">
              <Info label="Name" value={`${driver.firstName} ${driver.lastName}`} />
              <Info label="License" value={driver.license} />
              <Info label="City" value={driver.city} />
              <Info label="Street" value={driver.street} />
              <Info label="House" value={driver.houseNumber} />
              <Info label="Apartment" value={driver.apartment?.toString() ?? "N/A"} />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <h2 className="text-base font-extrabold">Driver cars</h2>
            </div>
            {vehicles.length === 0 ? (
              <div className="p-5 text-sm font-bold text-[var(--muted)]">No cars are registered for this driver.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-[var(--panel)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    <tr>
                      <th className="px-5 py-3">Registration</th>
                      <th className="px-5 py-3">Model</th>
                      <th className="px-5 py-3">Color</th>
                      <th className="px-5 py-3">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr className="border-t border-[#333331]" key={vehicle._id}>
                        <td className="px-5 py-4 font-extrabold text-[#7fb1ef]">{vehicle.registrationNumber}</td>
                        <td className="px-5 py-4 font-bold">{vehicle.model}</td>
                        <td className="px-5 py-4 font-bold text-[var(--muted)]">{vehicle.color}</td>
                        <td className="px-5 py-4 font-bold">{vehicle.manufactureYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#333331] bg-[#242422] p-3">
      <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-base text-white">{value}</div>
    </div>
  );
}
