import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { driverFormSchema } from "@/lib/validations/drivers";
import { DriverModel } from "@/models/Driver";

type Props = {
  params: Promise<{ id: string }>;
};

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;

  await connectMongo();
  const result = driverFormSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ message: result.error.issues[0]?.message ?? "Please check the driver details." }, { status: 400 });
  }

  try {
    const driver = await DriverModel.findByIdAndUpdate(id, result.data, { new: true, runValidators: true });

    if (!driver) {
      return NextResponse.json({ message: "Driver not found." }, { status: 404 });
    }

    return NextResponse.json({ driver });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ message: "A driver with this first name and last name already exists." }, { status: 409 });
    }

    console.error("Failed to update driver:", error);
    return NextResponse.json({ message: "Failed to update driver." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;

  await connectMongo();
  const driver = await DriverModel.findByIdAndDelete(id);

  if (!driver) {
    return NextResponse.json({ message: "Driver not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
