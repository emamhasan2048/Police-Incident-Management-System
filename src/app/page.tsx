import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getAuthSession } from "@/lib/auth";
import { AppNav } from "./nav";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function HomePage({ searchParams }: Props) {
  const session = await getAuthSession();
  const params = await searchParams;
  const returnTo = getParam(params, "returnTo") || "/overview";

  if (session?.role === "ADMIN") {
    redirect("/admin/dropdowns");
  }

  if (session?.role === "USER") {
    redirect("/overview");
  }

  return (
    <main className="shell">
      <AppNav />

      <section className="mx-auto max-w-5xl">
        <h1 className="sr-only">Police Incident Management System Login</h1>
        <AuthPanel returnTo={returnTo} session={session} />
      </section>
    </main>
  );
}
