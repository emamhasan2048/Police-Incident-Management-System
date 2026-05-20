import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { DriverModel } from "@/models/Driver";

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

function missingRequiredFields(driver: ReturnType<typeof normalizeDriverPayload>) {
  return ["firstName", "lastName", "license", "city", "street", "houseNumber"].filter(
    (field) => !driver[field as keyof typeof driver],
  );
}

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
  const payload = normalizeDriverPayload(await request.json());
  const missing = missingRequiredFields(payload);

  if (missing.length > 0) {
    return NextResponse.json({ message: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  try {
    const driver = await DriverModel.create(payload);
    return NextResponse.json({ driver }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ message: "A driver with this first name and last name already exists." }, { status: 409 });
    }

    console.error("Failed to create driver:", error);
    return NextResponse.json({ message: "Failed to create driver." }, { status: 500 });
  }
}
