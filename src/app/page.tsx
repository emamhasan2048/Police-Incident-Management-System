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
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Command dashboard</p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-950">Police Incident Management System</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-zinc-500">
          Manage driver profiles, linked vehicles, and violation records from one clean operational dashboard.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <Link className="card block p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]" href={card.href} key={card.title}>
            <h2 className="text-lg font-extrabold text-zinc-950">{card.title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-500">{card.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
