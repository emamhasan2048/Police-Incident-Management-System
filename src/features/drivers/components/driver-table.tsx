"use client";

import { Button } from "@/components/ui/button";
import { type DriverRecord } from "../types";

type DriverTableProps = {
  drivers: DriverRecord[];
  onDelete: (id: string) => void;
  onEdit: (driver: DriverRecord) => void;
};

export function DriverTable({ drivers, onDelete, onEdit }: DriverTableProps) {
  return (
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
                      <Button className="min-h-0 px-3 py-1.5 text-xs" onClick={() => onEdit(driver)} type="button">
                        Edit
                      </Button>
                      <Button className="min-h-0 border-red-800 bg-red-950/40 px-3 py-1.5 text-xs text-red-200 hover:bg-red-900/50" onClick={() => onDelete(driver._id)} type="button">
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
