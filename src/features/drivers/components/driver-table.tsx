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
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-extrabold text-zinc-950">Driver List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
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
                <td className="px-5 py-6 text-center font-bold text-zinc-500" colSpan={4}>
                  No drivers found.
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr className="border-t border-zinc-100 transition hover:bg-zinc-50" key={driver._id}>
                  <td className="px-5 py-4 font-extrabold text-zinc-950">
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td className="px-5 py-4 font-bold text-blue-600">{driver.license}</td>
                  <td className="px-5 py-4 font-bold text-zinc-500">
                    {driver.houseNumber}, {driver.street}, {driver.city}
                    {driver.apartment ? `, Apt ${driver.apartment}` : ""}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button className="min-h-0 px-3 py-1.5 text-xs" onClick={() => onEdit(driver)} type="button">
                        Edit
                      </Button>
                      <Button className="min-h-0 border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100" onClick={() => onDelete(driver._id)} type="button">
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
