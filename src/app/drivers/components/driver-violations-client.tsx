"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { driverViolationsSearchSchema, type DriverViolationsSearchValues } from "@/lib/validations/drivers";

type DriverRecord = {
  _id: string;
  firstName: string;
  lastName: string;
  license: string;
};

type ViolationRecord = {
  _id: string;
  violationMessage: string;
  date: string;
  violationCode: string;
};

type DriverViolationsResponse = {
  driver?: DriverRecord;
  violations?: ViolationRecord[];
  message?: string;
};

export function DriverViolationsClient() {
  const [driver, setDriver] = useState<DriverRecord | null>(null);
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const form = useForm<DriverViolationsSearchValues>({
    defaultValues: { lastName: "" },
    mode: "onChange",
    resolver: zodResolver(driverViolationsSearchSchema),
  });

  async function searchViolations(values: DriverViolationsSearchValues) {
    setError("");
    setSearched(true);

    const response = await fetch(`/api/drivers/violations?lastName=${encodeURIComponent(values.lastName)}`, { cache: "no-store" });
    const data = (await response.json()) as DriverViolationsResponse;

    if (!response.ok) {
      setError(data.message ?? "Violation lookup failed.");
      setDriver(null);
      setViolations([]);
      return;
    }

    setDriver(data.driver ?? null);
    setViolations(data.violations ?? []);
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form className="card grid gap-4 p-5" noValidate onSubmit={form.handleSubmit(searchViolations)}>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Driver Violations</p>
            <h1 className="text-2xl font-extrabold text-zinc-950">Lookup violations by driver last name</h1>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Controller
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Driver last name</FormLabel>
                  <FormControl>
                    <Input invalid={Boolean(fieldState.error)} placeholder="e.g. Hasan" {...field} />
                  </FormControl>
                  <FormMessage message={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <Button className="self-end justify-center" type="submit">
              Search
            </Button>
          </div>
        </form>
      </Form>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-extrabold text-red-700">{error}</div>}

      {searched && !driver && !error && <div className="card p-5 text-sm font-bold text-[var(--muted)]">No driver found for that last name.</div>}

      {driver && (
        <div className="card overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-base font-extrabold">
              <span className="text-zinc-950">Violations for {driver.firstName} {driver.lastName}</span>
            </h2>
          </div>
          {violations.length === 0 ? (
            <div className="p-5 text-sm font-bold text-[var(--muted)]">No violations are registered for this driver.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[var(--panel)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  <tr>
                    <th className="px-5 py-3">Violation Message</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Violation Code</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((violation) => (
                    <tr className="border-t border-zinc-100" key={violation._id}>
                      <td className="px-5 py-4 font-bold">{violation.violationMessage}</td>
                      <td className="px-5 py-4 font-bold text-zinc-500">{new Date(violation.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700">{violation.violationCode}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
