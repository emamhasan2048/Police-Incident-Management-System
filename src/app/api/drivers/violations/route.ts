import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";
import { ViolationModel } from "@/models/Violation";

export const dynamic = "force-dynamic";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lastName = searchParams.get("lastName")?.trim();

  if (!lastName) {
    return NextResponse.json({ message: "Search by driver last name." }, { status: 400 });
  }

  await connectMongo();

  const driver = await DriverModel.findOne({ lastName: new RegExp(`^${escapeRegExp(lastName)}$`, "i") }).lean();

  if (!driver) {
    return NextResponse.json({ driver: null, violations: [] });
  }

  const violations = await ViolationModel.find({ driverId: driver._id }).populate("driverId").sort({ date: -1 }).lean();
  return NextResponse.json({ driver, violations });
}
