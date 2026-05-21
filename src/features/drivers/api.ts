import { type DriverFormValues } from "@/lib/validations/drivers";
import { type DriverResponse, type DriversResponse } from "./types";

export async function fetchDrivers() {
  const response = await fetch("/api/drivers", { cache: "no-store" });
  const data = (await response.json()) as DriversResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Drivers could not be loaded.");
  }

  return data.drivers ?? [];
}

export async function saveDriver(values: DriverFormValues, editingId: string | null) {
  const response = await fetch(editingId ? `/api/drivers/${editingId}` : "/api/drivers", {
    method: editingId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = (await response.json()) as DriverResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Driver could not be saved.");
  }

  return data.driver;
}

export async function removeDriver(id: string) {
  const response = await fetch(`/api/drivers/${id}`, { method: "DELETE" });
  const data = (await response.json()) as DriverResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Driver could not be deleted.");
  }
}
