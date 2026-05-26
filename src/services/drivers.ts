import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";
import { type DriverRecord } from "@/features/drivers/types";

export type DriverPageData = {
  databaseError: boolean;
  drivers: DriverRecord[];
};

export async function getDriversForPage(): Promise<DriverPageData> {
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
  } catch {
    return { databaseError: true, drivers: [] };
  }
}
