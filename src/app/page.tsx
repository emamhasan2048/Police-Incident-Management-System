import Link from "next/link";
import { AppNav } from "./nav";

const dashboardCards = [
  {
    title: "Driver List",
    description: "Create, update, view, and remove driver records with duplicate name protection.",
    href: "/drivers/list",
  },
  {
    title: "Driver Details",
    description: "Search a driver by last name or license number and review assigned vehicles.",
    href: "/drivers/details",
  },
  {
    title: "Driver Violations",
    description: "Lookup all driver violations by last name, including code, date, and message.",
    href: "/drivers/violations",
  },
];

export default function HomePage() {
  return (
    <main className="shell">
      <AppNav />

      <section className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Command dashboard</p>
        <h1 className="max-w-3xl text-3xl font-extrabold">Police Incident Management System</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-[var(--muted)]">
          Manage driver profiles, linked vehicles, and violation records from one dark-themed incident registry.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <Link className="card block p-5 transition hover:-translate-y-1 hover:border-[#7fb1ef]" href={card.href} key={card.title}>
            <h2 className="text-lg font-extrabold">{card.title}</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-[var(--muted)]">{card.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
