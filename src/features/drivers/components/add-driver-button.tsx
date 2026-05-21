"use client";

import { Button } from "@/components/ui/button";

export function AddDriverButton({ onClick }: { onClick: () => void }) {
  return (
    <Button className="justify-center" onClick={onClick} type="button">
      Add Driver
    </Button>
  );
}
