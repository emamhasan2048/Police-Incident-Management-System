import { AppNav } from "@/app/nav";
import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";
import { DatabaseError } from "@/app/database-error";
import { DriverListClient } from "../components/driver-list-client";
import { type DriverRecord } from "@/features/drivers/types";

export const dynamic = "force-dynamic";

async function getDriversForPage() {
  try {
    await connectMongo();
    const drivers = await DriverModel.find().sort({ createdAt: -1 }).lean();

    return {
      databaseError: false,
      drivers: drivers.map((driver) => ({
        _id: driver._id?.toString() ?? "",
        firstName: driver.firstName,
        lastName: driver.lastName,
        license: driver.license,
        city: driver.city,
        street: driver.street,
        houseNumber: driver.houseNumber,
        apartment: driver.apartment,
      })),
    };
  } catch (error) {
    console.error("Failed to load drivers:", error);
    return { databaseError: true, drivers: [] as DriverRecord[] };
  }
}

export default async function DriverListPage() {
  const { databaseError, drivers } = await getDriversForPage();

  return (
    <main className="shell">
      <AppNav />

      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Drivers</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Driver List</h1>
      </div>

      {databaseError && <DatabaseError />}

      <DriverListClient initialDrivers={drivers} />
    </main>
  );
}
