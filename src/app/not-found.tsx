import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <h1 className="mb-4 text-2xl font-extrabold">Page not found</h1>
      <p className="mb-4 text-sm font-bold text-[var(--muted)]">The page you requested does not exist or is not available for your role.</p>
      <Link className="text-sm font-bold text-blue-600" href="/">
        Back to homepage
      </Link>
    </main>
  );
}
