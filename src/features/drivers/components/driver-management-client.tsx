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
  const [dialogError, setDialogError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refreshDrivers() {
    setDrivers(await fetchDrivers());
  }

  function openCreateDialog() {
    setEditingDriver(null);
    setError("");
    setDialogError("");
    setMessage("");
    setDialogOpen(true);
  }

  function openEditDialog(driver: DriverRecord) {
    setEditingDriver(driver);
    setError("");
    setDialogError("");
    setMessage("");
    setDialogOpen(true);
  }

  async function handleSaveDriver(values: DriverFormValues) {
    setIsSubmitting(true);
    setError("");
    setDialogError("");
    setMessage("");

    try {
      await saveDriver(values, editingDriver?._id ?? null);
      await refreshDrivers();
      setDialogOpen(false);
      setEditingDriver(null);
      setMessage(editingDriver ? "Driver updated successfully." : "Driver created successfully.");
    } catch (saveError) {
      setDialogError(saveError instanceof Error ? saveError.message : "Driver could not be saved.");
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
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.07)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Driver Management</p>
          <h2 className="text-xl font-extrabold text-zinc-950">Manage registered drivers</h2>
        </div>
        <AddDriverButton onClick={openCreateDialog} />
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-extrabold text-red-700">{error}</div>}
      {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-extrabold text-emerald-700">{message}</div>}

      <DriverTable drivers={drivers} onDelete={handleDeleteDriver} onEdit={openEditDialog} />

      <DriverFormDialog
        defaultValues={dialogDefaults}
        errorMessage={dialogError}
        isSubmitting={isSubmitting}
        mode={editingDriver ? "edit" : "create"}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setDialogError("");
          }
        }}
        onSubmit={handleSaveDriver}
      />
    </div>
  );
}
