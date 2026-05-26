import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { driverFormSchema } from "@/lib/validations/drivers";
import { DriverModel } from "@/models/Driver";

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongo();
  const drivers = await DriverModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ drivers });
}

export async function POST(request: Request) {
  await connectMongo();
  const result = driverFormSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Please check the driver details." }, { status: 400 });
  }

  try {
    const driver = await DriverModel.create(result.data);
    return NextResponse.json({ driver }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ message: "A driver with this first name and last name already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Failed to create driver." }, { status: 500 });
  }
}
