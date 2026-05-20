"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { cityOptions, cityStreetOptions } from "@/lib/driver-location-options";

type DriverRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  license: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: number;
};

type DriverFormState = Omit<DriverRecord, "_id">;

const emptyForm: DriverFormState = {
  firstName: "",
  lastName: "",
  license: "",
  city: cityOptions[0],
  street: cityStreetOptions[cityOptions[0]][0],
  houseNumber: "",
  apartment: undefined,
};

export function DriverListClient() {
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [form, setForm] = useState<DriverFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const streets = useMemo(() => cityStreetOptions[form.city] ?? [], [form.city]);

  async function loadDrivers() {
    const response = await fetch("/api/drivers", { cache: "no-store" });
    const data = await response.json();
    setDrivers(data.drivers ?? []);
  }

  useEffect(() => {
    // The first load is intentionally client-side so production builds do not require database access.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDrivers();
  }, []);

  function updateField<K extends keyof DriverFormState>(field: K, value: DriverFormState[K]) {
    setForm((current) => {
      if (field === "city") {
        const city = String(value);
        return {
          ...current,
          city,
          street: cityStreetOptions[city]?.[0] ?? "",
        };
      }

      return { ...current, [field]: value };
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function saveDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/drivers/${editingId}` : "/api/drivers";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Driver could not be saved.");
        return;
      }

      setMessage(editingId ? "Driver updated successfully." : "Driver created successfully.");
      resetForm();
      await loadDrivers();
    } catch {
      setError("Network error while saving driver.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDriver(id: string) {
    setError("");
    setMessage("");

    const response = await fetch(`/api/drivers/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? "Driver could not be deleted.");
      return;
    }

    setMessage("Driver deleted successfully.");
    await loadDrivers();
  }

  function startEdit(driver: DriverRecord) {
    setEditingId(driver._id);
    setForm({
      firstName: driver.firstName,
      lastName: driver.lastName,
      license: driver.license,
      city: driver.city,
      street: driver.street,
      houseNumber: driver.houseNumber,
      apartment: driver.apartment,
    });
    setMessage("");
    setError("");
  }

  return (
    <div className="grid gap-6">
      <form className="card grid gap-4 p-5" onSubmit={saveDriver}>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Driver CRUD</p>
          <h2 className="text-xl font-extrabold">{editingId ? "Edit driver" : "Add new driver"}</h2>
        </div>

        {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">{error}</div>}
        {message && <div className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm font-extrabold text-emerald-200">{message}</div>}

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="First name" value={form.firstName} onChange={(value) => updateField("firstName", value)} required />
          <Field label="Last name" value={form.lastName} onChange={(value) => updateField("lastName", value)} required />
          <Field label="License" value={form.license} onChange={(value) => updateField("license", value)} required />

          <label>
            <span className="label">City</span>
            <select className="field" value={form.city} onChange={(event) => updateField("city", event.target.value)} required>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="label">Street</span>
            <select className="field" value={form.street} onChange={(event) => updateField("street", event.target.value)} required>
              {streets.map((street) => (
                <option key={street} value={street}>
                  {street}
                </option>
              ))}
            </select>
          </label>

          <Field label="House number" value={form.houseNumber} onChange={(value) => updateField("houseNumber", value)} required />
          <Field
            label="Apartment"
            type="number"
            value={form.apartment?.toString() ?? ""}
            onChange={(value) => updateField("apartment", value ? Number(value) : undefined)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="nav-button" disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : editingId ? "Update driver" : "Create driver"}
          </button>
          {editingId && (
            <button className="nav-button" onClick={resetForm} type="button">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-base font-extrabold">Driver List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="bg-[var(--panel)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">License</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-center font-bold text-[var(--muted)]" colSpan={4}>
                    No drivers found.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr className="border-t border-[#333331]" key={driver._id}>
                    <td className="px-5 py-4 font-extrabold">
                      {driver.firstName} {driver.lastName}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#7fb1ef]">{driver.license}</td>
                    <td className="px-5 py-4 font-bold text-[var(--muted)]">
                      {driver.houseNumber}, {driver.street}, {driver.city}
                      {driver.apartment ? `, Apt ${driver.apartment}` : ""}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-md border border-[#50504d] px-3 py-1.5 text-xs font-extrabold hover:border-[#7fb1ef]" onClick={() => startEdit(driver)} type="button">
                          Edit
                        </button>
                        <button className="rounded-md border border-red-800 bg-red-950/40 px-3 py-1.5 text-xs font-extrabold text-red-200 hover:bg-red-900/50" onClick={() => deleteDriver(driver._id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="field" onChange={(event) => onChange(event.target.value)} required={required} type={type} value={value} />
    </label>
  );
}
