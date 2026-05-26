import Link from "next/link";
import { AppNav } from "@/app/nav";

export default function CaseNotFound() {
  return (
    <main className="shell">
      <AppNav />
      <h1 className="mb-4 text-2xl font-extrabold">Case not found</h1>
      <p className="mb-4 text-sm font-bold text-[var(--muted)]">No case exists for the requested registration number.</p>
      <Link className="text-sm font-bold text-blue-600" href="/all-cases">
        Back to all cases
      </Link>
    </main>
  );
}
