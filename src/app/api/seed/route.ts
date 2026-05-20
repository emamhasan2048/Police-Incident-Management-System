import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { CaseModel } from "@/models/Case";
import { DriverModel } from "@/models/Driver";
import { VehicleModel } from "@/models/Vehicle";
import { ViolationModel } from "@/models/Violation";

const sampleCases = [
  {
    driverName: "Ingrida Šimkutė",
    licenseNumber: "LT-00562",
    address: "Šiauliai, Tilžės 9",
    registrationNumber: "LTU-2204",
    vehicleModel: "Renault Clio",
    color: "Red",
    manufactureYear: 2020,
    violationCode: "SP-01",
    violationDate: new Date("2025-11-03"),
    status: "pending",
  },
  {
    driverName: "Aleksas Jonaitis",
    licenseNumber: "LT-00241",
    address: "Vilnius, Gedimino 5",
    registrationNumber: "LTU-4821",
    vehicleModel: "VW Golf",
    color: "Gray",
    manufactureYear: 2019,
    violationCode: "PK-03",
    violationDate: new Date("2026-01-10"),
    status: "pending",
  },
  {
    driverName: "Tomas Grigas",
    licenseNumber: "LT-00883",
    address: "Kaunas, Laisvės 12",
    registrationNumber: "LTU-8832",
    vehicleModel: "Toyota Corolla",
    color: "White",
    manufactureYear: 2021,
    violationCode: "SP-01",
    violationDate: new Date("2026-04-22"),
    status: "pending",
  },
  {
    driverName: "Ingrida Šimkutė",
    licenseNumber: "LT-00562",
    address: "Šiauliai, Tilžės 9",
    registrationNumber: "LTU-2204",
    vehicleModel: "Renault Clio",
    color: "Red",
    manufactureYear: 2020,
    violationCode: "DU-05",
    violationDate: new Date("2026-04-25"),
    status: "completed",
  },
  {
    driverName: "Mindaugas Petrauskas",
    licenseNumber: "LT-00774",
    address: "Klaipėda, Taikos 18",
    registrationNumber: "LTU-7741",
    vehicleModel: "Audi A4",
    color: "Black",
    manufactureYear: 2018,
    violationCode: "RL-02",
    violationDate: new Date("2026-04-27"),
    status: "pending",
  },
  {
    driverName: "Rūta Kazlauskienė",
    licenseNumber: "LT-00339",
    address: "Panevėžys, Respublikos 3",
    registrationNumber: "LTU-3390",
    vehicleModel: "Ford Focus",
    color: "Blue",
    manufactureYear: 2017,
    violationCode: "PK-03",
    violationDate: new Date("2026-04-28"),
    status: "pending",
  },
  {
    driverName: "Aleksas Jonaitis",
    licenseNumber: "LT-00241",
    address: "Vilnius, Gedimino 5",
    registrationNumber: "LTU-4821",
    vehicleModel: "VW Golf",
    color: "Gray",
    manufactureYear: 2019,
    violationCode: "SP-01",
    violationDate: new Date("2026-04-30"),
    status: "pending",
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongo();
  await CaseModel.deleteMany({});
  await CaseModel.insertMany(sampleCases);
  await DriverModel.deleteMany({});
  await VehicleModel.deleteMany({});
  await ViolationModel.deleteMany({});

  const drivers = await DriverModel.insertMany([
    {
      firstName: "Emam",
      lastName: "Hasan",
      license: "LIC-1001",
      city: "Dhaka",
      street: "Dhanmondi 27",
      houseNumber: "14A",
      apartment: 5,
    },
    {
      firstName: "Nadia",
      lastName: "Rahman",
      license: "LIC-1002",
      city: "Chattogram",
      street: "CDA Avenue",
      houseNumber: "22",
    },
    {
      firstName: "Arif",
      lastName: "Khan",
      license: "LIC-1003",
      city: "Sylhet",
      street: "Zindabazar Road",
      houseNumber: "8",
      apartment: 2,
    },
  ]);

  const [hasan, nadia, arif] = drivers;

  await VehicleModel.insertMany([
    {
      registrationNumber: "DHK-2041",
      model: "Toyota Corolla",
      color: "White",
      manufactureYear: 2021,
      driverId: hasan._id,
    },
    {
      registrationNumber: "DHK-8820",
      model: "Honda Civic",
      color: "Black",
      manufactureYear: 2020,
      driverId: hasan._id,
    },
    {
      registrationNumber: "CTG-5512",
      model: "Nissan X-Trail",
      color: "Silver",
      manufactureYear: 2019,
      driverId: nadia._id,
    },
    {
      registrationNumber: "SYL-7781",
      model: "Suzuki Swift",
      color: "Blue",
      manufactureYear: 2022,
      driverId: arif._id,
    },
  ]);

  await ViolationModel.insertMany([
    {
      violationMessage: "Overspeeding",
      date: new Date("2025-08-12"),
      violationCode: "SP001",
      driverId: hasan._id,
    },
    {
      violationMessage: "Illegal Parking",
      date: new Date("2025-08-15"),
      violationCode: "PK002",
      driverId: hasan._id,
    },
    {
      violationMessage: "Red light violation",
      date: new Date("2026-04-18"),
      violationCode: "RDL-02",
      driverId: nadia._id,
    },
  ]);

  return NextResponse.json({
    ok: true,
    inserted: {
      trafficCases: sampleCases.length,
      drivers: drivers.length,
      vehicles: 4,
      violations: 3,
    },
    message: "Seeded traffic cases, drivers, vehicles, and violations.",
  });
}
