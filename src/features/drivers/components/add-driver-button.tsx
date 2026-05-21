"use client";

import { Button } from "@/components/ui/button";

export function AddDriverButton({ onClick }: { onClick: () => void }) {
  return (
    <Button className="justify-center border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:border-blue-500 hover:bg-blue-500" onClick={onClick} type="button">
      Add Driver
    </Button>
  );
}
