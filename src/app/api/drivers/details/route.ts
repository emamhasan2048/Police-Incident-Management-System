import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";
import { VehicleModel } from "@/models/Vehicle";

export const dynamic = "force-dynamic";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ message: "Search by last name or license number." }, { status: 400 });
  }

  await connectMongo();

  const driver = await DriverModel.findOne({
    $or: [{ lastName: new RegExp(`^${escapeRegExp(query)}$`, "i") }, { license: new RegExp(`^${escapeRegExp(query)}$`, "i") }],
  }).lean();

  if (!driver) {
    return NextResponse.json({ driver: null, vehicles: [] });
  }

  if (!driver._id) {
    return NextResponse.json({ driver: null, vehicles: [] });
  }

  const vehicles = await VehicleModel.find({ driverId: driver._id }).populate("driverId").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ driver, vehicles });
}
