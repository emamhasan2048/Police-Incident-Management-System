"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cityOptions, cityStreetOptions } from "@/lib/driver-location-options";
import { driverFormSchema, type DriverFormValues } from "@/lib/validations/drivers";

const defaultCity = cityOptions[0] ?? "";
const defaultStreet = cityStreetOptions[defaultCity]?.[0] ?? "";
const fieldClassName =
  "h-14 rounded-2xl bg-zinc-50/50 px-4 text-zinc-900 shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";
const invalidFieldClassName = "border-red-300 focus:border-red-500 focus:ring-red-500/10";
const validFieldClassName = "border-zinc-300";

export const emptyDriverFormValues: DriverFormValues = {
  firstName: "",
  lastName: "",
  license: "",
  city: defaultCity,
  street: defaultStreet,
  houseNumber: "",
  apartment: undefined,
};

type DriverFormProps = {
  defaultValues?: DriverFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: DriverFormValues) => Promise<void>;
};

export function DriverForm({ defaultValues = emptyDriverFormValues, isSubmitting, onCancel, onSubmit, submitLabel }: DriverFormProps) {
  const form = useForm<DriverFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(driverFormSchema),
  });

  const selectedCity = useWatch({ control: form.control, name: "city" });
  const streets = useMemo(() => cityStreetOptions[selectedCity] ?? [], [selectedCity]);

  return (
    <Form {...form}>
      <form className="grid gap-5" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-7 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => <TextField error={fieldState.error?.message} label="First name" {...field} />}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => <TextField error={fieldState.error?.message} label="Last name" {...field} />}
          />
          <Controller
            control={form.control}
            name="license"
            render={({ field, fieldState }) => <TextField error={fieldState.error?.message} label="License" {...field} />}
          />
          <Controller
            control={form.control}
            name="city"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="mb-2 text-sm font-semibold text-zinc-700">City</FormLabel>
                <FormControl>
                  <Select
                    className={fieldClass(Boolean(fieldState.error))}
                    invalid={Boolean(fieldState.error)}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const nextCity = event.target.value;
                      field.onChange(nextCity);
                      form.setValue("street", cityStreetOptions[nextCity]?.[0] ?? "", { shouldDirty: true, shouldValidate: true });
                    }}
                  >
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />
          <Controller
            control={form.control}
            name="street"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="mb-2 text-sm font-semibold text-zinc-700">Street</FormLabel>
                <FormControl>
                  <Select className={fieldClass(Boolean(fieldState.error))} invalid={Boolean(fieldState.error)} {...field}>
                    {streets.map((street) => (
                      <option key={street} value={street}>
                        {street}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />
          <Controller
            control={form.control}
            name="houseNumber"
            render={({ field, fieldState }) => <TextField error={fieldState.error?.message} label="House number" {...field} />}
          />
          <Controller
            control={form.control}
            name="apartment"
            render={({ field, fieldState }) => (
              <TextField
                error={fieldState.error?.message}
                label="Apartment"
                type="number"
                value={field.value?.toString() ?? ""}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value === "" ? undefined : Number(value))}
              />
            )}
          />
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            className="h-12 rounded-2xl border border-zinc-300 bg-white px-6 font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-zinc-100"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-[1px] hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function TextField({
  error,
  label,
  onBlur,
  onChange,
  type = "text",
  value,
}: {
  error?: string;
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <FormItem>
      <FormLabel className="mb-2 text-sm font-semibold text-zinc-700">{label}</FormLabel>
      <FormControl>
        <Input
          className={fieldClass(Boolean(error))}
          invalid={Boolean(error)}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          value={value}
        />
      </FormControl>
      <FormMessage message={error} />
    </FormItem>
  );
}

function fieldClass(invalid: boolean) {
  return `${fieldClassName} ${invalid ? invalidFieldClassName : validFieldClassName}`;
}
