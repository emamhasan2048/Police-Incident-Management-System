"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchFilter } from "@/hooks/use-search-filter";
import type { CaseView } from "@/lib/cases";
import { badgeTone } from "@/lib/violations";
import { CaseActions } from "./case-actions";

type StatusFilter = "all" | "pending" | "completed";

export function CasesBrowser({ cases }: { cases: CaseView[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const debouncedQuery = useDebounce(query, 250);

  const statusFilteredCases = useMemo(
    () => cases.filter((item) => status === "all" || item.status === status),
    [cases, status],
  );

  const filteredCases = useSearchFilter({
    getSearchText: getCaseSearchText,
    items: statusFilteredCases,
    query: debouncedQuery,
  });

  const { canGoNext, canGoPrevious, page, pageCount, pageItems, setPage } = usePagination(filteredCases, 8);

  return (
    <>
      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <Input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by driver, reg. number, license, model, violation..."
          type="search"
          value={query}
        />
        <div className="flex flex-wrap gap-2">
          <FilterButton active={status === "all"} onClick={() => setStatus("all")}>
            All
          </FilterButton>
          <FilterButton active={status === "pending"} onClick={() => setStatus("pending")}>
            Pending
          </FilterButton>
          <FilterButton active={status === "completed"} onClick={() => setStatus("completed")}>
            Completed
          </FilterButton>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_1.2fr] border-b border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-sm font-extrabold text-[var(--muted)] max-lg:hidden">
          <div>Driver name</div>
          <div>Reg. number</div>
          <div>Date</div>
          <div>Violation</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-[var(--muted)]">No cases match your filters.</div>
        ) : (
          pageItems.map((item) => (
            <div
              className="grid gap-3 border-b border-zinc-100 px-4 py-4 text-sm font-bold last:border-b-0 sm:px-5 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_1.2fr] lg:items-center lg:py-3"
              key={item.id}
            >
              <div className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.14em] text-[var(--muted)] lg:hidden">Driver</span>
                <span className="block truncate">{item.driverName}</span>
              </div>
              <Link className="min-w-0 text-blue-600" href={`/cases/${item.registrationNumber}`}>
                <span className="block text-xs uppercase tracking-[0.14em] text-[var(--muted)] lg:hidden">Registration</span>
                {item.registrationNumber}
              </Link>
              <div>
                <span className="block text-xs uppercase tracking-[0.14em] text-[var(--muted)] lg:hidden">Date</span>
                {item.violationDate}
              </div>
              <div>
                <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--muted)] lg:hidden">Violation</span>
                <span className={`rounded-full px-3 py-1 text-base font-extrabold ${badgeTone(item.violationCode)}`}>
                  {item.violationCode}
                </span>
              </div>
              <CaseActions id={item.id} initialStatus={item.status} />
            </div>
          ))
        )}
      </div>

      {filteredCases.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-[var(--muted)]">
          <span>Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button disabled={!canGoPrevious} onClick={() => setPage(page - 1)} type="button">Previous</Button>
            <Button disabled={!canGoNext} onClick={() => setPage(page + 1)} type="button">Next</Button>
          </div>
        </div>
      )}
    </>
  );
}

function getCaseSearchText(item: CaseView) {
  return [
    item.driverName,
    item.registrationNumber,
    item.licenseNumber,
    item.vehicleModel,
    item.violationCode,
  ].join(" ");
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-xl border px-3 py-2 text-xs font-extrabold transition ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-zinc-300 bg-white text-zinc-500 hover:border-blue-300"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
