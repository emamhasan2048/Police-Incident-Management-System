import { AppNav } from "@/app/nav";
import { cityStreetOptions } from "@/lib/driver-location-options";
import { violationOptions } from "@/lib/violations";

export default async function DropdownDataPage() {
  const cities = Object.entries(cityStreetOptions);

  return (
    <main className="shell">
      <AppNav />

      <div className="mb-6 max-w-full">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Admin</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">Dropdown Data Management</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card max-w-full p-4 sm:p-5">
          <h2 className="mb-4 text-lg font-extrabold">Driver Locations</h2>
          <div className="grid gap-3">
            {cities.map(([city, streets]) => (
              <div className="rounded-lg border border-zinc-200 p-4" key={city}>
                <h3 className="font-extrabold text-zinc-900">{city}</h3>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-zinc-500">{streets.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card max-w-full p-4 sm:p-5">
          <h2 className="mb-4 text-lg font-extrabold">Violation Codes</h2>
          <div className="grid gap-3">
            {violationOptions.map((item) => (
              <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between" key={item.code}>
                <span className="font-extrabold text-zinc-900">{item.code}</span>
                <span className="text-sm font-semibold text-zinc-500 sm:text-right">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
