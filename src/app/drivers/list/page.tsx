import { DatabaseError } from "@/app/database-error";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/page-shell";
import { getDriversForPage } from "@/services/drivers";
import { DriverListClient } from "../components/driver-list-client";

export const dynamic = "force-dynamic";

export default async function DriverListPage() {
  const { databaseError, drivers } = await getDriversForPage();

  return (
    <PageShell>
      <PageHeading eyebrow="Drivers" title="Driver List" />
      {databaseError && <DatabaseError />}
      <DriverListClient initialDrivers={drivers} />
    </PageShell>
  );
}
