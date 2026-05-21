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
        <div className="grid gap-4 sm:grid-cols-2">
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
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
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
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Select invalid={Boolean(fieldState.error)} {...field}>
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
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
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input invalid={Boolean(error)} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      </FormControl>
      <FormMessage message={error} />
    </FormItem>
  );
}
