import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";

type Props = {
  params: Promise<{ id: string }>;
};

type DriverPayload = {
  firstName?: string;
  lastName?: string;
  license?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  apartment?: number | string | null;
};

function normalizeDriverPayload(payload: DriverPayload) {
  return {
    firstName: String(payload.firstName ?? "").trim(),
    lastName: String(payload.lastName ?? "").trim(),
    license: String(payload.license ?? "").trim(),
    city: String(payload.city ?? "").trim(),
    street: String(payload.street ?? "").trim(),
    houseNumber: String(payload.houseNumber ?? "").trim(),
    apartment: payload.apartment === "" || payload.apartment == null ? undefined : Number(payload.apartment),
  };
}

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;

  await connectMongo();
  const payload = normalizeDriverPayload(await request.json());

  try {
    const driver = await DriverModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

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
