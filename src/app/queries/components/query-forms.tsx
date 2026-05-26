"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type QueryDefaults = {
  color: string;
  license: string;
  model: string;
  registration: string;
};

type QueryFormsProps = QueryDefaults & {
  licenseResults: ReactNode;
  modelColorResults: ReactNode;
  offenderResults: ReactNode;
  registrationResults: ReactNode;
  showOffenders: boolean;
  showStats: boolean;
  statsResults: ReactNode;
};

export function QueryForms(props: QueryFormsProps) {
  return (
    <div className="space-y-5">
      <RegistrationQueryForm defaultValue={props.registration}>{props.registrationResults}</RegistrationQueryForm>
      <ModelColorQueryForm color={props.color} model={props.model}>{props.modelColorResults}</ModelColorQueryForm>
      <LicenseQueryForm defaultValue={props.license}>{props.licenseResults}</LicenseQueryForm>
      <ActionQueryForm label="Show offenders" query="show=offenders" title="List of offenders (drivers with violations)">
        {props.showOffenders && props.offenderResults}
      </ActionQueryForm>
      <ActionQueryForm label="Show stats" query="show=stats" title="Number of vehicles by model and year">
        {props.showStats && props.statsResults}
      </ActionQueryForm>
    </div>
  );
}

function RegistrationQueryForm({ children, defaultValue }: { children: ReactNode; defaultValue: string }) {
  const router = useRouter();
  const form = useForm<{ registration: string }>({ defaultValues: { registration: defaultValue } });

  function submit(values: { registration: string }) {
    if (!values.registration.trim()) {
      form.setError("registration", { message: "Registration number is required." });
      return;
    }
    router.push(`/queries?registration=${encodeURIComponent(values.registration.trim())}`);
  }

  return (
    <QueryCard icon="#" title="Who owns a vehicle with registration number?">
      <Form {...form}>
        <form className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start" noValidate onSubmit={form.handleSubmit(submit)}>
          <Controller
            control={form.control}
            name="registration"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="registration">Registration number</FormLabel>
                <FormControl>
                  <Input {...field} id="registration" invalid={Boolean(fieldState.error)} placeholder="e.g. LTU-4821" />
                </FormControl>
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />
          <Button className="justify-center md:mt-7" type="submit">Search</Button>
        </form>
      </Form>
      {children}
    </QueryCard>
  );
}

function ModelColorQueryForm({ children, color, model }: { children: ReactNode; color: string; model: string }) {
  const router = useRouter();
  const form = useForm<{ color: string; model: string }>({ defaultValues: { color, model } });

  function submit(values: { color: string; model: string }) {
    if (!values.model.trim() && !values.color.trim()) {
      form.setError("model", { message: "Enter a model or color." });
      return;
    }
    const params = new URLSearchParams({ model: values.model.trim(), color: values.color.trim() });
    router.push(`/queries?${params.toString()}`);
  }

  return (
    <QueryCard icon="*" title="Who owns a vehicle by model & color?">
      <Form {...form}>
        <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start" noValidate onSubmit={form.handleSubmit(submit)}>
          {(["model", "color"] as const).map((name) => (
            <Controller
              control={form.control}
              key={name}
              name={name}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor={name}>{name === "model" ? "Vehicle model" : "Color"}</FormLabel>
                  <FormControl>
                    <Input {...field} id={name} invalid={Boolean(fieldState.error)} placeholder={name === "model" ? "e.g. VW Golf" : "e.g. Gray"} />
                  </FormControl>
                  <FormMessage message={fieldState.error?.message} />
                </FormItem>
              )}
            />
          ))}
          <Button className="justify-center md:mt-7" type="submit">Search</Button>
        </form>
      </Form>
      {children}
    </QueryCard>
  );
}

function LicenseQueryForm({ children, defaultValue }: { children: ReactNode; defaultValue: string }) {
  const router = useRouter();
  const form = useForm<{ license: string }>({ defaultValues: { license: defaultValue } });

  function submit(values: { license: string }) {
    if (!values.license.trim()) {
      form.setError("license", { message: "License number is required." });
      return;
    }
    router.push(`/queries?license=${encodeURIComponent(values.license.trim())}`);
  }

  return (
    <QueryCard icon="!" title="Violations committed by a driver (license no.)">
      <Form {...form}>
        <form className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start" noValidate onSubmit={form.handleSubmit(submit)}>
          <Controller
            control={form.control}
            name="license"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="license">License number</FormLabel>
                <FormControl>
                  <Input {...field} id="license" invalid={Boolean(fieldState.error)} placeholder="e.g. LT-00241" />
                </FormControl>
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />
          <Button className="justify-center md:mt-7" type="submit">Search</Button>
        </form>
      </Form>
      {children}
    </QueryCard>
  );
}

function ActionQueryForm({ children, label, query, title }: { children: ReactNode; label: string; query: string; title: string }) {
  const router = useRouter();
  const form = useForm<{ action: string }>({ defaultValues: { action: query } });

  return (
    <QueryCard icon="@" title={title}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => router.push(`/queries?${values.action}`))}>
          <Controller control={form.control} name="action" render={({ field }) => <input {...field} type="hidden" />} />
          <Button type="submit">{label}</Button>
        </form>
      </Form>
      {children}
    </QueryCard>
  );
}

function QueryCard({ children, icon, title }: { children: ReactNode; icon: string; title: string }) {
  return (
    <section className="card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[var(--muted)]">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

