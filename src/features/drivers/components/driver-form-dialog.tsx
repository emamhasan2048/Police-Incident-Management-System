"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type DriverFormValues } from "@/lib/validations/drivers";
import { DriverForm, emptyDriverFormValues } from "./driver-form";

type DriverFormDialogProps = {
  defaultValues?: DriverFormValues;
  errorMessage?: string;
  isSubmitting: boolean;
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DriverFormValues) => Promise<void>;
};

export function DriverFormDialog({ defaultValues = emptyDriverFormValues, errorMessage, isSubmitting, mode, onOpenChange, onSubmit, open }: DriverFormDialogProps) {
  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 rounded-full bg-purple-200/20 blur-3xl" />

        <DialogHeader className="relative mb-8 border-b border-zinc-200/80 pb-8">
          <DialogTitle>{isEdit ? "Edit driver" : "Add driver"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the selected driver record." : "Create a new driver record without leaving this page."}</DialogDescription>
          {errorMessage && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">!</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </DialogHeader>
        <div className="relative">
          <DriverForm
            defaultValues={defaultValues}
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? "Update driver" : "Create driver"}
            onCancel={() => onOpenChange(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
