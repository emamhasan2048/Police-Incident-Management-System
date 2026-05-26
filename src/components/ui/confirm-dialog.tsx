"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  confirmLabel?: string;
  description: string;
  isPending?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function ConfirmDialog({
  confirmLabel = "Delete",
  description,
  isPending = false,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button disabled={isPending} type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="justify-center border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
