"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type DriverFormValues } from "@/lib/validations/drivers";
import { DriverForm, emptyDriverFormValues } from "./driver-form";

type DriverFormDialogProps = {
  defaultValues?: DriverFormValues;
  isSubmitting: boolean;
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DriverFormValues) => Promise<void>;
};

export function DriverFormDialog({ defaultValues = emptyDriverFormValues, isSubmitting, mode, onOpenChange, onSubmit, open }: DriverFormDialogProps) {
  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit driver" : "Add driver"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the selected driver record." : "Create a new driver record without leaving this page."}</DialogDescription>
        </DialogHeader>
        <DriverForm
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Update driver" : "Create driver"}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
