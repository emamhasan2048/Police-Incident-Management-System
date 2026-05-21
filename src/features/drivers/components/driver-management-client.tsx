"use client";

import { useState } from "react";
import { type DriverFormValues } from "@/lib/validations/drivers";
import { fetchDrivers, removeDriver, saveDriver } from "../api";
import { type DriverRecord } from "../types";
import { AddDriverButton } from "./add-driver-button";
import { DriverFormDialog } from "./driver-form-dialog";
import { emptyDriverFormValues } from "./driver-form";
import { DriverTable } from "./driver-table";

export function DriverManagementClient({ initialDrivers }: { initialDrivers: DriverRecord[] }) {
  const [drivers, setDrivers] = useState<DriverRecord[]>(initialDrivers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverRecord | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refreshDrivers() {
    setDrivers(await fetchDrivers());
  }

  function openCreateDialog() {
    setEditingDriver(null);
    setError("");
    setMessage("");
    setDialogOpen(true);
  }

  function openEditDialog(driver: DriverRecord) {
    setEditingDriver(driver);
    setError("");
    setMessage("");
    setDialogOpen(true);
  }

  async function handleSaveDriver(values: DriverFormValues) {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      await saveDriver(values, editingDriver?._id ?? null);
      await refreshDrivers();
      setDialogOpen(false);
      setEditingDriver(null);
      setMessage(editingDriver ? "Driver updated successfully." : "Driver created successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Driver could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDriver(id: string) {
    setError("");
    setMessage("");

    try {
      await removeDriver(id);
      await refreshDrivers();
      setMessage("Driver deleted successfully.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Driver could not be deleted.");
    }
  }

  const dialogDefaults: DriverFormValues = editingDriver
    ? {
        firstName: editingDriver.firstName,
        lastName: editingDriver.lastName,
        license: editingDriver.license,
        city: editingDriver.city,
        street: editingDriver.street,
        houseNumber: editingDriver.houseNumber,
        apartment: editingDriver.apartment,
      }
    : emptyDriverFormValues;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Driver Management</p>
          <h2 className="text-xl font-extrabold">Manage registered drivers</h2>
        </div>
        <AddDriverButton onClick={openCreateDialog} />
      </div>

      {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">{error}</div>}
      {message && <div className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm font-extrabold text-emerald-200">{message}</div>}

      <DriverTable drivers={drivers} onDelete={handleDeleteDriver} onEdit={openEditDialog} />

      <DriverFormDialog
        defaultValues={dialogDefaults}
        isSubmitting={isSubmitting}
        mode={editingDriver ? "edit" : "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveDriver}
      />
    </div>
  );
}
